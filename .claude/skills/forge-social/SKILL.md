---
name: forge-social
description: "Produce, plan and review FORGE's TikTok and Instagram content: weekly batches of reels (AI avatar hook made on Higgsfield + real app screenshots), carousels in the FORGE style, captions, profile kit (bio, highlight covers), and the Sunday numbers review. Use this whenever Marco asks for anything about FORGE on social media — posts, reels, TikTok, Instagram, caroselli, avatar, ganci, copioni, didascalie, calendario, 'i contenuti della settimana', bio, copertine, or what to change after looking at views and leads — even if he doesn't say 'FORGE' or 'skill' but the context is the FORGE app for personal trainers or the @forgecoach.it accounts."
---

# FORGE social

FORGE Coach is an app for Italian personal trainers (49 € once, clients use the free FORGE app). The social accounts exist to bring PTs into the "10 schede gratis" box on the site, because a contact with consent can be followed up and sold to; a follower can't. Everything here serves that path: post → profile → link in bio (with `utm_source`) → box on forgecoach-it.lovable.app → CRM → PRIMI50 → Gumroad.

## Read first

1. `C:\Users\stang\code\forge\.agents\product-marketing.md` — product, audience, objections, brand voice. The installed marketing skills (social, video, copywriting, marketing-psychology, launch, offers, lead-magnets…) read the same file, so lean on them for hooks and frameworks: especially `~/.claude/skills/social/references/short-form-video.md` (hook library, video structures) and `carousel-frameworks.md`.
2. Memory `project-forge-social` — which avatar was chosen, Higgsfield balance, account status, what was published.
3. The strategy doc (Claude Docs) https://claude.ai/artifact/ChFrzdjVGLVqvcm73cY6Nn — pillars, the 30-day calendar, the Sunday numbers. Read it through the Claude Docs connector; Marco may have edited it.

## Rules that don't bend (and why)

- **Talk to personal trainers, not to people who train.** Generic fitness content grows followers who never buy a coaching app. Every hook names the PT or their world: «Coach,…», «Se sei personal trainer…», «POV: sei un PT e…», clients, schede, check, rinnovi.
- **The avatar is FORGE's virtual presenter, declared as AI.** TikTok requires the AI label and bans pretending to be a real person; Italian consumer law treats invented testimonials as unfair practice. So: AI label on every post that shows the avatar or an AI voice, «Presentatore virtuale AI» in the bio, the burned-in line «Contenuto creato con l'AI» (reel.py adds it), and never lines like «i miei clienti», «uso FORGE da un anno», «ho perso 10 kg».
- **Marco stays anonymous**: no face, voice or name of Marco anywhere.
- **Brand voice**: direct, concrete, numbers that are true, gym language, no guru promises. Brand text has no first person («ti regalo» → «10 schede pronte, gratis»).
- **Prices**: 49 € once; PRIMI50 = 39 € for the first 50 coaches, always with «prezzo più basso degli ultimi 30 giorni: 49 €» (Omnibus). No strikethrough prices, no fake «ultime ore».
- **Music only from TikTok/Instagram libraries** — Marco adds it when scheduling. Copyrighted tracks get videos muted. reel.py exports with the avatar's voice only.
- **Marco publishes.** Prepare files and texts; scheduling and posting are his, post by post.

## The weekly batch

Output folder: `C:\Users\stang\OneDrive\Desktop\FORGE social\settimana-N\` with one subfolder per piece (`r1-…`, `c1-…`) plus `didascalie.md` for the whole week.

1. **Numbers first** (if past week 1): ask Marco for TikTok Studio / Instagram Insights numbers or screenshots, read the CRM leads by Fonte. Use the table «I numeri della domenica» in the strategy doc to decide what to change. Replace the weakest planned piece with a new version of the best one (new hook, same body).
2. **Pick the week** from the calendar: 4 reels + 2 carousels (+ 3 Instagram stories).
3. **Write** for each reel: hook line for the avatar (≤ 8 seconds spoken, Italian, PT-targeted), on-screen hook text, 3-5 scene captions, closing card. For each carousel: a `spec.json` (see below). Use the hook formulas from the social skill; one CTA per post.
4. **Produce** carousels with `scripts/carosello.py`, reels with `scripts/reel.py` (details below).
5. **Captions** in `didascalie.md`: per post, TikTok text and Instagram text (first line = hook again, 1-3 short lines, CTA, 3-5 niche hashtags such as #personaltrainer #coachonline #schedadiallenamento #personaltraineritalia), plus reminders: «attiva l'etichetta AI», «aggiungi musica dalla libreria».
6. **Self-check** before handing over: PT named in every hook · one CTA · AI label noted · no first-person brand text · no invented claims or testimonials · prices with the Omnibus line · text readable on a phone (look at the preview images yourself).
7. Tell Marco what's ready, with the preview images, and what he must do (check, schedule, add music, AI label).

## Carousels — `scripts/carosello.py spec.json cartella`

1080×1350 PNG slides in the FORGE style (black #07090B, green #00E15F, Space Grotesk), rendered with headless Chrome in a throwaway profile. Slide types: `copertina` (hook + subline), `punto` (optional big number, title, text, note), `esempio` (title + table rows, last row highlighted), `pagina` (title + an image, e.g. a crop of a page of `vendita/FORGE-10-schede.pdf` rendered with pymupdf), `cta` (title, text, green button). `*parole*` turn green; `\n` breaks a line. Keep it to 6-8 slides; slide 1 must stop the scroll on its own because it is all the feed shows; the last slide is the CTA. Build a contact sheet with PIL and look at it before handing over.

## Reels — `scripts/reel.py spec.json`

1080×1920, ~15-20 s: hook (avatar clip or still) with the hook text burned on top and the AI line at the bottom → 3-5 app screenshots in a phone frame with a caption each → end card «10 schede gratis · link in bio · @forgecoach.it». Slide-left transitions, loudness normalised to −14 LUFS.

- App screenshots: `C:\Users\stang\Downloads\FORGE-lancio\5-Schermate-app\` (clienti, nuovo-cliente, cliente-luca, cliente-home, cliente-allena, progressi, stimolo, check-foto, check-coach, confronto, importa, iphone, guida-coach, cliente-guida, licenza). New screens: `C:\Users\stang\code\forge\guida\schermate.py` makes them from the demo.
- **Avatar hook on Higgsfield (CLI, not the connector — the credits are on the CLI account):**
  1. `higgsfield account status` — check the balance before generating; a hook costs ~8 credits (seedance_2_0_mini, 8 s, 720p, audio on) or ~12 (veo3_1_lite 8 s with `--generate_audio true`). `higgsfield generate cost …` gives the exact figure.
  2. Prompts go in a JSON file passed as `--prompt "@file.json"` (a prompt starting with @ is read as a JSON file; PowerShell also strips quotes).
  3. Start from the locked avatar still (memory says which: A uomo, B donna, C 3D) as the start image, 9:16. Ask for natural Italian speech of the exact hook line, selfie framing, gym background.
  4. Download, put it in the reel folder as `gancio.mp4`, set `"video": "gancio.mp4"` in the spec. Listen for Italian mispronunciations (Seedance has slipped before) and tell Marco to listen too.
- Without a clip, `"img"` + `"durata"` makes a still hook with a slow zoom — fine for a draft, weaker on retention.

## Comment-keyword CTA (from 03/10/2026)

A reel that asks «Commenta SCHEDE» gets comments (reach) and turns each comment into a contact. Use it as the CTA on reels instead of «link in bio» when the piece is a demo or a spot. The reply goes in the DM with the site link `https://forgecoach-it.lovable.app/?utm_source=ig-commento#regalo` (TikTok: `tt-commento`), never the PDF itself: the box collects email + consent, so the lead enters the CRM and its 8-contact sequence. Ready texts and the optional ManyChat setup: `OneDrive\Desktop\FORGE social\spot-animato\didascalie.md`. Brand text stays without first person («ti arrivano in direct 10 schede»).

## Animated spot in code

`C:\Users\stang\code\spot-animati` is a Remotion project (compositions `Forge` and `GuidoIo`, 1080×1920). Voice: ElevenLabs v4 through the Higgsfield CLI (see memory feedback-voce-sintetica); Marco rejected the edge-tts voice of v1 as «terribile». Generate the whole script in one take and time the scenes from faster-whisper word timestamps (the GuidoIo composition shows how). Render with `npx remotion render src/index.ts Forge out/FORGE-spot.mp4`, then loudnorm to −14 LUFS. Check the voice with faster-whisper: «illimitati» came out as «limitati» once, so rewrite any line that's ambiguous out loud. A synthetic voice still needs the AI label.

## After the week

Update memory `project-forge-social`: what was produced, credits left, what Marco changed, which hooks performed. Keep the strategy doc's calendar in sync if the plan moved.


## Approfondimento ganci
Per ideare ganci di reel e caroselli usa anche `../social/references/founder-viral-hook-creator/GUIDA.md` (19 schemi e parole che attirano l attenzione). Tradurre sempre in italiano parlato e rispettare le regole di questa skill: niente formule da IA.
