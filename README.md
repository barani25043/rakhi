# 🪢 Raksha Bandhan Digital Greeting Card Web App

A polished, highly interactive, and cinematic digital Raksha Bandhan greeting card experience built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and HTML5 Audio API.

## ✨ Features & Storytelling Flow

1. **Scene 1 — Intro**: Soft dark burgundy & red gradient background with glowing diyas, floating hearts, animated Rakhi title, and a glowing `OPEN YOUR SURPRISE ✨` CTA button with click particle burst.
2. **Scene 2 — Shinchan Character Scene**: Browser-style secret surprise window (`special-surprise.local`) featuring Shinchan doing waving and happy animations, with playful dodging `NO 🙈` button interactions and easter egg hidden responses!
3. **Scene 3 — Unfolding Letter**: Realistic digital paper unfolding animation with a wax seal, floating flower petals, and customizable handwritten message for your sister.
4. **Scene 4 & 5 — Scrapbook Memories Gallery & Lightbox**: Interactive clothesline hanging photos with wooden clips, photo tilt angles, stickers, custom captions, lightbox expand modal with mobile swipe & keyboard navigation support, and Shinchan animations walking/peeking.
5. **Scene 6 — Best Sister Award Certificate**: Gold-embossed certificate presentation card with animated stars, trophy, rating (`∞ / 10`), golden particle showers, and Shinchan holding a gift box.
6. **Scene 7 — Final Emotional Surprise**: Warm pink/red gradient with floating Rakhis, heart burst easter eggs on click, emotional sign-off message, and a `Replay the surprise ↻` button.
7. **Background Music & Audio**: Floating glassmorphism mute/unmute controller with smooth audio fade-in/fade-out using the HTML5 Audio API.
8. **Responsive Design**: 9:16 vertical-first layout optimized for mobile screens (375px–430px) with centered card frame on desktop displays.

---

## 🛠️ Customization & Personalization

All text content, sister name, captions, photo list, and award details are centralized in **one single file**:

📁 `src/data/cardData.ts`

```typescript
const cardData = {
  sisterName: "Didi", // Change to your sister's name or nickname
  letterHeader: "To My Forever Best Sister ❤️",
  letter: `...`,      // Edit your handwritten letter
  memories: [         // Customize photo paths and captions
    {
      image: "/assets/sister/photo1.jpg",
      caption: "Partners in crime ❤️",
      ...
    }
  ]
}
```

### Replacing Images
- **Sister Photos**: Place your photos in `public/assets/sister/` as `photo1.jpg`, `photo2.jpg`, etc.
- **Shinchan Character Poses**: Place custom PNGs in `public/assets/shinchan/` (`idle.png`, `wave.png`, `happy.png`, `crying.png`, `jump.png`, `gift.png`).
- **Background Music**: Place your audio file at `public/assets/audio/bg-music.mp3`.

---

## 🚀 Quick Start & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📱 Responsive Preview Standards

- **Mobile Viewport**: `375x812`, `390x844`, `430x932`
- **Desktop**: Centered card frame with blurred ambient backdrop
