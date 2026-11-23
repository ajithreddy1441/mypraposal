# ❤ The Developer & The BDA

React + Vite + Tailwind + Framer Motion. Mobile-first and ready for Vercel. All 17 photos are already included and optimised in `public/images`.

## How it flows now (one page at a time)
After the terminal + hold-the-heart opening, every part is its own full screen with **Back / Next** buttons at the bottom
(and the phone's back gesture goes to the previous page instead of leaving the site):

Hero → Chapter 1 → Chapter 2 → Chapter 3 → Chapter 4 → Gallery → Frames → **Your video** → Love letter → **The question** → Finale

- The letter page only shows "Next" after she opens the envelope.
- The question page has **Yes / Let me think / No**. The "No" button runs away from the mouse before
  it can be touched, escapes on every tap on phones, changes its text each time, shrinks a little,
  sometimes teleports with a heart "poof", and makes the Yes button grow. It can never be clicked.
  Its lines and the pop-up messages are in `proposal.noLines` and `proposal.noToasts` in the config.
- Next-button labels for every page are in `pages` in the config.

## Adding your song
1. Save your song as `public/audio/bgm.mp3` (exact name), then rebuild / redeploy.
2. In `src/config/proposalData.js` → `media`, fill in `songTitle` and `songFrom` (the film). They show in the
   gold music pill at the top right. Tapping the pill mutes / unmutes.
3. Long intro? Set `bgmStartAt` to the second you want it to start from (e.g. `12`).
4. Volume is `bgmVolume` (0 to 1). If the file is missing, the pill hides itself.

The music starts when she presses and holds the heart on the opening screen (phones only allow sound after a tap),
pauses while your video plays and resumes afterwards.

## Look and feel
"Pattu silk at midnight": plum silk background, zari-gold foil headings, a temple-border (zari) ornament,
her lavender as the second colour, and red only for the hearts. Fonts: DM Serif Display (headings, and names
in italic), DM Serif Text (letter and story text), Manrope (buttons and small text).

## Childhood pages
After Chapter Two there are two pages: "Chinnappudu" (his childhood photo beside hers) and "Appude kalisi unte..."
(the two of you as kids). Edit them in `childhood` and `whatIf` in `src/config/proposalData.js`.
Remove the `childhood` block to hide both pages. Colours live in `tailwind.config.js`, shared styles in `src/index.css`.

## Adding your video
The video page is **always in the site** now (page 8, after Frames). Until you add the video it shows a
blurred photo with "Video coming soon ❤". Add your video in ONE of two ways (in `src/config/proposalData.js` → `media`):

**Option A: upload the file**
1. Save it as `public/video/proposal.mp4` (exact name), then rebuild / redeploy.
2. Portrait (phone) or landscape both work; the frame adjusts to the video's shape.
3. Keep it under ~40 MB so it loads fast on her phone (GitHub refuses files over 100 MB). To shrink it:
   ```bash
   ffmpeg -i input.mov -vf "scale=-2:1280" -c:v libx264 -preset veryfast -crf 26 -c:a aac -b:a 128k -movflags +faststart public/video/proposal.mp4
   ```

**Option B: paste a link** (good for big videos)
- Upload to YouTube as **Unlisted** (or Google Drive with "Anyone with the link", or Vimeo) and paste the link in `videoLink`.
- Set `videoOrientation` to `'portrait'` for a phone video or `'landscape'` for a wide one.
- If both are set, the link is used.

Either way, the music pauses while the video plays and comes back when she leaves the page.
`videoPoster` is the photo shown before she presses play. Page text is in `videoSection`.
Set `showVideoPage: false` if you ever want the page hidden until a video file exists.

## The old sections
1. **Terminal opening**: a code terminal types out the story as a git log, then she presses and holds a heart until it fills and bursts open. Music starts on that touch.
2. **Hero**: the title with her "mahi" word-sketch in a gold arch frame.
3. **Story (Telugu)**: four chapters with polaroids, a late-night chat, a before/after slider ("Serious Developer" vs "Nee pakkana") and the "Mahi" reveal.
4. **Nuvvu gallery**: all her photos. Tap one for a full-screen swipe view.
5. **Framed, forever**: the four framed collages in a swipeable 3D carousel.
6. **Video**: your video message (shows "coming soon" until you add it).
7. **Love letter**: a sealed envelope that opens when she taps the red wax heart, with your full proposal.
8. **The question**: Yes, I will ❤ / Let me think ☺️
9. **Finale**: heart-shaped red fireworks, floating hearts, a heart photo of you both and "I love you, Mahi."

## Optional files
- `public/audio/bgm.mp3`: your song
- `public/video/proposal.mp4`: your video (H.264 MP4, ideally under 40 MB)

## Edit text
Everything is in `src/config/proposalData.js`.

## Run and deploy
```bash
npm install
npm run dev            # local
```
Vercel: push this folder to a GitHub repo, then on vercel.com choose Add New → Project → import → Deploy (the Vite preset is detected).
Or run `npm i -g vercel && vercel --prod`.

## Know when she answers
**Telegram alerts (automatic, she sees nothing).** You get a message when she opens the site, reaches the question,
taps "Let me think", tries to press No, and when she says YES.
1. In Telegram, open **@BotFather** → send `/newbot` → pick any name → copy the **token** it gives you.
2. Open your new bot and send it any message (e.g. "hi").
3. In a browser open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy the number after `"chat":{"id":`.
4. Vercel → your project → Settings → Environment Variables → add
   `TELEGRAM_BOT_TOKEN` = the token, and `TELEGRAM_CHAT_ID` = that number. Then Deployments → Redeploy.
5. Test: open your live site yourself and press the heart. You should get "👀 Mahi opened the website".
   (Alerts only work on the live Vercel site, not with `npm run dev`.)

To switch alerts off, set `notify.enabled: false` in `src/config/proposalData.js`.

**WhatsApp button (she sends it herself).** Put your number in `notify.whatsappNumber` (country code + number,
digits only, e.g. `919876543210`). A "Send him my answer 💌" button appears on the final screen and opens WhatsApp
with `notify.whatsappMessage` ready to send to you.
