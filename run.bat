@echo off
title DD FASHION Launcher
echo ========================================================
echo       Starting DD FASHION E-Commerce Platform
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on port 8000...
start "DD Fashion - Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting React Frontend on port 5173...
start "DD Fashion - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up!
echo - Storefront:   http://localhost:5173
echo - Backend API:  http://localhost:8000/docs
echo - Admin Email:  admin@ddfashion.com
echo.
