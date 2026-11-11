# STATO LAVORI — @cthe.trader (aggiornato 10/11/2026)

Leggi questo file all'inizio di ogni sessione. Dice dove siamo e cosa manca.

## Pipeline automatica (usa questa, non rifare a mano)

```
cd C:\Users\stang\code\marco-social\produzione\script
python episodio.py "../attualita/<EPISODIO>"
```

Fa 8 passi: controlli → taglio pause ×1,1 → trascrizione → **allineamento del copione ai tempi**
→ sottotitoli con `DURATA_` rigenerata → musica + sfx → copia asset (+ verifica che il labiale
sia a tempo) → stampa i comandi per voce, labiale, render, copertina, loudnorm.

**Si ferma se manca qualcosa** (es. «nessun mp3 in voce/»). I parametri vengono da `config.json`
dell'episodio, mai a memoria.

## I 6 errori del 05/11 che la pipeline impedisce

| errore | come lo evita |
|---|---|
| immagine sbagliata (`A1.jpg` invece di `C-microfono.png`) | il percorso sta in `config.json` |
| voce sbagliata (`eleven_v3` stab. 0,35) | il comando dice `eleven_v4` stab. **0,6** |
| labiale sfasato (voce grezza invece di quella tagliata) | passo 7 **confronta le durate e avvisa** |
| `DURATA_` non rigenerata (19 s di video vuoto) | passo 5 la scrive sempre |
| disco pieno (render morto) | passo 8 ricorda di controllare |
| sorgenti modificate durante il render | il render è l'ultimo passo |

**Altri due inciampi trovati il 06/11:**
- `voce/testo-*.txt` deve corrispondere a `copione.md`. A6 era disallineato (voce buonista su copione accusatorio) e la voce è stata rigenerata.
- **Non lanciare 5 labiali insieme**: i job in coda scadono (`job not found`). Uno o due alla volta.
- L'ID voce **ElevenLabs** di Julian è `7p1Ofvcwsv7UBPoFNcpI`. Quello di Higgsfield (`95429266-...`) **non funziona** su ElevenLabs.

## Regole di contenuto (dal 06/11)

- **Tono: accusa, non spiega.** Niente concessioni («occhio però», «è come la vedo io», «puoi essere d'accordo»). Chiusura che accusa. Modello: Achille Gandolfi Vannini.
- **Parolacce: no.** (deciso 06/11)
- **Nomi: solo citati, mai attaccati come persona.** «Sabella ha detto questo» sì; «Sabella è un ipocrita» no.
- **Formato «guarda questo»** (corretto 06/11 su A7): C apre («Guarda questo») → **la fonte a tutto
  schermo, integrale, col suo audio vero** → C smonta. **Non** una card di testo e **non** muta:
  la fonte che parla è la prova, la card è la nostra parafrasi. Con l'audio vero sotto, la voce di
  C va **tagliata** del pezzo della citazione, altrimenti due voci si sovrappongono.
- **Labiale fuori sync:** `<OffthreadVideo>` dentro una `<Sequence from=X>` senza `startFrom`
  riparte da 0 mentre la voce va avanti. Si tagliano `voce.wav` e `C-parla.mp4` agli **stessi** due
  punti e ogni troncone va in una Sequence propria: il sync tiene per costruzione. A6 ha lo stesso
  bug (`A6ORACLE.tsx:428`).
- **Faceless: escluso.**
- Niente «Priced in.» (bocciato 04/11).

## Episodi

| # | cartella | formato | durata | componente | stato |
|---|---|---|---|---|---|
| A5 | `A5-milano` | A5 | 120 s | `A5MILANO` | **finito**, `finale/A5-milano-v3.mp4` |
| A6 | `A6-oracle` | guarda questo | 119 s | `A6ORACLE` | **v5 07/11** `finale/A6-oracle-v5-FINALE.mp4`: fonte Bloomberg TV, fatti verificati, layout diviso (schede in alto, C in basso). Da approvare |
| A7 | `A7-sabella` | guarda questo | **137 s** | `A7SABELLA` | **finito v2**, `finale/A7-sabella-FINALE.mp4` |
| A8 | `A8-mercato` | SchedeC | 94 s | `A8MERCATO` | **v2 08/11** fatti corretti (v1 diceva «ai massimi storici»: falso), grafico S&P vero, copertina + didascalie. **APPROVATO da Marco 08/11** |
| A9 | `A9-machine-learning` | SchedeC | 88 s | `A9MACHINE` | **v2 08/11** tolto il «30%» senza fonte, aggiunta la multa SEC 2024 per «AI washing», copertina + didascalie. **APPROVATO da Marco 08/11** |
| A10 | `A10-prop-math` | SchedeC | 95 s | `A10PROP` | **09/11** rifatto da Vaga FX: moneta su 10.000 trader → 313 «campioni», Finance Magnates 7%. **FINITO 09/11**: `finale/A10-prop-FINALE.mp4` (97 s) + `-telefono.mp4`, copertina, didascalie. Mandato a Marco, da approvare |
| A11 | `A11-pensioni` | SchedeC | 80 s | `A11PENS` | **FINITO 09/11** da Mik Cosentino: contributivo + PIL Italia +12% vs euro +36% in 25 anni → «la pensione si rimpicciolisce». Fatti in `FATTI-A11-A13.md` (corretti 286 mld e 15,2%: vedi file). Mandato a Marco, da approvare |
| A12 | `A12-armi` | SchedeC | 77 s | `A12ARMI` | **FINITO 09/11** da Amedeo Iasci: «col senno di poi» (Rheinmetall/Leonardo vs Lockheed/L3Harris, Zoom/Peloton, -19% Rheinmetall 05-06/11). Prezzi Yahoo al 06/11. Mandato a Marco, da approvare |
| A13 | `A13-qi` | SchedeC | 84 s | `A13QI` | **FINITO 09/11** da Mik Cosentino: «un titolo non è una prova» (QI 276 contestato, Guinness 1990, kalām, studio SFI finfluencer). Mandato a Marco, da approvare |
| A14 | `A14-taglio` | SchedeC | 76 s | `A14TAGLIO` | **10/11** da Mik Cosentino (Dfjft3gI_8S): clip Zelensky / re di Svezia vera ma tagliata prima della stretta di mano (Facta, Lead Stories) → falsi che muovono i mercati (2013: 136 mld $ in 3 min; 2025: 2.400 mld in 10 min) → «chi ti vende un corso taglia uguale». Da approvare |
| A15 | `A15-bollette` | SchedeC | 76 s | `A15BOLLETTE` | **10/11** da Mik Cosentino (DfjdE5tIMGs, corteo di Torino 07/11): tenuti SOLO i fatti verificati (bollette bruciate, percorso, cori), scartati annuncio in arabo, Appendino, 4.000 persone (non trovati nelle cronache). Angolo: inflazione +5,4%, sciopero fino a 1 mld (CGIA), spread 116→107. Da approvare |
| A16 | `A16-bomba` | SchedeC | 55 s | `A16BOMBA` | **11/11** da the_jashi_project (DfmkMfGqaAg): allarme bomba in ~6.000 scuole (mail «Mikhail Andropov») + frigoriferi hackerati → «l'opportunità è la cybersecurity»; C: CrowdStrike +114% / Palo Alto +99% da inizio anno, poi -17% in 5 giorni → «svegliato quando?». Gancio: vigili (Riviera24) + studenti (Il Messaggero). Da approvare, da far uscire l'11/11 |
| HF3 | `higgsfield-aff/v3` | green screen | 30 s | `HF3` | **10/11** reel affiliato da Mik (DfieadGI32a, parola MIRACOLO, #higgsfieldcreator): C ritagliato sopra le clip ufficiali di Higgsfield Miracle. Solo cose verificate sul sito (vedi `didascalia.md`). Da approvare |

**YouTube L0** «MI PRESENTO *non giudicatemi*» (youtu.be/RIrsWRF3X8w): caricato in 2K e **PROGRAMMATO per il 09/11/2026 alle 12:00** (08-09/11). Le 3 copertine A/B (`youtube/L0-presentazione/copertine/copertina-A/B/C.jpg`) NON sono caricate: YouTube chiede a Marco la verifica una tantum del canale (telefono) per miniature personalizzate e Test A/B.

## Formato SchedeC (dall'08/11/2026) — per i reel dove C parla tutto il video

Stesso layout di A6 v5 (schede in alto, C in basso col microfono, «pieno» = C a tutto schermo),
in un componente condiviso: `remotion-c/src/SchedeC.tsx`. L'episodio è un file di 20 righe
(`A8MERCATO.tsx`) + le schede agganciate alle parole:

```
python episodio.py ../attualita/<EP>                      # voce, parole, musica, sfx
python runpod_pe.py talk <png> <voce.wav> <clip/C-parla.mp4> 720p   # labiale, $0,25, ~15 min
ffmpeg -i clip/C-parla.mp4 -vf "fps=30,scale=1080:1936:flags=lanczos,unsharp=5:5:0.6" -an clip/C-parla-hd.mp4
#   → copiarla in remotion-c/public-<cartella>/<cartella>/C-parla.mp4 con voce/musica/sfx/cover-frame
PYTHONIOENCODING=utf-8 python ../attualita/<EP>/montaggio/schede.py   # stampa i buchi (<-- lunga/corta)
bash render-schede.sh <COMP> <cartella> <EP> <nome>       # pezzi da 600 frame + audio ffmpeg + copia telefono
python copertina_titolo.py <foto C> <out.jpg> "RIGA UNO|RIGA *DUE" <numero>   # + -griglia.jpg
```

Tipi di scheda: tit, lista, vs, via, giornale, timbro, **grafico** (dati veri in `punti`), pieno.
Sfondo copertina: `runpod_pe.py set C-microfono.png prompt.txt out.png` ($0,13). **Higgsfield ha 0,89 crediti.**
**Disco:** l'08/11 c'erano solo 4,2 GB liberi su C:.

## Materiale di riferimento (analizzato 06/11)

`produzione/motion-transfer/` — ogni cartella ha video, audio, frame e `trascrizione.txt`:

| cartella | chi | cosa insegna |
|---|---|---|
| `ig-DcOWtVipMuV` | Gandolfi / Sabella | **citare e rovesciare** — il modello di tono |
| `ig-DfZAzr-INyO` | Jashi | ridicolizza l'ansia, poi il lungo termine |
| `ig-DfXy0o3g6O0` | Tomas Edgar | card S&P + grafico dietro la faccia |
| `ig-DfKq7bsMgEq` | Leah Filter | faceless — **escluso** |
| `ig-DfXs-gPi66D` | — | non scaricabile |

## RENDER SU RUNPOD (06/11/2026) — il PC ha troppa poca RAM

Il PC di Marco ha 7,8 GB e i render Remotion morivano a metà (L0, A5, A7: tre volte).
Soluzione: renderizzare su un pod CPU Runpod (8 core, 755 GB RAM). **Il pod è già pronto.**

| | |
|---|---|
| pod id | **`wjs99a3svd3zme`** |
| tipo | `cpu3c` — 8 vCPU, 755 GB RAM (ma **16 GB reali** nel container), 40 GB disco |
| costo | **$0,24/ora** — **IN PAUSA** dal 07/11 (stop, disco conservato). Riaccendere con `pod-action start` |
| datacenter | `EUR-IS-1` |
| SSH | `ssh -i ~/.ssh/id_ed25519 -p 37573 root@157.157.221.29` |
| stato nel pod | Node **22.23.4**, npm 10.9.9, ffmpeg, git, python3 ✅ |

**Già caricato in `/tmp/` del pod:** `progetto.tgz` (162 KB, codice senza public) e `asset-a7.tgz` (33 MB).

**Prossimi passi:**
```bash
# dentro il pod
mkdir -p /root/progetto/public/a7sabella
tar -xzf /tmp/progetto.tgz -C /root/progetto
tar -xzf /tmp/asset-a7.tgz -C /root/progetto/public/a7sabella
cd /root/progetto && npm install --no-audit --no-fund
npx remotion render A7SABELLA /root/progetto/A7SABELLA.mp4 --concurrency=6 --crf=20 --audio-bitrate=192k
```

**ATTENZIONE — memoria:** il container ha un tetto cgroup di **16 GB** (`cat /sys/fs/cgroup/memory/memory.limit_in_bytes`;
`memory.max` non esiste, è cgroup v1), non i 755 GB che annuncia `free`. Con **più di un video** nella
composizione, `--concurrency=6` fa uccidere il compositor: `Compositor exited with signal SIGKILL` a metà
render, con `free` che mostra centinaia di GB liberi. Usare **`--concurrency=3`** in quel caso. Diagnosi
del 06/11 su A7 v2 (video di C in due tronconi + il filmato della fonte).

```bash
npx remotion render A7SABELLA /root/progetto/A7SABELLA.mp4 --concurrency=3 --crf=20 --audio-bitrate=192k
```

**Per gli altri episodi** (a6oracle, a8mercato, a9machine): creare `asset-<cartella>.tgz` da
`remotion-c/public/<cartella>/`, caricarlo con `scp`, scompattare in `public/<cartella>/`, renderizzare.

**Nota sulle chiavi SSH:** runpodctl ha registrato una chiave **RSA** nuova sull'account, ma i pod
funzionano con `~/.ssh/id_ed25519` passata via `PUBLIC_KEY` al create. Usare quella.

**runpodctl** è in `~/bin/runpodctl.exe` (v3.0.1). Non supporta i pod CPU (`--cpu-flavor`/`--vcpu`
non esistono): i pod CPU si creano via API MCP `create-pod`.

## Comandi che servono

```powershell
# voce (una per episodio, ElevenLabs: Julian, v4, stability 0.6)
powershell -File C:\Users\stang\code\marco-social\produzione\script\genera-voci.ps1

# upload su Higgsfield (dà URL pubblici CloudFront per il labiale)
higgsfield upload create "produzione/attualita/<EP>/montaggio/voce.wav"

# labiale: via MCP Runpod (endpoint infinitetalk) con quell'URL + immagine C-microfono
# poi copia la clip in remotion-c/public/<cartella_public>/C-parla.mp4

# render (chiudi prima i browser zombie!)
Get-Process chrome-headless-shell -EA SilentlyContinue | Stop-Process -Force
cd C:\Users\stang\code\marco-social\produzione\remotion-c
npx remotion render <COMP> ..\attualita\<EP>\finale\<EP>.mp4 --concurrency=1 --crf=20 --audio-bitrate=192k

# copertina
npx remotion still Cover<COMP> ..\attualita\<EP>\finale\<EP>-copertina.png
ffmpeg -y -i "..\attualita\<EP>\finale\<EP>-copertina.png" -q:v 2 "..\attualita\<EP>\finale\<EP>-copertina.jpg"

# audio finale
ffmpeg -y -i "<EP>.mp4" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k "<EP>-FINALE.mp4"
```

## Permessi

In `C:\Users\stang\.claude\settings.json` ci sono 26 regole `allow` (python, ffmpeg, npx remotion,
higgsfield, yt-dlp, curl, PowerShell per i processi) e 4 `deny`, fra cui la protezione che impedisce
a Claude di modificare i propri permessi. **Si caricano all'avvio della sessione**: se qualcosa è
bloccato, riavvia Claude Code.

## Da fare

1. ~~Verifica numeri A6~~ fatto 07/11 (tabella in `copione.md`). **Il pod CPU `wjs99a3svd3zme` non esiste più**: il 07/11 A6 è stato renderizzato in locale a pezzi da 600 frame (`--concurrency=2`), audio montato con ffmpeg (il render audio di Remotion muore per RAM).
2. ~~A8 e A9~~ fatti l'08/11 col formato **SchedeC** (vedi sotto).
4. **Numeri A7** — la citazione di Sabella va presa dalla fonte originale.

**Fatto:** A7 e A6 renderizzati (v4 JASHI), con copertina e didascalie.

## Spese Runpod (dal billing del 07/11)

| giorno | pod CPU | disco | public endpoints | totale |
|---|---|---|---|---|
| 05/11 | — | — | $0,75 | $0,75 |
| 06/11 | $2,41 | $0,06 | $2,13 | $4,59 |
| **totale** | | | | **$5,34** |

Un labiale InfiniteTalk = **$0,25**. Una copertina Nano Banana = **$0,13**. Un render sul pod ≈ **$0,04**
(ma il pod costa $0,24/ora anche fermo: spegnerlo quando non serve).

## 10/11/2026 — A14, A15, HF3 (tre reel di Mik Cosentino mandati da Marco)

- **Whisper può saltare un pezzo di voce** (A15: 35 s su 91). Il taglio pause usa i suoi tempi, quindi quel pezzo spariva dal video.
  `episodio.py` ora si ferma se whisper sente meno dell'85% delle parole del copione. Rimedio: cancellare `voce/*-parole.json`
  e ritrascrivere con `condition_on_previous_text=False`.
- **Fatti del reel d'origine: verificarli sempre.** Dal reel su Torino metà delle affermazioni non si trova nelle cronache; dal reel
  Higgsfield «gratis 3 giorni» e i comandi «/miracle …» non sono sul sito (Miracle è «coming soon»). Si tiene solo quello che ha una fonte.
- **Voce:** `script/genera-voce-a14-15-hf3.ps1` (salta i file già fatti: non rispende caratteri).
- **Disco:** in `%TEMP%` restano le cartelle `remotion-v4…-assets*` e `react-motion-render*` dei render vecchi (circa 2 GB). Claude non può
  cancellarle (permesso negato): le cancella Marco a mano quando il disco è pieno.
- **Schede:** il `timbro` vuole `primo` / `secondo` / `parola_b` (1-2 parole): con `testo` esce vuoto. Un `tit` con `grande` regge
  2 righe, la terza finisce sui sottotitoli. `schede_lib.py` ora blocca il primo caso e avvisa sul secondo.
- **Render HF3:** `bash script/render-hf3.sh` (bundle con `public-hf3`, 2 pezzi, audio già mixato in `higgsfield-aff/v3/finale/audio.m4a`).

### 10/11/2026 sera — Marco boccia i tre («non vanno bene»): rifatti

- **Regola di Marco: mostrare, non spiegare.** I reel di attualità si aprono con il **filmato vero del fatto a tutto schermo**
  (ferma lo scorrimento), poi C. Nuovo mattone `video` in `SchedeC.tsx`:
  `("parola", "video", {"src": "<cartella>/<file>.mp4", "inizio": s, "tutto": True, "righe": [...], "credito": "..."})`.
  Senza `tutto` il filmato va nella zona alta con C sotto; `etichetta`, `rosso`, `timbro` + `parola_b`, `ferma` (fermo immagine),
  `falso` (titolo nello stile della clip virale), `vel`, `zoom`. I file vanno in `remotion-c/public-<cartella>/<cartella>/`.
- **A14 v2:** apre con la clip Zelensky / re com'è girata (stesso titolo), poi il video intero di Suspilne con la stretta di mano
  e il timbro «TAGLIATA QUI» sul fermo immagine. Fonte: `yt-dlp https://youtu.be/0XsXPYxaPM0` (8-32 s).
- **A15 v2:** apre con le bollette che bruciano e il corteo (alanews, `youtu.be/gU5PqPWFra4`). ATTENZIONE: il filmato ha la
  filigrana «alanews» in mezzo: è un'agenzia, va chiesto a Marco se tenerlo.
- **HF3 v2** (Marco: «annoia mortalmente, guarda com'è più intrattenente Cosentino»): C parla tutto il video con battute,
  4 dimostrazioni in 12 secondi agganciate alle parole (Cambiato / Fatto / Notte / Sparita), filmato grande, timbri, coriandoli.
  Voce e tempi in `higgsfield-aff/v3/v4/`. Durata 27 s.
- **Disco: 0,5-0,7 GB liberi.** Ogni `remotion still` e ogni render lascia roba in `%TEMP%`. Da liberare prima del prossimo lavoro.

### 11/11/2026 — A15 col video ANSA e reel «Shorts Studio» con C

- **A15 v3:** Marco non vuole la filigrana alanews. Filmati rifatti dal video ANSA ripreso da Tag24 (`youtu.be/YNWpwFhIsZA`):
  solo un logo piccolo in alto a sinistra, che nel tutto schermo resta fuori dal ritaglio.
- **Reel «Shorts Studio»** (`higgsfield-aff/shorts`, composizione `SHORTSC`, 51 s): stesso schema del reel di Simone Massaro
  Dfknph9xASv (parola SHORTS, #HiggsfieldCreator) con C. **Formato multicamera:**
  1. quattro inquadrature di C generate dalla stessa foto (`runpod_pe.py set`, 0,13 $ l'una): fronte, lato con veneziane,
     tre quarti con piante, primo piano (`set/*.txt` sono i prompt);
  2. un labiale InfiniteTalk per inquadratura, **tutti sull'intera voce** (0,25 $ l'uno, due alla volta): così lo stacco tra una
     camera e l'altra si mette dove si vuole e il labiale resta a tempo;
  3. la tabella `REGIA` in `SHORTSC.tsx` dice a che secondo si passa a quale camera, con zoom; gli effetti sonori sugli stacchi
     si generano leggendo quella tabella;
  4. `bash script/render-shorts.sh`.
  Costo: 1,39 $ di Runpod (3 inquadrature + 4 labiali) e circa 900 caratteri ElevenLabs.
- **Disco:** Marco ha liberato spazio, 12 GB liberi l'11/11.
- **Reel «Shorts Studio» v2 (11/11):** Marco: «la prima schermata è troppo arancione e il montaggio può essere fatto meglio».
  Tolta la bicromia arancione; stacchi solo a inizio frase (24 righe in `REGIA`, prima 33) senza lampi bianchi; carrellate morbide
  avanti/indietro; sottotitoli fermi nel terzo basso; scritte grandi in Inter minuscolo al posto dei timbri Anton ruotati;
  schermata dei Connettori a tutto schermo; sovrimpressioni che escono in dissolvenza; effetti sonori più bassi sugli stacchi.
  **Regola per i prossimi multicamera:** un'inquadratura dura una frase (2-4 s); lo stacco veloce solo se il parlato lo chiede.

### 11/11/2026 — Analisi dei numeri e didascalie nuove

Tutto in `attualita/ANALISI-E-DIDASCALIE-11-11.md` (numeri di Instagram e TikTok letti dal browser, conclusioni, regole delle
didascalie, didascalie di A11-A15 e del reel «Shorts Studio»). In breve: vince la cronaca che indigna, la gente lascia a 0:01,
i video sono troppo lunghi (visione media 6-23 s), condivisioni a zero, TikTok è 87% Italia quindi descrizioni in italiano.

### 11/11/2026 — A16 «Svegliato quando?» e Runpod senza litterbox

- **A16** (`A16-bomba`, 55 s, copione 157 parole, voce `script/genera-voce-a16.ps1`): fatti e fonti nei commenti di
  `montaggio/schede.py`. ATTENZIONE: il -17% di CrowdStrike/Palo Alto NON è causato dagli attacchi (vendite sul software dopo
  le elezioni di metà mandato): video e didascalia li accostano nel tempo, non dicono che uno causa l'altro.
- **litterbox giù (HTTP 500).** `runpod_pe.py` ha la modalità `RUNPOD_B64=1`: manda foto e voce dentro la richiesta come
  data URI, senza caricarle fuori. Tenere il carico piccolo: voce 16 kHz mono, foto in jpg (~3 MB in tutto). Labiale A16 ok, 0,25 $.
