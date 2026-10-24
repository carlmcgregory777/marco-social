# C - The Trader - collega Claude al tuo account BytePlus ModelArk (Seedance 2.5).
# La chiave non viene mai mostrata: finisce solo in una variabile di Windows del tuo utente (ARK_API_KEY).
$ErrorActionPreference = 'Continue'
function Scrivi([string]$t, [string]$c = 'Gray') { Write-Host $t -ForegroundColor $c }

Write-Host ''
Scrivi 'C - The Trader - chiave di BytePlus ModelArk' 'Yellow'
Scrivi 'Incolla la API key qui sotto con il tasto destro e premi Invio: non la vedi mentre la incolli, e va bene cosi.'
Write-Host ''

$sicura = Read-Host -AsSecureString -Prompt 'Chiave di BytePlus'
$p = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sicura)
try { $chiave = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($p).Trim() }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($p) }

if ($chiave.Length -lt 20) { Scrivi 'La chiave sembra vuota o troppo corta. Rilancia e riprova.' 'Red'; Read-Host 'Premi Invio per chiudere'; exit 1 }

[Environment]::SetEnvironmentVariable('ARK_API_KEY', $chiave, 'User')
$chiave = $null
Scrivi 'Fatto: la chiave e salvata. Torna da Claude e scrivi "fatto".' 'Green'
Read-Host 'Premi Invio per chiudere'
