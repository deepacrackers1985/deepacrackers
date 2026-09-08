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
  const uploadedDir = 'C:/Users/Gokul Kannan/.gemini/antigravity-ide/brain/eced3f90-77ef-4b8e-9727-d0bc2b474170/.user_uploaded'
  if (fs.existsSync(uploadedDir)) {
    const pubDir = path.resolve(__dirname, 'public')
    const f1 = path.join(uploadedDir, 'media_1788876247793.jpg')
    const f2 = path.join(uploadedDir, 'media_1788876256353.png')
    if (fs.existsSync(f1)) {
      fs.copyFileSync(f1, path.join(pubDir, 'combo_banner_3000.jpg'))
    }
    if (fs.existsSync(f2)) {
      fs.copyFileSync(f2, path.join(pubDir, 'combo_banner_2000.png'))
    }
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

