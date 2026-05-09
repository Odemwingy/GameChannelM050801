import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sourceFiles = [
  '列表页前端/横屏状态.html',
  '列表页前端/竖屏状态.html',
  ...readdirSync('详情页前端')
    .filter((file) => file.endsWith('.html'))
    .map((file) => join('详情页前端', file)),
].filter((file) => existsSync(file))

const outDir = 'public/assets/source'
const mimeExt = {
  png: 'png',
  jpeg: 'jpg',
  jpg: 'jpg',
  webp: 'webp',
  'svg+xml': 'svg',
  'x-icon': 'ico',
}

mkdirSync(outDir, { recursive: true })

const seen = new Map()
const imagePattern = /data:image\/(png|jpe?g|webp|svg\+xml|x-icon);base64,([A-Za-z0-9+/=]+)/g

for (const file of sourceFiles) {
  const html = readFileSync(file, 'utf8')
  let match

  while ((match = imagePattern.exec(html))) {
    const [, mime, base64] = match
    const buffer = Buffer.from(base64, 'base64')
    const hash = createHash('sha1').update(buffer).digest('hex').slice(0, 12)
    const existing = seen.get(hash)

    if (existing) {
      existing.count += 1
      continue
    }

    const name = `source-${String(seen.size + 1).padStart(3, '0')}-${hash}.${mimeExt[mime]}`
    writeFileSync(join(outDir, name), buffer)
    seen.set(hash, {
      name,
      path: `/assets/source/${name}`,
      mime: `image/${mime}`,
      bytes: buffer.length,
      count: 1,
    })
  }
}

const manifest = [...seen.values()]
  .sort((a, b) => b.bytes - a.bytes)

writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Extracted ${manifest.length} unique images into ${outDir}`)
