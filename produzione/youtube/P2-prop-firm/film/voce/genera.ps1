# Voce P2 film (17/11/2026): Julian, eleven_v4, stability 0.6 come trailer e reel. Uso: genera.ps1 parte1
$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
$d = 'C:\Users\stang\code\marco-social\produzione\youtube\P2-prop-firm\film\voce'
$out = "$d\$($args[0]).mp3"
if (Test-Path $out) { Write-Host "gia' fatto"; exit 0 }
$t = [IO.File]::ReadAllText("$d\$($args[0]).txt", [Text.Encoding]::UTF8)
$b = @{ text = $t; model_id = 'eleven_v4'
        voice_settings = @{ stability = 0.6; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/7p1Ofvcwsv7UBPoFNcpI?output_format=mp3_44100_128" `
    -Method POST -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' `
    -Body ([Text.Encoding]::UTF8.GetBytes($b)) -OutFile $out -UseBasicParsing
Write-Host ("OK " + [math]::Round((Get-Item $out).Length/1KB) + " KB")
