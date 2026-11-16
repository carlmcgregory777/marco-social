# Coda TikTok di @cthe.trader — uno al giorno alle 12:30

Decisione di Marco (15/11/2026): «Uno al giorno, 12:30». L'app TikTok sul Redmi non programma, quindi
un'attività programmata pubblica ogni giorno il primo video ancora DA FARE, dal telefono via adb.

| Giorno | Video | Stato |
|---|---|---|
| dom 15/11 | A18 «Lavorare in regola conviene?» | FATTO 15/11 13:22 (37.500 views al 16/11, virale) |
| lun 16/11 | A12 «Col senno di poi» | FATTO 16/11 11:13 (descrizione con gancio Rheinmetall 10.000 → 81.000) |
| mar 17/11 | A13 «Un titolo non è una prova» | DA FARE |
| mer 18/11 | P1 «Fare soldi col trading?» | DA FARE |

## Dettagli per video (file già in /sdcard/DCIM/Camera/ sul Redmi)

### A18
- In **Bozze** del profilo TikTok c'è già la versione leggera (la bozza più recente, copertina «LAVORARE IN REGOLA CONVIENE?»), con descrizione, copertina ed etichetta IA. Le altre bozze di A18 (56 MB e 20,8 MB) sono quelle rotte: non usarle.
- Se la bozza non va: video `A18-tt.mp4` (45 s), copertina `A18-conti-copertina.jpg`.
- Descrizione: `Reddito zero, 3 figli, in affitto: fino a 1.200 euro al mese di sussidio. Poi trovi lavoro e scopri la tua aliquota marginale.` + `#assegnodiinclusione #assegnounico #tasse`

### A12
- Video `A12-tt.mp4` (1:17), copertina `A12-armi-copertina.jpg`.
- Descrizione: `Col senno di poi li compravamo tutti. Fonte: Yahoo Finance - video: Rheinmetall, Leonardo - nessun consiglio finanziario` + `#azioni #investire #trading`

### A13
- Video `A13-tt.mp4` (1:24), copertina `A13-qi-copertina.jpg`.
- Descrizione: `Un titolo non dimostra niente. Fonte: SFI Finfluencers - video: YoungHoon Kim - nessun consiglio finanziario` + `#trading #finfluencer #investire`

### P1
- Video `P1-tt.mp4` (47 s), copertina `P1-copertina.jpg`.
- Descrizione: `Non conta quanto sei bravo col trading. Conta in che gioco stai giocando. Tu in quale casella sei? Scrivilo nei commenti.` + `#trading #tradingitalia #educazionefinanziaria`

## Come si pubblica dal Redmi (provato il 15/11/2026)
- adb: `C:\Users\stang\Android\Sdk\platform-tools\adb.exe` (in Git Bash: `export MSYS_NO_PATHCONV=1`). Screenshot: `bash /c/Users/stang/code/guido-io/telefono/s.sh` → `guido-io/telefono/_sm.png` (450x1000, coordinate vere = x2,4). Il telefono a volte risponde in ritardo: aspettare 3-5 s tra un tocco e lo screenshot.
- Aprire TikTok: `adb shell monkey -p com.zhiliaoapp.musically -c android.intent.category.LAUNCHER 1`. Tab Profilo (972,2190): controllare che il nome sia **@cthe.trader**.
- Nuovo video: tasto + (540,2190) → icona galleria in basso a sinistra (110,2175) → toccare il CERCHIO in alto a destra della miniatura giusta (le durate aiutano) → Avanti (797,2165) → Avanti (797,2180).
- Descrizione: toccare il campo (300,262), poi `bash produzione/script/tt_descrizione.sh "testo" "#tag1" "#tag2" "#tag3"`. Dopo gli hashtag TikTok mostra una lista di suggerimenti: NON toccarla a caso (un tocco ha trasformato #tasse in #tasseauxdebois). Controllare con uno screenshot; se l'ultimo hashtag è sbagliato, cancellare con `keyevent 67` e toccare il suggerimento esatto (il primo della lista). Niente accenti né € con adb.
- Chiudere la tastiera (`keyevent 4`) → Modifica copertina (866,566) → Carica (958,1838) → scegliere l'immagine della copertina → Salva (980,156).
- Altre opzioni (540,1538): «Contenuti generati dall'IA» ON, lingua Italiano. Chiudere con la X.
- Pubblica (797,2170). Aspettare e controllare nel Profilo che il video sia caricato (non «Si è verificato un problema»).
- MAI toccare «Promuovi», «Ordina ora» o promozioni a pagamento. Dopo l'uso cancellare `_s.png` e `_sm.png`.
