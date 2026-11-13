# Trailer P2 v2 (13/11/2026): regia «cinematografica» come il video del casinò (r8xOR7SX_34).
# Differenze dalla v1: camera sempre in movimento (CAMERA_MOVE=1), angoli insoliti (riflessi, dall'alto col faro, macro, dal basso,
# POV dal monitor, olandese), luce bassa blu/viola ad alto contrasto, grana. Il manichino resta quello di set/manichino-rif.png.
import os
CHAR = ("Keep the exact same character from the reference image: an adult male figure with white matte porcelain skin made of flat low-poly facets, "
        "completely featureless faceted head (NO eyes, NO nose, NO mouth, no hair), heather-grey hoodie, dark navy jeans, white sneakers. ")
NOTTE = ("Cinematic film still, 16:9, moody low-key lighting, deep navy blue and violet neon tones, strong contrast, practical lights only, "
         "shallow depth of field, anamorphic lens look, subtle 35mm film grain, realistic, no subtitles, no watermark. ")
GIORNO = ("Cinematic film still, 16:9, warm low morning sun with long hard shadows and light beams through dust, strong contrast, "
          "shallow depth of field, anamorphic lens look, subtle 35mm film grain, realistic, no subtitles, no watermark. ")
S = {
 "a": ("Aerial drone view at night of a dense city block of apartment buildings, almost all windows dark, ONE single window on the fourth floor glowing cold blue from a computer screen. "
       "Wet streets reflecting street lamps, mist. " + NOTTE,
       "Slow aerial drone push-in towards the single glowing window, slight descent, city lights twinkle."),
 "b": (CHAR + "Extreme macro close-up at night: his white faceted fingers hold a blue credit card next to a laptop keyboard, the card number area is blurred, "
       "cold blue screen light on the card edge, everything else falls into darkness. " + NOTTE,
       "Very slow push-in on the card while his fingers turn it slightly towards the screen light, rack focus from keyboard to card."),
 "c": (CHAR + "Night. Shot through the dark window glass from outside the building: we see him sitting at a desk inside, and on the glass the bright reflection of his monitor "
       "showing a clean card \"CHALLENGE 100.000 $\" with a purple \"BUY\" button, overlapping the city lights reflections. Layers of reflections, rain drops on the glass. " + NOTTE,
       "Slow lateral dolly along the wet window glass, reflections sliding over him, rain drops running down."),
 "d": ("Top-down god's-eye view from very high above, in total darkness: a large grid of 100 tiny identical desks, each with a tiny white faceted low-poly figure in a grey hoodie "
       "and a small glowing blue monitor, arranged in 10 rows of 10, isolated by a soft overhead spotlight cone, the floor black. Miniature diorama feeling. " + NOTTE,
       "Very slow top-down rotation and push-in over the grid of tiny desks, the little monitors flicker."),
 "e": (CHAR + "Morning. Close-up of a round white wall clock showing exactly 9:00 in sharp focus in the foreground; behind it, out of focus, he sits at his desk "
       "with a coffee mug, the window light flaring. " + GIORNO,
       "Rack focus from the clock in the foreground to him at the desk in the background, slow dolly to the right."),
 "f": (CHAR + "Morning. Camera placed behind the computer monitor looking at him: the dark back of the monitor fills the left foreground, "
       "his faceted white head lit from the front by the screen glow, sunlight behind him, coffee mug, symmetrical composition. " + GIORNO,
       "Slow push-in towards him past the edge of the monitor, his head tilts slightly as he reads the screen."),
 "g": ("Extreme macro close-up of a computer screen: green candlestick chart rising, individual pixels visible, a big green \"+2%\" label glowing at the top right, "
       "shallow depth of field across the screen surface. " + GIORNO,
       "Slow tracking shot sliding along the screen surface following the green candles upward, focus breathing."),
 "h": (CHAR + "Morning, very low-angle heroic shot from the floor: he stands in front of the big window with both arms open wide, triumphant, strong sun flare behind him, "
       "silhouette rim light on the faceted edges, ceiling visible. " + GIORNO,
       "Slow low-angle orbit around him from left to right, the sun flares through his arms."),
 "i": ("Night, extreme close-up of a smartphone lying face up on a dark wooden desk, the screen lights up with a red push notification \"BREAKING: INFLATION DATA ABOVE EXPECTATIONS\", "
       "the phone vibrates, red light spills on the wood grain. " + NOTTE,
       "The phone vibrates and slides slightly on the desk, slow push-in, the red light pulses."),
 "j": (CHAR + "Night, extreme close-up side profile of his white faceted low-poly head in total darkness, lit only by a deep red glow from an off-screen monitor, "
       "red reflections of falling candlestick charts sweeping across the polygon facets. " + NOTTE,
       "Red light flickers and sweeps across the facets of his head as charts fall, very slow push-in, he lowers his head slightly."),
 "k": (CHAR + "Night, dutch angle (tilted camera) wide shot: he sits at his desk with both hands on his head in despair, the room dark, both monitors glowing red, "
       "long red shadows on the wall. " + NOTTE,
       "Slow camera roll and push-in on the tilted frame, red monitors flicker, he bends forward."),
 "l": (CHAR + "Night, extreme close-up of his white faceted thumb hovering over a smartphone screen showing a purple button \"RETRY -20%\" with a glowing border, "
       "the background a dark room with red monitor bokeh. " + NOTTE,
       "His thumb slowly moves down and presses the purple button, the button glows brighter, slow push-in."),
 "o": ("Night, wide symmetrical tracking shot along the central aisle of a huge dark hall with endless rows of identical desks, at each desk an identical figure with white matte "
       "porcelain low-poly faceted skin and featureless faceted head in a grey hoodie, all staring at monitors glowing red, overhead strip lights, haze. " + NOTTE,
       "Smooth steadicam tracking forward along the central aisle between the rows, the figures pass on both sides, red monitors flicker."),
}
os.makedirs("set", exist_ok=True); os.makedirs("clip", exist_ok=True)
for k, (img, mov) in S.items():
    open(f"set/prompt-{k}.txt", "w", encoding="utf-8").write(img)
    open(f"clip/prompt-{k}.txt", "w", encoding="utf-8").write(mov)
open("lista.txt", "w").write("\n".join(S))
print(len(S))
