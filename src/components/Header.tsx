/**
 * 顶部导航栏组件
 * - 左侧：博客 Logo 和名字（内容来自 src/data/posts.ts 的 site）
 * - 右侧：导航链接 + 深色模式切换按钮（手机上折叠为汉堡菜单）
 * - 滚动超过 8px 后会变成半透明毛玻璃效果（sticky 吸顶）
 * 想增删导航项 → 改下面的 nav 数组
 */
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { site } from '@/data/posts'

const nav = [
  { to: '/', label: '首页' },
  { to: '/posts', label: '文章' },
  { to: '/archive', label: '归档' },
  { to: '/about', label: '关于' },
]

export default function Header() {
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefers
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-border/80 bg-background/85 shadow-[0_1px_12px_rgba(52,89,60,0.06)] backdrop-blur-md'
          : 'border-transparent bg-background'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-lg transition-transform duration-300 group-hover:rotate-12">
            {site.avatar}
          </span>
          <span className="font-serif text-lg font-bold tracking-wide text-foreground">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-leaf-100 font-medium text-leaf-800'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={toggleDark}
            aria-label="切换深浅色"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
          <button
            onClick={toggleDark}
            aria-label="切换深浅色"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="菜单"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur-md sm:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-[15px] ${
                  isActive ? 'bg-leaf-100 font-medium text-leaf-800' : 'text-muted-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
