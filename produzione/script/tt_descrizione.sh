#!/bin/bash
# uso: tt.sh "testo" "#tag1" "#tag2" "#tag3"  (campo descrizione già attivo)
export MSYS_NO_PATHCONV=1
t() { local s="${1// /%s}"; adb shell "input text '$s'"; sleep 0.5; }
fix() { adb shell input keyevent 21; adb shell input keyevent 22; sleep 0.3; }
t "$1"; adb shell input keyevent 66; adb shell input keyevent 66; sleep 0.3
shift
first=1
for h in "$@"; do
  if [ $first = 0 ]; then t " "; fi
  t "$h"; fix; first=0
done
