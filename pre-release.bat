@echo off
REM ==========================================
REM 轻游迹 TripLite - 预发布验证脚本
REM ==========================================

echo.
echo ========================================
echo    轻游迹 TripLite - 预发布验证
echo ========================================
echo.

REM 步骤 1: 运行回归测试
echo [1/3] 运行回归测试...
node "%~dp0regression-test.js"
if errorlevel 1 (
    echo.
    echo ❌ 回归测试失败，请修复问题后重试！
    pause
    exit /b 1
)

REM 步骤 2: Git 状态检查
echo.
echo [2/3] 检查 Git 状态...
cd /d "%~dp0"
git status --porcelain > "%temp%\git-status.txt"
findstr /r "." "%temp%\git-status.txt" >nul
if not errorlevel 1 (
    echo.
    echo ⚠️  有以下未提交的更改：
    type "%temp%\git-status.txt"
    echo.
    set /p commit="是否提交这些更改并继续发布？(Y/N): "
    if /i not "%commit%"=="Y" (
        echo.
        echo 发布已取消
        pause
        exit /b 1
    )
    echo.
    git add -A
    git commit -m "chore: pre-release check"
)

REM 步骤 3: 推送到 GitHub
echo.
echo [3/3] 推送到 GitHub...
git push
if errorlevel 1 (
    echo.
    echo ❌ 推送失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ 发布成功完成！
echo ========================================
echo.
echo 访问地址：https://peaunt8.github.io/journeyh5/travel-planner.html
echo.

pause
