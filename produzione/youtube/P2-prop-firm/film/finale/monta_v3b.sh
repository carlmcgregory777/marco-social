#!/bin/bash
# P2 film v3, versione a pezzi (22/11/2026): il render unico crollava (RAM 8 GB, browser chiuso al frame 5952).
# Video muto a blocchi da 1500 frame (un processo nuovo per blocco, 3 tentativi, riprende da dove era),
# salta i frame 4440-6809 (vecchia trappola 2, sostituita da P2T2), audio a parte in wav, poi innesto + 1440p in un passaggio.
cd "$(dirname "$0")/../../../../remotion-c"
F=../youtube/P2-prop-firm/film/finale; T=../youtube/P2-prop-firm/film/t2nuova; P=$F/pezzi
mkdir -p $P /c/Users/stang/rtmp-p2f; export TEMP='C:\Users\stang\rtmp-p2f' TMP='C:\Users\stang\rtmp-p2f'
blocchi() { local a=$1 b=$2; while [ $a -le $b ]; do local e=$((a+1499)); [ $e -gt $b ] && e=$b; echo "$a $e"; a=$((e+1)); done; }
fai() { # $1 lista, $2 inizio, $3 fine
  : > $P/$1.txt
  blocchi $2 $3 | while read a e; do
    o=$P/$1-$a.mp4
    for t in 1 2 3; do
      [ -s $o ] && break
      npx remotion render build-p2f P2FILM $o --frames=$a-$e --muted --concurrency=2 --port=3177 --offthreadvideo-cache-size-in-bytes=200000000 --crf=18 < /dev/null >> $F/render.log 2>&1 || rm -f $o
      rm -rf /c/Users/stang/rtmp-p2f/puppeteer_dev_chrome_profile-*
    done
    [ -s $o ] || { echo "BLOCCO $a-$e FALLITO"; exit 1; }
    echo "file '$(cygpath -w $(realpath $o))'" >> $P/$1.txt; echo "ok $a-$e"
  done
}
: > $F/render.log
fai A 0 4439 || exit 1
fai B 6810 22154 || exit 1
[ -s $P/audio.wav ] || npx remotion render build-p2f P2FILM $P/audio.wav --codec=wav --port=3177 >> $F/render.log 2>&1 || { echo AUDIO FALLITO; exit 1; }
echo RENDER OK
ffmpeg -v error -y -f concat -safe 0 -i $P/A.txt -f concat -safe 0 -i $P/B.txt -i $P/audio.wav -i $T/P2T2-1080.mp4 -filter_complex "\
[0:v]trim=0:147.527,setpts=PTS-STARTPTS[v1];[2:a]atrim=0:147.527,aresample=48000,asetpts=PTS-STARTPTS[a1];\
[3:v]setpts=PTS-STARTPTS[v2];[3:a]loudnorm=I=-16.3:TP=-1.5:LRA=7,aresample=48000,asetpts=PTS-STARTPTS[a2];\
[1:v]trim=start=0.461,setpts=PTS-STARTPTS[v3];[2:a]atrim=start=227.461,aresample=48000,asetpts=PTS-STARTPTS[a3];\
[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[v][a];[v]scale=2560:1440:flags=lanczos,unsharp=5:5:0.6[vo]" \
 -map "[vo]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $F/P2-film-YOUTUBE-1440p-v3.mp4 || { echo INNESTO FALLITO; exit 1; }
echo INNESTO E 1440p OK
rm -rf $P /c/Users/stang/rtmp-p2f
