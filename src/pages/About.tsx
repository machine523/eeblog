/**
 * 关于页：个人卡片 + 三个小介绍 + 座右铭 + 联系方式
 * - 昵称、简介、邮箱等在 src/data/posts.ts 的 site 里改
 * - 「职业 / 日常 / 理想」三个小卡片在下面的 facts 数组里改
 */
import { Code2, Coffee, Github, Mail, MapPin, Quote, Rss, Tent } from 'lucide-react'
import Layout from '@/components/Layout'
import { site } from '@/data/posts'

const icons: Record<string, typeof Github> = { github: Github, mail: Mail, rss: Rss }

const facts = [
  { icon: Code2, title: '职业', text: '前端工程师，偶尔写写后端。相信好的工具和好的文字一样，都应该删繁就简。' },
  { icon: Coffee, title: '日常', text: '手冲咖啡、纸质书、周末长距离散步。最近在学习拉花，目前最高水平是一朵抽象派蘑菇。' },
  { icon: Tent, title: '理想', text: '拥有一间看得见山的书房，和一颗永远对世界好奇的心。' },
]

export default function About() {
  return (
    <Layout>
      <section className="animate-fade-up pt-12">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-leaf-100 to-leaf-200 text-5xl shadow-inner">
            {site.avatar}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-black tracking-tight">{site.owner}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              {site.location}
            </p>
            <div className="mt-3 flex gap-2">
              {site.socials.map((s) => {
                const Icon = icons[s.icon] ?? Mail
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-leaf-400 hover:text-leaf-700"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-foreground/85">{site.bio}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,89,60,0.08)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                <f.icon size={18} />
              </div>
              <h2 className="mt-3 font-serif font-bold">{f.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-serif text-xl font-bold">常对自己说的话</h2>
          <div className="mt-4 space-y-3">
            {site.mottos.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border-l-[3px] border-leaf-400 bg-leaf-50 px-5 py-3.5"
              >
                <Quote size={15} className="shrink-0 text-leaf-500" />
                <span className="font-serif text-leaf-800">{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-leaf-400/60 bg-leaf-50/50 p-6 text-center">
          <p className="font-serif text-lg font-semibold text-leaf-800">想和我聊聊？</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            无论是一个想法、一个问题，还是仅仅打个招呼，都欢迎来信。
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
          >
            <Mail size={15} />
            {site.email}
          </a>
        </div>
      </section>
    </Layout>
  )
}
