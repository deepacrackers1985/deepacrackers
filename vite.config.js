import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure combo banners from user upload are placed in public
try {
  const possible3k = [
    'C:/Users/Gokul Kannan/.gemini/antigravity-ide/brain/ae0d2c74-6f23-4f2e-b05d-e0caaa24c023/.tempmediaStorage/media_1789281135153.jpg',
    'C:/Users/Gokul Kannan/.gemini/antigravity-ide/brain/ae0d2c74-6f23-4f2e-b05d-e0caaa24c023/.user_uploaded/media_1789280913302.jpg',
  ];
  const pubDir = path.resolve(__dirname, 'public');
  for (const src of possible3k) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(pubDir, 'combo_banner_3000.jpg'));
      fs.copyFileSync(src, path.join(pubDir, 'combo_banner_3000_portrait.jpg'));
      break;
    }
  }
  // Copy new Tamil Deepa Vedi Kadai logo
  const logoUpload = 'C:/Users/Gokul Kannan/.gemini/antigravity-ide/brain/ae0d2c74-6f23-4f2e-b05d-e0caaa24c023/.user_uploaded/media_1789282839093.png';
  if (fs.existsSync(logoUpload)) {
    fs.copyFileSync(logoUpload, path.join(pubDir, 'logo.png'));
    fs.copyFileSync(logoUpload, path.join(pubDir, 'deepa_logo.png'));
  }
} catch (err) {
  // safe fallback
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  plugins: [react(), tailwindcss()],
})

