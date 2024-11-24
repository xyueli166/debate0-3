import React, { useState } from 'react';
import { AlertCircle, Lock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DebatePosition {
  id: string;
  title: string;
  description: string;
  available: boolean;
  externalLink?: string;
}

const positions: DebatePosition[] = [
  {
    id: 'first',
    title: '立论/申论训练',
    description: '立论陈词、攻辩总结，奠定全场辩论基调',
    available: false
  },
  {
    id: 'second',
    title: '驳论/质询训练',
    description: '驳论陈词、攻辩对抗，展开正面交锋',
    available: true,
    externalLink: 'https://www.coze.cn/s/iA4Lwbun/' // 在这里填写你的外部链接
  },
  {
    id: 'third',
    title: '接质训练',
    description: '承接质询，从容应对，展开回击。',
    available: false,
  },
  {
    id: 'fourth',
    title: '趣味技巧',
    description: '划定战场、归谬、受身',
    available: false
  }
];

interface DebatePositionSelectProps {
  onClose: () => void;
}

const DebatePositionSelect: React.FC<DebatePositionSelectProps> = ({ onClose }) => {
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePositionSelect = (position: DebatePosition) => {
    if (position.available) {
      if (position.externalLink) {
        window.location.href = position.externalLink;
      } else {
        navigate('/chat');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">选择辩位</h2>
          <p className="text-gray-600">选择你想要训练的辩位进行专项训练</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {positions.map((position) => (
            <div
              key={position.id}
              onMouseEnter={() => setHoveredPosition(position.id)}
              onMouseLeave={() => setHoveredPosition(null)}
              className="relative"
              onClick={() => handlePositionSelect(position)}
            >
              <div 
                className={`group ${
                  position.available 
                    ? 'bg-white border-2 border-blue-500 cursor-pointer hover:bg-blue-50' 
                    : 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed'
                } rounded-xl p-6 text-left transition-colors duration-200`}
              >
                {!position.available && (
                  <div className="absolute top-2 right-2">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                )}
                {position.available && position.externalLink && (
                  <div className="absolute top-2 right-2">
                    <ExternalLink className="text-blue-500" size={20} />
                  </div>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${
                  position.available ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {position.title}
                </h3>
                <p className={position.available ? 'text-gray-600' : 'text-gray-400'}>
                  {position.description}
                </p>
              </div>
              {hoveredPosition === position.id && !position.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <span className="bg-black text-white px-4 py-2 rounded-md text-sm">
                    功能开发中，敬请期待
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            目前仅开放三辩训练功能，其他辩位正在积极开发中
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebatePositionSelect;
