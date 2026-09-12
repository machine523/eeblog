---
title: React Server Components 学习笔记
date: 2026-08-22
tags: 前端, 技术
excerpt: RSC 不是 SSR 的升级版，而是一次组件模型的重构。这篇笔记记录我理解它的三个关键时刻。
emoji: ⚛️
colorFrom: "#e6f0f7"
colorTo: "#eef6f2"
featured: true
---

折腾了两个周末，总算把 React Server Components 的心智模型理顺了。记录一下，免得三个月后自己又忘干净。

## 关键时刻一：它不是 SSR

SSR 是把组件在服务器渲染成 HTML 字符串，发到浏览器后再 hydrate。RSC 完全不同——它把组件树的**描述**（一种特殊的序列化格式）发到客户端。

最直观的区别：Server Component 的代码**永远不会被打包进客户端 bundle**。

```tsx
// 这个组件只存在于服务器
async function ArticleList() {
  const articles = await db.article.findMany() // 直接查库！
  return (
    <ul>
      {articles.map((a) => (
        <li key={a.id}>{a.title}</li>
      ))}
    </ul>
  )
}
```

没有 useEffect，没有 loading state，没有 API 层。数据获取回到了它本来该有的样子。

## 关键时刻二：边界是 'use client'

Server 和 Client 组件的分界线，就是文件顶部那行 `'use client'`。标记了的文件及其**所有依赖**都会进入客户端 bundle。

所以最佳实践是：把交互组件推到组件树的叶子节点。一个页面大部分可以是 Server Component，只在真正需要 onClick、useState 的地方开一个小口子。

## 关键时刻三：组合的魔力

Server Component 可以把 Client Component 当作 children 组合起来：

```tsx
// Server Component
export default function Page() {
  return (
    <ClientSidebar>       {/* 交互边界 */}
      <ServerContent />   {/* 依然在服务器渲染 */}
    </ClientSidebar>
  )
}
```

children 是作为「已经渲染好的插槽」传过去的，这个设计真的很优雅。

## 小结

RSC 的本质是**把数据依赖留在服务器，把交互依赖留在客户端**。想清楚每个组件属于哪一边，架构自然就清晰了。
