// Copia dist/index.html a dist/404.html para habilitar fallback SPA en Vercel
// y evitar depender de rewrites que puedan interceptar assets.
const fs = require('fs')
const path = require('path')

const distDir = path.resolve(__dirname, '..', 'dist')
const indexPath = path.join(distDir, 'index.html')
const notFoundPath = path.join(distDir, '404.html')

if (!fs.existsSync(distDir)) {
  console.error('dist/ no existe. Ejecuta el build antes del postbuild.')
  process.exit(1)
}

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html no encontrado. Revisa el proceso de build.')
  process.exit(1)
}

fs.copyFileSync(indexPath, notFoundPath)
console.log('Copiado dist/index.html -> dist/404.html')
