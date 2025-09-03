@echo off
echo Starting nginx...
cd /d "%~dp0"
nginx.exe
echo nginx started successfully!
pause
