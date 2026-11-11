# Voce A14, A15 e reel Higgsfield v3 (10/11/2026). Julian, eleven_v4, stability 0.6.
$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
if (-not $k) { Write-Host 'MANCA ELEVENLABS_API_KEY'; exit 1 }
$v = '7p1Ofvcwsv7UBPoFNcpI'
$p = 'C:\Users\stang\code\marco-social\produzione'
$lavori = @(
  @("$p\attualita\A14-taglio\voce\testo-v1.txt", "$p\attualita\A14-taglio\voce\v1-julian.mp3"),
  @("$p\attualita\A15-bollette\voce\testo-v1.txt", "$p\attualita\A15-bollette\voce\v1-julian.mp3"),
  @("$p\higgsfield-aff\v3\voce\gancio.txt", "$p\higgsfield-aff\v3\voce\gancio.mp3"),
  @("$p\higgsfield-aff\v3\voce\cta.txt", "$p\higgsfield-aff\v3\voce\cta.mp3")
)
foreach ($l in $lavori) {
  if (Test-Path $l[1]) { Write-Host ("gia' fatto " + $l[1]); continue }
  $t = [IO.File]::ReadAllText($l[0], [Text.Encoding]::UTF8)
  $b = @{ text = $t; model_id = 'eleven_v4'
          voice_settings = @{ stability = 0.6; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
  $bytes = [Text.Encoding]::UTF8.GetBytes($b)
  Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$v`?output_format=mp3_44100_128" `
      -Method POST -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' `
      -Body $bytes -OutFile $l[1] -UseBasicParsing
  $f = Get-Item $l[1]
  Write-Host ($l[1] + " OK " + [math]::Round($f.Length/1KB) + " KB")
}
