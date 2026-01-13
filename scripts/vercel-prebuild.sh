#!/bin/bash
# Vercel pre-build script to reduce node_modules size
# Physically removes files before bundling

echo "🧹 Cleaning node_modules for Vercel deployment..."

# Remove build tools (not needed at runtime)
rm -rf node_modules/@swc
rm -rf node_modules/@esbuild
rm -rf node_modules/typescript
rm -rf node_modules/typescript5
rm -rf node_modules/@types
rm -rf node_modules/vite
rm -rf node_modules/@vercel/node
rm -rf node_modules/@vercel/nft
rm -rf node_modules/@vercel/build-utils

# Remove ESM builds (we use CommonJS)
find node_modules -type d -name "esm" -exec rm -rf {} + 2>/dev/null || true
find node_modules -type d -name "es" -exec rm -rf {} + 2>/dev/null || true
find node_modules -name "*.mjs" -type f -delete 2>/dev/null || true

# Remove docs and dev files
find node_modules -name "*.md" -type f -delete
find node_modules -name "*.ts" -type f ! -name "*.d.ts" -delete
find node_modules -name "LICENSE*" -type f -delete
find node_modules -name "CHANGELOG*" -type f -delete
find node_modules -type d -name "test" -exec rm -rf {} + 2>/dev/null || true
find node_modules -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true
find node_modules -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null || true

# Remove source maps and TypeScript definitions
find node_modules -name "*.map" -type f -delete
find node_modules -name "*.d.ts" -type f -delete

# Remove duplicate sharp binaries (keep only linux-x64, remove musl)
rm -rf node_modules/@img/sharp-libvips-linuxmusl-x64
rm -rf node_modules/@img/sharp-linux-arm
rm -rf node_modules/@img/sharp-linux-arm64
rm -rf node_modules/@img/sharp-darwin-*
rm -rf node_modules/@img/sharp-win32-*

# Remove video players if not used (uncomment if you don't use video)
# rm -rf node_modules/@mux
# rm -rf node_modules/hls.js

# Remove heavy intl data if not needed
rm -rf node_modules/@formatjs/intl-displaynames

# Remove date-fns locales except en, ru, pl, vi, th
find node_modules/date-fns/locale -mindepth 1 -maxdepth 1 -type d ! -name "en*" ! -name "ru*" ! -name "pl*" ! -name "vi*" ! -name "th*" -exec rm -rf {} + 2>/dev/null || true

echo "✅ Cleanup complete!"
du -sh node_modules | awk '{print "📦 node_modules size: " $1}'
