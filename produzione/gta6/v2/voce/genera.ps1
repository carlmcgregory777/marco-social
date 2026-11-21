# Voci G1 GTA (21/11/2026): una battuta per file. C = Julian, contatto = Brian, passante = Sarah. eleven_v4.
$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
$p = 'C:\Users\stang\code\marco-social\produzione\gta6\v2\voce'
foreach ($r in [IO.File]::ReadAllLines("$p\battute.tsv", [Text.Encoding]::UTF8)) {
  $f = $r.Split("`t"); $out = "$p\$($f[0]).mp3"
  if (Test-Path $out) { continue }
  $b = @{ text = $f[2]; model_id = 'eleven_v4'; language_code = 'it'
          voice_settings = @{ stability = 0.5; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
  Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$($f[1])`?output_format=mp3_44100_128" -Method POST `
    -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($b)) -OutFile $out -UseBasicParsing
  Write-Host "OK $($f[0])"
}
