#!/bin/bash
echo "Starting custom build process..."

# Build normal
echo "Running vite build..."
pnpm vite build

# Verificar que los archivos de contenido estén en dist
echo "Verifying content files..."
ls -la dist/content/blog/es/ || echo "ERROR: No content files found!"

# Crear un manifiesto de archivos para debugging
echo "Creating file manifest..."
find dist/content -name "*.md" > dist/file-manifest.txt

echo "Build process completed!"
