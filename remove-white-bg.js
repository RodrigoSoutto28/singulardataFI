import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp } from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, 'src', 'assets', 'icons3d');

async function processImage(filePath) {
  try {
    const image = await Jimp.read(filePath);
    
    // We iterate over every pixel. If the pixel is close to pure white, we make it transparent.
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // If color is very close to white (e.g. > 240 for all channels)
      if (r > 240 && g > 240 && b > 240) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    // Write back as a true PNG
    await image.write(filePath);
    console.log(`✅ Processed: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, err);
  }
}

async function main() {
  console.log('Starting white background removal...');
  const files = fs.readdirSync(ICONS_DIR);
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const filePath = path.join(ICONS_DIR, file);
      await processImage(filePath);
    }
  }
  console.log('Done!');
}

main();
