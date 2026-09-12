/**
 * 全部文章页
 * 顶部一排标签按钮可以筛选文章；选中的标签会记在网址上（?tag=xxx），
 * 所以从首页话题点进来会自动带上筛选
 */
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import Layout from '@/components/Layout'
import { PostCard, TagPill } from '@/components/PostCard'
import { allTags, sortedPosts } from '@/data/posts'

export default function Posts() {
  const [params, setParams] = useSearchParams()
  const activeTag = params.get('tag')

  const filtered = useMemo(
    () => (activeTag ? sortedPosts.filter((p) => p.tags.includes(activeTag)) : sortedPosts),
    [activeTag],
  )

  const selectTag = (tag: string | null) => {
    if (tag) setParams({ tag })
    else setParams({})
  }

  return (
    <Layout>
      <section className="animate-fade-up pt-12">
        <h1 className="font-serif text-3xl font-black tracking-tight">全部文章</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {filtered.length} 篇{activeTag ? ` · 话题「${activeTag}」` : ''}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <TagPill tag="全部" active={!activeTag} onClick={() => selectTag(null)} />
          {allTags.map((tag) => (
            <TagPill
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={() => selectTag(tag)}
            />
          ))}
        </div>

        <div className="mt-8 divide-y divide-border/50">
          {filtered.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">这个话题下还没有文章 🌱</p>
        )}
      </section>
    </Layout>
  )
}
