import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DebateTopicData } from '../types';
import FunctionBar from './FunctionBar';
import { toBlob } from 'html-to-image';

interface DebateTopicInfoProps {
  data: DebateTopicData;
}

const DebateTopicInfo: React.FC<DebateTopicInfoProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.markdown)
      .then(() => alert('内容已复制到剪贴板'))
      .catch(err => console.error('复制失败:', err));
  };

  const handleShare = async () => {
    if (contentRef.current) {
      setIsSharing(true);
      try {
        const blob = await toBlob(contentRef.current, {
          quality: 0.95,
          cacheBust: true,
          pixelRatio: 2,
        });
        
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          alert('截图已复制到剪贴板，可以粘贴到其他应用中查看');
        } else {
          throw new Error('Failed to generate image');
        }
      } catch (err) {
        console.error('截图生成失败:', err);
        alert('截图生成失败，请稍后重试');
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <div className="relative">
      <div ref={contentRef} className="bg-white shadow-lg rounded-2xl p-8">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          className="markdown-content"
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold my-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-medium my-2" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-lg font-medium my-2" {...props} />,
            p: ({node, ...props}) => <p className="my-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
            li: ({node, ...props}) => <li className="my-1" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
            em: ({node, ...props}) => <em className="italic" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />,
            code: ({node, inline, ...props}) => 
              inline 
                ? <code className="bg-gray-100 rounded px-1" {...props} />
                : <pre className="bg-gray-100 rounded p-2 my-2 overflow-x-auto"><code {...props} /></pre>,
          }}
        >
          {data.markdown}
        </ReactMarkdown>

        <FunctionBar onCopy={handleCopy} onShare={handleShare} />
      </div>
      {isSharing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-semibold">正在生成截图，请稍候...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebateTopicInfo;
