# @cthe.trader - collega Claude al tuo account ElevenLabs (la voce Julian dei reel di C).
# La chiave non viene mai mostrata: finisce solo in una variabile di Windows del tuo utente (ELEVENLABS_API_KEY).
$ErrorActionPreference = 'Continue'
function Scrivi([string]$t, [string]$c = 'Gray') { Write-Host $t -ForegroundColor $c }

Write-Host ''
Scrivi '@cthe.trader - chiave di ElevenLabs' 'Yellow'
Scrivi 'Su elevenlabs.io: in basso a sinistra il tuo profilo -> "API Keys" -> "Create API Key".'
Scrivi 'Permessi: basta "Text to Speech" (accesso) e "User" (lettura). Copia la chiave.'
Scrivi 'Incollala qui sotto con il tasto destro e premi Invio: non la vedi mentre la incolli, e va bene cosi.'
Write-Host ''

$sicura = Read-Host -AsSecureString -Prompt 'Chiave di ElevenLabs'
$p = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sicura)
try { $chiave = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($p).Trim() }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($p) }

if ($chiave.Length -lt 20) { Scrivi 'La chiave sembra vuota o troppo corta. Rilancia e riprova.' 'Red'; Read-Host 'Premi Invio per chiudere'; exit 1 }

try {
    $r = Invoke-RestMethod -Uri 'https://api.elevenlabs.io/v1/user/subscription' -Headers @{ 'xi-api-key' = $chiave } -TimeoutSec 30
    $restano = [int]$r.character_limit - [int]$r.character_count
    Scrivi "Chiave valida. Piano: $($r.tier). Caratteri rimasti questo mese: $restano." 'Green'
}
catch {
    $codice = $_.Exception.Response.StatusCode.value__
    if ($codice -eq 401) {
        Scrivi 'ElevenLabs non accetta questa chiave per leggere il piano: controlla di averla copiata tutta e che abbia il permesso "User" in lettura.' 'Red'
        Read-Host 'Premi Invio per chiudere'; exit 1
    }
    Scrivi "Non riesco a controllare il piano (errore $codice): salvo la chiave lo stesso." 'Yellow'
}

[Environment]::SetEnvironmentVariable('ELEVENLABS_API_KEY', $chiave, 'User')
$chiave = $null
Scrivi 'Fatto: la chiave e salvata. Torna da Claude e scrivi "fatto".' 'Green'
Read-Host 'Premi Invio per chiudere'
