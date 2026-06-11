import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp } from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, 'src', 'assets', 'icons3d');

/**
 * More aggressive white removal:
 * - Threshold 230 instead of 240
 * - Anti-aliased edges: semi-transparent near-white pixels
 */
async function processImage(filePath) {
  try {
    const image = await Jimp.read(filePath);
    const { width, height, data } = image.bitmap;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx + 0];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Saturation: how "gray" vs "colorful" the pixel is
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;

        // Fully transparent: very light AND low saturation (pure white/near-white bg)
        if (lum > 230 && sat < 0.12) {
          data[idx + 3] = 0;
        }
        // Semi-transparent: antialiased edge pixels (lighter grey with low saturation)
        else if (lum > 200 && sat < 0.08) {
          // Fade out proportionally
          const alpha = Math.round(((255 - lum) / 55) * 255);
          data[idx + 3] = Math.min(data[idx + 3], alpha);
        }
      }
    }

    await image.write(filePath);
    console.log(`✅ Processed: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`❌ Error: ${path.basename(filePath)}:`, err.message);
  }
}

async function main() {
  console.log('🎨 Removing white backgrounds (aggressive mode)...');
  const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.png'));
  for (const file of files) {
    await processImage(path.join(ICONS_DIR, file));
  }
  console.log(`✨ Done! Processed ${files.length} icons.`);
}

main();
