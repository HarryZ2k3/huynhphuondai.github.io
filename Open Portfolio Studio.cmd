@echo off
start "" "http://localhost:5174"
wsl.exe -d Ubuntu --cd /home/harryz/projects/personal-portfolio --exec env PATH=/home/harryz/.nvm/versions/node/v22.23.2/bin:/usr/local/bin:/usr/bin:/bin pnpm studio
pause
