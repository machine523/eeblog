@echo off
chcp 936
echo 正在关闭博客服务器...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":3000"') do taskkill /PID %%a /T /F
echo.
echo 已关闭。按任意键退出。
pause
