@echo off
chcp 65001 >nul
echo 🚀 启动WebSocket测试服务器...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js
    echo 📥 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查ws模块是否安装
echo 📦 检查依赖模块...
npm list ws >nul 2>&1
if errorlevel 1 (
    echo 📥 安装ws模块...
    npm install ws
)

echo.
echo ✅ 依赖检查完成
echo.
echo 🎯 启动WebSocket服务器...
echo 📍 端口: 8080
echo 🔗 地址: ws://localhost:8080/rtspoverwebsocket
echo.

REM 启动服务器
node scripts/websocket-server.js

pause 