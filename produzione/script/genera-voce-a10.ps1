# Voce A10 (08/11/2026). Julian, eleven_v4, stability 0.6.
$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
if (-not $k) { Write-Host 'MANCA ELEVENLABS_API_KEY'; exit 1 }
$v = '7p1Ofvcwsv7UBPoFNcpI'
foreach ($ep in @('A10-prop-math')) {
  $dir = "C:\Users\stang\code\marco-social\produzione\attualita\$ep\voce"
  $t = [IO.File]::ReadAllText("$dir\testo-v1.txt", [Text.Encoding]::UTF8)
  $b = @{ text = $t; model_id = 'eleven_v4'
          voice_settings = @{ stability = 0.6; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
  $bytes = [Text.Encoding]::UTF8.GetBytes($b)
  Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$v`?output_format=mp3_44100_128" `
      -Method POST -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' `
      -Body $bytes -OutFile "$dir\v1-julian.mp3" -UseBasicParsing
  $f = Get-Item "$dir\v1-julian.mp3"
  Write-Host ("$ep OK " + [math]::Round($f.Length/1KB) + " KB")
}
