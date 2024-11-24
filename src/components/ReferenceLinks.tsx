import React, { useState } from 'react';
import { ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';

interface Reference {
  title: string;
  url: string;
  favicon?: string;
}

interface ReferenceLinksProps {
  references: Reference[];
}

const ReferenceLinks: React.FC<ReferenceLinksProps> = ({ references }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  return (
    <div 
      className={`fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-l-2xl transition-all duration-300 z-50 ${
        isCollapsed ? 'w-12' : 'w-96'
      }`}
    >
      <div className={`h-[80vh] ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <ExternalLink className="mr-2 text-blue-500" size={20} />
            参考资料
            <span className="ml-2 text-sm text-gray-500">({references.length})</span>
          </h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="收起参考资料"
          >
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(80vh-5rem)] p-4 space-y-4">
          {references.map((ref, index) => (
            <a
              key={index}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <img
                src={ref.favicon || getFavicon(ref.url)}
                alt=""
                className="w-5 h-5 mt-1 mr-3"
                onError={(e) => {
                  e.currentTarget.src = getFavicon(ref.url);
                }}
              />
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {ref.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 truncate">{ref.url}</p>
              </div>
            </a>
          ))}

          {references.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              暂无参考资料
            </div>
          )}
        </div>
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="h-[80vh] w-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="展开参考资料"
        >
          <span className="transform -rotate-90 whitespace-nowrap text-sm text-gray-500 flex items-center">
            <ChevronLeft size={16} className="transform rotate-90 mr-1" />
            参考资料 ({references.length})
          </span>
        </button>
      )}
    </div>
  );
};

export default ReferenceLinks;
