#!/bin/bash
# P2 film v3 stile Hormozi (23/11/2026): render P2V3 a blocchi (RAM 8 GB) + musica bassa con ducking + 1440p.
# Musica: «Misdirection» (The Grey Room / Density & Time), Raccolta audio di YouTube, uso libero senza attribuzione.
cd "$(dirname "$0")/../../../../remotion-c"
F=../youtube/P2-prop-firm/film/finale; P=$F/pezzi4; M=../youtube/P2-prop-firm/film/musica/misdirection.mp3
mkdir -p $P /c/Users/stang/rtmp-p2f; export TEMP='C:\Users\stang\rtmp-p2f' TMP='C:\Users\stang\rtmp-p2f'
N=$(npx remotion compositions build-p2v3 2>/dev/null | grep P2V3 | awk '{print $4}'); N=${N:-22320}; echo "frame $N"
: > $P/lista.txt; : > $F/render4.log
a=0
while [ $a -lt $N ]; do
  e=$((a+1499)); [ $e -ge $N ] && e=$((N-1)); o=$P/v-$a.mp4
  for t in 1 2 3; do
    [ -s $o ] && break
    npx remotion render build-p2v3 P2V3 $o --frames=$a-$e --muted --concurrency=2 --port=3179 --offthreadvideo-cache-size-in-bytes=200000000 --crf=17 < /dev/null >> $F/render4.log 2>&1 || rm -f $o
    rm -rf /c/Users/stang/rtmp-p2f/puppeteer_dev_chrome_profile-*
  done
  [ -s $o ] || { echo "BLOCCO $a FALLITO"; exit 1; }
  echo "file '$(cygpath -w $(realpath $o))'" >> $P/lista.txt; echo "ok $a-$e"; a=$((e+1))
done
[ -s $P/audio.wav ] || npx remotion render build-p2v3 P2V3 $P/audio.wav --codec=wav --port=3179 < /dev/null >> $F/render4.log 2>&1 || { echo AUDIO FALLITO; exit 1; }
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $P/audio.wav)
ffmpeg -v error -y -f concat -safe 0 -i $P/lista.txt -i $P/audio.wav -i $M -i $M -i $M -i $M -i $M -filter_complex "\
[2:a][3:a]acrossfade=d=4[m1];[m1][4:a]acrossfade=d=4[m2];[m2][5:a]acrossfade=d=4[m3];[m3][6:a]acrossfade=d=4,atrim=0:$D,afade=t=in:d=2,afade=t=out:st=$(python -c "print($D-5)"):d=5,volume=0.11,aresample=48000[mus];\
[1:a]aresample=48000,asplit[v1][v2];[mus][v2]sidechaincompress=threshold=0.04:ratio=5:attack=30:release=500[duck];\
[v1][duck]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=9[a];\
[0:v]scale=2560:1440:flags=lanczos,unsharp=5:5:0.5[v]" -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart $F/P2-film-YOUTUBE-1440p-v3.mp4 || { echo FINALE FALLITO; exit 1; }
ffmpeg -v error -y -i $F/P2-film-YOUTUBE-1440p-v3.mp4 -vf scale=1280:720 -c:v libx264 -crf 27 -preset fast -c:a aac -b:a 128k $F/anteprima-P2-v3.mp4
echo FATTO; rm -rf $P /c/Users/stang/rtmp-p2f
