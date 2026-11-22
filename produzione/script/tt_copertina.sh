#!/bin/bash
# Mette la copertina come primi 3 fotogrammi (0,1 s) del video, perché su TikTok via Publora non si può scegliere la copertina:
# TikTok usa il primo fotogramma. Uso: tt_copertina.sh <video.mp4> <copertina.jpg> <out.mp4>
V="$1"; C="$2"; O="$3"
ffmpeg -v error -y -loop 1 -t 0.1 -framerate 30 -i "$C" -i "$V" -f lavfi -t 0.1 -i anullsrc=r=44100:cl=stereo -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p[c];[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p[v];[1:a]aresample=44100,aformat=channel_layouts=stereo[a];[2:a]aformat=channel_layouts=stereo[s];[c][s][v][a]concat=n=2:v=1:a=1[ov][oa]" -map "[ov]" -map "[oa]" -c:v libx264 -crf 20 -preset medium -c:a aac -b:a 160k -movflags +faststart "$O"
