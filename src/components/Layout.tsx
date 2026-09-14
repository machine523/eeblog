/**
 * 页面骨架：所有页面共用「导航栏 + 内容区 + 页脚」
 * max-w-3xl 控制内容最大宽度（约 768px，阅读最舒适的单行长度），
 * 想讓内容更宽/更窄就改 Layout 里的 max-w-3xl（如 max-w-4xl / max-w-2xl）
 */
import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5">{children}</main>
      <Footer />
    </div>
  )
}
