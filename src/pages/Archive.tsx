/**
 * 归档页：把所有文章按年份分组，以时间线方式列出
 * 纯数据驱动，文章多了会自动分年，不需要维护
 */
import { Link } from 'react-router'
import Layout from '@/components/Layout'
import { sortedPosts } from '@/data/posts'

export default function Archive() {
  const byYear = sortedPosts.reduce<Record<string, typeof sortedPosts>>((acc, post) => {
    const year = post.date.slice(0, 4)
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <Layout>
      <section className="animate-fade-up pt-12">
        <h1 className="font-serif text-3xl font-black tracking-tight">归档</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {sortedPosts.length} 篇，写于 {years[years.length - 1]} ~ {years[0]}
        </p>

        <div className="mt-10 space-y-12">
          {years.map((year) => (
            <div key={year}>
              <h2 className="flex items-baseline gap-3 font-serif text-2xl font-bold text-leaf-800">
                {year}
                <span className="text-sm font-normal text-muted-foreground">
                  {byYear[year].length} 篇
                </span>
              </h2>
              <ul className="mt-4 space-y-1 border-l-2 border-leaf-200 pl-0">
                {byYear[year].map((post) => (
                  <li key={post.slug}>
                    <Link
                      to={`/posts/${post.slug}`}
                      className="group flex items-baseline gap-4 rounded-lg px-4 py-2.5 transition-colors hover:bg-accent/60"
                    >
                      <time className="shrink-0 font-mono text-xs text-muted-foreground">
                        {post.date.slice(5).replace('-', ' / ')}
                      </time>
                      <span className="font-serif font-medium text-foreground transition-colors group-hover:text-leaf-700">
                        <span className="link-underline">{post.title}</span>
                      </span>
                      <span className="ml-auto hidden shrink-0 gap-1.5 sm:flex">
                        {post.tags.map((t) => (
                          <span key={t} className="text-xs text-muted-foreground/70">
                            #{t}
                          </span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
