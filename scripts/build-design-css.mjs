import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import prefixwrap from 'postcss-prefixwrap'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const designDir = path.join(root, 'design')

function resolveHtml(name) {
  const inDesign = path.join(designDir, name)
  if (fs.existsSync(inDesign)) return inDesign
  const legacy = path.join(process.env.USERPROFILE || '', 'Desktop', name)
  if (fs.existsSync(legacy)) return legacy
  const legacySpace = path.join(process.env.USERPROFILE || '', 'Desktop', name.replace('.html', ' .html'))
  if (fs.existsSync(legacySpace)) return legacySpace
  throw new Error(`HTML bulunamadı: ${name} (design/ veya Masaüstü)`)
}

function extractStyle(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8')
  const m = html.match(/<style>([\s\S]*?)<\/style>/)
  if (!m) throw new Error(`No <style> in ${htmlPath}`)
  return m[1].trim()
}

async function buildLanding() {
  let css = extractStyle(resolveHtml('fikirge-landing.html'))
  // :root — globals.css ile uyumlu, tekrarı kaldır
  css = css.replace(/:root\s*\{[\s\S]*?\}\s*/m, '')
  css = css.replace(/html\s*\{\s*scroll-behavior:\s*smooth;\s*\}\s*/m, '')
  css = css.replace(/body::before/g, 'SELF::before')
  css = css.replace(/body\s*\{/g, 'SELF {')
  const wrapped = await postcss([prefixwrap('#landing')]).process(css, {
    from: undefined,
  })
  let out = wrapped.css
  out = out.replace(/#landing SELF::before/g, '#landing::before')
  out = out.replace(/#landing SELF \{/g, '#landing {')
  const header = `/* Otomatik üretildi: scripts/build-design-css.mjs (landing) */\n`
  fs.writeFileSync(
    path.join(process.cwd(), 'app/styles/landing-scoped.css'),
    header + out,
    'utf8'
  )
}

async function buildDashboard() {
  let css = extractStyle(resolveHtml('fikirge-dashboard.html'))
  css = css.replace(/:root\s*\{[\s\S]*?\}\s*/m, '')
  css = css.replace(/html,\s*body\s*\{\s*height:\s*100%;\s*\}\s*/m, '')
  css = css.replace(/body\s*\{/g, 'SELF {')
  const wrapped = await postcss([prefixwrap('#db-root')]).process(css, {
    from: undefined,
  })
  let out = wrapped.css
  out = out.replace(/#db-root SELF \{/g, '#db-root {')
  const header = `/* Otomatik üretildi: scripts/build-design-css.mjs (dashboard) */\n`
  fs.writeFileSync(
    path.join(process.cwd(), 'app/styles/dashboard-scoped.css'),
    header + out,
    'utf8'
  )
}

await buildLanding()
await buildDashboard()
console.log('landing-scoped.css + dashboard-scoped.css yazıldı.')
