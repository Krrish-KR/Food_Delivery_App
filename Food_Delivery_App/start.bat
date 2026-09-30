@echo off
title OmniEats • Live Food Delivery & GPS Map Tracking
echo ========================================================
echo   OmniEats • Global Food Delivery Platform
echo   Live GPS Telemetry, Instructions Board & Online Payments
echo ========================================================
echo.
echo Starting OmniEats Server on http://localhost:4000 ...
start "" http://localhost:4000
node server.js
pause
