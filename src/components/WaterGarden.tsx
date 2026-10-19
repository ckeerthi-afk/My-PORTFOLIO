// @ts-nocheck
import { useEffect, useRef } from 'react'

function rand(seed) { const x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x) }
function range(n, fn) { let o = ''; for (let i = 0; i < n; i++) o += fn(i); return o }
function sway(amp = 3, dur = 8, delay = 0, inner) { return '<g class="ng-sway" style="--amp:' + amp + 'deg;--dur:' + dur + 's;--delay:' + -delay + 's">' + inner + '</g>' }
function dots(seed, count, color, width, height) {
  return '<g fill="' + color + '">' + range(count, (i) => {
    const r = 1.4 + rand(seed + i * 3) * 2.2
    const style = '--dur:' + (3 + rand(seed + i * 7) * 4) + 's;--delay:' + -rand(seed + i * 11) * 6 + 's'
    return '<circle class="ng-twinkle" style="' + style + '" cx="' + rand(seed + i) * width + '" cy="' + rand(seed + i * 5 + 1) * height + '" r="' + r + '"/>'
  }) + '</g>'
}
function bell(bud) {
  let s = '<g><g filter="url(#ng-glow)">'
  s += bud ? '<path d="M -9 0 C -24 -22 -20 -52 0 -74 C 20 -52 24 -22 9 0 Z" fill="#f3fbee"/>'
    : '<path d="M -10 0 C -28 -14 -44 -50 -46 -92 L -30 -80 L -15 -100 L 0 -84 L 15 -100 L 30 -80 L 46 -92 C 44 -50 28 -14 10 0 Z" fill="#f4fbef"/><ellipse cx="0" cy="-86" rx="26" ry="5" fill="#dff2d6"/>'
  s += '</g><g stroke="#cfeac3" stroke-width="2" fill="none" stroke-linecap="round">'
  s += bud ? '<path d="M 0 -4 L 0 -66"/>' : '<path d="M 0 -4 L 0 -82"/><path d="M -6 -4 Q -20 -40 -30 -78"/><path d="M 6 -4 Q 20 -40 30 -78"/>'
  s += '</g>'
  if (!bud) s += '<g fill="#f6d43a"><path d="M 0 -84 L 0 -104" stroke="#f6d43a" stroke-width="2.5"/><circle cx="-5" cy="-106" r="2.6"/><circle cx="0" cy="-110" r="2.6"/><circle cx="5" cy="-106" r="2.6"/></g>'
  s += '<path d="M -10 -2 Q -24 -18 -32 -32 Q -14 -26 -3 -8 Z" fill="#3e9f4b"/><path d="M 10 -2 Q 24 -18 32 -32 Q 14 -26 3 -8 Z" fill="#3e9f4b"/><path d="M -14 -6 C -24 4 -16 16 -6 14 L 0 8 L 6 14 C 16 16 24 4 14 -6 Q 0 2 -14 -6 Z" fill="#2c8a3c"/></g>'
  return s
}
function magnoliaFlower() {
  return '<g><g filter="url(#ng-glow)"><path d="M -4 -14 C -46 -12 -62 -62 -42 -82 C -26 -94 -8 -70 -4 -14 Z" fill="#eef3f6"/><path d="M 4 -14 C 46 -12 62 -62 42 -82 C 26 -94 8 -70 4 -14 Z" fill="#eef3f6"/><path d="M -12 -16 C -32 -60 -24 -98 0 -100 C 24 -98 32 -60 12 -16 Z" fill="#fbfdfe"/></g><ellipse cx="0" cy="-22" rx="16" ry="8" fill="#bfe1f8" opacity="0.85"/><path d="M -14 0 Q -22 -14 -8 -22 L 8 -22 Q 22 -14 14 0 Z" fill="#79bdee"/></g>'
}
function magnoliaBud() {
  return '<g><path d="M -9 0 C -16 -16 -10 -32 0 -36 C 10 -32 16 -16 9 0 Z" fill="#f4f9fc" filter="url(#ng-glow-soft)"/><path d="M -9 0 C -12 -10 -6 -16 0 -18 C 6 -16 12 -10 9 0 Z" fill="#7cc0ef"/></g>'
}
function tulipHead(white) {
  return '<g><path d="M -38 -4 C -42 -54 -30 -84 0 -84 C 30 -84 42 -54 38 -4 C 30 12 -30 12 -38 -4 Z" fill="' + (white ? '#fdfcff' : '#f2b6d8') + '" filter="url(#ng-glow)"/>' +
    (white ? '<path d="M -22 -64 q 5.5 -7 11 0 t 11 0 t 11 0 t 11 0" stroke="#cdc7f4" stroke-width="5" fill="none" stroke-linecap="round"/>' : '<ellipse cx="-4" cy="-60" rx="22" ry="14" fill="#f8d3e8"/>') + '</g>'
}
function daisyHead() {
  return '<g><g filter="url(#ng-glow)">' + range(18, (i) => '<ellipse cx="0" cy="-28" rx="6.5" ry="19" fill="#ffffff" transform="rotate(' + i * 20 + ')"/>') + '</g><circle r="15" fill="#e8d84a"/><circle r="12" fill="#f5e75e"/></g>'
}

const clusters = [
  { d: 'M60 560 C 70 470 90 400 120 330 M 92 410 C 60 380 40 340 28 300 M 120 330 C 132 280 150 250 168 212', flowers: [[28, 300, -25, 0.78], [120, 330, 0, 0.9], [168, 212, 10, 0.95]], buds: [[75, 385, -40]] },
  { d: 'M240 560 C 230 480 250 420 282 372 M 256 432 C 300 420 330 400 362 360 M 282 372 C 272 322 252 282 232 240', flowers: [[232, 240, -10, 0.9], [282, 372, 10, 1.0], [362, 360, 30, 0.85]], buds: [[312, 410, 40]] },
  { d: 'M150 560 C 160 520 180 490 205 468', flowers: [[205, 468, 15, 0.95]] },
  { d: 'M400 560 C 380 520 345 495 312 482', flowers: [[312, 482, -30, 0.9]] },
  { d: 'M10 560 C 20 520 30 500 40 488', flowers: [[40, 488, 8, 0.85]] },
]

const W = 1600, H = 520, COUNT = 28, VH = 390, VY = H - VH
const plants = []
for (let i = 0; i < COUNT; i++) {
  const r = rand(i + 100)
  plants.push({ kind: r < 0.3 ? 'bell' : r < 0.36 ? 'bud' : r < 0.68 ? 'tulip' : 'daisy', x: (i + 0.5) * (W / COUNT) + (rand(i + 300) - 0.5) * 30, y: 440 + rand(i + 200) * 70, s: (0.75 + rand(i + 400) * 0.3) * 0.7, tilt: (rand(i + 500) - 0.5) * 10, white: rand(i + 600) > 0.2, seed: i })
}
plants.sort((a, b) => a.y - b.y)
const blades = Array.from({ length: 16 }, (_, b) => ({ x: (b + 0.5) * (W / 16) + (rand(b + 700) - 0.5) * 40, h: 70 + rand(b + 710) * 110, lean: (rand(b + 720) - 0.5) * 90, color: ['#1d5aa3', '#2468b8', '#1a4f92'][b % 3] }))
const auraY = { bell: -50, bud: -36, tulip: -42, daisy: 0 }

function plantView(p, index) {
  const len = (H + 60 - p.y) / p.s, side = p.seed % 2 ? 1 : -1
  let inner = '<circle data-aura="' + index + '" cy="' + auraY[p.kind] + '" r="78" fill="url(#ng-aura)" opacity="0"/>'
  if (p.kind === 'bell' || p.kind === 'bud') {
    inner += '<path d="M 0 10 Q ' + side * 6 + ' ' + len * 0.5 + ' 0 ' + len + '" stroke="#3a9945" stroke-width="' + (p.kind === 'bud' ? 5 : 6) + '" fill="none" stroke-linecap="round"/>' + sway(3.5, 5 + rand(p.seed + 2) * 3, rand(p.seed + 6) * 5, bell(p.kind === 'bud'))
  } else if (p.kind === 'tulip') {
    inner += '<path d="M 0 0 Q ' + side * 8 + ' ' + len * 0.5 + ' 0 ' + len + '" stroke="#4f9a6a" stroke-width="7" fill="none"/>' + tulipHead(p.white)
  } else {
    inner += '<path d="M 0 0 Q ' + side * 10 + ' ' + len * 0.5 + ' ' + -side * 4 + ' ' + len + '" stroke="#69b347" stroke-width="5" fill="none"/><path d="M ' + side * 3 + ' 90 Q ' + side * 30 + ' 70 ' + side * 44 + ' 84 Q ' + side * 26 + ' 100 ' + side * 3 + ' 96 Z" fill="#78c255"/>' + daisyHead()
  }
  return '<g transform="translate(' + p.x + ' ' + p.y + ') rotate(' + p.tilt + ') scale(' + p.s + ')">' + sway(2.2 + rand(p.seed + 50) * 1.8, 7 + rand(p.seed + 51) * 4, rand(p.seed + 52) * 8, '<g data-body="' + index + '" style="transition:none">' + inner + '</g>') + '</g>'
}

function garden() {
  let s = '<svg class="ng-garden" viewBox="0 ' + VY + ' ' + W + ' ' + VH + '" preserveAspectRatio="xMidYMax slice" role="img" aria-label="A night garden of campanula, magnolia, tulips and daisies swaying in the breeze">' +
    '<defs><filter id="ng-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="blur"/><feFlood flood-color="#ffffff" flood-opacity="0.4"/><feComposite in2="blur" operator="in" result="halo"/><feMerge><feMergeNode in="halo"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="ng-glow-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/><feFlood flood-color="#ffffff" flood-opacity="0.3"/><feComposite in2="blur" operator="in" result="halo"/><feMerge><feMergeNode in="halo"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<linearGradient id="ng-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2677cf"/><stop offset="1" stop-color="#3794e0"/></linearGradient>' +
    '<radialGradient id="ng-aura"><stop offset="0" stop-color="#fffbe0" stop-opacity="0.5"/><stop offset="0.45" stop-color="#fff2a8" stop-opacity="0.3"/><stop offset="1" stop-color="#fff2a8" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#ng-night)"/>' +
    '<g transform="translate(0 ' + VY + ')">' + dots(21, 50, '#fff', W, VH * 0.5) + '</g>' +
    '<g transform="translate(14 ' + (VY + 2) + ')"><circle cx="1482" cy="68" r="46" fill="#fffbe0" opacity="0.12"/><path d="M 1482 50 A 22 22 0 1 0 1504 84 A 17 17 0 1 1 1482 50 Z" fill="#fbfbf5" filter="url(#ng-glow-soft)" class="ng-breathe"/></g>'
  ;[0, 400, 800, 1200].forEach((ox, k) => {
    s += '<g transform="translate(' + ox + ' 250)">'
    clusters.forEach((c, j) => {
      if (!(j < 2 || (j + k) % 2 === 0)) return
      let inner = '<path d="' + c.d + '" stroke="#22457c" stroke-width="7" fill="none" stroke-linecap="round"/>'
      ;(c.buds || []).forEach((bd) => { inner += '<g transform="translate(' + bd[0] + ' ' + bd[1] + ') rotate(' + bd[2] + ')">' + magnoliaBud() + '</g>' })
      c.flowers.forEach((f, n) => { inner += '<g transform="translate(' + f[0] + ' ' + f[1] + ') rotate(' + f[2] + ') scale(' + f[3] * 0.7 + ')">' + sway(3, 6 + rand(j * 5 + n + k) * 3, rand(j * 3 + n + k) * 6, magnoliaFlower()) + '</g>' })
      s += sway(1.6 + rand(j + k * 9 + 30) * 1.2, 9 + rand(j + k + 31) * 4, rand(j + k * 4 + 32) * 8, inner)
    })
    s += '</g>'
  })
  blades.forEach((bl, n) => {
    s += sway(2, 10 + (n % 5), n * 1.3, '<path d="M ' + (bl.x - 22) + ' ' + (H + 40) + ' Q ' + (bl.x - 30) + ' ' + (H + 40 - bl.h * 0.5) + ' ' + (bl.x + bl.lean) + ' ' + (H + 40 - bl.h) + ' Q ' + (bl.x + 30) + ' ' + (H + 40 - bl.h * 0.5) + ' ' + (bl.x + 22) + ' ' + (H + 40) + ' Z" fill="' + bl.color + '" opacity="0.85"/>')
  })
  plants.forEach((p, n) => { s += plantView(p, n) })
  return s + '</svg>'
}

const CAN_W = 140, CAN_H = 112, CAN_CX = 80, CAN_CY = 60, CAN_TILT = -32, CAN_SCALE = 0.6
const ROSE = { x: 5, y: 55 }, rad = (CAN_TILT * Math.PI) / 180
const TIP_X = (CAN_CX + (ROSE.x - CAN_CX) * Math.cos(rad) - (ROSE.y - CAN_CY) * Math.sin(rad)) * CAN_SCALE
const TIP_Y = (CAN_CY + (ROSE.x - CAN_CX) * Math.sin(rad) + (ROSE.y - CAN_CY) * Math.cos(rad)) * CAN_SCALE
function wateringCan() {
  return '<svg width="' + CAN_W * CAN_SCALE + '" height="' + CAN_H * CAN_SCALE + '" viewBox="0 0 ' + CAN_W + ' ' + CAN_H + '" aria-hidden="true" style="display:block"><g transform="rotate(' + CAN_TILT + ' ' + CAN_CX + ' ' + CAN_CY + ')">' +
    '<path d="M 99 46 C 120 44 121 78 99 76" fill="none" stroke="#22457c" stroke-width="7" stroke-linecap="round"/><path d="M 54 38 C 56 14 88 14 92 38" fill="none" stroke="#22457c" stroke-width="7" stroke-linecap="round"/>' +
    '<g filter="url(#ng-glow-soft)"><path d="M 47 74 L 12 60 Q 9 55 12 51 L 47 60 Z" fill="#eef4f6"/><path d="M 47 36 L 97 36 Q 101 36 101 40 L 103 82 Q 103 88 97 88 L 47 88 Q 41 88 41 82 L 43 40 Q 43 36 47 36 Z" fill="#f7fafb"/></g>' +
    '<path d="M 47 69 L 12 57 Q 11 59 12 60 L 47 74 Z" fill="#bfe1f8"/><path d="M 84 36 L 97 36 Q 101 36 101 40 L 103 82 Q 103 88 97 88 L 86 88 Q 92 62 84 36 Z" fill="#d6eaf8"/><path d="M 41.6 78 L 102.6 78 L 103 82 Q 103 88 97 88 L 47 88 Q 41 88 41 82 Z" fill="#79bdee"/>' +
    '<ellipse cx="72" cy="36.5" rx="27" ry="4" fill="#22457c"/><path d="M 14 49 L 7 44 Q 1 55 7 66 L 14 61 Z" fill="#79bdee"/><g fill="#22457c"><circle cx="6" cy="50" r="1"/><circle cx="5" cy="55" r="1"/><circle cx="6" cy="60" r="1"/></g>' +
    '<g transform="translate(66 68)"><path d="M -2 0 C -14 -2 -17 -15 -11 -20 C -6 -23 -2 -16 -2 0 Z" fill="#bfe1f8"/><path d="M 2 0 C 14 -2 17 -15 11 -20 C 6 -23 2 -16 2 0 Z" fill="#bfe1f8"/><path d="M -4 -1 C -9 -14 -6 -25 0 -26 C 6 -25 9 -14 4 -1 Z" fill="#9ccff3"/><path d="M -4 2 Q -6 -3 -2 -5 L 2 -5 Q 6 -3 4 2 Z" fill="#79bdee"/></g>' +
    '<rect x="49" y="44" width="5" height="26" rx="2.5" fill="#ffffff"/></g></svg>'
}
function makeSprite(stops, size) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d'), grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach((s) => grad.addColorStop(s[0], s[1])); g.fillStyle = grad; g.fillRect(0, 0, size, size)
  return c
}

export default function WaterGarden() {
  const stageRef = useRef(null), canvasRef = useRef(null), canRef = useRef(null), gardenRef = useRef(null)
  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current, can = canRef.current, ctx = canvas.getContext('2d')
    gardenRef.current.innerHTML = garden()
    can.innerHTML = wateringCan()
    can.style.transformOrigin = TIP_X + 'px ' + TIP_Y + 'px'
    const bodies = [], auras = []
    stage.querySelectorAll('[data-body]').forEach((el) => { bodies[+el.getAttribute('data-body')] = el })
    stage.querySelectorAll('[data-aura]').forEach((el) => { auras[+el.getAttribute('data-aura')] = el })

    let w = 1, h = 1, k = 1, dpr = 1
    const resize = () => { const r = stage.getBoundingClientRect(); w = r.width; h = r.height; k = w / W; dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr) }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(stage)

    const flySprite = makeSprite([[0, 'rgba(255,255,225,1)'], [0.1, 'rgba(255,238,90,0.95)'], [0.3, 'rgba(255,220,40,0.22)'], [1, 'rgba(255,200,0,0)']], 64)
    const pointer = { x: 0, y: 0, cx: 0, cy: 0, inside: false }
    const n = plants.length
    const vitality = new Float32Array(n), shown = new Float32Array(n), spawned = new Uint8Array(n)
    let drops = [], bubbles = [], beads = [], flies = [], dropDebt = 0
    for (let f = 0; f < 6; f++) flies.push({ x: Math.random() * w, y: Math.random() * h * 0.8, a: Math.random() * Math.PI * 2, speed: 14 + Math.random() * 18, phase: Math.random() * 10, life: Infinity, max: Infinity })

    const onMove = (e) => { const r = stage.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.cx = e.clientX; pointer.cy = e.clientY }
    const enter = (e) => { pointer.inside = true; onMove(e); can.style.opacity = '1' }
    const leave = () => { pointer.inside = false; can.style.opacity = '0' }
    stage.addEventListener('pointerenter', enter); stage.addEventListener('pointerleave', leave); stage.addEventListener('pointermove', onMove)

    let last = performance.now(), raf = 0
    function tick(t) {
      const dt = Math.min(0.05, (t - last) / 1000); last = t
      if (pointer.inside) {
        const bob = Math.sin(t / 260) * 3
        can.style.transform = 'translate(' + (pointer.cx - TIP_X) + 'px, ' + (pointer.cy - TIP_Y) + 'px) rotate(' + bob + 'deg)'
        dropDebt += dt * 240
        while (dropDebt > 1) { dropDebt -= 1; drops.push({ x: pointer.x + (Math.random() - 0.5) * 6, y: pointer.y + (Math.random() - 0.5) * 9, vx: -35 - Math.random() * 85, vy: 20 + Math.random() * 80 }) }
      }
      const next = []
      for (const d of drops) {
        d.vy += 900 * dt; d.x += d.vx * dt; d.y += d.vy * dt
        let hit = false
        for (let i = n - 1; i >= 0; i--) {
          const p = plants[i], px = p.x * k, py = (p.y - VY + auraY[p.kind] * p.s) * k
          if (Math.abs(d.x - px) < 40 * k * p.s && Math.abs(d.y - py) < 45 * k * p.s) {
            vitality[i] = Math.min(1, vitality[i] + 0.05)
            const roll = Math.random()
            if (roll < 0.35 && bubbles.length < 220) {
              const max = 1.2 + Math.random() * 1.4
              bubbles.push({ x: d.x, y: d.y, vx: (Math.random() - 0.5) * 30, vy: -15 - Math.random() * 30, r: 0.8 + Math.random() * 1.8, life: max, max, ph: Math.random() * 6.28 })
            } else if (roll < 0.45 && beads.length < 90) {
              // a little water that stays on the petals, then slowly fades
              const max = 3 + Math.random() * 3
              beads.push({ i, dx: d.x - px, dy: d.y - py, r: 1.2 + Math.random() * 1.6, life: max, max })
            }
            hit = true; break
          }
        }
        if (!hit && d.y < h + 10) next.push(d)
      }
      drops = next
      bubbles = bubbles.filter((b) => { b.life -= dt; b.vy -= 8 * dt; b.x += (b.vx + Math.sin(t / 220 + b.ph) * 10) * dt; b.y += b.vy * dt; b.vx *= 1 - dt * 1.5; return b.life > 0 })
      beads = beads.filter((b) => { b.life -= dt; b.dy += dt * 1.5; return b.life > 0 })

      for (let j = 0; j < n; j++) {
        vitality[j] = Math.max(0, vitality[j] - dt * 0.05)
        const target = vitality[j], prev = shown[j], nv = prev + (target - prev) * Math.min(1, dt * 3)
        shown[j] = nv
        if (Math.abs(nv - prev) > 0.0005 || (nv === 0 && prev !== 0)) {
          if (bodies[j]) bodies[j].style.transform = 'translate(0px, ' + (-18 * nv).toFixed(2) + 'px) scale(' + (1 + 0.16 * nv).toFixed(3) + ')'
          if (auras[j]) auras[j].setAttribute('opacity', (nv * 0.95).toFixed(3))
        }
        const pl = plants[j]
        if (target > 0.6 && !spawned[j] && flies.length < 16) {
          spawned[j] = 1
          if (Math.random() < 0.6) flies.push({ x: pl.x * k, y: (pl.y - VY + auraY[pl.kind] * pl.s) * k, a: Math.random() * Math.PI * 2, speed: 18 + Math.random() * 20, phase: Math.random() * 10, life: 14 + Math.random() * 6, max: 20 })
        } else if (target < 0.2) spawned[j] = 0
      }
      flies = flies.filter((fl) => {
        fl.life -= dt; fl.a += (Math.random() - 0.5) * 5 * dt
        if (fl.x < 12 || fl.x > w - 12 || fl.y < 12 || fl.y > h - 12) fl.a = Math.atan2(h * 0.45 - fl.y, w / 2 - fl.x) + (Math.random() - 0.5)
        fl.x += Math.cos(fl.a) * fl.speed * dt; fl.y += Math.sin(fl.a) * fl.speed * dt * 0.7
        return fl.life > 0
      })

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'; ctx.lineCap = 'round'
      const streak = (width, color, len) => { ctx.lineWidth = width; ctx.strokeStyle = color; ctx.beginPath(); drops.forEach((d) => { ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx * len, d.y - d.vy * len) }); ctx.stroke() }
      streak(3, 'rgba(150,210,255,0.25)', 0.024); streak(1.4, 'rgba(225,245,255,0.9)', 0.018)
      beads.forEach((b) => {
        const p = plants[b.i], lift = shown[b.i] * 18 * k
        const x = p.x * k + b.dx, y = (p.y - VY + auraY[p.kind] * p.s) * k + b.dy - lift
        ctx.globalAlpha = Math.min(1, b.life / 1.2, (b.max - b.life) / 0.2)
        ctx.fillStyle = 'rgba(200,232,255,0.85)'; ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x - b.r * 0.35, y - b.r * 0.35, b.r * 0.35, 0, Math.PI * 2); ctx.fill()
      })
      ctx.lineWidth = 0.8
      bubbles.forEach((b) => {
        ctx.globalAlpha = Math.max(0, Math.min(1, b.life / 0.5, (b.max - b.life) / 0.15))
        ctx.strokeStyle = 'rgba(225,245,255,0.85)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillRect(b.x - b.r * 0.45, b.y - b.r * 0.45, 0.8, 0.8)
      })
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'lighter'
      flies.forEach((fl) => {
        const blink = 0.45 + 0.55 * Math.max(0, Math.sin(t / 700 + fl.phase))
        const fade = fl.max === Infinity ? 1 : Math.min(1, fl.life / 2, (fl.max - fl.life) / 1.5 + 0.2)
        ctx.globalAlpha = blink * fade * 0.6
        const s = 16 + blink * 6
        ctx.drawImage(flySprite, fl.x - s / 2, fl.y - s / 2, s, s)
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); stage.removeEventListener('pointerenter', enter); stage.removeEventListener('pointerleave', leave); stage.removeEventListener('pointermove', onMove) }
  }, [])

  return (
    <>
      <div ref={stageRef} className="ng-stage relative aspect-[1600/390] w-full cursor-none touch-none overflow-hidden">
        <div ref={gardenRef} className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full" />
        <div className="ng-overlay ng-breathe pointer-events-none absolute inset-0" />
        <div className="ng-grain pointer-events-none absolute inset-0" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      </div>
      <div ref={canRef} className="pointer-events-none fixed left-0 top-0 z-50 opacity-0 transition-opacity duration-200 [filter:drop-shadow(0_6px_8px_rgba(18,40,80,0.35))]" />
    </>
  )
}
