import { gzipSync } from 'node:zlib'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ASSETS_DIR = join(process.cwd(), 'dist', 'assets')

const BUDGETS = [
  { label: 'react-vendor', prefix: 'react-vendor-', ext: '.js', maxGzipBytes: 200 * 1024 },
  { label: 'data-vendor', prefix: 'data-vendor-', ext: '.js', maxGzipBytes: 55 * 1024 },
  { label: 'markdown-vendor', prefix: 'markdown-vendor-', ext: '.js', maxGzipBytes: 95 * 1024 },
  { label: 'ui-vendor', prefix: 'ui-vendor-', ext: '.js', maxGzipBytes: 35 * 1024 },
  { label: 'animation-vendor', prefix: 'animation-vendor-', ext: '.js', maxGzipBytes: 50 * 1024 },
  { label: 'main-css', prefix: 'index-', ext: '.css', maxGzipBytes: 20 * 1024 },
]

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`
}

function findAssetFile(files, prefix, ext) {
  const matches = files.filter((name) => name.startsWith(prefix) && name.endsWith(ext))
  if (matches.length === 0) return null
  matches.sort()
  return matches[matches.length - 1]
}

function getGzipSize(filePath) {
  const content = readFileSync(filePath)
  return gzipSync(content).length
}

function main() {
  let files
  try {
    files = readdirSync(ASSETS_DIR)
  } catch {
    console.error(`Performance budget check failed: directory not found: ${ASSETS_DIR}`)
    console.error('Run `pnpm build` before `pnpm performance:budget`.')
    process.exit(1)
  }

  const results = []
  let hasErrors = false

  for (const budget of BUDGETS) {
    const filename = findAssetFile(files, budget.prefix, budget.ext)

    if (!filename) {
      hasErrors = true
      results.push({
        name: budget.label,
        file: '(missing)',
        actual: null,
        budget: budget.maxGzipBytes,
        status: 'MISSING',
      })
      continue
    }

    const fullPath = join(ASSETS_DIR, filename)
    const gzipBytes = getGzipSize(fullPath)
    const passed = gzipBytes <= budget.maxGzipBytes

    if (!passed) hasErrors = true

    results.push({
      name: budget.label,
      file: filename,
      actual: gzipBytes,
      budget: budget.maxGzipBytes,
      status: passed ? 'PASS' : 'FAIL',
    })
  }

  console.log('Performance Budget Report (gzip)')
  console.log('')

  for (const row of results) {
    const actual = row.actual === null ? 'N/A' : formatKb(row.actual)
    const budget = formatKb(row.budget)
    const file = row.file.padEnd(40)
    console.log(
      `[${row.status}] ${row.name.padEnd(18)} ${actual.padEnd(12)} / ${budget.padEnd(12)} ${file}`,
    )
  }

  console.log('')

  if (hasErrors) {
    console.error('Performance budget check failed.')
    process.exit(1)
  }

  console.log('All performance budgets passed.')
}

main()
