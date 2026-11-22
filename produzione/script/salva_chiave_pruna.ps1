# Salva la chiave API di Pruna come variabile utente PRUNA_API_KEY (22/11/2026).
# La chiave si incolla qui, non viene mostrata a schermo e non finisce in nessun file.
$s = Read-Host "Incolla la chiave API di Pruna e premi Invio" -AsSecureString
$k = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)).Trim()
if ($k.Length -lt 10) { Write-Host "Chiave troppo corta: niente salvato." -ForegroundColor Red; exit 1 }
[Environment]::SetEnvironmentVariable('PRUNA_API_KEY', $k, 'User')
Write-Host ("Chiave salvata (" + $k.Length + " caratteri). Puoi chiudere questa scheda.") -ForegroundColor Green
