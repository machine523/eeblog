/**
 * 文章详情页
 * 结构：返回链接 → 标签 → 大标题 → 日期/阅读时长 → emoji 封面横幅
 * → Markdown 正文（由 components/Markdown.tsx 渲染）→ 上一篇/下一篇
 */
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import Layout from '@/components/Layout'
import Markdown from '@/components/Markdown'
import { formatDate, getPost, readingTime, sortedPosts } from '@/data/posts'
import NotFound from './NotFound'

export default function PostDetail() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <NotFound />

  const idx = sortedPosts.findIndex((p) => p.slug === post.slug)
  const prev = idx > 0 ? sortedPosts[idx - 1] : undefined // 更新的一篇
  const next = idx < sortedPosts.length - 1 ? sortedPosts[idx + 1] : undefined // 更早的一篇

  return (
    <Layout>
      <article className="animate-fade-up pt-8">
        <Link
          to="/posts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-leaf-700"
        >
          <ArrowLeft size={15} />
          全部文章
        </Link>

        {/* 文章头部：标签 → 大标题 → 日期/阅读时长（紧凑排列） */}
        <header className="mt-6">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/posts?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-leaf-100 px-3 py-1 text-xs text-leaf-700 transition-colors hover:bg-leaf-200"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="mt-3 font-serif text-2xl font-black leading-snug tracking-tight sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 border-b border-border/70 pb-5 text-sm text-muted-foreground">
            <time>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              约 {readingTime(post.content)} 分钟
            </span>
          </div>
        </header>

        {/* 封面横幅：技术文档风格压低高度，只留一条浅色带 + 小图标 */}
        <div
          className="mt-6 flex h-24 items-center justify-center rounded-xl text-4xl"
          style={{ background: `linear-gradient(135deg, ${post.cover.from}, ${post.cover.to})` }}
          aria-hidden
        >
          {post.cover.emoji}
        </div>

        {/* 正文 */}
        <Markdown content={post.content} />

        {/* 上一篇 / 下一篇 */}
        <nav className="mt-10 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
          {next ? (
            <Link
              to={`/posts/${next.slug}`}
              className="group rounded-xl border border-border/70 p-4 transition-all hover:border-leaf-400 hover:bg-card"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft size={12} /> 更早一篇
              </span>
              <span className="mt-1.5 block font-serif font-semibold transition-colors group-hover:text-leaf-700">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {prev && (
            <Link
              to={`/posts/${prev.slug}`}
              className="group rounded-xl border border-border/70 p-4 text-right transition-all hover:border-leaf-400 hover:bg-card"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                更新一篇 <ArrowRight size={12} />
              </span>
              <span className="mt-1.5 block font-serif font-semibold transition-colors group-hover:text-leaf-700">
                {prev.title}
              </span>
            </Link>
          )}
        </nav>
      </article>
    </Layout>
  )
}
