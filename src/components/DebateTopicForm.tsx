import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

interface DebateTopicFormProps {
  onSubmit: (topic: string) => void
  isLoading: boolean
}

const DebateTopicForm: React.FC<DebateTopicFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('')
  const [searchParams] = useSearchParams()
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null)

  useEffect(() => {
    const topicFromUrl = searchParams.get('topic')
    if (topicFromUrl) {
      setTopic(decodeURIComponent(topicFromUrl))
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim())
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center bg-gray-100 rounded-full overflow-hidden transition-all duration-300 ${
          isLoading ? 'opacity-50' : 'focus-within:ring-2 focus-within:ring-blue-300'
        }`}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="输入辩论主题"
            className="flex-grow p-4 bg-transparent outline-none text-lg text-gray-800 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-4 text-blue-500 hover:text-blue-600 transition-colors"
            disabled={isLoading}
            aria-label="搜索"
          >
            <Search size={24} />
          </button>
        </div>
      </form>
      {remainingSearches !== null && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          今日深度搜索剩余次数：{remainingSearches}次
        </div>
      )}
    </div>
  )
}

export default DebateTopicForm