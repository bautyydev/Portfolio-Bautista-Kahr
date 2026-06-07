@echo off
cd /d "C:\Users\bauty\proyecto bauti"

echo.
echo  Subiendo cambios a GitHub...
echo.

git add -A

set /p mensaje="  Descripcion del cambio: "

git commit -m "%mensaje%"
git push

echo.
echo  Listo! El sitio se actualiza en Vercel en ~30 segundos.
echo.
pause
