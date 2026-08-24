import sharp from 'sharp';
import { readdirSync, mkdirSync, copyFileSync, unlinkSync, rmSync } from 'fs';
import { join } from 'path';

const DIR = './public/assets/shinchan';
const TMP = './public/assets/shinchan_tmp';
const THRESHOLD = 230;

async function removeWhiteBg(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  if (!width || !height) return;

  const raw = await image.ensureAlpha().raw().toBuffer();

  // Pass 1: make near-white pixels fully transparent
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i + 1], b = raw[i + 2];
    if (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD) {
      raw[i + 3] = 0;
    }
  }

  // Pass 2: soften edge pixels near white for anti-aliasing
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i + 1], b = raw[i + 2], a = raw[i + 3];
    if (a > 0 && r > 200 && g > 200 && b > 200) {
      const brightness = (r + g + b) / 3;
      raw[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - (brightness - 200) / 55))));
    }
  }

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);
}

async function main() {
  mkdirSync(TMP, { recursive: true });

  const files = readdirSync(DIR).filter(f => f.endsWith('.png'));
  console.log(`Processing ${files.length} images...`);

  for (const file of files) {
    try {
      await removeWhiteBg(join(DIR, file), join(TMP, file));
      console.log(`✅ ${file}`);
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
    }
  }

  // Copy processed files back
  for (const file of readdirSync(TMP)) {
    copyFileSync(join(TMP, file), join(DIR, file));
  }

  // Remove temp dir
  rmSync(TMP, { recursive: true, force: true });

  console.log('\n🎉 Done! All images now have transparent backgrounds.');
}

main();
