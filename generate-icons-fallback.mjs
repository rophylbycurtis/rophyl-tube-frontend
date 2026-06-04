// Generates minimal valid PNG icons with no dependencies
import { writeFileSync } from 'fs'

function createMinimalPNG(size) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function crc32(buf) {
    let crc = 0xffffffff
    const table = []
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[i] = c
    }
    for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
    return (crc ^ 0xffffffff) >>> 0
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const t = Buffer.from(type)
    const crcBuf = Buffer.concat([t, data])
    const c = Buffer.alloc(4)
    c.writeUInt32BE(crc32(crcBuf))
    return Buffer.concat([len, t, data, c])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)   // width
  ihdr.writeUInt32BE(size, 4)   // height
  ihdr[8] = 8                   // bit depth
  ihdr[9] = 2                   // color type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  // Create pixel data — red square with a white circle
  const rows = []
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.35

  for (let y = 0; y < size; y++) {
    const row = [0] // filter byte
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (dist < r) {
        // White circle (play button area)
        const angle = Math.atan2(y - cy, x - cx)
        const inTriangle =
          x > cx - r * 0.3 &&
          x < cx + r * 0.5 &&
          Math.abs(y - cy) < (cx + r * 0.5 - x) * 0.7
        if (inTriangle) {
          row.push(255, 255, 255) // white
        } else {
          row.push(232, 0, 29)   // brand red
        }
      } else {
        row.push(6, 6, 8)       // dark bg
      }
    }
    rows.push(Buffer.from(row))
  }

  // Compress with zlib (deflate)
  const { deflateSync } = await import('zlib')
  const raw = Buffer.concat(rows)

  return new Promise((resolve) => {
    const { deflateSync } = require('zlib')
    const compressed = Buffer.from(
      // Simple uncompressed deflate blocks
      (() => {
        const { deflateSync } = require('zlib')
        return deflateSync(raw)
      })()
    )

    const idat = chunk('IDAT', compressed)
    const iend = chunk('IEND', Buffer.alloc(0))
    resolve(Buffer.concat([sig, chunk('IHDR', ihdr), idat, iend]))
  })
}

// Actually — simplest approach: write an SVG and convert to PNG description
// Just write SVG files that browsers accept as icons

import { writeFileSync, mkdirSync } from 'fs'

mkdirSync('public', { recursive: true })

const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#060608"/>
  <rect x="${size*0.1}" y="${size*0.1}" width="${size*0.8}" height="${size*0.8}"
        rx="${size*0.15}" fill="#E8001D"/>
  <polygon points="
    ${size*0.38},${size*0.32}
    ${size*0.72},${size*0.5}
    ${size*0.38},${size*0.68}
  " fill="white"/>
</svg>
`.trim()

writeFileSync('public/icon-192.svg', svgIcon(192))
writeFileSync('public/icon-512.svg', svgIcon(512))
console.log('SVG icons written to public/')
console.log('Now convert them to PNG at https://svgtopng.com or use the SVGs directly')