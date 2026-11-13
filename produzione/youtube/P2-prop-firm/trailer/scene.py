# Prompt delle 12 scene del trailer P2 (13/11/2026). Scrive set/prompt-sNN.txt e clip/prompt-sNN.txt
import os
CHAR = ("Keep the exact same character from the reference image: an adult male figure with white matte porcelain skin made of flat low-poly facets, "
        "completely featureless faceted head (NO eyes, NO nose, NO mouth, no hair), heather-grey hoodie, dark navy jeans, white sneakers. ")
ROOM = ("Setting: his small modern studio apartment: a light wooden desk against the wall with two computer monitors, a black office chair, "
        "a window on the left, a bookshelf and a green plant. ")
LOOK = "Cinematic realistic film still, horizontal 16:9, shallow depth of field, high detail, no subtitles, no watermark. "
S = {
 "s01": (CHAR + ROOM + "Night, the room is dark, lit only by the cold blue light of the monitors. Over-the-shoulder shot from behind him: he sits on the chair, his hand on the mouse, "
         "and the main monitor shows a clean trading website with a big card \"CHALLENGE 100.000 $\" and a bright purple button \"BUY\". " + LOOK,
         "Slow push-in towards the monitor. His hand clicks the mouse, the purple BUY button glows brighter. Monitor light flickers softly on him."),
 "s02": (CHAR + ROOM + "Bright morning sunlight from the window. Medium shot from the front-side: he sits at the desk holding a white coffee mug, laptop open, "
         "a wall clock on the wall shows 9:00. Calm, hopeful mood, warm light. " + LOOK,
         "He takes a sip of coffee and puts the mug down, leaning towards the screen. Sunlight dust in the air. Static camera."),
 "s03": (CHAR + ROOM + "Morning light. Over-the-shoulder close shot of the main monitor: a trading platform with a candlestick chart going up in green and a big green number \"+2%\" "
         "in the top corner. His faceted head and shoulder blurred in the foreground. " + LOOK,
         "The green candles keep rising one by one on the screen, the +2% number pulses. Very subtle camera drift."),
 "s04": (CHAR + ROOM + "Morning light. Medium wide shot from the front: he leans back on the chair with both hands behind his head, relaxed and proud, feet on the desk corner. "
         "Monitors show green charts. " + LOOK,
         "He leans back further and stretches comfortably, swinging slightly on the chair, satisfied. Static camera."),
 "s05": (CHAR + ROOM + "Next day, grey overcast light. Extreme close-up of the monitor: a news banner \"BREAKING: INFLATION DATA\" in red at the top, and the candlestick chart "
         "below collapsing with huge red candles. Tense mood. " + LOOK,
         "Huge red candles drop fast down the chart, the red news banner blinks. Camera slowly pushes in, slight shake."),
 "s06": (CHAR + ROOM + "Grey cold light. Medium close shot from the front, monitors glowing red reflected on his white faceted head: he has both hands on his head in despair. " + LOOK,
         "He grabs his head with both hands and slowly bends forward in despair, red light flickering on him. Static camera."),
 "s07": (CHAR + ROOM + "Close shot of the main monitor: a red full-screen alert window with a big warning icon and the text \"ACCOUNT BREACHED\" and below \"Daily loss limit -5%\". "
         "Dark room, red glow. " + LOOK,
         "The red alert window pulses and glows, a slow push-in towards the text. Red light on the desk."),
 "s08": (CHAR + ROOM + "Close-up of his white faceted hand holding a smartphone above the desk; the phone screen shows a notification \"RESET YOUR CHALLENGE - 20% OFF\" with a purple button "
         "\"TRY AGAIN\". The red monitor glow blurred in the background. " + LOOK,
         "The notification slides in on the phone screen and the purple TRY AGAIN button gently pulses. His thumb moves towards it."),
 "s09": (CHAR + "Top-down overhead shot looking straight down at his light wooden desk: keyboard, mouse, a coffee mug, and three printed receipts side by side, each reading "
         "\"CHALLENGE 100K\" with a price, his white faceted hands resting near them. " + LOOK,
         "Top-down static camera. His faceted hand slides a third receipt next to the other two, then taps the desk nervously."),
 "s10": (CHAR + ROOM + "Late night, the wall clock shows 3:00, the room is dark and messy with empty mugs. Wide shot from the doorway: he sits hunched in front of the glowing monitors, alone. " + LOOK,
         "The monitor light flickers on him, he rubs his faceted head slowly. Very slow push-in from the doorway."),
 "s11": ("Wide symmetrical shot of a huge dark open-space room with long rows of identical desks, at each desk an identical figure with white matte porcelain low-poly faceted skin, "
         "featureless faceted head, heather-grey hoodie, all staring at monitors glowing red. Dozens of them, endless rows, cold cinematic light. " + LOOK,
         "Slow dolly forward along the central aisle between the rows of identical figures, the red monitors flicker. Smooth movement."),
}
C12 = ("Keep this exact same man identical: same face, purple bowl-cut hair, long neck, protruding ears, thick black moustache, small mole between the eyebrows, black suit jacket, "
       "purple shirt, black tie. New scene: he stands still in a dark corridor in front of a door with a glowing purple neon \"EXIT\" sign above it, looking straight at the camera with an impassive serious face, "
       "hands in his pockets. Cinematic realistic film still, horizontal 16:9, moody purple light, shallow depth of field.")
os.makedirs("set", exist_ok=True); os.makedirs("clip", exist_ok=True)
for k, (img, mov) in S.items():
    open(f"set/prompt-{k}.txt", "w", encoding="utf-8").write(img)
    open(f"clip/prompt-{k}.txt", "w", encoding="utf-8").write(mov)
open("set/prompt-s12.txt", "w", encoding="utf-8").write(C12)
open("clip/prompt-s12.txt", "w", encoding="utf-8").write("He stays still and impassive, a slow blink, the purple EXIT neon flickers softly. Slow push-in.")
print("ok", len(S) + 1)
