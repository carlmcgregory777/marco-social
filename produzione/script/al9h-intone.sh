#!/bin/bash
# AL9H v3 (15/11/2026): mette il labiale Intone (gancio, 2,45 s) dentro C-parla.mp4.
# Uso: bash script/al9h-intone.sh <intone.mp4>   (da produzione/)
set -e
IN="$1"; P=remotion-c/public-al9h/al9h; H=algory9-hormozi/hf
[ -f $H/C-parla-foto.mp4 ] || cp $P/C-parla.mp4 $H/C-parla-foto.mp4
ffmpeg -v error -y -ss ${OFF:-0} -i "$IN" -an -vf "hqdn3d=1.5:1.5:4:4,scale=1920:1080:flags=lanczos,cas=0.6,fps=30,format=yuv420p" -t 2.45 -c:v libx264 -crf 16 $H/intone-1080.mp4
ffmpeg -v error -y -i $H/C-parla-foto.mp4 -i $H/intone-1080.mp4 -filter_complex \
 "[0:v]trim=0:0.3,setpts=PTS-STARTPTS,fps=30,format=yuv420p[a];[1:v]setpts=PTS-STARTPTS,format=yuv420p[b];[0:v]trim=start=2.75,setpts=PTS-STARTPTS,fps=30,format=yuv420p[c];[a][b][c]concat=n=3:v=1[v]" \
 -map "[v]" -c:v libx264 -crf 16 $P/C-parla.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 $P/C-parla.mp4
