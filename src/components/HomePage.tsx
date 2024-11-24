import React, { useState } from 'react';
import { Search, Zap, ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import DebatePositionSelect from './DebatePositionSelect';

const HomePage: React.FC = () => {
  const [showPositionSelect, setShowPositionSelect] = useState(false);
  const [showHotTopics, setShowHotTopics] = useState(false);
  const [showDebateTips, setShowDebateTips] = useState(true);

  const hotTopics = [
    "人工智能对人类认知能力的发展是促进/阻碍",
    "再见爱人：李行亮和麦琳谁更值得被同情？",
    "再见爱人：爱情中应不应该为了伴侣去做家庭主妇/夫？",
    "“走自己的路，让别人说去吧”是/不是一种值得普遍倡导的青年价值观",
    "在当代，追寻热爱是/不是内卷的解脱之道",
    "辩论能/不能带领我们向真理更近一步"
  ];

  const debateTips = [
    {
      id: 1,
      title: "辩论干货（一）｜高端的辩题，往往采用最朴素的分类方式......",
      link: "https://mp.weixin.qq.com/s/11zh-Y4U9e6hQpZbwd8JeQ"
    },
    {
      id: 2,
      title: "辩论干货（二）｜立论立好，无拘无束",
      link: "https://mp.weixin.qq.com/s/d4ATquMyTRuIyNDxVWbX5Q"
    },
    {
      id: 3,
      title: "辩论干货（三）｜“不讲理”的技术",
      link: "https://mp.weixin.qq.com/s/XrGfCsKjL7mTHWsGKVeahw"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 font-sans text-gray-900">
      <header className="w-full max-w-4xl mb-12 text-center pt-16 pb-8">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          真知 AI 辩论
        </h1>
        <p className="text-xl text-gray-600">
          科学思辨、探寻真知。
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <div className="bg-white shadow-md rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Search className="mr-2 text-blue-500" size={24} />
              辩题信息检索
            </h2>
            <Link to="/search" className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-600 transition-all duration-300">
              开始检索
            </Link>
          </div>
          <p className="mb-6 text-gray-600">获取系统化的辩论主题信息，深入了解辩题背景、关键概念、各方观点、争议核心等系统化的辩题信息。</p>
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowHotTopics(!showHotTopics)}
              className="w-full text-left text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between"
            >
              <span>热门搜索</span>
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  showHotTopics ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {showHotTopics && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotTopics.map((topic, index) => (
                  <li key={index}>
                    <Link 
                      to={`/search?topic=${encodeURIComponent(topic)}`}
                      className="flex items-center justify-between bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 p-3 rounded-lg group"
                    >
                      <span>{topic}</span>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

       <div className="bg-white shadow-md rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900">
              <Zap className="mr-2 text-blue-500" size={24} />
              AI 磨辩
            </h2>
            <button 
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-600 transition-all duration-300"
              onClick={() => setShowPositionSelect(true)}
            >
              开始训练
            </button>
          </div>
          <p className="text-gray-600">和大师级AI磨辩，提升你的辩论技巧！</p>
          <p className="mt-4 text-sm text-gray-500">内测用户免费体验</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-8">
          <div className="mb-6">
            <button
              onClick={() => setShowDebateTips(!showDebateTips)}
              className="w-full text-left text-2xl font-semibold text-gray-900 mb-4 flex items-center justify-between"
            >
              <span className="flex items-center">
                <BookOpen className="mr-2 text-blue-500" size={24} />
                辩论干货
              </span>
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  showDebateTips ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            <p className="text-gray-600">精选辩论技巧、经典案例分析、实战经验分享</p>
          </div>
          {showDebateTips && (
            <ul className="space-y-3">
              {debateTips.map((tip) => (
                <li key={tip.id}>
                  <a
                    href={tip.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 p-4 rounded-lg group"
                  >
                    <span>{tip.title}</span>
                    <ChevronRight 
                      size={20} 
                      className="text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform" 
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500">
        <p>产品内测中，所有搜索结果将不会被保存，敬请谅解</p>
        <p>反馈/联系我们：Rightzerox@outlook.com</p>
      </footer>

      {showPositionSelect && (
        <DebatePositionSelect onClose={() => setShowPositionSelect(false)} />
      )}
    </div>
  );
};

export default HomePage;
