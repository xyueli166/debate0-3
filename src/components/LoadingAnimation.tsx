import React, { useState, useEffect } from 'react';

const LoadingAnimation: React.FC = () => {
  const [loadingText, setLoadingText] = useState('正在链接服务器...');
  const [currentIndex, setCurrentIndex] = useState(0);

  const texts = [
    '正在链接服务器...',
    '准备数据中，请稍候...',
    '获取最新数据...',
    '正在提取信息...',
    '过滤无关数据...',
    '重组数据信息...',
    '生成搜索结果...',
    '优化结果显示...',
    '正在处理洞察...',
    '正在生成结果...',
    '正在整理内容...',
    '正在优化格式...',
    '即将完成...'
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % texts.length;
        setLoadingText(texts[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }}></div>
      </div>
      <div className="text-center">
        <p className="text-xl font-medium text-gray-800 mb-2">{loadingText}</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;