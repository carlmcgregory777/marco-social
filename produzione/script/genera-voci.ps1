# Genera le voci dei 4 episodi (Julian, Eleven v4, stability 0.6) — come A4 e A5.
# Doppio clic o: powershell -File genera-voci.ps1
# La chiave si legge dal registro utente, non viene mai stampata.
$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
if (-not $k) { Write-Host 'MANCA ELEVENLABS_API_KEY: lancia strumenti\imposta-chiave-elevenlabs.cmd' -ForegroundColor Red; Read-Host 'Invio per chiudere'; exit 1 }
$v = '7p1Ofvcwsv7UBPoFNcpI'   # Julian - Deep, Rich and Mature
$base = 'C:\Users\stang\code\marco-social\produzione\attualita'
$eps = @('A6-oracle','A7-sabella','A8-mercato','A9-machine-learning')

foreach ($e in $eps) {
    $testo = Join-Path $base "$e\voce\testo-v1.txt"
    $out   = Join-Path $base "$e\voce\v1-julian.mp3"
    if (-not (Test-Path $testo)) { Write-Host "SALTO $e : manca $testo" -ForegroundColor Red; continue }
    $t = [IO.File]::ReadAllText($testo, [Text.Encoding]::UTF8)
    $b = @{ text = $t; model_id = 'eleven_v4'
            voice_settings = @{ stability = 0.6; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
    $bytes = [Text.Encoding]::UTF8.GetBytes($b)
    Write-Host "Genero $e ($($t.Length) caratteri)..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$v?output_format=mp3_44100_128" `
            -Method POST -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' `
            -Body $bytes -OutFile $out
        $f = Get-Item $out
        Write-Host ("  OK  " + [math]::Round($f.Length/1KB) + " KB") -ForegroundColor Green
    } catch {
        Write-Host ("  ERRORE: " + $_.Exception.Message) -ForegroundColor Red
    }
}
Write-Host ''
Write-Host 'Fatto. Torna da Claude e scrivi "fatto".' -ForegroundColor Yellow
Read-Host 'Invio per chiudere'
