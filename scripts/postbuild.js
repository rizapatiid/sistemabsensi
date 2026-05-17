/**
 * Postbuild script untuk menyalin file yang diperlukan ke direktori standalone.
 * Dijalankan setelah `next build` dengan output: 'standalone'.
 * 
 * Next.js standalone TIDAK otomatis menyertakan:
 * - Prisma query engine binary (.prisma/client)
 * - File statis (.next/static)
 * - Folder public
 */

const fs = require('fs')
const path = require('path')

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`[postbuild] Skipping (not found): ${src}`)
    return
  }
  fs.mkdirSync(dest, { recursive: true })
  fs.cpSync(src, dest, { recursive: true, force: true })
  console.log(`[postbuild] Copied: ${src} → ${dest}`)
}

const root = path.join(__dirname, '..')
const standaloneDir = path.join(root, '.next', 'standalone')

console.log('[postbuild] Starting post-build copy...')

// 1. Salin folder public
copyDir(
  path.join(root, 'public'),
  path.join(standaloneDir, 'public')
)

// 2. Salin static files
copyDir(
  path.join(root, '.next', 'static'),
  path.join(standaloneDir, '.next', 'static')
)

// 3. Salin Prisma client dan binary engine (KRITIS untuk standalone)
copyDir(
  path.join(root, 'node_modules', '.prisma'),
  path.join(standaloneDir, 'node_modules', '.prisma')
)

copyDir(
  path.join(root, 'node_modules', '@prisma', 'client'),
  path.join(standaloneDir, 'node_modules', '@prisma', 'client')
)

console.log('[postbuild] Done! Standalone build is ready.')
