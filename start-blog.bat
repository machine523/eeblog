@echo off
chcp 936
title shiguang-blog
cd /d %~dp0

rem 把 Kimi 自带的 Node 目录加入 PATH（双击环境下系统 PATH 没有 node）
set "PATH=D:\kimi\resources\resources\runtime;%PATH%"

rem 启动开发服务器
"D:\kimi\resources\resources\runtime\npm.cmd" run dev -- --strictPort
