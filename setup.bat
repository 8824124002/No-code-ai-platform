@echo off
echo Setting up No-Code AI Platform...

echo Installing backend dependencies...
cd backend
call npm install

echo Installing frontend dependencies...
cd ../frontend
call npm install

echo Creating environment files...
cd ../backend
copy .env.example .env
cd ../frontend
copy .env.example .env

echo Setup completed!
echo Please update the .env files with your configuration before starting the application.
pause 