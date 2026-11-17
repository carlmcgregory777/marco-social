# P2 film (17/11/2026): scene nuove per il copione v2 (le altre si riusano dal trailer: trailer/clip s01-s12 e trailer/v2/clip a-o).
import os
CHAR = ("Keep the exact same character from the reference image: an adult male figure with white matte porcelain skin made of flat low-poly facets, "
        "completely featureless faceted head (NO eyes, NO nose, NO mouth, no hair), heather-grey hoodie, dark navy jeans, white sneakers. ")
CC = ("Keep the exact same man from the first reference image identical (purple bowl-cut hair, protruding ears, long neck, thick black moustache, "
      "impassive look, black suit, purple shirt, black tie) and the exact same faceted white low-poly figure from the second reference image "
      "(featureless faceted head, NO face, grey hoodie). ")
NOTTE = ("Cinematic film still, 16:9, moody low-key lighting, deep navy blue and violet neon tones, strong contrast, practical lights only, "
         "shallow depth of field, anamorphic lens look, subtle 35mm film grain, realistic, no subtitles, no watermark, no readable text. ")
CALDA = ("Cinematic film still, 16:9, warm golden lamp light, soft contrast, shallow depth of field, anamorphic lens look, subtle 35mm film grain, "
         "realistic, no subtitles, no watermark, no readable text. ")
S = {
 "n1": ("cc", CC + "A small home office at night that is turning warm: the man in the suit sits down calmly next to the faceted figure at the desk "
        "and slides the laptop towards himself, the figure turns its featureless head towards him. Medium wide shot from the side. " + CALDA,
        "The man in the suit slides the laptop towards himself and looks at the screen calmly, the faceted figure turns its head towards him, slow push-in."),
 "n5": ("m", CHAR + "Night, close shot over his shoulder: he leans over a long printed contract on the desk under a single desk lamp, holding a big magnifying glass "
        "over tiny dense fine print, some words highlighted in purple marker. " + NOTTE,
        "The magnifying glass slowly slides along the lines of fine print, the lamp light flickers slightly, slow push-in."),
 "n6": ("m", CHAR + "Night, foggy cemetery: rows of old stone tombstones, on each tombstone a cracked dead computer monitor with a dim grey screen, "
        "he stands alone in the middle holding a glowing phone, purple moonlight, low ground fog. Wide shot. " + NOTTE,
        "Slow dolly forward through the low fog between the tombstones towards him, the phone glow flickers."),
 "n7": ("m", CHAR + "Night, dark casino: he stands in front of a giant glowing slot machine whose three reels show stock market candlestick charts, "
        "his faceted hand on the big lever, purple and red neon reflections on his white facets, coins on the floor. " + NOTTE,
        "He pulls the lever down, the reels spin and blur, neon lights flash, slow push-in."),
 "n11": ("m", CHAR + "An empty grey waiting room with a row of plastic chairs: he sits alone holding a phone with a spinning loading circle on the screen, "
        "dust and thin cobwebs on his shoulders and on the chair, a wall clock, cold flat fluorescent light, faded colors. Symmetrical wide shot. " + NOTTE,
        "Dust particles float slowly in the light, the loading circle spins on the phone, he stays still, very slow push-in."),
 "n12": ("m", CHAR + "A colorful youtuber room: he sits in front of a camera on a tripod with a big ring light, gesturing enthusiastically to the lens, "
        "a podcast microphone, behind him a glowing neon sign shaped like a big percent symbol and a coupon ticket, LED strips. Side shot showing the camera. " + NOTTE,
        "He gestures enthusiastically towards the camera, the ring light glows, LED strips shift color, slow orbit."),
}
for k, (r, img, mov) in S.items():
    open(f"set/prompt-{k}.txt", "w", encoding="utf-8").write(img)
    open(f"set/rif-{k}.txt", "w").write(r)
    open(f"clip/prompt-{k}.txt", "w", encoding="utf-8").write(mov)
print(" ".join(S))
