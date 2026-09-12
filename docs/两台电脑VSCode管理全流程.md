# 🏠💼 家里 + 公司两台电脑，用 VSCode 管理博客 · 全流程手册

> 适用场景：家里一台电脑、公司一台电脑，都想在**本地用 VSCode** 写博客。
> 核心思想一句话：**GitHub 仓库是"中央大脑"，两台电脑都只是它的副本**。
> 改完 push（上传）回大脑，另一台 pull（下载）下来，两边永远一致。
>
> 仓库地址：<https://github.com/machine523/eeblog>
> 文章位置：仓库里的 `src/content/posts/` 文件夹（每篇一个 `.md` 文件）
> 图片位置：仓库里的 `public/images/` 文件夹

---

## 第一部分：一次性准备（每台电脑各做一次）

> 以下步骤在**家里电脑**和**公司电脑**上都要各做一遍，流程完全一样。

### 步骤 1：安装三个软件

| 软件 | 作用 | 下载地址 | 安装方法 |
| --- | --- | --- | --- |
| Git | 负责和 GitHub 同步（上传/下载） | <https://git-scm.com/download/win> | 一路点"下一步" |
| VSCode | 写文章用的编辑器 | <https://code.visualstudio.com> | 一路点"下一步" |
| Node.js LTS | 本地预览博客 | <https://nodejs.org> | 选 LTS 版，一路"下一步" |

> 装完后**重启一次电脑**（让系统识别新安装的命令），最省事。

### 步骤 2：把博客"克隆"到本地硬盘

1. 打开 VSCode
2. 按 `` Ctrl+` ``（键盘左上角，Esc 下面那个键）呼出底部终端
3. 在终端里依次输入（家里和公司可以选不同盘符，这里以 D 盘为例）：

```bash
cd /d D:\
git clone https://github.com/machine523/eeblog.git
```

4. 看到 `Cloning into 'eeblog'...` 和最后的 `done.` 就成功了，
   你的 D 盘多了一个 `D:\eeblog` 文件夹——这就是博客的本地副本

> ⚠️ 如果报 `Failed to connect to github.com:443`：
> 那是网络抖动（GitHub 在国内连接不稳定），**隔一分钟重试几次**基本必过；
> 重试前如果已生成一个空的 eeblog 文件夹，先删掉它：
> `Remove-Item -Recurse -Force eeblog`，再重新 clone。

### 步骤 3：安装依赖（为了本地预览）

终端里继续在 `D:\eeblog` 目录下执行：

```bash
cd eeblog
npm install
```

- 第一次会下载很多文件（1~3 分钟），看到 `added xxx packages` 即完成
- **这一步每台电脑只做一次**，以后不用再装

### 步骤 4：验证本地预览能打开

```bash
npm run dev
```

- 终端出现 `Local: http://localhost:xxxx/`，按住 `Ctrl` 点这个网址，浏览器里能看到博客
- 看完在终端按 `Ctrl + C` 停止预览

🎉 到这里，这台电脑的准备全部完成。另一台电脑照做一遍即可。

---

## 第二部分：日常写作流程（每次写博客都按这个来）

### 标准四步口诀：**拉 → 写 → 传 → 推**

```
① git pull（拉取最新）→ ② 写文章 → ③ 提交（commit）→ ④ 推送（push）
```

### 第 ① 步：拉取最新内容（最关键，千万别省）

每次打开 VSCode 准备写作，**第一件事**：

1. `` Ctrl+` `` 打开终端
2. 输入 `git pull` 回车
3. 看到 `Already up to date.`（已是最新）或文件更新提示 = 成功

> 为什么要做：你可能在另一台电脑或 GitHub 网页上改过文章。
> 不先 pull 就直接写，最后 push 时会被 GitHub 拒绝（提示冲突）。

### 第 ② 步：写 / 改文章

**改现有文章**：左侧文件树依次展开 `src → content → posts`，双击要改的 `.md` 文件，改完 `Ctrl+S` 保存。

**写新文章**：

1. 左侧右键 `posts` 文件夹 → **新建文件**，名字用英文小写+短横线，如 `i2c-bus-notes.md`
2. 复制下面这段头部信息到文件最顶上，改成你自己的内容：

```markdown
---
title: I2C 总线学习笔记        ← 文章标题
date: 2026-09-12              ← 今天日期（格式必须是 年-月-日）
tags: 硬件, 通信协议           ← 标签，逗号隔开（决定文章归到哪个分类）
excerpt: 一句话摘要。          ← 显示在文章卡片上，50 字以内
emoji: 🔧                     ← 文章图标（Win+. 打开表情面板挑选）
colorFrom: "#e8f3ea"          ← 封面渐变色（浅色系，可照抄现有文章）
colorTo: "#f6f9f1"
featured: false               ← true=显示在首页精选区；false=只进最新列表
---

正文从这里写。支持：## 小标题、**加粗**、- 列表、> 引用、```代码块、![图片](/images/xx.png)
```

**放图片**（可选）：图片文件先复制到 `public/images/` 文件夹，
文章里单独一行写 `![图片说明](/images/文件名.png)`。

**边写边看效果**（可选）：终端运行 `npm run dev`，浏览器开 `http://localhost:xxxx`，
每次 `Ctrl+S` 保存后网页自动刷新。

### 第 ③ 步：提交（给改动"打包拍照"）

1. 点 VSCode 左侧边栏**第三个图标**（长得像分叉树枝，叫"源代码管理"）
2. 「更改」列表里会列出你改过的所有文件
3. 在上方输入框写一句说明，例如：`新增：I2C总线学习笔记`
4. 点蓝色的 **✓ 提交** 按钮
5. 如果弹窗问「是否暂存所有更改并直接提交？」→ 点 **是**

### 第 ④ 步：推送（上传到 GitHub）

提交完成后，同一面板的按钮会变成 **🔄 同步更改**，点它。

- **第一次推送**会弹出 GitHub 登录授权 → 点允许，在浏览器里登录一次，
  以后这台电脑就永久记住了
- 推送成功后，GitHub 会自动重新构建网站，**2~3 分钟后** https://eebolg.online 更新

### 验证网站已更新（可选）

1. 打开 <https://github.com/machine523/eeblog/actions>
2. 最上面一条记录：🟡 黄点 = 构建中，✅ 绿勾 = 完成
3. 绿勾后打开网站按 `Ctrl+F5` 强制刷新，就能看到新文章

---

## 第三部分：两台电脑的典型配合场景

### 场景 A：早上在公司写了一半，晚上回家接着写

| 时间 | 电脑 | 操作 |
| --- | --- | --- |
| 早上 | 公司 | `git pull` → 写文章 → ✓ 提交 → 🔄 推送 |
| 晚上 | 家里 | 打开 VSCode → **`git pull`** → 早上写的内容就出现了 → 接着写 → 提交 → 推送 |
| 第二天 | 公司 | 打开 VSCode → **`git pull`** → 继续 |

> 看出规律了吗？**坐下先 pull，起身前 push**，两台电脑永远同步。

### 场景 B：出门了，只有手机/平板想改个错别字

用浏览器打开 GitHub 仓库网页版直接改（不需要 VSCode）：
进 `src/content/posts/` → 点文章 → 右上角铅笔 ✏️ → 改完拉到底 **Commit changes**。
回家后在电脑上 `git pull`，网页上的修改就同步到本地了。

### 场景 C：忘了 pull 就写，push 被拒绝怎么办

报错类似 `rejected ... fetch first`。按顺序执行：

```bash
git pull
```

- 大部分情况 Git 会自动合并成功，然后再走正常 提交→推送 即可
- 如果提示 **CONFLICT（冲突）**（同一篇文章两边都改了），小白最稳的处理：
  1. 把冲突的 md 文件**复制一份到桌面备份**
  2. 终端执行 `git checkout -- 冲突的文件名` 然后 `git pull`
  3. 打开备份，把自己写的内容手动合并回去，再提交推送

---

## 第四部分：故障速查表

| 症状 | 原因 | 解决办法 |
| --- | --- | --- |
| `Failed to connect to github.com:443` | 网络抖动 | 隔 1 分钟重试几次；还不行用镜像 `git clone https://kkgithub.com/machine523/eeblog.git` |
| `destination path 'eeblog' already exists` | 上次失败的克隆留了残骸 | `Remove-Item -Recurse -Force eeblog` 后重新 clone |
| push 弹登录窗口卡住 | 首次授权未完成 | 按提示在浏览器完成 GitHub 登录授权 |
| `npm install` 报错 | 网络或 Node 没装好 | 重试；确认装的是 Node.js LTS 且装完重启过 |
| 网页没更新 | 构建中或浏览器缓存 | 去 Actions 页看绿勾；`Ctrl+F5` 强制刷新 |
| PowerShell 里 `curl` 报错 | curl 是别名 | 用 `curl.exe`（带 .exe）才是真的 |

---

## 附：Git 命令速查（就这几句够用）

| 命令 | 作用 | 什么时候用 |
| --- | --- | --- |
| `git pull` | 下载 GitHub 最新内容到本机 | **每次开始写作前** |
| `git status` | 看看改了哪些文件 | 提交前检查 |
| `git add .` | 把改动装进待提交包 | VSCode 图形提交会自动做，命令行才需要 |
| `git commit -m "说明"` | 打包拍照 | add 之后 |
| `git push` | 上传到 GitHub | commit 之后 |
| `git log --oneline` | 查看历史版本 | 想看看以前改了啥 |

> 日常用 VSCode 的图形按钮（✓ 提交、🔄 同步更改）就够了，
> 命令只需记住 `git pull` 这一句必须手敲。
