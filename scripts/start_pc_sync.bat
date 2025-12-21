@echo off
chcp 65001 >nul
title PC Sync Service

echo ============================================
echo   🖥️ PC Sync Service - Starting...
echo ============================================
echo.

:: 切换到脚本目录
cd /d "%~dp0"

:: 运行 Python 脚本
python pc_sync.py

:: 如果出错，暂停以查看错误
if %errorlevel% neq 0 (
    echo.
    echo ❌ 脚本运行出错，请检查上方错误信息
    pause
)
