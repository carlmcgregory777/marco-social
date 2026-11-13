#!/bin/bash
# Upscale 1440p + grading notturno blu/viola per le clip del trailer v2 (13/11/2026)
OUT=../../../../remotion-c/public-p2/p2/clip/v2
mkdir -p $OUT
for k in "$@"; do
  [ -f clip/$k.mp4 ] || continue
  ffmpeg -v error -y -i clip/$k.mp4 -an -vf "scale=2560:1440:flags=lanczos,cas=0.5,colorbalance=rs=-0.04:bs=0.06:rm=-0.02:bm=0.03,eq=contrast=1.05:saturation=0.95,vignette=PI/5" -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p $OUT/$k.mp4 && echo "$k graded"
done
