/**
 * 页脚组件：博客名 + 一句话简介 + 社交图标 + 版权行
 * 内容全部来自 src/data/posts.ts 的 site 对象，改数据即可，不用动这里
 */
import { Github, Mail, Rss } from 'lucide-react'
import { site } from '@/data/posts'

const icons: Record<string, typeof Github> = {
  github: Github,
  mail: Mail,
  rss: Rss,
}

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{site.avatar}</span>
              <span className="font-serif text-lg font-bold">{site.name}</span>
            </div>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.slogan}。用文字抵抗遗忘，用代码构建世界。
            </p>
          </div>

          <div className="flex items-center gap-3">
            {site.socials.map((s) => {
              const Icon = icons[s.icon] ?? Mail
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:text-leaf-700"
                >
                  <Icon size={17} />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2023 - 2026 {site.owner} · {site.name}</span>
          <span className="font-serif italic">慢慢走，欣赏啊。</span>
        </div>
      </div>
    </footer>
  )
}
