/**
 * 首页
 * 从上到下依次是：个人介绍 Hero → 精选文章（featured: true 的文章）
 * → 最新文章列表 → 话题标签云
 * 想调整区块顺序/删某个区块，直接移动或删除对应的 <section> 即可
 */
import { Link } from 'react-router'
import { ArrowRight, Github, Mail, MapPin, Rss, Sparkles } from 'lucide-react'
import Layout from '@/components/Layout'
import { PostCard } from '@/components/PostCard'
import { allTags, site, sortedPosts } from '@/data/posts'

const icons: Record<string, typeof Github> = { github: Github, mail: Mail, rss: Rss }

export default function Home() {
  const featured = sortedPosts.filter((p) => p.featured)
  const recent = sortedPosts.filter((p) => !p.featured).slice(0, 4)

  return (
    <Layout>
      {/* Hero */}
      <section className="animate-fade-up pt-14 sm:pt-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          {site.location}
        </div>
        <h1 className="mt-4 font-serif text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          你好，我是{site.owner}
          <span className="ml-3 inline-block animate-[wave_2s_ease-in-out_infinite] origin-[70%_70%]">👋</span>
        </h1>
        <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
          {site.bio}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/posts"
            className="group inline-flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-leaf-700 hover:shadow-md"
          >
            开始阅读
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="flex items-center gap-2">
            {site.socials.map((s) => {
              const Icon = icons[s.icon] ?? Mail
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-leaf-400 hover:text-leaf-700"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>
        <style>{`@keyframes wave { 0%,60%,100%{transform:rotate(0)} 10%{transform:rotate(14deg)} 20%{transform:rotate(-8deg)} 30%{transform:rotate(14deg)} 40%{transform:rotate(-4deg)} 50%{transform:rotate(10deg)} }`}</style>
      </section>

      {/* 精选文章 */}
      <section className="mt-16 animate-fade-up stagger-2">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-leaf-600" />
          <h2 className="font-serif text-xl font-bold">精选文章</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((post) => (
            <Link
              key={post.slug}
              to={`/posts/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(52,89,60,0.10)]"
            >
              <div
                className="flex h-36 items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${post.cover.from}, ${post.cover.to})` }}
                aria-hidden
              >
                {post.cover.emoji}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold leading-snug transition-colors group-hover:text-leaf-700">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新文章 */}
      <section className="mt-16 animate-fade-up stagger-3">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-serif text-xl font-bold">最新文章</h2>
          <Link
            to="/posts"
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-leaf-700"
          >
            全部文章
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recent.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* 标签 */}
      <section className="mt-16 animate-fade-up stagger-4">
        <h2 className="mb-4 font-serif text-xl font-bold">话题</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              to={`/posts?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:text-leaf-700"
            >
              # {tag}
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
