# Voce Algory #11: pause >0,22 s -> 0,10 s, accelerata x1,12. Scrive voce.wav e parole.json (tempi finali).
import json, subprocess, numpy as np, wave
SR=44100; V='../voce/intera-g1.mp3'; W=json.load(open('../voce/intera-g1-parole.json',encoding='utf-8'))
r=subprocess.run(['ffmpeg','-v','error','-i',V,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True,check=True)
a=np.frombuffer(r.stdout,np.int16).astype(np.float32)/32768
# pezzi parlati: unisco parole con pause < 0.22 s
pz=[]; s=W[0]['s']-0.05; e=W[0]['e']
for w in W[1:]:
    if w['s']-e>0.22: pz.append((s,e+0.06)); s=w['s']-0.05
    e=w['e']
pz.append((s,e+0.15))
out=[]; mappa=[]; t=0.0; GAP=0.10
for (s,e) in pz:
    s=max(0,s); seg=a[int(s*SR):int(e*SR)]
    n=int(0.008*SR); seg=seg.copy(); seg[:n]*=np.linspace(0,1,n); seg[-n:]*=np.linspace(1,0,n)
    mappa.append((s,e,t)); out.append(seg); out.append(np.zeros(int(GAP*SR),np.float32)); t+=len(seg)/SR+GAP
y=np.concatenate(out)
open('tmp.raw','wb').write((np.clip(y,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','1','-i','tmp.raw','-filter:a','atempo=1.12,loudnorm=I=-14:TP=-1.5','-ar','48000','voce.wav'],check=True)
def m(x):
    for s,e,t0 in mappa:
        if s-0.06<=x<=e+0.06: return (t0+max(0,x-s))/1.12
    return None
P=[dict(w=w['w'],s=round(m(w['s']),3),e=round(m(w['e']),3)) for w in W]
json.dump(P,open('parole.json','w',encoding='utf-8'),ensure_ascii=False,indent=0)
print('durata', round(t/1.12,2), 'pezzi', len(pz))
