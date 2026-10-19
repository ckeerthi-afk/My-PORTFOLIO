import { useEffect, useRef } from 'react'

export type Bloom = { name: string; desc: string; snippet: string }

export const BLOOMS: Record<string, Bloom> = {
  'Human-Centered': { name: 'Human-Centered', desc: 'Every decision starts with the person on the other side of the screen.', snippet: '12 user interviews before a single wireframe' },
  Storyteller: { name: 'Storyteller', desc: 'I turn research into narratives that stakeholders remember and act on.', snippet: 'Insight → story → roadmap' },
  Strategic: { name: 'Strategic', desc: 'Design that connects user value to business outcomes.', snippet: 'Time-to-value as a north-star metric' },
  'Systems Thinker': { name: 'Systems Thinker', desc: 'I see the product as a living system, not a set of screens.', snippet: 'Map flows, not pages' },
  Curious: { name: 'Curious', desc: 'Why does this workflow exist? Asking until the real problem surfaces.', snippet: '5 whys, minimum' },
  Collaborative: { name: 'Collaborative', desc: 'Engineers, PMs and researchers are co-designers, not handoff points.', snippet: 'Design reviews with dev in the room' },
  'Detail Obsessed': { name: 'Detail Obsessed', desc: 'Clarity lives in microcopy, spacing and the empty states nobody plans.', snippet: '4px matters' },
  Experimentation: { name: 'Experimentation', desc: 'Prototype fast, test early, let evidence win arguments.', snippet: 'Hypothesis → prototype → learn' },
  Learner: { name: 'Learner', desc: 'Currently deep in AI patterns, frontend and product strategy.', snippet: 'Always one course in progress' },
  'Research Driven': { name: 'Research Driven', desc: 'Interviews, journey maps and usability tests guide the work.', snippet: 'Evidence over opinion' },
  'Visual Thinker': { name: 'Visual Thinker', desc: 'I sketch to think — diagrams make complexity discussable.', snippet: 'Whiteboard first' },
  'Problem Solver': { name: 'Problem Solver', desc: 'Untangling enterprise workflows into paths people can follow.', snippet: '7 steps → 3 steps' },
  'Empathetic': { name: 'Empathetic', desc: 'I listen for what people mean, not just what they say.', snippet: 'Feelings are data' },
  'Accessibility Advocate': { name: 'Accessibility Advocate', desc: 'Contrast, focus states and screen readers are part of the spec.', snippet: 'WCAG AA by default' },
  'Prototyper': { name: 'Prototyper', desc: 'If it can be clicked, it can be tested.', snippet: 'Code prototypes in a day' },
  'Facilitator': { name: 'Facilitator', desc: 'Workshops that get a room of opinions to one decision.', snippet: 'Post-its to priorities' },
  'Simplifier': { name: 'Simplifier', desc: 'Remove until it breaks, then add one thing back.', snippet: 'Less, but clearer' },
  'Onboarding Nerd': { name: 'Onboarding Nerd', desc: 'The first five minutes decide whether people stay.', snippet: 'Day-one value' },
  'Data Informed': { name: 'Data Informed', desc: 'Analytics show what happens; research shows why.', snippet: 'Numbers + nuance' },
  'AI Explorer': { name: 'AI Explorer', desc: 'Designing trust, guardrails and handoffs for AI features.', snippet: 'Human in the loop' },
  'Writer': { name: 'Writer', desc: 'Words are interface. Good copy removes whole screens.', snippet: 'Microcopy first' },
  'Calm Under Pressure': { name: 'Calm Under Pressure', desc: 'Deadlines move; clear thinking stays.', snippet: 'Ship, then polish' },
  'Advocate': { name: 'Advocate', desc: 'I bring the user\u2019s voice into rooms they\u2019re not in.', snippet: 'Quotes in every deck' },
  'Craftsperson': { name: 'Craftsperson', desc: 'Pixel-level care for the things people touch every day.', snippet: 'Polish is respect' },
  'Mentor': { name: 'Mentor', desc: 'Sharing what I learn so the whole team levels up.', snippet: 'Crits, not critiques' },
  'Playful': { name: 'Playful', desc: 'Delight is a feature, used with restraint.', snippet: 'Tiny moments of joy' },
  'Service Designer': { name: 'Service Designer', desc: 'Seeing the whole journey, on and off the screen.', snippet: 'Frontstage + backstage' },
  'Question Asker': { name: 'Question Asker', desc: 'The right question saves a week of design.', snippet: 'What would make this obvious?' },
  'Bridge Builder': { name: 'Bridge Builder', desc: 'Translating between design, engineering and business.', snippet: 'One shared language' },
  'Motion Minded': { name: 'Motion Minded', desc: 'Movement that explains change instead of decorating it.', snippet: 'Easing with purpose' },
  'Pragmatic': { name: 'Pragmatic', desc: 'The best solution is the one that ships and helps.', snippet: 'Good > perfect' },
  'Inclusive': { name: 'Inclusive', desc: 'Designing for the edges makes the middle better.', snippet: 'Many users, many contexts' },
  'Patient': { name: 'Patient', desc: 'Complex domains take time to understand properly.', snippet: 'Learn the domain first' },
  'Resilient': { name: 'Resilient', desc: 'Feedback is fuel, even when it stings.', snippet: 'Iterate, don\u2019t defend' },
  'Organised': { name: 'Organised', desc: 'Clean files, clear handoffs, no surprises.', snippet: 'Figma you can trust' },
  'Optimistic': { name: 'Optimistic', desc: 'Every messy workflow has a simpler version waiting.', snippet: 'There\u2019s always a way' },
  'Connector': { name: 'Connector', desc: 'Linking insights across teams that never talk.', snippet: 'Dots, joined' },
}
const SKILLS = Object.keys(BLOOMS)

export default function Garden({ onBloom }: { onBloom: (b: Bloom | null) => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const leavesRef = useRef<HTMLDivElement>(null)
  const cb = useRef(onBloom)
  cb.current = onBloom

  useEffect(() => {
    const art = svgRef.current!, leaves = leavesRef.current!
    art.innerHTML = ''; leaves.innerHTML = ''
    const NS = 'http://www.w3.org/2000/svg'
    const C = { stem: '#c9c3d8', leaf: '#ebebe8' }
    const T = { ink: '#17171c', soft: '#8a8790' }
    const EASE = 'cubic-bezier(.22,1,.36,1)'
    const el = (tag: string, attrs: Record<string, any> = {}, style: Record<string, string> = {}) => {
      const e = document.createElementNS(NS, tag) as SVGElement
      for (const k in attrs) e.setAttribute(k, String(attrs[k]))
      for (const s in style) e.style.setProperty(s, style[s])
      return e
    }
    const add = (p: Element, ...c: Element[]) => { c.forEach((x) => p.appendChild(x)); return p }
    const polar = (x: number, y: number, r: number, deg: number) => { const a = ((deg - 90) * Math.PI) / 180; return [x + Math.cos(a) * r, y + Math.sin(a) * r] }
    const star = (x: number, y: number, ro: number, ri: number, rot = 0) => Array.from({ length: 10 }, (_, i) => polar(x, y, i % 2 ? ri : ro, rot + i * 36).join(',')).join(' ')
    const pts = (l: number[][]) => l.map((p) => p.join(',')).join(' ')

    function Leaf(base: number[], tip: number[], w: number) {
      const [x1, y1] = base, dx = (tip[0] - x1) * 0.6, dy = (tip[1] - y1) * 0.6
      w *= 0.6
      const len = Math.hypot(dx, dy), nx = (-dy / len) * w, ny = (dx / len) * w, mx = x1 + dx * 0.45, my = y1 + dy * 0.45
      const d = `M${x1},${y1} Q${mx + nx},${my + ny} ${x1 + dx},${y1 + dy} Q${mx - nx * 0.7},${my - ny * 0.7} ${x1},${y1} Z`
      return add(el('g'), el('path', { d, fill: C.leaf, class: 'leaf-flutter' }, { 'transform-origin': `${x1}px ${y1}px`, 'animation-delay': -(x1 % 7) + 's' }),
        el('line', { x1, y1, x2: x1 + dx * 0.92, y2: y1 + dy * 0.92, stroke: C.stem, 'stroke-width': 2.5, 'stroke-linecap': 'round' }))
    }

    function Flower(x: number, y: number, s: number, pinned: boolean, onHover?: (on: boolean) => void) {
      const corners = Array.from({ length: 5 }, (_, i) => polar(x, y, 19 * s, i * 72))
      const g = el('g', { class: 'flower' })
      const glow = el('circle', { cx: x, cy: y, fill: 'url(#flower-glow)', 'pointer-events': 'none' }, { transition: `r 900ms ${EASE}, opacity 900ms ${EASE}` })
      const ms = { 'transform-box': 'fill-box', 'transform-origin': 'center', transition: `transform 1100ms ${EASE}, opacity 700ms ${EASE}` }
      const bud = el('g', {}, ms)
      add(bud, el('polygon', { points: pts(corners), 'stroke-width': 4 * s, 'stroke-linejoin': 'round' }, { fill: 'var(--h-petal)', stroke: 'var(--h-petal)' }))
      corners.forEach((c) => bud.appendChild(el('line', { x1: x, y1: y, x2: c[0], y2: c[1], 'stroke-width': 1.4 * s }, { stroke: 'var(--h-budEdge)' })))
      bud.appendChild(el('circle', { cx: x, cy: y, r: 3.2 * s }, { fill: 'var(--h-ring)' }))
      const bloom = add(el('g', {}, ms),
        el('polygon', { points: star(x, y, 25 * s, 14 * s), 'stroke-width': 6 * s, 'stroke-linejoin': 'round' }, { fill: 'var(--h-openPetal)', stroke: 'var(--h-openPetal)' }),
        el('circle', { cx: x, cy: y, r: 17 * s }, { fill: 'var(--h-openHalo)' }),
        el('polygon', { points: star(x, y, 17 * s, 9.5 * s, 18), 'stroke-width': 3 * s, 'stroke-linejoin': 'round' }, { fill: 'var(--h-openInner)', stroke: 'var(--h-openInner)' }),
        el('circle', { cx: x, cy: y, r: 7 * s }, { fill: 'var(--h-ring)' }),
        el('circle', { cx: x, cy: y, r: 2.4 * s, fill: '#eef1cc' }))
      const motion = (n: SVGElement, on: boolean, rot: number) => { n.style.transform = on ? 'scale(1) rotate(0deg)' : `scale(0.3) rotate(${rot}deg)`; n.style.opacity = on ? '1' : '0' }
      const render = (open: boolean) => { glow.setAttribute('r', String((open ? 34 : 28) * s)); glow.style.opacity = open ? '1' : '0.7'; motion(bud, !open, 0); motion(bloom as SVGElement, open, -72) }
      render(pinned)
      g.addEventListener('mouseenter', () => { render(true); onHover?.(true) })
      g.addEventListener('mouseleave', () => { render(pinned); onHover?.(false) })
      return add(g, el('circle', { cx: x, cy: y, r: 28 * s, fill: 'transparent' }), glow, bud, bloom)
    }

    type Tag = { x: number; y: number; side: number; edge: number; n: number }
    function Label(t: Tag, detail = false) {
      const anchor = t.side < 0 ? 'end' : 'start', tx = t.edge + t.side * 14
      const num = el('text', { x: tx, y: t.y - 18, 'text-anchor': anchor, fill: T.soft, 'font-family': "'JetBrains Mono', monospace", 'font-size': 12, 'letter-spacing': '0.18em' })
      num.textContent = `N° ${String(t.n + 1).padStart(2, '0')} / ${SKILLS.length}`
      const word = el('text', { x: tx, y: t.y + 11, 'text-anchor': anchor, fill: T.ink, 'font-family': "'Inter Tight', sans-serif", 'font-weight': 600, 'font-size': 30, 'letter-spacing': '-0.03em' })
      word.textContent = SKILLS[t.n]
      const text = add(el('g', { class: 'skill-text' }), num, word)
      if (detail) {
        const b = BLOOMS[SKILLS[t.n]]
        const d = el('text', { x: tx, y: t.y + 40, 'text-anchor': anchor, fill: T.soft, 'font-family': "'Inter Tight', sans-serif", 'font-size': 16 })
        d.textContent = b.snippet
        text.appendChild(d)
      }
      return add(el('g', { 'pointer-events': 'none' }),
        el('line', { x1: t.x + t.side * 30, y1: t.y, x2: t.edge, y2: t.y, stroke: T.ink, 'stroke-width': 1.25, pathLength: 1, class: 'skill-line' }),
        el('circle', { cx: t.x + t.side * 30, cy: t.y, r: 3, fill: T.ink }),
        add(el('g', { transform: `rotate(45 ${t.edge} ${t.y})` }), el('rect', { x: t.edge - 5, y: t.y - 5, width: 10, height: 10, fill: '#0d0d0d', class: 'skill-node' })),
        text)
    }

    function Umbel(cx: number, cy: number, points: number[][], labels: (number | null)[], pinned: number[], s: number, reach: number, onHover: (t: Tag | null) => void) {
      const tagFor = (i: number): Tag | null => { const n = labels[i]; if (n == null) return null; const [x, y] = points[i]; return { x, y, side: x < cx ? -1 : 1, edge: cx + (x < cx ? -reach : reach), n } }
      const g = el('g', { class: 'umbel-sway' }, { 'transform-origin': `${cx}px ${cy - 120}px`, 'animation-duration': (cx % 3 ? 8 : 10) + 's' })
      points.forEach((p) => g.appendChild(el('line', { x1: cx, y1: cy, x2: p[0], y2: p[1], stroke: C.stem, 'stroke-width': 2, 'stroke-opacity': 0.5 })))
      g.appendChild(Flower(cx, cy, s * 0.8, false))
      points.forEach(([x, y], i) => {
        const d = Math.hypot(x - cx, y - cy), deg = (Math.atan2(y - cy, x - cx) * 180) / Math.PI
        const k = 1 - 0.25 * Math.min(1, Math.max(0, (d - (60 * s) / 1.5) / ((100 * s) / 1.5)))
        const isPinned = pinned.includes(i)
        const outer = el('g', { transform: `translate(${x} ${y}) rotate(${deg}) scale(${k} 1) rotate(${-deg}) translate(${-x} ${-y})` })
        const drift = el('g', { class: 'flower-drift' }, { 'animation-duration': 5 + ((i * 7) % 4) + 's', 'animation-delay': -((i * 1.3) % 6) + 's' })
        drift.appendChild(Flower(x, y, s, isPinned, (on) => onHover(on ? tagFor(i) : null)))
        g.appendChild(add(outer, drift))
      })
      pinned.forEach((i) => { const t = tagFor(i); if (t) g.appendChild(Label(t)) })
      return g
    }
    function ring(cx: number, cy: number, r: number, n: number, off = 0, from = 0, to = 360) {
      return Array.from({ length: n }, (_, i) => { const a = ((from + ((to - from) * (i + off)) / (to - from === 360 ? n : n - 1)) * Math.PI) / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] })
    }
    const upper = [...ring(495, 655, 85, 5, 0.5), ...ring(495, 655, 150, 7, 0.25), ...ring(495, 655, 210, 10)]
    const lower = [...ring(300, 950, 95, 3, 0, 40, 140), ...ring(300, 950, 170, 5, 0, 10, 170), ...ring(300, 950, 240, 7, 0, 15, 165)]
        // every flower gets its own trait, no repeats
    const pool = SKILLS.map((_, k) => k).filter((k) => k !== 0 && k !== 1 && k !== 7)
    const L = [upper.map((_, i) => (i === 12 || i === 18 ? null : pool.shift() ?? null)), lower.map((_, i) => (i === 8 ? null : pool.shift() ?? null))] as (number | null)[][]
    const PINNED = { upper: [12, 18], lower: [8] }
    L[0][12] = 1; L[0][18] = 0; L[1][8] = 7

    const rand = (i: number, k: number) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v) }
    for (let i = 0; i < 12; i++) {
      const size = 10 + rand(i, 2) * 14, dur = 16 + rand(i, 3) * 14, delay = -rand(i, 4) * 30
      const fall = document.createElement('div'); fall.className = 'falling-leaf'; fall.style.left = 15 + rand(i, 1) * 90 + '%'; fall.style.animationDuration = dur + 's'; fall.style.animationDelay = delay + 's'
      const drift = document.createElement('div'); drift.className = 'falling-leaf-drift'; drift.style.animationDuration = dur + 's'; drift.style.animationDelay = delay + 's'
      const sway = document.createElement('div'); sway.className = 'falling-leaf-sway'; sway.style.setProperty('--sway', 20 + rand(i, 5) * 50 + 'px'); sway.style.setProperty('--spin', (rand(i, 6) > 0.5 ? 1 : -1) * (180 + rand(i, 7) * 360) + 'deg'); sway.style.animationDuration = dur / 3 + 's'; sway.style.animationDelay = delay + 's'
      const svg = el('svg', { width: size, height: size * 1.6, viewBox: '0 0 20 32' }, { opacity: String(0.12 + rand(i, 8) * 0.16) })
      add(svg, el('path', { d: 'M10,1 Q19,13 10,31 Q1,13 10,1 Z', fill: '#8e8e98' }))
      leaves.appendChild(add(fall, add(drift, add(sway, svg as unknown as Element))))
    }

    const grad = el('radialGradient', { id: 'flower-glow' })
    ;[[0, 0.7], [55, 0.4], [80, 0.1], [100, 0]].forEach(([o, op]) => grad.appendChild(el('stop', { offset: o + '%' }, { 'stop-color': 'var(--h-glow)', 'stop-opacity': String(op) })))
    art.appendChild(add(el('defs'), grad))
    const branch = el('g', { class: 'branch-sway' }, { 'transform-origin': '685px 170px' })
    add(branch, Leaf([600, 205], [330, 95], 85), Leaf([485, 310], [235, 175], 85), Leaf([235, 367], [-205, 455], -75), Leaf([480, 455], [235, 665], 85))
    const stems = el('g', { fill: 'none', stroke: C.stem, 'stroke-width': 3, 'stroke-linecap': 'round' })
    ;['M685,170 Q640,180 605,210 L490,315 L495,655', 'M115,360 Q300,375 390,360 L490,315'].forEach((d) => stems.appendChild(el('path', { d })))
    branch.appendChild(stems)
    let current: Element | null = null
    const setTag = (t: Tag | null) => {
      current?.remove(); current = null
      if (t) { current = Label(t, true); branch.appendChild(current); cb.current(BLOOMS[SKILLS[t.n]]) } else cb.current(null)
    }
    branch.appendChild(Umbel(495, 655, upper, L[0], PINNED.upper, 1.8, 260, setTag))
    art.appendChild(branch)
  }, [])

  return (
    <div className="relative mx-auto h-full w-full max-w-[760px]">
      <div ref={leavesRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
      <svg ref={svgRef} viewBox="-40 90 1080 820" overflow="visible" className="hydrangea relative z-10 h-auto w-full" aria-label="Interactive garden of design traits" />
    </div>
  )
}
