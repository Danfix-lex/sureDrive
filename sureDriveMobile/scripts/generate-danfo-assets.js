const fs = require('fs');
const sharp = require('sharp');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="60" cy="80" r="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFD600" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#FFD600" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#111111" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#222831"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="32" fill="url(#bg)"/>
  <ellipse cx="60" cy="90" rx="48" ry="18" fill="url(#glow)" />
  <rect x="20" y="60" rx="10" width="80" height="30" fill="#FFD600" stroke="#111" stroke-width="4"/>
  <rect x="30" y="65" width="18" height="14" fill="#fff" stroke="#111" stroke-width="2"/>
  <rect x="52" y="65" width="18" height="14" fill="#fff" stroke="#111" stroke-width="2"/>
  <rect x="74" y="65" width="18" height="14" fill="#fff" stroke="#111" stroke-width="2"/>
  <ellipse cx="38" cy="95" rx="8" ry="8" fill="#111"/>
  <ellipse cx="82" cy="95" rx="8" ry="8" fill="#111"/>
  <path d="M25 90 Q60 110 95 90" stroke="#4caf50" stroke-width="4" fill="none"/>
  <circle cx="100" cy="50" r="14" fill="#4caf50" stroke="#fff" stroke-width="3"/>
  <path d="M94 50 l6 7 l10 -10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`;

const targets = [
  { name: 'icon.png', size: 512 },
  { name: 'adaptive-icon.png', size: 512 },
  { name: 'splash-icon.png', size: 1280 },
  { name: 'favicon.png', size: 64 },
];

(async () => {
  for (const t of targets) {
    await sharp(Buffer.from(svg))
      .resize(t.size, t.size)
      .png()
      .toFile(`./assets/images/${t.name}`);
    console.log(`Generated ${t.name} (${t.size}x${t.size})`);
  }
})(); 