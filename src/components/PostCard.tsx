/**
 * 文章卡片 & 标签按钮
 * - PostCard：文章列表里的一行卡片（emoji 封面块 + 标题 + 摘要 + 标签）
 * - TagPill：文章页顶部的圆形标签筛选按钮
 * 卡片上的 emoji 图标来自每篇 md 文件头部的 emoji 字段
 */
import { Link } from 'react-router'
import { Clock } from 'lucide-react'
import { formatDate, readingTime, type Post } from '@/data/posts'

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group flex gap-4 rounded-2xl border border-transparent px-4 py-5 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-[0_4px_24px_rgba(52,89,60,0.07)] sm:gap-6 sm:px-6"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* 封面块 */}
      <div
        className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl text-4xl transition-transform duration-300 group-hover:scale-105 sm:flex"
        style={{ background: `linear-gradient(135deg, ${post.cover.from}, ${post.cover.to})` }}
        aria-hidden
      >
        {post.cover.emoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {readingTime(post.content)} 分钟
          </span>
        </div>
        <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-leaf-700">
          <span className="link-underline">{post.title}</span>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-leaf-100/70 px-2.5 py-0.5 text-xs text-leaf-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export function TagPill({
  tag,
  active,
  onClick,
}: {
  tag: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 ${
        active
          ? 'border-leaf-600 bg-leaf-600 text-white shadow-sm'
          : 'border-border bg-card text-muted-foreground hover:border-leaf-400 hover:text-leaf-700'
      }`}
    >
      {tag}
    </button>
  )
}
