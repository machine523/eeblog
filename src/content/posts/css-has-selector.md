---
title: ":has() 选择器，CSS 等了二十年的礼物"
date: 2026-07-12
tags: 前端, 技术
excerpt: 父选择器终于来了。:has() 不只是语法糖，它让一大批曾经必须写 JS 的交互回归纯 CSS。
emoji: 🎨
colorFrom: "#e9f2f6"
colorTo: "#eff6ee"
featured: false
---

如果说近几年 CSS 有什么真正意义上的「新能力」，:has() 一定排第一。它让 CSS 第一次拥有了「向上看」的能力。

## 以前做不到的事

场景：表单里某个输入框校验失败时，把整行标红。以前的解法是给父元素加 class，绕不开 JS。现在：

```css
.form-row:has(input:invalid) {
  background: #fef2f2;
  border-color: #f87171;
}
```

## 我常用的几个模式

**卡片里有没有图，布局不一样：**

```css
.card:has(img) {
  grid-template-rows: 200px 1fr;
}
.card:not(:has(img)) {
  grid-template-rows: 1fr;
}
```

**复选框选中时划掉整行：**

```css
.todo:has(:checked) .todo-text {
  text-decoration: line-through;
  opacity: 0.5;
}
```

**页面有弹层时禁止滚动：**

```css
body:has(dialog[open]) {
  overflow: hidden;
}
```

## 性能要注意

:has() 的匹配是向上的，浏览器需要做更多工作。避免写 `*:has(*)` 这种大范围匹配，把选择器限制在具体的组件范围内，实测完全够用。

CSS 的哲学一直是「描述结果，而非步骤」。:has() 让这个哲学覆盖到了更多场景。
