// Simple script to generate placeholder PWA icons
// Run with: node generate-icons.mjs
import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#060608'
  ctx.fillRect(0, 0, size, size)

  // Red rounded rect
  const padding = size * 0.12
  const radius = size * 0.18
  ctx.fillStyle = '#E8001D'
  ctx.beginPath()
  ctx.roundRect(padding, padding, size - padding * 2, size - padding * 2, radius)
  ctx.fill()

  // Play triangle
  ctx.fillStyle = '#ffffff'
  const cx = size / 2
  const cy = size / 2
  const tw = size * 0.28
  const th = size * 0.32
  ctx.beginPath()
  ctx.moveTo(cx - tw * 0.4, cy - th / 2)
  ctx.lineTo(cx + tw * 0.6, cy)
  ctx.lineTo(cx - tw * 0.4, cy + th / 2)
  ctx.closePath()
  ctx.fill()

  writeFileSync(outputPath, canvas.toBuffer('image/png'))
  console.log(`Generated ${outputPath}`)
}

generateIcon(192, 'public/icon-192.png')
generateIcon(512, 'public/icon-512.png')