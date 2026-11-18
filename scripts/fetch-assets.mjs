import fs from 'fs';
import path from 'path';
import https from 'https';

const ASSETS = [
  // 1. Lookbook Editorial Streetwear
  {
    name: 'lookbook/model-01-shibuya.jpg',
    url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'lookbook/model-02-cowl.jpg',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'lookbook/model-03-bone.jpg',
    url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'lookbook/model-04-cropped.jpg',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'lookbook/model-05-night.jpg',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'lookbook/model-06-brutalist.jpg',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
  },

  // 2. Textile & Workshop Craft Textures
  {
    name: 'textures/cotton-loopback-macro.jpg',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'textures/fabric-grain-detail.jpg',
    url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'textures/atelier-table.jpg',
    url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafc62?auto=format&fit=crop&w=1200&q=85',
  },

  // 3. Collection Chapter Atmospheric Banners
  {
    name: 'banners/banner-one-piece.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
  },
  {
    name: 'banners/banner-jjk.jpg',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
  },
  {
    name: 'banners/banner-berserk.jpg',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85',
  },
  {
    name: 'banners/banner-dbs.jpg',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects (Unsplash typically issues 302 redirects)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading curated online assets...');
  for (const item of ASSETS) {
    const fullPath = path.join('public', 'images', item.name);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      console.log(`Fetching ${item.name}...`);
      await download(item.url, fullPath);
      const stat = fs.statSync(fullPath);
      console.log(`✔ Saved ${item.name} (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`✘ Error downloading ${item.name}:`, e.message);
    }
  }
  console.log('All assets processed.');
}

run();
