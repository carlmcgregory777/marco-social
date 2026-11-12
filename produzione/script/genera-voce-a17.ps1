# Voce A17 (12/11/2026). Julian, eleven_v4, stability 0.6.
$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
if (-not $k) { Write-Host 'MANCA ELEVENLABS_API_KEY'; exit 1 }
$v = '7p1Ofvcwsv7UBPoFNcpI'
$p = 'C:\Users\stang\code\marco-social\produzione\attualita\A17-nuovo\voce'
$out = "$p\v1-julian.mp3"
if (Test-Path $out) { Write-Host "gia' fatto"; exit 0 }
$t = [IO.File]::ReadAllText("$p\testo-v1.txt", [Text.Encoding]::UTF8)
$b = @{ text = $t; model_id = 'eleven_v4'
        voice_settings = @{ stability = 0.6; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
$bytes = [Text.Encoding]::UTF8.GetBytes($b)
Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$v`?output_format=mp3_44100_128" `
    -Method POST -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' `
    -Body $bytes -OutFile $out -UseBasicParsing
Write-Host ("OK " + [math]::Round((Get-Item $out).Length/1KB) + " KB")
