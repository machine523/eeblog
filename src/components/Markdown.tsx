/**
 * Markdown 正文渲染器（文章详情页的排版核心）
 * ------------------------------------------------------------
 * 排版风格参考技术博客 / 技术文档（掘金、MDN）：紧凑、密实、层级清晰
 *
 * 想自己微调？记住这几个关键数字（单位都是 rem，1rem ≈ 16px）：
 *   - 正文字号/行距：下面最外层 div 的 text-[15px] leading-[1.75]
 *       觉得挤 → 行距调大到 1.85；觉得松 → 调小到 1.7
 *   - 段落间距：p 标签的 my-3（上下各 0.75rem）
 *   - 标题与上文距离：h2 的 mt-8、h3 的 mt-6
 *   - 列表项间距：ul 的 space-y-1
 * Tailwind 的数字规则：my-1=0.25rem，my-2=0.5rem，my-3=0.75rem，以此类推
 * ------------------------------------------------------------
 * 支持的语法：## / ### 标题、段落、> 引用、- 列表、```代码块、
 * **加粗**、*斜体*、`行内代码`、[链接](url)
 */
import type { ReactNode } from 'react'

/** 处理一行文字里的行内样式：`代码`、**加粗**、*斜体*、[链接]() */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // 正则按优先级匹配四种行内语法：代码 > 加粗 > 斜体 > 链接
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)]+\))/g
  const nodes: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const token = m[0]
    if (token.startsWith('`')) {
      // `行内代码`：浅绿底小字
      nodes.push(
        <code
          key={`${keyPrefix}-${i}`}
          className="rounded bg-leaf-100/80 px-1 py-0.5 font-mono text-[0.85em] text-leaf-800"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('*')) {
      nodes.push(<em key={`${keyPrefix}-${i}`}>{token.slice(1, -1)}</em>)
    } else {
      const label = token.slice(1, token.indexOf(']'))
      const href = token.slice(token.indexOf('(') + 1, -1)
      nodes.push(
        <a
          key={`${keyPrefix}-${i}`}
          href={href}
          className="font-medium text-leaf-700 underline decoration-leaf-300 underline-offset-4 transition-colors hover:text-leaf-600"
        >
          {label}
        </a>,
      )
    }
    last = m.index + token.length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/** Markdown 被切分成的「块」类型 */
type Block =
  | { type: 'code'; lang: string; lines: string[] }
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'quote'; lines: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'p'; text: string }

/** 把 Markdown 原文逐行切分成一个个「块」（标题/段落/引用/列表/代码） */
function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    // ``` 开头：代码块，一直读到下一个 ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // 跳过结束的 ```
      blocks.push({ type: 'code', lang, lines: codeLines })
      continue
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) })
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) })
      i++
      continue
    }

    // > 开头：引用块，连续的行合并
    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push({ type: 'quote', lines: quoteLines })
      continue
    }

    // - 开头：无序列表，连续的行合并
    if (trimmed.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // 其余：普通段落（连续非空行合并成一段）
    const para: string[] = [trimmed]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{2,3}\s|>\s|-\s|```)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim())
      i++
    }
    blocks.push({ type: 'p', text: para.join(' ') })
  }
  return blocks
}

export default function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content)
  return (
    /* 正文容器：text-[15px] 字号、leading-[1.75] 行距 —— 技术文档的紧凑感主要来自这里 */
    <div className="text-[15px] leading-[1.75] text-foreground/90">
      {blocks.map((block, idx) => {
        const key = `b-${idx}`
        switch (block.type) {
          case 'code':
            /* 代码块：深色卡片 + 仿 macOS 窗口的三个圆点 */
            return (
              <figure key={key} className="my-4 overflow-hidden rounded-lg border border-leaf-900/10 bg-[#182620] shadow-sm">
                <figcaption className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                  <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                  <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                  {block.lang && (
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {block.lang}
                    </span>
                  )}
                </figcaption>
                <pre className="overflow-x-auto px-3.5 py-3">
                  <code className="font-mono text-[13px] leading-[1.7] text-[#c9e4d0]">
                    {block.lines.join('\n')}
                  </code>
                </pre>
              </figure>
            )
          case 'h2':
            /* 二级标题：绿色竖条 + 大字，mt-8 与上文拉开、mb-3 紧贴下文 */
            return (
              <h2
                key={key}
                className="mb-3 mt-8 flex items-center gap-2.5 font-serif text-xl font-bold text-foreground"
              >
                <span className="h-4 w-[3px] rounded-full bg-leaf-500" aria-hidden />
                {block.text}
              </h2>
            )
          case 'h3':
            /* 三级标题：更小一号，前面加一个小方块标记层级 */
            return (
              <h3 key={key} className="mb-2 mt-6 flex items-center gap-2 font-serif text-base font-bold text-leaf-900">
                <span className="h-2 w-2 rounded-[2px] bg-leaf-400" aria-hidden />
                {block.text}
              </h3>
            )
          case 'quote':
            /* 引用块：左侧细竖线 + 浅绿底。中文不用斜体（斜体中文观感差） */
            return (
              <blockquote
                key={key}
                className="my-4 rounded-r-lg border-l-2 border-leaf-400 bg-leaf-50 px-4 py-2.5 text-[0.95em] leading-relaxed text-leaf-800"
              >
                {block.lines.map((l, i) => (
                  <p key={i} className={i > 0 ? 'mt-1' : ''}>{renderInline(l, `${key}-${i}`)}</p>
                ))}
              </blockquote>
            )
          case 'ul':
            /* 列表：space-y-1 让条目更紧凑，小圆点做标记 */
            return (
              <ul key={key} className="my-3 space-y-1 pl-1">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-[0.68em] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400" aria-hidden />
                    <span className="min-w-0">{renderInline(item, `${key}-${i}`)}</span>
                  </li>
                ))}
              </ul>
            )
          case 'p':
          default:
            /* 普通段落：my-3 = 上下间距 0.75rem（比之前的 my-5 紧凑得多） */
            return (
              <p key={key} className="my-3">
                {renderInline((block as { text: string }).text, key)}
              </p>
            )
        }
      })}
    </div>
  )
}
