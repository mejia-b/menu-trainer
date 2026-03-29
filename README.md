# Menu Trainer — Reunion

A flashcard-style web app for restaurant staff to memorize dish names, ingredients, dietary tags, and preparation notes. Built as a single HTML file deployed on Vercel with an ElevenLabs AI voice integration.

---

## Features

- **44 flashcards** covering the full Reunion menu — appetizers, pastas, mains, sides, and salads
- **Flip cards** to reveal ingredients, with tap/click or spacebar support
- **Voice input** — speak your ingredients aloud using the browser's speech recognition
- **Type input** — type ingredients as an alternative to voice
- **Answer checking** — matched ingredients highlight green, missed ones highlight red
- **AI voice** — ElevenLabs TTS reads dish names aloud and confirms results
- **Progress tracking** — mark cards as Mastered or Needs Practice, stored in localStorage
- **Deck filtering** — study all cards, only weak ones, or review mastered ones
- **Shuffle** — randomize card order for varied practice sessions
- **Dietary tags** — GF, Vegan, and Kosher labels visible on each card
- **Keyboard shortcuts** — arrow keys to navigate, space to flip, Enter to check answer

---

## Project Structure

```
your-project/
├── index.html        # The entire app — UI, data, and logic
├── api/
│   └── voice.js      # Vercel serverless function — proxies ElevenLabs TTS
└── README.md
```

---

## Deployment (Vercel)

This app is deployed as a static site on Vercel with one serverless function for voice.

### 1. Clone or push to GitHub

Make sure your repo contains `index.html` and the `api/voice.js` file.

### 2. Connect to Vercel

- Go to [vercel.com](https://vercel.com) and import your GitHub repo
- Vercel auto-detects the `api/` folder and deploys `voice.js` as a serverless function

### 3. Add your ElevenLabs API key

In Vercel → your project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `ELEVENLABS_API_KEY` | your key from elevenlabs.io |

### 4. Redeploy

After adding the environment variable, trigger a redeploy so the function picks it up.

---

## AI Voice Setup

Voice works out of the box once the environment variable is set — no configuration needed in the app itself.

The `/api/voice` serverless function receives the dish name and voice ID from the browser, injects the API key server-side, calls ElevenLabs, and streams the audio back. The API key is never exposed to the client.

### Changing the voice

Click **⚙ AI Voice** in the top right corner to choose a different voice. To find available voice IDs on your account, run this in your browser console:

```js
fetch('https://api.elevenlabs.io/v1/voices', {
  headers: { 'xi-api-key': 'YOUR_KEY_HERE' }
}).then(r => r.json()).then(d => console.log(d.voices.map(v => ({name: v.name, id: v.voice_id}))))
```

> **Note:** Not all voices are available on the free tier. If you get a 402 error, the voice requires a paid plan. Stick to voices confirmed working on your account.

### Free tier limits

ElevenLabs free tier includes 10,000 characters/month — more than enough for daily practice sessions.

### Model

The app uses `eleven_turbo_v2_5` — ElevenLabs' current fast model available on the free tier.

---

## Local Development

No build step required. Just open `index.html` in a browser for UI development.

For voice to work locally you need to run a local server since `/api/voice` is a Vercel function. Use the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

Then open `http://localhost:3000`.

---

## Progress & Storage

All progress is saved in the browser's `localStorage` under the key `menu_trainer_scores_v1`. Clearing site data or using a different browser will reset progress. There is a **Reset all progress** button at the bottom of the app.

---

## Menu Data

All 44 dishes are stored as a JavaScript array in `index.html`. Each entry contains:

```js
{
  name: "Dish Name",
  ingredients: ["Ingredient 1", "Ingredient 2", ...],
  notes: "Allergy info, prep notes, dietary flags",
  tags: ["gf", "vegan", "kosher"]   // any combination or empty
}
```

To update the menu, edit the `MENU` array directly in `index.html`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | Playfair Display, DM Sans (Google Fonts) |
| Voice input | Web Speech API (Chrome/Edge) |
| Voice output | ElevenLabs Text-to-Speech API |
| Hosting | Vercel (static + serverless) |
| Storage | Browser localStorage |
