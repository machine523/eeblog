import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import Layout from '@/components/Layout'

export default function NotFound() {
  return (
    <Layout>
      <section className="flex animate-fade-up flex-col items-center py-24 text-center">
        <span className="text-6xl">🍃</span>
        <h1 className="mt-6 font-serif text-4xl font-black tracking-tight">这片叶子迷路了</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          你要找的页面不存在，也许它被风吹走了，或者从来没有存在过。
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
        >
          <ArrowLeft size={15} />
          回到首页
        </Link>
      </section>
    </Layout>
  )
}
