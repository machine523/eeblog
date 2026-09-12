import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

/**
 * 路由说明：使用 HashRouter（网址形如 /#/posts/xxx）。
 * 原因：本博客会托管到 GitHub Pages 等纯静态环境，
 * 这些环境不支持「所有路径回退到 index.html」，
 * Hash 路由把路径放在 # 后面，服务器永远只收到对 index.html 的请求，
 * 刷新、直接分享文章链接都不会 404 —— 在任何静态托管上都能稳定工作。
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
