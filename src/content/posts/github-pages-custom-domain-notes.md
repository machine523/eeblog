---
title: 从零把博客挂到自己的域名：GitHub Pages + 阿里云 DNS 实战笔记
date: 2026-09-12
tags: 技术, 建站, 踩坑记录
excerpt: 记录把 GitHub Pages 博客绑定到自定义域名 eebolg.online 的完整过程，含 DNS 配置、HTTPS 证书、git 连不上 GitHub 的排查方法。
emoji: 🌐
colorFrom: "#e3f0fb"
colorTo: "#f0f7fd"
featured: true
---

这个博客框架搭好之后，我做的第一件事就是把它挂到自己注册的域名 `eebolg.online` 上。整个过程比想象中坑多，把完整流程和踩坑记录整理成这篇笔记，方便以后换服务器、换域名时照查。

## 整体原理（一句话版）

![域名访问的完整链路：浏览器 → DNS 解析 → GitHub Pages → 返回网页](/images/dns-resolution-flow.png)

```
浏览器输入域名 → DNS 把域名翻译成 GitHub 的服务器 IP → GitHub 根据域名找到你的仓库 → 返回网页
```

所以要打通这条链路，需要两头配合：**域名侧**把 DNS 指到 GitHub，**GitHub 侧**告诉仓库"这个域名是我的"。

## 第一步：GitHub 侧绑定域名

仓库 → Settings → Pages → Custom domain，填入 `eebolg.online` 保存。

同时在仓库里放一个 `public/CNAME` 文件，内容就一行域名。这样每次构建发布时都会带上它，域名设置不会因为重新部署而丢失。

## 第二步：阿里云 DNS 添加解析记录

阿里云控制台 → 云解析 DNS → 找到域名 → 添加记录。GitHub Pages 官方要求 **4 条 A 记录**（做负载均衡，缺一不可）：

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

主机记录 `@` 表示裸域名（eebolg.online 本身）。填完点确定，中间还会弹一个「解析变更确认」框，再点一次确定才真正生效。

**验证方法**：`nslookup eebolg.online 223.5.5.5`（用阿里公共 DNS 查），返回 4 个 IP 就说明 DNS 已生效。本机直接 `nslookup` 可能因为路由器缓存暂时查不到，不代表没配好。

## 第三步：等 HTTPS 证书（最考验耐心的一步）

HTTP 访问在 DNS 生效后立刻就通，但 `https://` 要等 GitHub 用 Let's Encrypt 为你的域名**自动签发免费证书**，官方说法是几分钟到 1 小时，我实际等了好几个小时。

判断证书好没好：

- 浏览器直接访问 `https://你的域名`，不弹证书警告 = 好了
- 或看证书内容：还是 `CN=*.github.io`（默认证书）就是没签好；变成你的域名 = 签好了

证书签好后，回到 Settings → Pages 勾选 **Enforce HTTPS**，整个域名链路才算完工。

## 踩坑记录

### 坑 1：阿里云控制台的广告弹窗

添加记录时，页面弹出的促销广告正好盖住「确定」按钮，第一次提交悄悄失败（记录数还是 0）。**关掉弹窗再提交**，提交后务必刷新列表确认「共 N 条」，不要想当然。

### 坑 2：GitHub 一直显示 "DNS Check in Progress"

明明确认 DNS 已生效，GitHub 设置页却卡在检查中。解法：把 Custom domain **删掉、保存、再填回来**，强制 GitHub 重新检查。想自助查状态可以调它的健康检查接口 `GET /repos/用户名/仓库/pages/health`，返回里 `is_valid: true` 就说明配置没问题，纯粹是等证书。

### 坑 3：另一台电脑 git 连不上 GitHub

报错 `Failed to connect to github.com:443`，但浏览器明明能打开 GitHub。排查三板斧：

1. **先重试**：GitHub 在国内连接时好时坏，多试几次常常直接通
2. **分清真 curl**：PowerShell 里 `curl` 是别名不是真 curl，测网络要用 `curl.exe`
3. **删残骸再克隆**：失败的 clone 会留下不完整的文件夹，重试前 `Remove-Item -Recurse -Force 文件夹名`，否则报 "already exists"

如果网络实在不通，可以先用镜像克隆：`git clone https://kkgithub.com/machine523/eeblog.git`，等网络恢复再 `git remote set-url origin` 换回官方地址。

## 多电脑协作口诀

博客内容全在 GitHub 仓库里（文章就是 `src/content/posts/` 下的 md 文件），所以任何一台电脑都只是副本：

> **pull → 写 → 提交 → 推送**

开始写之前先 `git pull` 拉最新，写完 `提交 + 推送`，GitHub 会自动重新构建，几分钟后网站更新。两边永远不会乱。

## 参考命令速查

```bash
nslookup eebolg.online 223.5.5.5     # 查 DNS 是否生效
curl.exe -v https://eebolg.online    # 测 HTTPS（PowerShell 里要带 .exe）
git pull                             # 拉取最新内容
git add . && git commit -m "说明"    # 打包改动
git push                             # 推送到 GitHub，触发自动部署
```

整个过程下来，最大的体会是：**这类"配置型"工作，每一步都要当场验证结果**（记录条数、nslookup 返回、证书 CN），不要相信"应该成功了"。
