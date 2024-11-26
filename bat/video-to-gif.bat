@echo off
setlocal enabledelayedexpansion

:: Set code page to UTF-8 for Unicode support
chcp 65001 > nul

:: Prompt for input file
set /p inputFile=Enter the path of the video file (e.g., C:\Videos\example.mp4): 

:: Remove any leading and trailing double quotes
set inputFile=%inputFile:"=%

:: Check if file exists
if not exist "%inputFile%" (
    echo Error: File not found.
    pause
    exit /b
)

:: Get the output file name (same as input but with .gif extension)
for %%F in ("%inputFile%") do set outputFile=%%~dpnF.gif

:: Convert using FFmpeg
ffmpeg -i "%inputFile%" -vf "fps=10" -loop 0 "%outputFile%"

:: Check if conversion was successful
if exist "%outputFile%" (
    echo Conversion successful! GIF saved as "%outputFile%"
) else (
    echo Conversion failed.
)

pause
