// Compile design/theme.tailwind.css with the project's installed tailwindcss (4.3.1)
// and assert the utilities and the mode overrides actually come out.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'

const repo = fileURLToPath(new URL('../../', import.meta.url)).replace(/\/$/, '')
const base = repo
const req = createRequire(base + '/package.json')
const mod = await import(pathToFileURL(req.resolve('tailwindcss')).href)
const compile = mod.compile ?? mod.default.compile
const twDir = req.resolve('tailwindcss').replace(/\/dist\/[^/]+$/, '')
const themeCss = readFileSync(repo + '/design/tokens/theme.tailwind.css', 'utf8')
const indexCss = readFileSync(repo + '/src/styles/index.css', 'utf8')

const loadStylesheet = async (id) => {
  if (id === 'tailwindcss') {
    const p = twDir + '/index.css'
    return { path: p, base: twDir, content: readFileSync(p, 'utf8') }
  }
  const p = new URL(id.replace(/^\.\//, ''), 'file://' + base + '/').pathname
  return { path: p, base: base, content: readFileSync(p, 'utf8') }
}

// Tailwind v4 only emits the theme variables a utility actually uses, so every
// colour token needs a candidate or it never reaches the output to be compared.
const colorNames = [...themeCss.matchAll(/--color-([\w-]+):/g)].map(m => m[1])
const candidates = [
  'bg-primary', 'text-text-primary', 'border-border',
  'rounded-card', 'rounded-pill', 'text-h1-hero', 'text-body-sm',
  'p-section-x', 'gap-hero-y', 'font-sans',
  ...colorNames.map(n => 'bg-' + n),
]

const themeOut = (await compile("@import 'tailwindcss';\n" + themeCss, { base, loadStylesheet }))
  .build(candidates)
const indexOut = (await compile(indexCss, { base, loadStylesheet }))
  .build(candidates)

const checks = [
  ['.bg-primary', 'background-color: var(--color-primary)'],
  ['.text-text-primary', 'color: var(--color-text-primary)'],
  ['.border-border', 'border-color: var(--color-border)'],
  ['.rounded-card', 'border-radius: var(--radius-card)'],
  ['.rounded-pill', 'border-radius: var(--radius-pill)'],
  ['.text-h1-hero', 'font-size: var(--text-h1-hero)'],
  ['.text-body-sm', 'font-size: var(--text-body-sm)'],
  ['.p-section-x', 'padding: var(--spacing-section-x)'],
  ['.gap-hero-y', 'gap: var(--spacing-hero-y)'],
]
let bad = 0
for (const [sel, decl] of checks) {
  const ok = themeOut.includes(sel) && themeOut.includes(decl)
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${sel.padEnd(22)} ${decl}`)
}

// mode ladders: mobile base, tablet 768, desktop 1280
for (const [mq, val] of [['768px', '64px'], ['1280px', '96px']]) {
  const i = themeOut.indexOf(`@media (min-width: ${mq})`)
  const slice = i < 0 ? '' : themeOut.slice(i, i + 4000)
  const ok = i >= 0 && slice.includes(`--text-h1-hero: ${val}`)
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} min-width ${mq.padEnd(8)} --text-h1-hero: ${val}`)
}

// the tokens the project already has must keep their exact value, per mode
function decls(css, selectorRe) {
  const out = {}
  let i = 0
  while ((i = css.search(selectorRe)) >= 0) {
    const start = css.indexOf('{', i)
    let depth = 0, k = start
    for (; k < css.length; k++) {
      if (css[k] === '{') depth++
      else if (css[k] === '}') { depth--; if (depth === 0) break }
    }
    const body = css.slice(start + 1, k)
    for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] ??= m[2].trim()
    css = css.slice(k + 1)
  }
  return out
}

const idxLight = decls(indexOut, /:root/)
const idxDark = decls(indexOut, /\.dark\b/)
const thLight = decls(themeOut, /:root/)
const thDark = decls(themeOut, /\.dark\b/)

const shared = ['--color-primary', '--color-surface', '--color-surface-card', '--color-text-primary',
  '--color-text-tertiary', '--color-border', '--font-sans']
for (const v of shared) {
  const a = idxLight[v], b = thLight[v]
  const ok = a && b && a === b
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} light ${v.padEnd(24)} index.css=${a}  theme=${b}`)
}
for (const v of ['--color-surface', '--color-text-primary', '--color-border', '--shadow-glow-primary']) {
  const a = idxDark[v], b = thDark[v]
  const ok = a && b && a === b
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'} dark  ${v.padEnd(24)} index.css=${a}  theme=${b}`)
}

console.log(`\n${bad === 0 ? 'PASS' : 'FAIL'} — ${checks.length + 2 + shared.length} checks, ${bad} failed`)
process.exit(bad === 0 ? 0 : 1)
