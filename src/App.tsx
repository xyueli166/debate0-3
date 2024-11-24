import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import DebateTopicForm from './components/DebateTopicForm';
import DebateTopicInfo from './components/DebateTopicInfo';
import ReferenceLinks from './components/ReferenceLinks';
import LoadingAnimation from './components/LoadingAnimation';
import { ArrowLeft, Search, Info } from 'lucide-react';

function App() {
  const [streamContent, setStreamContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchMode, setSearchMode] = useState<'simple' | 'deep'>('simple');
  const [references, setReferences] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const [hasStartedReceivingContent, setHasStartedReceivingContent] = useState(false);

  const handleTopicSubmit = async (topic: string) => {
    setIsLoading(true);
    setShowResults(false);
    setStreamContent('');
    setReferences([]);
    setError(null);
    setHasStartedReceivingContent(false);

    try {
      const response = await fetch(
        `/api/index`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            topic, 
            mode: searchMode 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '搜索请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      setShowResults(true);

      let decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.type === 'references') {
                setReferences(data.data);
                if (searchMode === 'deep' && typeof data.remainingLimit === 'number') {
                  setRemainingSearches(data.remainingLimit);
                }
              } else if (data.type === 'content') {
                setHasStartedReceivingContent(true);
                setStreamContent(prev => prev + data.data);
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSearchModeChange = (mode: 'simple' | 'deep') => {
    setSearchMode(mode);
    if (mode === 'simple') {
      setRemainingSearches(null);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 font-sans text-gray-900">
            <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
              <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                >
                  <ArrowLeft size={24} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="text-base font-medium">返回主页</span>
                </Link>
              </div>
            </nav>

            <header className="w-full max-w-4xl mb-12 text-center pt-24 pb-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                辩题信息检索
              </h1>
              <p className="text-xl text-gray-600">
                获取系统化的辩论主题信息
              </p>
            </header>

            <main className="w-full max-w-3xl">
              <div className="bg-white shadow-md rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <Search className="mr-2 text-blue-500" size={24} />
                    搜索模式
                  </h2>
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 rounded-full transition-all duration-300 ${
                        searchMode === 'simple'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={() => handleSearchModeChange('simple')}
                    >
                      简洁搜索
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full transition-all duration-300 ${
                        searchMode === 'deep'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={() => handleSearchModeChange('deep')}
                    >
                      深度搜索
                    </button>
                  </div>
                </div>
                {searchMode === 'deep' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start">
                    <Info size={20} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p>深度搜索模式每天限制使用5次。
                      {remainingSearches !== null && ` 今日剩余次数：${remainingSearches}次`}</p>
                    </div>
                  </div>
                )}
                <DebateTopicForm 
                  onSubmit={handleTopicSubmit} 
                  isLoading={isLoading}
                />
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
              {isLoading && !hasStartedReceivingContent && <LoadingAnimation />}
              {showResults && (
                <>
                  <DebateTopicInfo data={{ markdown: streamContent }} />
                  <ReferenceLinks references={references} />
                </>
              )}
            </main>
            <footer className="mt-16 text-center text-gray-500">
              <p>大模型生成不能保证信息真实，请仔细辨别，感谢理解。</p>
              <p>产品内测中，所有搜索结果将不会被保存，敬请谅解</p>
              <p>反馈/联系我们：Rightzerox@outlook.com</p>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
