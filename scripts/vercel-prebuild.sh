#!/bin/bash
# Vercel POST-build script to reduce node_modules size
# Runs AFTER strapi build completes, before Vercel bundles

echo "🧹 Cleaning node_modules for Vercel deployment (post-build)..."

# Remove build tools (definitely not needed at runtime)
echo "  Removing build tools..."
rm -rf node_modules/@swc 2>/dev/null
rm -rf node_modules/@esbuild 2>/dev/null
rm -rf node_modules/typescript 2>/dev/null
rm -rf node_modules/typescript5 2>/dev/null
rm -rf node_modules/@types 2>/dev/null
rm -rf node_modules/vite 2>/dev/null
rm -rf node_modules/@vercel/nft 2>/dev/null
rm -rf node_modules/@vercel/build-utils 2>/dev/null

# Remove duplicate sharp binaries (keep only linux-x64-gnu)
echo "  Removing duplicate sharp binaries..."
rm -rf node_modules/@img/sharp-libvips-linuxmusl-x64 2>/dev/null
rm -rf node_modules/@img/sharp-linux-arm* 2>/dev/null
rm -rf node_modules/@img/sharp-darwin-* 2>/dev/null
rm -rf node_modules/@img/sharp-win32-* 2>/dev/null

# Remove heavy intl package (likely unused)
echo "  Removing @formatjs/intl-displaynames..."
rm -rf node_modules/@formatjs/intl-displaynames 2>/dev/null

# NUCLEAR: Remove video players (40MB) - uncomment if you don't use video features
echo "  Removing video player packages..."
rm -rf node_modules/@mux 2>/dev/null
rm -rf node_modules/hls.js 2>/dev/null

# NUCLEAR: Remove date-fns ESM build (17MB) - we only use CJS
echo "  Removing date-fns ESM build..."
rm -rf node_modules/date-fns/esm 2>/dev/null

# Remove source maps and TypeScript definitions (safe to remove)
echo "  Removing .map and .d.ts files..."
find node_modules -name "*.map" -type f -delete 2>/dev/null
find node_modules -name "*.d.ts" -type f -delete 2>/dev/null

# Remove test directories (safe to remove)
echo "  Removing test directories..."
find node_modules -type d \( -name "test" -o -name "tests" -o -name "__tests__" \) -exec rm -rf {} + 2>/dev/null

# Remove docs (safe to remove)
echo "  Removing documentation files..."
find node_modules -name "*.md" -type f -delete 2>/dev/null
find node_modules -name "LICENSE*" -type f -delete 2>/dev/null
find node_modules -name "CHANGELOG*" -type f -delete 2>/dev/null

# Conservative: Only remove .ts files in specific known build tool directories
echo "  Removing TypeScript source files from build tools..."
rm -rf node_modules/@strapi/strapi/lib/commands/*.ts 2>/dev/null

echo "✅ Cleanup complete!"
du -sh node_modules 2>/dev/null | awk '{print "📦 node_modules size: " $1}'
