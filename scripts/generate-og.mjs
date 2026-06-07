import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const basePath = join(root, "scripts/og-base.jpg");
const brandmarkPath = join(root, "public/soveng-brandmark.svg");
const outPath = join(root, "public/og-image.jpg");

const width = 1200;
const height = 630;

const photo = await sharp(basePath)
  .extract({ left: 0, top: 720, width: 2644, height: 1388 })
  .resize(width, height, { fit: "cover", position: "centre" })
  .toBuffer();

const brandmark = await sharp(brandmarkPath).resize(72, 84).png().toBuffer();

const overlay = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0a0a0b" stop-opacity="0.96" />
      <stop offset="48%" stop-color="#0a0a0b" stop-opacity="0.82" />
      <stop offset="72%" stop-color="#0a0a0b" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#0a0a0b" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#fade)" />
  <text x="64" y="248" fill="#f7931a" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="0.18em">SEC-08</text>
  <text x="64" y="318" fill="#fafafa" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="800">T-Shirt Contest</text>
  <text x="64" y="372" fill="#8b8b93" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="500">Browse designs. Judges rate on Nostr.</text>
  <text x="64" y="548" fill="#f7931a" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="600">sovereignengineering.io/contest</text>
</svg>
`);

await sharp(photo)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: brandmark, top: 64, left: 64 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
