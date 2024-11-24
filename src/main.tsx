// main.tsx
// 这是应用的入口点,负责渲染根组件

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { inject } from '@vercel/analytics'
inject();
// 使用 StrictMode 渲染 App 组件
// StrictMode 是一个用于突出显示应用程序中潜在问题的工具
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
