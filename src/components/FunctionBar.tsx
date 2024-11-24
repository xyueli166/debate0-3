import React from 'react';
import { Copy, Share2 } from 'lucide-react';

interface FunctionBarProps {
  onCopy: () => void;
  onShare: () => void;
}

const FunctionBar: React.FC<FunctionBarProps> = ({ onCopy, onShare }) => {
  return (
    <div className="flex justify-center mt-8 pt-6 border-t border-gray-200 space-x-6">
      <button
        onClick={onCopy}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
      >
        <Copy size={20} />
        <span>复制内容</span>
      </button>
      <button
        onClick={onShare}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
      >
        <Share2 size={20} />
        <span>分享截图</span>
      </button>
    </div>
  );
};

export default FunctionBar;