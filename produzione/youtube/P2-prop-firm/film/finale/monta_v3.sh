#!/bin/bash
# P2 film v3 (22/11/2026): render P2FILM (C tutto 1080p) -> innesto nuova trappola 2 (P2T2) al posto di 147,527-227,461 s -> 1440p.
set -e
cd "$(dirname "$0")/../../../../remotion-c"
F=../youtube/P2-prop-firm/film/finale; T=../youtube/P2-prop-firm/film/t2nuova
mkdir -p /c/Users/stang/rtmp-p2f; export TEMP='C:\Users\stang\rtmp-p2f' TMP='C:\Users\stang\rtmp-p2f'
[ -f build-p2f/index.html ] || npx remotion bundle src/index.ts --public-dir=public-p2f --out-dir=build-p2f > /dev/null 2>&1
npx remotion render build-p2f P2FILM $F/P2-film-1080.mp4 --concurrency=4 --offthreadvideo-cache-size-in-bytes=400000000 --crf=18 > $F/render.log 2>&1
echo RENDER OK
ffmpeg -v error -y -i $F/P2-film-1080.mp4 -i $T/P2T2-1080.mp4 -filter_complex "\
[0:v]trim=0:147.527,setpts=PTS-STARTPTS[v1];[0:a]atrim=0:147.527,asetpts=PTS-STARTPTS[a1];\
[1:v]setpts=PTS-STARTPTS[v2];[1:a]loudnorm=I=-16.3:TP=-1.5:LRA=7,aresample=48000,asetpts=PTS-STARTPTS[a2];\
[0:v]trim=start=227.461,setpts=PTS-STARTPTS[v3];[0:a]atrim=start=227.461,asetpts=PTS-STARTPTS[a3];\
[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k $F/P2-film-v3-1080.mp4
rm -f $F/P2-film-1080.mp4; echo INNESTO OK
ffmpeg -v error -y -i $F/P2-film-v3-1080.mp4 -vf "scale=2560:1440:flags=lanczos,unsharp=5:5:0.6" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart $F/P2-film-YOUTUBE-1440p-v3.mp4
echo UPSCALE OK
rm -rf /c/Users/stang/rtmp-p2f
