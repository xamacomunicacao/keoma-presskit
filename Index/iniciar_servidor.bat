@echo off
echo Iniciando servidor local (Node.js)...
echo O seu navegador ira abrir a pagina em alguns segundos.
echo.
echo Para acessar o PAINEL ADMIN: http://localhost:3000/admin.html
echo.
echo Para fechar o servidor, pressione CTRL+C nesta janela.
echo.
start http://localhost:3000
node server.js
