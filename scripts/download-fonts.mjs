import fs from 'node:fs';
import path from 'node:path';

const projectRoot = 'C:/Users/sanjo/.gemini/antigravity/scratch/the-jeexers';
const fontsDir = path.join(projectRoot, 'public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    return await res.text();
  } catch (err) {
    console.error(`Failed to fetch text from ${url}:`, err);
    return null;
  }
}

async function main() {
  console.log('--- Processing Clash Display ---');
  const clashCss = await fetchText('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap');
  if (clashCss) {
    fs.writeFileSync(path.join(fontsDir, 'clash-display.css'), clashCss);
    console.log('Saved clash-display.css');
  }

  console.log('--- Processing Round 8 ---');
  const round8Css = await fetchText('https://db.onlinewebfonts.com/c/760c3a7c48d97f8fbc0019404a5923c3?family=ROUND+8+THREE');
  if (round8Css) {
    fs.writeFileSync(path.join(fontsDir, 'round-8.css'), round8Css);
    console.log('Saved round-8.css');
  }

  console.log('--- Processing Neue Metana Regular ---');
  const metanaRegCss = await fetchText('https://db.onlinewebfonts.com/c/61e3f59cf9f0c41d90d6e7875a56303d?family=NeueMetana-Regular');
  if (metanaRegCss) {
    fs.writeFileSync(path.join(fontsDir, 'neue-metana-reg.css'), metanaRegCss);
    console.log('Saved neue-metana-reg.css');
  }

  console.log('--- Processing Neue Metana Bold ---');
  const metanaBoldCss = await fetchText('https://db.onlinewebfonts.com/c/4a83c37f6095a688675bd152b8392902?family=NeueMetana-Bold');
  if (metanaBoldCss) {
    fs.writeFileSync(path.join(fontsDir, 'neue-metana-bold.css'), metanaBoldCss);
    console.log('Saved neue-metana-bold.css');
  }
}

main();
