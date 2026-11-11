@echo off
rem ============================================================
rem  PRODUCI — renderizza un episodio di C su Runpod
rem  Doppio clic qui. Non serve Claude, non serve incollare comandi.
rem  ============================================================
setlocal EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"

set "PROGETTO=%~dp0"
set "REMOTION=%PROGETTO%produzione\remotion-c"
set "ATTUALITA=%PROGETTO%produzione\attualita"
set "KEY=%USERPROFILE%\.ssh\id_ed25519"
set "POD_HOST=157.157.221.29"
set "POD_PORT=37573"
set "POD_ID=wjs99a3svd3zme"

echo.
echo ============================================
echo   PRODUCI - render di un episodio di C
echo ============================================
echo.

rem ---------- 1. scelta dell'episodio ----------
echo Episodi disponibili:
echo.
set "N=0"
for /d %%D in ("%ATTUALITA%\A*") do (
    if exist "%%D\config.json" (
        set /a N+=1
        set "EP!N!=%%~nxD"
        echo   !N!^) %%~nxD
    )
)
echo.
set /p "SCELTA=Numero dell'episodio (Invio per uscire): "
if "%SCELTA%"=="" goto :fine
set "EP=!EP%SCELTA%!"
if "%EP%"=="" ( echo Scelta non valida. & pause & goto :fine )

rem ---------- 2. leggo composizione e cartella public dal config ----------
for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "(Get-Content '%ATTUALITA%\%EP%\config.json' -Raw | ConvertFrom-Json).composizione"`) do set "COMP=%%A"
for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "(Get-Content '%ATTUALITA%\%EP%\config.json' -Raw | ConvertFrom-Json).cartella_public"`) do set "PUB=%%A"
echo.
echo   Episodio:    %EP%
echo   Composizione: %COMP%
echo   Cartella:     %PUB%
echo.

rem ---------- 3. controlli ----------
if not exist "%KEY%" ( echo ERRORE: manca la chiave SSH %KEY% & pause & goto :fine )
if not exist "%REMOTION%\public\%PUB%\C-parla.mp4" (
    echo ATTENZIONE: manca il labiale in public\%PUB%\C-parla.mp4
    echo Il render fallira'. Genera prima il labiale con InfiniteTalk.
    pause
    goto :fine
)
if not exist "%REMOTION%\public\%PUB%\voce.wav" (
    echo ATTENZIONE: manca voce.wav in public\%PUB%\
    pause
    goto :fine
)

rem ---------- 4. il pod risponde? ----------
echo [1/6] controllo il pod...
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 -o BatchMode=yes -i "%KEY%" -p %POD_PORT% root@%POD_HOST% "echo ok" >nul 2>&1
if errorlevel 1 (
    echo.
    echo   IL POD NON RISPONDE.
    echo   Aprilo da console.runpod.io ^(Pods ^> %POD_ID% ^> Start^)
    echo   oppure creane uno nuovo e aggiorna POD_HOST/POD_PORT in questo file.
    echo.
    pause
    goto :fine
)
echo       pod raggiungibile.

rem ---------- 5. carico progetto e asset ----------
echo [2/6] preparo gli archivi...
if not exist "%TEMP%\produci" mkdir "%TEMP%\produci"
pushd "%REMOTION%"
tar -czf "%TEMP%\produci\progetto.tgz" --exclude=node_modules --exclude=.remotion --exclude=out --exclude="public/*" package.json package-lock.json tsconfig.json src 2>nul
popd
tar -czf "%TEMP%\produci\asset.tgz" -C "%REMOTION%\public\%PUB%" . 2>nul
if errorlevel 1 ( echo ERRORE nel creare gli archivi & pause & goto :fine )

echo [3/6] carico sul pod (puo' durare qualche minuto)...
scp -o StrictHostKeyChecking=no -o BatchMode=yes -i "%KEY%" -P %POD_PORT% "%TEMP%\produci\progetto.tgz" "%TEMP%\produci\asset.tgz" root@%POD_HOST%:/tmp/
if errorlevel 1 ( echo ERRORE nel caricamento & pause & goto :fine )

rem ---------- 6. render sul pod ----------
echo [4/6] renderizzo %COMP% (circa 3-6 minuti)...
ssh -o StrictHostKeyChecking=no -o BatchMode=yes -i "%KEY%" -p %POD_PORT% root@%POD_HOST% "bash -s" < "%~dp0produci-remoto.sh" "%COMP%" "%PUB%"
if errorlevel 1 ( echo ERRORE nel render & pause & goto :fine )

rem ---------- 7. scarico ----------
echo [5/6] scarico il video...
if not exist "%ATTUALITA%\%EP%\finale" mkdir "%ATTUALITA%\%EP%\finale"
scp -o StrictHostKeyChecking=no -o BatchMode=yes -i "%KEY%" -P %POD_PORT% root@%POD_HOST%:/root/progetto/%COMP%.mp4 "%ATTUALITA%\%EP%\finale\%EP%.mp4"
if errorlevel 1 ( echo ERRORE nel download & pause & goto :fine )

rem ---------- 8. copertina ----------
echo [6/6] copertina...
ssh -o StrictHostKeyChecking=no -o BatchMode=yes -i "%KEY%" -p %POD_PORT% root@%POD_HOST% "cd /root/progetto && npx remotion still Cover%COMP% /root/progetto/copertina.png" >nul 2>&1
scp -o StrictHostKeyChecking=no -o BatchMode=yes -i "%KEY%" -P %POD_PORT% root@%POD_HOST%:/root/progetto/copertina.png "%ATTUALITA%\%EP%\finale\%EP%-copertina.png" >nul 2>&1
if exist "%ATTUALITA%\%EP%\finale\%EP%-copertina.png" (
    ffmpeg -y -v error -i "%ATTUALITA%\%EP%\finale\%EP%-copertina.png" -q:v 2 "%ATTUALITA%\%EP%\finale\%EP%-copertina.jpg" 2>nul
    echo       copertina fatta.
) else (
    echo       copertina non riuscita (non bloccante).
)

rem ---------- 9. audio a norma ----------
echo [7/7] normalizzo l'audio a -14 LUFS...
ffmpeg -y -v error -i "%ATTUALITA%\%EP%\finale\%EP%.mp4" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k "%ATTUALITA%\%EP%\finale\%EP%-FINALE.mp4" 2>nul
if exist "%ATTUALITA%\%EP%\finale\%EP%-FINALE.mp4" (
    echo       fatto.
) else (
    echo       loudnorm non riuscito: il video %EP%.mp4 resta valido.
)

echo.
echo ============================================
echo   FATTO
echo ============================================
echo   Video:     %ATTUALITA%\%EP%\finale\%EP%-FINALE.mp4
echo   Copertina: %ATTUALITA%\%EP%\finale\%EP%-copertina.jpg
echo.
echo   Il pod resta acceso (costa 0,24 $/ora).
echo   Spegnilo da console.runpod.io quando hai finito.
echo.
pause
goto :eof

:fine
endlocal
