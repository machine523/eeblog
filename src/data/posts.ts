/**
 * ============================================================
 * 博客数据中心（小白阅读指南）
 * ============================================================
 * 这个文件做两件事：
 *   1. 保存「站点信息」（博客名、昵称、简介、社交链接等）——改 site 即可
 *   2. 自动读取 src/content/posts/ 文件夹里的所有 .md 文章文件，
 *      解析成网页能用的数据 —— 一般不需要改动这部分
 *
 * 你日常只需要打交道的是：
 *   - 改个人信息  → 本文件的 site 对象
 *   - 写文章      → src/content/posts/ 文件夹（里面有份《_如何添加文章.md》说明书）
 * ============================================================
 */

/** 一篇文章在网页里的完整结构 */
export interface Post {
  slug: string // 文章的网址标识（来自 md 文件名）
  title: string
  date: string // 格式：YYYY-MM-DD
  tags: string[]
  excerpt: string
  /** 文章卡片/横幅的封面：一个 emoji 图标 + 一组渐变色 */
  cover: { emoji: string; from: string; to: string }
  featured: boolean // true 表示显示在首页「精选文章」
  content: string // Markdown 正文
}

/** ============================================================
 *  站点信息 —— 改成你自己的！
 *  ============================================================ */
export const site = {
  name: '拾光小栈', // 博客名字（左上角、页脚都会用到）
  slogan: '把日子过成值得记录的样子',
  owner: '阿栈', // 你的昵称
  avatar: '🌿', // 头像图标：一个 emoji
  bio: '一名喜欢写字的工程师。白天写代码，晚上写生活；相信慢慢来，比较快。',
  location: '杭州 · 中国',
  email: 'hi@shiguang.blog',
  // 社交链接：icon 可选 github / mail / rss（在 Header、Footer、关于页显示）
  socials: [
    { label: 'GitHub', href: 'https://github.com', icon: 'github' },
    { label: '邮件', href: 'mailto:hi@shiguang.blog', icon: 'mail' },
    { label: 'RSS', href: '#', icon: 'rss' },
  ],
  // 关于页里「常对自己说的话」
  mottos: ['写作是思考的整理术', '代码如诗，删繁就简', '记录，是对抗遗忘的方式'],
}

/* ============================================================
 * 下面开始是「读取文章文件夹」的逻辑，弄明白原理可以改，
 * 不想折腾的话不用动它，照常用文件夹管理文章即可。
 * ============================================================ */

/**
 * Vite 提供的「批量导入」能力：
 * 把 src/content/posts/ 下的所有 .md 文件以纯文本形式一次性读进来。
 * 结果是 { 文件路径: 文件内容 } 这样一个对照表。
 */
const rawFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** 文章没写图标/颜色时使用的默认封面 */
const DEFAULT_COVER = { emoji: '🌿', from: '#e8f4e9', to: '#f3f7ec' }

/**
 * 解析 md 文件开头的信息区（frontmatter）。
 * frontmatter 长这样：
 *   ---
 *   title: 文章标题
 *   tags: 随笔, 生活
 *   ---
 *   正文……
 *
 * 返回 { 信息字段, 正文 }
 */
function parseMarkdown(raw: string): { meta: Record<string, string>; body: string } {
  const meta: Record<string, string> = {}

  // 统一换行符，去掉 BOM（某些编辑器保存时会加上的隐藏字符）
  const text = raw.replace(/\r\n/g, '\n').replace(/^﻿/, '')

  // 文件必须以 --- 开头，否则整个文件都当正文（信息用默认值）
  if (!text.startsWith('---')) {
    return { meta, body: text.trim() }
  }

  // 找到第二个 --- 的位置，两个 --- 之间就是信息区
  const end = text.indexOf('\n---', 3)
  if (end === -1) {
    return { meta, body: text.trim() }
  }

  const header = text.slice(3, end).trim()
  const body = text.slice(end + 4).trim()

  // 逐行解析「键: 值」
  for (const line of header.split('\n')) {
    const colon = line.indexOf(':')
    if (colon <= 0) continue // 空行或没有冒号的行直接跳过
    const key = line.slice(0, colon).trim()
    let value = line.slice(colon + 1).trim()
    // 去掉值两端的引号（title: "带冒号: 的标题" 这种写法也能正确解析）
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    meta[key] = value
  }
  return { meta, body }
}

/** 把单个 md 文件解析成一篇文章 */
function toPost(filePath: string, raw: string): Post {
  // 从文件路径取出文件名（不带 .md），作为文章网址：/posts/文件名
  const slug = filePath.split('/').pop()!.replace(/\.md$/, '')

  const { meta, body } = parseMarkdown(raw)

  return {
    slug,
    title: meta.title || slug, // 没写标题就用文件名兜底
    date: meta.date || '2026-01-01',
    // 标签支持中英文逗号分隔，自动去掉空白
    tags: (meta.tags || '')
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean),
    excerpt: meta.excerpt || '',
    cover: {
      emoji: meta.emoji || DEFAULT_COVER.emoji,
      from: meta.colorFrom || DEFAULT_COVER.from,
      to: meta.colorTo || DEFAULT_COVER.to,
    },
    featured: meta.featured === 'true', // 只有写 true 才算精选
    content: body,
  }
}

/** 所有文章（按日期从新到旧排序），文件名以 _ 开头的自动忽略（比如说明书） */
export const sortedPosts: Post[] = Object.entries(rawFiles)
  .filter(([path]) => !path.split('/').pop()!.startsWith('_'))
  .map(([path, raw]) => toPost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export const posts = sortedPosts

/** 全部标签（自动从所有文章里收集，不重复） */
export const allTags = Array.from(new Set(sortedPosts.flatMap((p) => p.tags)))

/** 根据网址标识找文章 */
export function getPost(slug: string): Post | undefined {
  return sortedPosts.find((p) => p.slug === slug)
}

/** 估算阅读时长：按中文阅读速度约 380 字/分钟 */
export function readingTime(content: string): number {
  const chars = content.replace(/[\s`#>*\-[\]()]/g, '').length
  return Math.max(1, Math.round(chars / 380))
}

/** 把 2026-09-12 格式化成「2026 年 9 月 12 日」 */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${y} 年 ${m} 月 ${d} 日`
}
