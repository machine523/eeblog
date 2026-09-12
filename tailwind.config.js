/**
 * Tailwind CSS 配置文件 —— 控制「工具类」的全局规则
 *
 * 小白只需要关心三个地方（都在 theme.extend 里）：
 *   1. fontFamily：网站用哪些字体
 *   2. colors.leaf：本博客的「鼠尾草绿」色板（bg-leaf-100、text-leaf-700 等）
 *   3. keyframes / animation：入场动画定义
 * 其余是 shadcn/ui 组件库的标准接线，保持原样即可。
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // 深色模式通过 <html class="dark"> 切换（见 Header.tsx 的切换按钮）
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Tailwind 扫描这些文件里出现的类名
  theme: {
    extend: {
      /* ★ 网站字体在这里改（font-sans / font-serif / font-mono 三个工具类对应这三行）：
         - sans  → 正文、按钮等大部分文字（body 默认用它）
         - serif → 大标题、文章标题（代码里写了 font-serif 的地方）
         - mono  → 代码块和日期数字
         规则：浏览器从左到右找字体，找到第一个「你电脑里有的」就用它，
         都找不到才用最后兜底的 sans-serif / serif。
         例如 sans 现在的意思是：优先用微软雅黑，没有（比如苹果电脑）
         就用思源黑体，再没有就用系统默认黑体。 */
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"Noto Sans SC"', 'ui-sans-serif', 'system-ui', '-apple-system', '"PingFang SC"', 'sans-serif'],
        serif: ['"Microsoft YaHei"', '"Noto Serif SC"', 'Georgia', '"Songti SC"', '"SimSun"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        /* 博客主题色板「leaf」（鼠尾草绿），数字越大颜色越深：
           50/100 适合做浅色背景块，400~600 适合做图标和点缀，
           700~900 适合做文字。想换主题色系就整体替换这一组 */
        leaf: {
          50: '#f3f7f3',
          100: '#e3eee4',
          200: '#c8dfc9',
          300: '#9fc7a4',
          400: '#72a97c',
          500: '#528b5d',
          600: '#3f6f49',
          700: '#34593c',
          800: '#2c4832',
          900: '#253b2a',
          950: '#122017',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        /* 页面入场动画：从下方 14px 处淡入浮起（配合 animate-fade-up 使用） */
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}