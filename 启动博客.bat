@echo off
chcp 936
title shiguang-blog
cd /d %~dp0

rem ★ 关键：把 Kimi 自带的 Node 目录加入 PATH
rem 否则 npm 启动 vite 时找不到 node.exe（双击环境下系统 PATH 里没有 node）
set "PATH=D:\kimi\resources\resources\runtime;%PATH%"

echo ============================================
echo   拾光小栈 本地预览启动中...
echo   浏览器稍后自动打开 http://localhost:3000
echo   想关闭网站：直接关掉这个黑窗口即可
echo ============================================
echo.

rem 8 秒后自动打开浏览器（等服务器启动）
start "" /min cmd /c "timeout /t 8 /nobreak && start http://localhost:3000"

rem 启动开发服务器
"D:\kimi\resources\resources\runtime\npm.cmd" run dev -- --strictPort

pause
