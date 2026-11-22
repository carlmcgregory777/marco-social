$k = [Environment]::GetEnvironmentVariable('ELEVENLABS_API_KEY','User')
$v = '7p1Ofvcwsv7UBPoFNcpI'
$p = 'C:\Users\stang\code\marco-social\produzione\BF-blackfriday\voce'
$t = [IO.File]::ReadAllText("$p\testo-v1.txt", [Text.Encoding]::UTF8)
$b = @{ text = $t; model_id = 'eleven_v4'; voice_settings = @{ stability = 0.45; similarity_boost = 0.75; style = 0.0; use_speaker_boost = $true } } | ConvertTo-Json
Invoke-WebRequest -Uri "https://api.elevenlabs.io/v1/text-to-speech/$v`?output_format=mp3_44100_128" -Method POST -Headers @{'xi-api-key' = $k} -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($b)) -OutFile "$p\v1-julian.mp3" -UseBasicParsing
Write-Host ("OK " + [math]::Round((Get-Item "$p\v1-julian.mp3").Length/1KB) + " KB")
