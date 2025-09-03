@echo off
echo Stopping nginx...
cd /d "%~dp0"
nginx.exe -s stop
echo nginx stopped successfully!
pause
