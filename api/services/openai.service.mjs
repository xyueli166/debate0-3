// services/openai.service.mjs

import { OpenAI } from 'openai';

const openaiClient = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

export async function* generateSummary(topic, englishTopic, searchResults) {
  try {
    const prompt = searchResults.simpleSearch 
      ? `你是一个辩题信息整理专家，你的语言风格一针见血，独到犀利，会保留所有有价值的信息，没有废话。请你根据以下信息生成关于 "${topic}" 的详细辩论主题信息，包括背景、关键概念解释、时间线、各方观点、争议焦点、社会影响、相关案例和最新进展。请以Markdown格式输出，使用适当的标题层级和列表格式。对于引用到的相关信息，请在文本中添加角标标注，所有引用的链接需在文本最后列出：\n${JSON.stringify(searchResults.results)}`
      : `你是一个辩论教练，善于分析和整理辩题信息。请你根据以下辩题"${topic}" (English: "${englishTopic}") 在学术库和普通信息库中搜索的内容${JSON.stringify(searchResults)}，为辩论者生成一个结构清晰且具有逻辑性的分析报告：

      你需要将搜集到的信息整理在以下框架内，每个板块的内容都要尽可能丰富全面,：
      ### 1. 议题背景分析（每个板块至少400字）
         - 历史背景
         - 现状分析
         - 社会意义

      ### 2. 概念体系（每个板块至少400字）
         - 核心概念的学术定义（列举不少于3位学者的详细观点，但不要编造！尽量从资料中来）
         - 概念界定的争议点
         - 相关理论框架（不少于3点）

      ### 3. 论证框架（每个板块至少400字）
         #### 正方论域
            - 价值支撑点
            - 理论基础
            - 论证路径设计
            - 可能遇到的质疑

         #### 反方论域（每个板块至少400字）
            - 价值支撑点
            - 理论基础
            - 论证路径设计
            - 可能遇到的质疑

      ### 4. 辩论策略（每个板块至少400字）
        正方
         - 立论构建策略
         * 框架设计思路
         * 核心概念界定建议
         * 论证重点布局
         
         - 质询战术设计
         * 关键质询方向
         * 具体问题设计
         * 可能的回应预设
         
         - 攻防策略
         * 防守重点
         * 进攻路径
         * 应对预案

      反 方
         - 立论构建策略
         * 框架设计思路
         * 核心概念界定建议
         * 论证重点布局
       
         - 质询战术设计
         * 关键质询方向
         * 具体问题设计
         * 可能的回应预设
         
         - 攻防策略
         * 防守重点
         * 进攻路径
         * 应对预案
         
      ### 5. 多维分析
         - 经济层面
         * 成本效益分析
         * 市场影响评估
         * 发展趋势预测
         
         - 社会层面
         * 利益相关方分析
         * 社会影响评估
         * 公众态度研究
         
         - 政策层面
         * 政策可行性分析
         * 制度约束评估
         * 实施难点分析
         
         - 伦理层面
         * 价值冲突分析
         * 道德风险评估
         * 伦理争议点

      ## Output Requirements

         - 优先使用学术研究成果
         - 数据需注明统计时间与范围
         - 以markdown格式输出，使用不同层级标题确保信息展示层级清晰
         - 适当使用有序列表和无序列表，用数字标记，关键部分加粗或划线。`;

  const response = await openaiClient.chat.completions.create({
    model: 'qwen-turbo-1101',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  for await (const chunk of response) {
    if (chunk.choices && chunk.choices[0]?.delta?.content) {
      // yield 返回 OpenAI 每个部分的内容
      yield { choices: [{ delta: { content: chunk.choices[0].delta.content } }] };
    }
  }
} catch (error) {
  console.error('OpenAI API error:', error);
  throw error;
}
}
