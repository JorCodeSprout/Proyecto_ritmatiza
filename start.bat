:: start.bat - Script de inicio para Docker Compose y Vite
@echo off
setlocal

:: 1. Levantar los contenedores de Docker en segundo plano
echo.
echo Levantando contenedores Docker (ritmatiza_app, ritmatiza_web, ritmatiza_db)...
docker compose up -d

:: 2. Iniciar el servidor de desarrollo de Vite
echo.
echo Iniciando Vite Dev Server en ./frontend (Ctrl + C para detener)
echo.

:: El comando START /B abre una nueva ventana/sesión de CMD para el proceso de Vite, 
:: permitiendo que ambos procesos (Docker y Vite) se ejecuten en paralelo.
START /B cmd /c "cd frontend && npm run dev"

echo.
echo Ambos procesos iniciados.
echo.
echo -> Acceso: http://ritmatiza.local
echo -> Los logs de Vite se muestran en la ventana que acaba de abrir.
echo.

endlocal