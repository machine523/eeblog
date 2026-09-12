import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
    // 监听所有网卡地址（IPv4 + IPv6）。
    // 不加这行时 Vite 只绑定 IPv6 的 localhost，
    // 有些浏览器走 IPv4 (127.0.0.1) 访问就会「拒绝连接」
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
