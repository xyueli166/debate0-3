import apihandler, { performSimpleSearch, performCombinedSearch } from '../api/services/search.service.mjs';
import { generateSummary } from '../api/services/openai.service.mjs';
import { rateLimitStore } from '../api/services/rateLimit.service.mjs';
import { translateText } from '../api/services/translate.service.mjs';

export default async function handler(req, res) {
  const { topic, mode, batchNumber = 1 } = req.body; // 获取批次号
  const clientIp = req.connection.remoteAddress; // 获取请求者 IP

  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    if (mode === 'simple') {
      const searchResults = await performSimpleSearch(topic);
      const references = searchResults.organic?.map(result => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet
      })) || [];

      res.write(JSON.stringify({ type: 'references', data: references }) + '\n');

      // 传入批次信息以分批获取摘要内容
      const summaryStream = generateSummary(topic, topic, { simpleSearch: true, results: searchResults, batchNumber });

      for await (const chunk of summaryStream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(JSON.stringify({ type: 'content', data: content }) + '\n');
        }
      }

    } else {
      const remainingLimit = rateLimitStore.getRemainingLimit(clientIp);
      if (remainingLimit <= 0) {
        return res.status(429).json({
          error: '已达到今日深度搜索次数限制',
          remainingLimit: 0,
          resetTime: new Date().setHours(24, 0, 0, 0)
        });
      }

      rateLimitStore.increment(clientIp);

      const englishTopic = await translateText(topic, 'en');
      const searchResults = await performCombinedSearch(topic, englishTopic);

      const references = [
        ...(searchResults.general.chinese?.organic || []),
        ...(searchResults.general.english?.organic || []),
        ...(searchResults.scholar.chinese?.organic || []),
        ...(searchResults.scholar.english?.organic || [])
      ].map(result => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet
      }));

      res.write(JSON.stringify({ type: 'references', data: references, remainingLimit: rateLimitStore.getRemainingLimit(clientIp) }) + '\n');

      const summaryStream = generateSummary(topic, englishTopic, searchResults, batchNumber);

      for await (const chunk of summaryStream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(JSON.stringify({ type: 'content', data: content }) + '\n');
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: '生成内容时发生错误' });
    } else {
      res.end();
    }
  }
}
