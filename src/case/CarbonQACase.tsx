import NextProject from '../components/NextProject'
import { useEffect, useRef, useState } from 'react'
import IbmLogo from '../components/IbmLogo'

/* Carbon tokens (Gray 100 / Blue 60 theme) */
const BLUE = '#0f62fe'
const G100 = '#161616'
const G90 = '#262626'

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

/* ---------------------------------------------------------------- prototype */

type Cat = 'Color' | 'Typography' | 'Layout' | 'Components' | 'Content' | 'Accessibility'
type Sev = 'Critical' | 'Warning' | 'Suggestion'
type Issue = { id: string; cat: Cat; sev: Sev; title: string; why: string; fix: string; token?: string; weight: number }

const ISSUES: Issue[] = [
  { id: 'cta', cat: 'Accessibility', sev: 'Critical', title: 'Primary button contrast is 2.9:1', why: 'WCAG 2.2 AA needs 4.5:1 for text. Light blue #78a9ff on white fails for low-vision users.', fix: 'Use $button-primary (Blue 60 #0f62fe) with $text-on-color white. That gives 5.9:1.', token: '$button-primary', weight: 16 },
  { id: 'font', cat: 'Typography', sev: 'Critical', title: 'Headline uses Poppins, not IBM Plex Sans', why: 'IBM brand only allows the Plex family. Other typefaces break brand trust on customer-facing pages.', fix: 'Swap to IBM Plex Sans and the $heading-05 type token (32/40, Regular 400).', token: '$heading-05', weight: 12 },
  { id: 'radius', cat: 'Components', sev: 'Warning', title: 'Rounded 12px corners on buttons & cards', why: 'Carbon uses square corners (0px) so it reads as precise and engineered. Rounded corners look like a different product.', fix: 'Replace the custom button with Carbon <Button kind="primary"> and use <Tile> for the cards.', token: '<Button />', weight: 10 },
  { id: 'spacing', cat: 'Layout', sev: 'Warning', title: '7 spacing values, 3 of them off-grid (13, 22, 27px)', why: 'Off-grid spacing makes the rhythm feel uneven, and engineers can\'t map it to tokens.', fix: 'Snap to the 8px mini-unit scale: $spacing-05 (16) / $spacing-07 (32).', token: '$spacing-05', weight: 8 },
  { id: 'copy', cat: 'Content', sev: 'Warning', title: 'CTA says "Click here to proceed!!"', why: 'IBM content style uses sentence case, no exclamation marks, and verb-first labels that say what happens next.', fix: 'Rewrite as "Start free trial".', weight: 8 },
  { id: 'color', cat: 'Color', sev: 'Suggestion', title: 'Off-palette purple #9b5de5 in the banner', why: 'This color isn\'t in the IBM palette, and it competes with the interactive blue for attention.', fix: 'Use $layer-accent-01 or Purple 60 #8a3ffc only for data viz, never as UI chrome.', token: '$layer-accent-01', weight: 6 },
  { id: 'alt', cat: 'Accessibility', sev: 'Suggestion', title: 'Hero image has no alt text', why: 'Screen readers announce it as "image" and the user gets nothing from it.', fix: 'Add a short description, or mark it decorative (alt="").', weight: 4 },
]
const SEV_COLOR: Record<Sev, string> = { Critical: '#da1e28', Warning: '#f1c21b', Suggestion: BLUE }

/** Mock "uploaded" landing page: renders broken or fixed depending on what's been applied. */
function Artboard({ fixed, focus }: { fixed: Set<string>; focus: string | null }) {
  const f = (id: string) => fixed.has(id)
  const ring = (id: string) => (focus === id ? 'outline outline-2 outline-offset-4 outline-[#da1e28]' : '')
  const r = f('radius') ? '0px' : '12px'
  return (
    <div className="w-full bg-white text-left text-[#161616] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)]" style={{ fontFamily: f('font') ? '"IBM Plex Sans", sans-serif' : 'Poppins, "Inter Tight", sans-serif' }}>
      <div className="flex items-center gap-3 bg-[#161616] px-4 py-2.5 text-[11px] text-white"><b>IBM</b><span className="text-white/60">watsonx Orchestrate</span></div>
      <div className={`px-5 py-2 text-[11px] text-white transition-colors duration-500 ${ring('color')}`} style={{ background: f('color') ? '#393939' : '#9b5de5' }}>New: AI agents for HR teams</div>
      <div className="grid gap-5 p-5 sm:grid-cols-[1.2fr_1fr]" style={{ gap: f('spacing') ? 32 : 22, padding: f('spacing') ? 32 : 27 }}>
        <div>
          <h4 className={`leading-tight transition-all ${ring('font')}`} style={{ fontSize: 26, fontWeight: f('font') ? 400 : 700 }}>Automate the busywork with AI agents</h4>
          <p className="mt-3 text-[13px] text-[#525252]" style={{ marginTop: f('spacing') ? 16 : 13 }}>Build, deploy and manage agents that plug into the tools your team already uses.</p>
          <button className={`mt-5 px-4 py-2.5 text-[13px] transition-all duration-500 ${ring('cta')} ${ring('copy')} ${ring('radius')}`}
            style={{ borderRadius: r, background: f('cta') ? BLUE : '#78a9ff', color: f('cta') ? '#fff' : '#e8f0ff', minWidth: f('radius') ? 180 : 0, textAlign: 'left' }}>
            {f('copy') ? 'Start free trial  →' : 'Click here to proceed!!'}
          </button>
        </div>
        <div className={`relative grid min-h-[120px] place-items-center overflow-hidden ${ring('alt')}`} style={{ borderRadius: r, background: 'linear-gradient(135deg,#a6c8ff,#0f62fe 60%,#001d6c)' }}>
          <div className="h-14 w-14 rotate-45 border-2 border-white/70" />
          {f('alt') && <span className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 font-mono text-[9px]">alt="Agent workflow diagram"</span>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-5 pb-5" style={{ padding: f('spacing') ? '0 32px 32px' : '0 27px 27px', gap: f('spacing') ? 16 : 8 }}>
        {['HR', 'Sales', 'IT'].map((t) => (
          <div key={t} className={`border border-[#e0e0e0] bg-[#f4f4f4] p-3 text-[11px] transition-all ${ring('radius')}`} style={{ borderRadius: r }}>
            <p className="font-semibold">{t} agents</p><p className="mt-1 text-[#6f6f6f]">12 templates</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Prototype() {
  const [step, setStep] = useState<'upload' | 'scan' | 'report'>('upload')
  const [fixed, setFixed] = useState<Set<string>>(new Set())
  const [focus, setFocus] = useState<string | null>('cta')
  const [filter, setFilter] = useState<Cat | 'All'>('All')
  const [mode, setMode] = useState<'Coach' | 'Quick'>('Coach')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (step !== 'scan') return
    setProgress(0)
    const id = setInterval(() => setProgress((p) => { if (p >= 100) { clearInterval(id); setStep('report'); return 100 } return p + 4 }), 60)
    return () => clearInterval(id)
  }, [step])

  const score = 100 - ISSUES.filter((i) => !fixed.has(i.id)).reduce((a, i) => a + i.weight, 0)
  const toggle = (id: string) => setFixed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const list = ISSUES.filter((i) => filter === 'All' || i.cat === filter)
  const cats: Cat[] = ['Color', 'Typography', 'Layout', 'Components', 'Content', 'Accessibility']
  const catScore = (c: Cat) => { const all = ISSUES.filter((i) => i.cat === c); const open = all.filter((i) => !fixed.has(i.id)); return all.length ? Math.round(100 - (open.length / all.length) * 100) : 100 }
  const SCAN_STEPS = ['Reading frames & layers', 'Matching components to Carbon', 'Checking color tokens & contrast', 'Reviewing content style', 'Writing recommendations']

  return (
    <div className="group/proto overflow-hidden border border-[#393939] bg-[#161616] text-white" style={{ fontFamily: '"IBM Plex Sans", "Inter Tight", sans-serif' }}>
      {/* shell header */}
      <div className="flex h-12 items-center border-b border-[#393939] px-4 text-sm">
        <b className="mr-1">IBM</b><span className="text-white/80">Carbon IQ</span>
        <span className="ml-3 hidden bg-[#393939] px-2 py-0.5 text-[11px] text-white/70 sm:inline">Beta</span>
        <div className="ml-auto flex items-center gap-1 text-xs">
          {(['Coach', 'Quick'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 ${mode === m ? 'bg-white text-[#161616]' : 'text-white/60 hover:text-white'}`}>{m} mode</button>
          ))}
        </div>
      </div>

      {step === 'upload' && (
        <div className="grid min-h-[560px] place-items-center p-8">
          <div className="w-full max-w-xl">
            <p className="text-xs text-white/50">New review</p>
            <h4 className="mt-2 text-3xl font-light tracking-tight">Check a design against Carbon</h4>
            <p className="mt-2 text-sm text-white/60">Paste a Figma frame link or drop an export. We'll review color, type, layout, components, content and accessibility.</p>
            <label className="mt-8 block text-xs text-white/60">Figma frame URL</label>
            <div className="mt-2 flex">
              <input readOnly value="figma.com/design/x8Q2…/Orchestrate-landing?node-id=12-48" className="flex-1 border-b border-[#6f6f6f] bg-[#262626] px-4 py-3 text-sm text-white/80 outline-none" />
            </div>
            <button onClick={() => setStep('scan')} className="mt-3 grid w-full place-items-center border border-dashed border-[#6f6f6f] py-10 text-sm text-white/60 transition hover:border-[#78a9ff] hover:text-white">
              Drag a PNG, PDF or .fig here<span className="mt-1 text-xs text-[#78a9ff]">or use the sample: Orchestrate landing page</span>
            </button>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-white/40">Your design stays inside IBM. Nothing is used to train models.</p>
              <div className="group/run relative">
                <span aria-hidden className="pointer-events-none absolute inset-0 animate-ping bg-[#0f62fe]/40 [animation-duration:2s] group-hover/proto:hidden" />
                <button onClick={() => setStep('scan')} className="relative bg-[#0f62fe] px-4 py-3 pr-12 text-sm transition hover:bg-[#0353e9]">Run review →</button>
                {/* ghost cursor hinting that this is clickable; hides once the visitor's own pointer is inside */}
                <div aria-hidden className="ghost-cursor pointer-events-none absolute left-1/2 top-1/2 z-10 group-hover/proto:hidden">
                  <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"><path d="M4 2l15 11-6.5 1 3.8 7.2-2.8 1.5-3.8-7.3L4 20z" fill="#fff" stroke="#161616" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  <span className="ghost-click absolute -left-2 -top-2 h-6 w-6 rounded-full border-2 border-white" />
                  <span className="absolute left-6 top-5 whitespace-nowrap bg-white px-2 py-1 text-[11px] font-medium text-[#161616]">Click to try</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'scan' && (
        <div className="grid min-h-[560px] place-items-center p-8">
          <div className="w-full max-w-md">
            <p className="text-sm">Reviewing Orchestrate landing page…</p>
            <div className="mt-4 h-1 bg-[#393939]"><div className="h-full bg-[#0f62fe] transition-all" style={{ width: `${progress}%` }} /></div>
            <ul className="mt-6 space-y-3 text-sm">
              {SCAN_STEPS.map((s, i) => { const done = progress > (i + 1) * 20; const on = !done && progress > i * 20; return (
                <li key={s} className={`flex items-center gap-3 ${done ? 'text-white' : on ? 'text-white/80' : 'text-white/30'}`}>
                  <span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${done ? 'bg-[#24a148]' : on ? 'animate-pulse border border-[#78a9ff]' : 'border border-[#525252]'}`}>{done ? '✓' : ''}</span>{s}
                </li>) })}
            </ul>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="grid min-h-[560px] lg:grid-cols-[1fr_420px]">
          {/* canvas */}
          <div className="flex flex-col bg-[#262626] p-5 md:p-8">
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs text-white/50">Carbon alignment</p>
                <p className="text-5xl font-light tracking-tight tabular-nums">{score}<span className="text-xl text-white/40">/100</span></p>
              </div>
              <span className="mb-2 px-2 py-1 text-xs" style={{ background: score >= 90 ? '#24a148' : score >= 70 ? '#f1c21b' : '#da1e28', color: score >= 70 && score < 90 ? '#161616' : '#fff' }}>
                {score >= 90 ? 'Ready for review' : score >= 70 ? 'Almost there' : 'Needs work'}
              </span>
              <button onClick={() => { setFixed(new Set()); setStep('upload') }} className="mb-2 ml-auto text-xs text-[#78a9ff] hover:underline">New review</button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px bg-[#393939] sm:grid-cols-6">
              {cats.map((c) => (
                <button key={c} onClick={() => setFilter(filter === c ? 'All' : c)} className={`p-2.5 text-left transition ${filter === c ? 'bg-[#393939]' : 'bg-[#262626] hover:bg-[#333]'}`}>
                  <p className="truncate text-[10px] text-white/50">{c}</p>
                  <div className="mt-1.5 h-1 bg-[#393939]"><div className="h-full transition-all duration-500" style={{ width: `${catScore(c)}%`, background: catScore(c) === 100 ? '#24a148' : '#78a9ff' }} /></div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-1 items-center justify-center"><div className="w-full max-w-[560px]"><Artboard fixed={fixed} focus={focus && !fixed.has(focus) ? focus : null} /></div></div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => setFixed(new Set(ISSUES.map((i) => i.id)))} className="bg-[#0f62fe] px-4 py-2.5 text-sm hover:bg-[#0353e9]">Apply all fixes</button>
              <button className="border border-white/40 px-4 py-2.5 text-sm hover:bg-white/10">Ask a senior designer</button>
              <button className="px-4 py-2.5 text-sm text-[#78a9ff] hover:bg-white/5">Export report</button>
            </div>
          </div>
          {/* issue panel */}
          <div className="max-h-[720px] overflow-y-auto border-l border-[#393939]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#393939] bg-[#161616] px-5 py-3 text-sm">
              <span>{filter === 'All' ? 'All findings' : filter} <span className="text-white/40">· {list.filter((i) => !fixed.has(i.id)).length} open</span></span>
              {filter !== 'All' && <button onClick={() => setFilter('All')} className="text-xs text-[#78a9ff]">Clear</button>}
            </div>
            {list.map((i) => {
              const done = fixed.has(i.id)
              const open = focus === i.id
              return (
                <div key={i.id} className={`border-b border-[#393939] transition ${open ? 'bg-[#262626]' : 'hover:bg-[#1f1f1f]'}`}>
                  <button onClick={() => setFocus(open ? null : i.id)} className="flex w-full gap-3 px-5 py-4 text-left">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: done ? '#24a148' : SEV_COLOR[i.sev] }} />
                    <span className="flex-1">
                      <span className="text-[11px] text-white/45">{i.cat} · {done ? 'Fixed' : i.sev}</span>
                      <span className={`mt-0.5 block text-sm ${done ? 'text-white/40 line-through' : ''}`}>{i.title}</span>
                    </span>
                    <span className="text-xs text-white/30">{open ? '−' : '+'}</span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 pl-10 text-[13px] leading-relaxed">
                      {mode === 'Coach' && <><p className="text-[11px] uppercase tracking-wider text-white/40">Why it matters</p><p className="mt-1 text-white/70">{i.why}</p></>}
                      <p className={`${mode === 'Coach' ? 'mt-3' : ''} text-[11px] uppercase tracking-wider text-white/40`}>Recommendation</p>
                      <p className="mt-1">{i.fix}</p>
                      {i.token && <code className="mt-3 inline-block bg-[#393939] px-2 py-1 font-mono text-[11px] text-[#a6c8ff]">{i.token}</code>}
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => toggle(i.id)} className={`px-3 py-2 text-xs ${done ? 'border border-white/30' : 'bg-[#0f62fe] hover:bg-[#0353e9]'}`}>{done ? 'Undo' : 'Apply fix'}</button>
                        <button className="px-3 py-2 text-xs text-[#78a9ff] hover:bg-white/5">Not relevant</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {mode === 'Coach' && (
              <div className="m-5 border-l-2 border-[#0f62fe] bg-[#262626] p-4 text-[13px] text-white/70">
                <p className="text-white">Learn while you fix</p>
                <p className="mt-1">You've hit contrast issues in 3 of your last 5 reviews. Take the 6-minute Carbon color module to stop them happening.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- story */

function useProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); setP(Math.min(1, Math.max(0, -r.top / ((r.height - window.innerHeight) || 1)))) }
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [ref])
  return p
}

const CHAPTERS = ['Overview', 'The moment', 'Listening', 'Insights', 'The reframe', 'Concepts', 'Design decisions', 'Built with Bob', 'The prototype', 'Playback', 'Reflection']

function CaseNav() {
  const [p, setP] = useState(0)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1))
      let a = 0
      CHAPTERS.forEach((_, i) => { const el = document.getElementById('cc-' + (i + 1)); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) a = i })
      setActive(a)
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]"><div className="h-full origin-left" style={{ background: BLUE, transform: `scaleX(${p})` }} /></div>
      <aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1480px]:block">
        <ul className="space-y-1.5">
          {CHAPTERS.map((c, i) => (
            <li key={c}><button onClick={() => document.getElementById('cc-' + (i + 1))?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-[11px] leading-none transition-colors duration-300" style={{ color: active === i ? BLUE : '#a3a39e' }}>
              <span className="h-1 w-1 rounded-full transition-opacity duration-300" style={{ background: BLUE, opacity: active === i ? 1 : 0 }} />
              <span className={active === i ? 'font-medium' : 'hover:text-ink'}>{c}</span>
            </button></li>
          ))}
        </ul>
      </aside>
    </>
  )
}

function Chapter({ n, title, dark }: { n: number; title: React.ReactNode; dark?: boolean }) {
  return (
    <div className="reveal mb-6 md:mb-8">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-muted'}`}>{String(n).padStart(2, '0')} / {CHAPTERS[n - 1]}</p>
      <h2 className="mt-5 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">{title}</h2>
    </div>
  )
}
const Wrap = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`px-6 py-28 md:px-16 md:py-36 ${className}`}><div className="mx-auto max-w-[1180px]">{children}</div></section>
)
const Lede = ({ children, dark, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) => (
  <p className={`reveal max-w-2xl text-lg leading-relaxed md:text-xl ${dark ? 'text-white/70' : 'text-muted'} ${className}`}>{children}</p>
)

/* Cursor trail that snaps to the 32px Carbon grid: cells light up and decay */
export function GridTrail() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext('2d')!
    const S = 32, cells = new Map<string, { x: number; y: number; a: number; c: string }>()
    const COLORS = ['#0f62fe', '#0f62fe', '#4589ff', '#78a9ff', '#ffffff']
    let raf = 0, last: [number, number] | null = null, dpr = 1
    const fit = () => { dpr = window.devicePixelRatio || 1; const r = cv.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr }
    const light = (gx: number, gy: number, a = 1) => {
      const k = gx + ',' + gy, cur = cells.get(k)
      if (cur) cur.a = Math.max(cur.a, a)
      else cells.set(k, { x: gx, y: gy, a, c: COLORS[Math.floor(Math.random() * COLORS.length)] })
    }
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top
      if (x < 0 || y < 0 || x > r.width || y > r.height) { last = null; return }
      const gx = Math.floor(x / S), gy = Math.floor(y / S)
      // fill the cells between samples so fast moves draw a continuous path
      if (last) { const [lx, ly] = last, n = Math.max(Math.abs(gx - lx), Math.abs(gy - ly)); for (let i = 1; i <= n; i++) light(Math.round(lx + ((gx - lx) * i) / n), Math.round(ly + ((gy - ly) * i) / n)) }
      light(gx, gy)
      if (Math.random() < 0.35) light(gx + (Math.random() < 0.5 ? -1 : 1), gy + (Math.random() < 0.5 ? -1 : 1), 0.5)
      last = [gx, gy]
    }
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
      cells.forEach((c, k) => {
        const inset = 1 + (1 - c.a) * 10
        ctx.globalAlpha = c.a * (c.c === '#ffffff' ? 0.5 : 0.85)
        ctx.fillStyle = c.c
        ctx.fillRect(c.x * S + inset, c.y * S + inset, S - inset * 2, S - inset * 2)
        c.a -= 0.018
        if (c.a <= 0) cells.delete(k)
      })
      raf = requestAnimationFrame(draw)
    }
    fit(); draw()
    window.addEventListener('resize', fit); window.addEventListener('pointermove', move)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); window.removeEventListener('pointermove', move) }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full motion-reduce:hidden" />
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const on = (e: PointerEvent) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setT({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 }) }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [])
  return [ref, t] as const
}

/* 01 hero */
function Hero() {
  const [tiltRef, tilt] = useTilt()
  return (
    <section id="cc-1">
      <div className="relative overflow-hidden px-6 pb-24 pt-36 text-white md:px-16 md:pt-44" style={{ background: `radial-gradient(110% 90% at 80% 0%, #0043ce 0%, ${G100} 62%)` }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="grad-blob grad-blob-0" style={{ background: '#0043ce' }} />
        <GridTrail />
        <div className="pointer-events-none relative mx-auto max-w-[1180px] [&_a]:pointer-events-auto">
          <div className="reveal flex flex-wrap items-center gap-5"><span className="grid h-10 place-items-center rounded-lg bg-white px-3"><IbmLogo className="h-6" /></span><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#78a9ff]">Case study · AI design QA · IBM</p></div>
          <h1 className="reveal mt-6 max-w-5xl text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">A second pair of eyes for everyone who designs</h1>
          <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">How I turned the senior designer's review into an instant, kind and teachable AI check. Think Grammarly, but for Carbon.</p>
          <div ref={tiltRef} className="reveal mt-16 grid gap-6 [perspective:1400px] lg:grid-cols-[1fr_300px]">
            <div className="transition-transform duration-500 ease-out" style={{ transform: `rotateY(${tilt.x * 4}deg) rotateX(${-tilt.y * 3}deg)` }}><div className="mx-auto max-w-[620px]"><Artboard fixed={new Set(['font', 'spacing'])} focus="cta" /></div></div>
            <div className="self-center bg-[#262626] p-5 text-sm shadow-2xl transition-transform duration-700 ease-out" style={{ transform: `translate(${tilt.x * -14}px, ${tilt.y * -10}px)` }}>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50"><span className="h-2 w-2 rounded-full bg-[#da1e28]" />Accessibility · Critical</p>
              <p className="mt-2">Primary button contrast is 2.9:1</p>
              <p className="mt-2 text-white/55">Use $button-primary, Blue 60. It passes at 5.9:1.</p>
              <span className="mt-4 inline-block bg-[#0f62fe] px-3 py-2 text-xs">Apply fix</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-24 md:px-16">
        <div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[240px_1fr]">
          <dl className="reveal space-y-6 self-end text-sm">
            {[['Focus', 'Research, product strategy, AI interaction design, prototyping'], ['Users', 'PMs, marketers, sellers and early-career designers'], ['Platform', 'Figma plugin + web, built on Carbon'], ['Shared at', 'Design playback']].map(([a, b]) => (
              <div key={a}><dt className="text-muted">{a}</dt><dd className="mt-1 font-medium">{b}</dd></div>
            ))}
          </dl>
          <div>
            <p className="reveal font-mono text-[11px] uppercase tracking-[0.2em] text-muted">TL;DR</p>
            <div className="reveal mt-6 rounded-2xl bg-white p-7 md:p-10">
              <p className="text-[19px] leading-[1.75] text-muted md:text-[21px]">
                Senior designers often become the <span className="text-ink">bottleneck for design reviews</span>, while product managers, engineers and junior designers struggle to know whether their screens follow Carbon. I designed <span className="font-medium text-ink">Carbon IQ</span>, an AI-powered design coach that works like Grammarly for IBM Design. It finds Carbon violations, explains why they matter and suggests fixes in real time. By <mark className="rounded-[3px] box-decoration-clone px-1 text-ink" style={{ background: '#d0e2ff' }}>bringing review into the moment of design</mark> rather than after it, teams ship more consistent experiences, <mark className="rounded-[3px] box-decoration-clone px-1 text-ink" style={{ background: '#d0e2ff' }}>review overhead drops</mark>, and design expertise becomes <mark className="rounded-[3px] box-decoration-clone px-1 text-ink" style={{ background: '#d0e2ff' }}>accessible beyond designers</mark>.
              </p>
              <div className="mt-8 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-3">
                {[['40%', 'faster to reach Carbon standard'], ['No overnight wait', 'for a senior designer in another time zone'], ['Empowered', 'people share work without fear of the red pen']].map(([n, l]) => (
                  <div key={n} className="bg-paper p-5"><p className="text-2xl font-semibold tracking-[-0.03em]" style={{ color: BLUE }}>{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted"><span className="font-medium text-ink">Presented at a design playback</span> and widely praised for its potential to scale design quality across teams.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 02 the moment: scroll-told vignette */
function Moment() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  const words = 'It\'s 11pm. A seller has a client demo at 9am. The screens look fine to her, but she has no way of knowing if they are.'.split(' ')
  const beats = [
    ['She built it herself', 'In Figma, in an afternoon. AI tools made it easy to make screens. Nothing made it easy to know if they were right.'],
    ['The only check is a person', 'Her senior designer is in another time zone. Feedback comes tomorrow, if she\'s brave enough to ask.'],
    ['The demo goes out', 'With a rounded, low-contrast button and a font IBM doesn\'t use. The client notices. Then the brand team does.'],
  ]
  return (
    <section id="cc-2" className="bg-[#0b0d12] text-white">
      <div ref={ref} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1180px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">02 / The moment</p>
            <p className="mt-8 max-w-5xl text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
              {words.map((w, i) => <span key={i} className="transition-colors duration-300" style={{ color: p * 1.7 > i / words.length ? '#fff' : 'rgba(255,255,255,0.14)' }}>{w} </span>)}
            </p>
            <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-3">
              {beats.map(([t, d], i) => { const on = p > 0.55 + i * 0.12; return (
                <div key={t} className="bg-[#0b0d12] p-6 transition-all duration-700" style={{ opacity: on ? 1 : 0.1, transform: on ? 'none' : 'translateY(24px)' }}>
                  <p className="font-mono text-xs text-[#78a9ff]">0{i + 1}</p>
                  <p className="mt-3 text-xl font-semibold tracking-tight">{t}</p>
                  <p className="mt-2 text-white/60">{d}</p>
                </div>) })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 03 listening */
const METHODS = [
  { k: 'Review comment audit', d: 'I collected past review comments from Figma files and Slack threads and tagged each one by what it was actually about.', found: 'Most comments were about the same things, over and over: tokens, spacing, contrast, the wrong component.' },
  { k: 'Senior designer conversations', d: 'I asked senior designers what they repeat most in critiques and what they wish they had time for instead.', found: '"I give the same 10 comments every week. I\'d rather be talking about the user\'s problem."' },
  { k: 'Non-designer conversations', d: 'PMs, marketers and sellers walked me through the last screen they made and how they decided it was "done".', found: 'Nobody thought "done" meant "checked". It meant "looks like the other screens I\'ve seen".' },
  { k: 'Tool benchmarking', d: 'I looked at Grammarly, accessibility checkers, Figma lint plugins and theme builders for what they get right about feedback.', found: 'The tools that work fix the problem inline and explain it in one line. The ones that only flag problems get ignored.' },
]
function Listening() {
  const [m, setM] = useState(0)
  return (
    <Wrap id="cc-3">
      <Chapter n={3} title="Before designing anything, I listened to the review itself." />
      <Lede>I wanted to understand design review from both sides: the people giving the feedback and the people dreading it.</Lede>
      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <ul className="space-y-2">
          {METHODS.map((x, i) => (
            <li key={x.k}><button onClick={() => setM(i)} onMouseEnter={() => setM(i)} className={`w-full rounded-2xl p-5 text-left transition-all duration-500 ${m === i ? 'bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]' : 'hover:bg-white/60'}`}>
              <p className="flex items-center gap-3 font-medium"><span className="font-mono text-xs" style={{ color: m === i ? BLUE : '#8d8d8d' }}>0{i + 1}</span>{x.k}</p>
              <p className={`overflow-hidden text-[15px] text-muted transition-all duration-500 ${m === i ? 'mt-2 max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>{x.d}</p>
            </button></li>
          ))}
        </ul>
        <div key={m} className="flex flex-col justify-between rounded-3xl p-8 text-white md:p-10" style={{ background: G100, animation: 'card-in 600ms cubic-bezier(.22,1,.36,1) both' }}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#78a9ff]">What I heard</p>
          <p className="mt-6 text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-snug tracking-tight">{METHODS[m].found}</p>
          <div className="mt-10 flex gap-2">{METHODS.map((_, j) => <span key={j} className="h-1 flex-1 rounded-full" style={{ background: j === m ? BLUE : '#393939' }} />)}</div>
        </div>
      </div>
    </Wrap>
  )
}

/* 04 insights: expandable */
const INSIGHTS = [
  { t: 'Most feedback is rules, not taste', s: 'Machine-checkable work was eating senior time.', e: 'Most review comments were about tokens, contrast, spacing and components. Very few were about real UX problems.', d: 'Automate the rules. Save seniors for the judgement calls.', bars: [['Color & contrast', 31], ['Spacing & grid', 24], ['Components', 18], ['Typography', 12], ['Content', 9], ['Real UX problems', 6]] },
  { t: 'Review feels like judgement', s: 'So people skip it.', e: 'Non-designers hide work to avoid the red pen. Juniors freeze in critique. Waiting overnight for a reviewer in another time zone makes it worse.', d: 'A private coach that\'s always on. Check your work before anyone else sees it.' },
  { t: 'Rules don\'t help without the fix', s: '"$spacing-05" means nothing to a PM.', e: 'Carbon docs are written for designers. Non-designers don\'t know what to look for.', d: 'Show the fix applied on the canvas.' },
  { t: 'No reason, no trust', s: 'People ignore AI advice they can\'t trace.', e: 'Unexplained suggestions got dismissed, and an AI that invents rules is worse than none.', d: 'Every finding cites an approved Carbon rule.' },
]
function Insights() {
  const [open, setOpen] = useState(0)
  return (
    <Wrap id="cc-4" className="bg-white">
      <Chapter n={4} title={<>Four insights that shaped <span className="hl" style={{ color: BLUE }}>everything</span></>} />
      <Lede>Open one to see the evidence and my design response.</Lede>
      <div className="mt-14 border-t border-line">
        {INSIGHTS.map((x, i) => { const on = open === i; return (
          <div key={x.t} className="reveal border-b border-line">
            <button onClick={() => setOpen(on ? -1 : i)} className="group grid w-full grid-cols-[48px_1fr_auto] items-start gap-4 py-7 text-left md:grid-cols-[80px_1fr_auto]">
              <span className="font-mono text-sm transition-colors" style={{ color: on ? BLUE : '#8d8d8d' }}>{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className={`block text-[clamp(1.25rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.03em] transition-colors ${on ? 'text-ink' : 'text-ink/70 group-hover:text-ink'}`}>{x.t}</span>
                <span className="mt-2 block text-muted">{x.s}</span>
              </span>
              <span className="mt-2 grid h-9 w-9 place-items-center rounded-full border border-line text-lg transition-transform duration-500" style={{ transform: on ? 'rotate(45deg)' : 'none', background: on ? BLUE : 'transparent', color: on ? '#fff' : undefined, borderColor: on ? BLUE : undefined }}>+</span>
            </button>
            <div className="grid transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}>
              <div className="overflow-hidden">
                <div className="grid gap-6 pb-10 md:ml-[96px] md:grid-cols-2">
                  <div className="rounded-2xl bg-paper p-6">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Evidence</p>
                    <p className="mt-3 leading-relaxed">{x.e}</p>
                    {x.bars && <div className="mt-5 space-y-2">{x.bars.map(([l, v]) => (
                      <div key={l} className="grid grid-cols-[130px_1fr] items-center gap-3 text-xs"><span className="text-muted">{l}</span><div className="h-2 bg-white"><div className="h-full transition-all duration-1000" style={{ width: on ? `${(v as number) * 3}%` : 0, background: l === 'Real UX problems' ? '#da1e28' : BLUE }} /></div></div>
                    ))}<p className="pt-1 text-[11px] text-muted">Rough share of tagged review comments.</p></div>}
                  </div>
                  <div className="rounded-2xl p-6 text-white" style={{ background: BLUE }}>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">So I designed</p>
                    <p className="mt-3 text-xl font-medium leading-snug">{x.d}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>) })}
      </div>
    </Wrap>
  )
}

/* 05 reframe */
function Reframe() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  return (
    <section id="cc-5">
      <div ref={ref} className="relative h-[200vh]" style={{ background: BLUE }}>
        <div className="sticky top-0 flex h-screen items-center px-6 text-white md:px-16">
          <div className="mx-auto max-w-[1180px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">05 / The reframe</p>
            <blockquote className="mt-8 text-[clamp(2rem,4.8vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              <span>People didn't need more rules. </span>
              <span className="transition-opacity duration-700" style={{ opacity: p > 0.25 ? 1 : 0.2 }}>They needed a senior designer's eye </span>
              <span className="relative inline-block transition-opacity duration-700" style={{ opacity: p > 0.45 ? 1 : 0.2 }}>while they were still designing.<span className="absolute -bottom-1 left-0 h-1 bg-white transition-all duration-700" style={{ width: p > 0.5 ? '100%' : '0%' }} /></span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 06 concepts */
const CONCEPTS = [
  { k: 'The linter', d: 'Lists every rule break.', good: 'Fast and precise', bad: 'A wall of red nobody acts on', pick: false },
  { k: 'The chatbot', d: 'Ask the AI if it\'s on-brand.', good: 'Friendly', bad: 'Not tied to the canvas, and hard to trust', pick: false },
  { k: 'The coach', d: 'Rules + AI, fixed in one click.', good: 'Trusted, and you learn as you go', bad: 'Needs a rule set the designers own', pick: true },
]
function Concepts() {
  const [c, setC] = useState(2)
  return (
    <Wrap id="cc-6" className="bg-white">
      <Chapter n={6} title="Three shapes it could take" />
      <Lede>Three directions, tested against the insights. One worked.</Lede>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {CONCEPTS.map((x, i) => { const on = c === i; return (
          <button key={x.k} onClick={() => setC(i)} className={`reveal relative rounded-3xl border p-7 text-left transition-all duration-500 ${on ? '-translate-y-1 border-transparent text-white shadow-[0_30px_60px_-30px_rgba(15,98,254,0.6)]' : 'border-line bg-paper hover:border-ink/30'}`} style={on ? { background: x.pick ? BLUE : G100 } : {}}>
            {x.pick && <span className={`absolute right-5 top-5 rounded-full px-2.5 py-1 text-[11px] ${on ? 'bg-white text-[#0f62fe]' : 'bg-white text-muted'}`}>Chosen</span>}
            <p className={`font-mono text-xs ${on ? 'text-white/60' : 'text-muted'}`}>Concept 0{i + 1}</p>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{x.k}</p>
            <p className={`mt-2 text-[15px] ${on ? 'text-white/75' : 'text-muted'}`}>{x.d}</p>
            <div className="grid transition-all duration-500" style={{ gridTemplateRows: '1fr' }}>
              <div className="overflow-hidden">
                <div className="mt-6 space-y-3 border-t border-current/20 pt-5 text-sm">
                  <p><span className={on ? 'text-white/50' : 'text-muted'}>+ </span>{x.good}</p>
                  <p><span className={on ? 'text-white/50' : 'text-muted'}>− </span>{x.bad}</p>
                </div>
              </div>
            </div>
          </button>) })}
      </div>
    </Wrap>
  )
}

/* 07 design decisions stepper: why + how behind the prototype */
const DECISIONS = [
  { s: 'Start with a link', why: 'Non-designers already have a Figma link. Asking them to export, rename or set anything up loses them at step one.', how: 'One input for a Figma URL plus a drop zone, and a sample file so first-time users can see what it does before they trust it with their own work.', show: 'upload' },
  { s: 'Show the work', why: 'A spinner hides what the AI is doing. People trust a result more when they can see how it was reached.', how: 'The scan lists its steps as they happen: reading layers, matching components, checking contrast, reviewing content. This also teaches users what a good review covers.', show: 'scan' },
  { s: 'Point at the problem', why: 'A list of issues makes people hunt for them. Grammarly underlines the word, so I wanted the same for design.', how: 'Selecting a finding outlines the exact element on the canvas in red. The category bars at the top show where to focus.', show: 'focus' },
  { s: 'Fix, don\'t flag', why: 'Insight 03: rules don\'t help without the fix. The fastest way to learn is to see it fixed.', how: '"Apply fix" updates the design live, and the score goes up. Every fix can be undone, so people feel safe trying.', show: 'fix' },
  { s: 'Two depths, one engine', why: 'A PM needs the answer in 30 seconds. A junior designer wants to know why. One level of detail can\'t serve both.', how: 'Quick mode shows only the fixes. Coach mode adds "Why it matters" and learning tips based on your past reviews.', show: 'coach' },
  { s: 'A score that encourages', why: 'Insight 02: people avoid feeling judged. A public grade would make people avoid the tool.', how: 'The score is private to the author, with encouraging labels like "Almost there" and "Ready for review". There\'s a clear way to ask a senior designer when the tool isn\'t enough.', show: 'score' },
]
function DecisionVisual({ k }: { k: string }) {
  const box = 'rounded-2xl bg-[#161616] p-6 text-white h-full min-h-[300px] flex flex-col justify-center'
  if (k === 'upload') return <div className={box}><p className="text-xs text-white/50">Figma frame URL</p><div className="mt-2 border-b border-[#6f6f6f] bg-[#262626] px-4 py-3 text-sm text-white/70">figma.com/design/x8Q2…/landing</div><div className="mt-3 grid place-items-center border border-dashed border-[#6f6f6f] py-8 text-sm text-white/50">Drop a file<span className="text-xs text-[#78a9ff]">or try the sample</span></div></div>
  if (k === 'scan') return <div className={box}>{['Reading frames & layers', 'Matching components to Carbon', 'Checking contrast', 'Reviewing content'].map((s, i) => <p key={s} className={`flex items-center gap-3 py-1.5 text-sm ${i < 3 ? '' : 'text-white/40'}`}><span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${i < 2 ? 'bg-[#24a148]' : i === 2 ? 'animate-pulse border border-[#78a9ff]' : 'border border-[#525252]'}`}>{i < 2 ? '✓' : ''}</span>{s}</p>)}</div>
  if (k === 'focus' || k === 'fix') return <div className="rounded-2xl bg-[#262626] p-6"><Artboard fixed={new Set(k === 'fix' ? ['cta', 'copy', 'radius', 'font'] : [])} focus={k === 'focus' ? 'cta' : null} /></div>
  if (k === 'coach') return <div className={box}><p className="text-[11px] uppercase tracking-wider text-white/40">Why it matters</p><p className="mt-1 text-sm text-white/70">WCAG AA needs 4.5:1. Light blue on white fails for low-vision users.</p><p className="mt-4 text-[11px] uppercase tracking-wider text-white/40">Recommendation</p><p className="mt-1 text-sm">Use $button-primary, Blue 60.</p><div className="mt-5 border-l-2 border-[#0f62fe] bg-[#262626] p-3 text-xs text-white/70">Contrast came up in 3 of your last 5 reviews. Try the 6-minute color module.</div></div>
  return <div className={box}><p className="text-xs text-white/50">Carbon alignment · only visible to you</p><p className="mt-1 text-6xl font-light">86<span className="text-xl text-white/40">/100</span></p><span className="mt-3 w-fit bg-[#f1c21b] px-2 py-1 text-xs text-[#161616]">Almost there</span><span className="mt-6 w-fit border border-white/40 px-3 py-2 text-xs">Ask a senior designer</span></div>
}
function Decisions() {
  const [i, setI] = useState(0)
  const d = DECISIONS[i]
  return (
    <Wrap id="cc-7">
      <Chapter n={7} title={<>Why the prototype works <span className="hl" style={{ color: BLUE }}>the way it does</span></>} />
      <Lede>Each screen comes from something I heard in research. Step through the flow to see why I made each decision and how I built it.</Lede>
      <div className="reveal mt-16">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] h-px bg-line" />
          <div className="absolute left-0 top-[18px] h-px transition-all duration-700" style={{ width: `${(i / (DECISIONS.length - 1)) * 100}%`, background: BLUE }} />
          <div className="relative grid grid-cols-6">
            {DECISIONS.map((x, j) => (
              <button key={x.s} onClick={() => setI(j)} className="group flex flex-col items-center gap-3 text-center">
                <span className={`grid h-9 w-9 place-items-center rounded-full border text-xs transition-all duration-500 ${j <= i ? 'border-transparent text-white' : 'border-line bg-white text-muted group-hover:border-ink'}`} style={j <= i ? { background: BLUE } : {}}>{j + 1}</span>
                <span className={`hidden text-xs md:block md:text-sm ${j === i ? 'font-medium text-ink' : 'text-muted'}`}>{x.s}</span>
              </button>
            ))}
          </div>
        </div>
        <div key={i} className="mt-12 grid gap-6 lg:grid-cols-2" style={{ animation: 'card-in 600ms cubic-bezier(.22,1,.36,1) both' }}>
          <div className="flex flex-col">
            <p className="text-3xl font-semibold tracking-[-0.03em]">{d.s}</p>
            <div className="mt-6 grid flex-1 gap-px overflow-hidden rounded-3xl bg-line">
              <div className="bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-widest text-[#da1e28]">Why</p><p className="mt-2 text-lg leading-snug">{d.why}</p></div>
              <div className="bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: BLUE }}>How I designed it</p><p className="mt-2 text-lg leading-snug">{d.how}</p></div>
            </div>
          </div>
          <DecisionVisual k={d.show} />
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => setI(Math.max(0, i - 1))} className="text-sm text-muted hover:text-ink disabled:opacity-30" disabled={i === 0}>← Previous decision</button>
          <button onClick={() => setI(Math.min(DECISIONS.length - 1, i + 1))} className="text-sm font-medium disabled:opacity-30" disabled={i === DECISIONS.length - 1}>Next decision →</button>
        </div>
      </div>
    </Wrap>
  )
}

/* 08 built with bob */
const BOB_STEPS = [
  { t: 'Scaffold on Carbon', mode: 'Plan', file: 'src/App.tsx',
    prompt: 'Set up a React app using @carbon/react with the Gray 100 theme. I need a shell header "IBM Carbon IQ" and three states: upload, scanning and report.',
    reply: 'I\'ll create a Carbon UI Shell with a Theme wrapper and a simple step state machine. Three files: App.tsx, UploadView.tsx and ReportView.tsx.',
    code: `import { Theme, Header, HeaderName } from '@carbon/react'

type Step = 'upload' | 'scan' | 'report'

export default function App() {
  const [step, setStep] = useState<Step>('upload')
  return (
    <Theme theme="g100">
      <Header aria-label="IBM Carbon IQ">
        <HeaderName prefix="IBM">Carbon IQ</HeaderName>
      </Header>
      {step === 'upload' && <UploadView onRun={() => setStep('scan')} />}
      {step === 'scan' && <ScanView onDone={() => setStep('report')} />}
      {step === 'report' && <ReportView />}
    </Theme>
  )
}` },
  { t: 'Rules engine: contrast', mode: 'Code', file: 'src/rules/contrast.ts',
    prompt: 'Write a rule that walks the Figma layer tree, finds text on a fill, and flags anything under WCAG AA 4.5:1. Suggest the nearest Carbon token that passes.',
    reply: 'Added a deterministic contrast rule using relative luminance. It returns findings in the shared Finding shape, so the UI can render them the same way as AI findings.',
    code: `// Deterministic rule: same input, same answer, no AI involved
export const contrastRule: Rule = (node) => {
  if (node.type !== 'TEXT' || !node.parentFill) return []
  const ratio = contrast(node.color, node.parentFill)
  if (ratio >= 4.5) return []
  return [{
    id: \`contrast-\${node.id}\`,
    category: 'Accessibility',
    severity: ratio < 3 ? 'Critical' : 'Warning',
    title: \`Text contrast is \${ratio.toFixed(1)}:1\`,
    fix: nearestPassingToken(node.parentFill, CARBON_TOKENS),
    source: 'carbondesignsystem.com/guidelines/accessibility',
  }]
}` },
  { t: 'AI review, grounded', mode: 'Code', file: 'src/ai/review.ts',
    prompt: 'For content tone and hierarchy, call watsonx. It must only cite rules from our approved rule set, never invent one. Return JSON.',
    reply: 'I wrote a grounded prompt that passes in only the approved rules, then validates the response. Any finding without a known ruleId is dropped before it reaches the UI.',
    code: `const SYSTEM = \`You are a senior IBM designer reviewing a screen.
Only use rules from APPROVED_RULES. Cite ruleId for every finding.
Write like a coach: plain language, one-line "why", one-line fix.\`

export async function aiReview(frame: Frame): Promise<Finding[]> {
  const res = await watsonx.generate({
    system: SYSTEM,
    input: { text: frame.textLayers, image: frame.png, rules: APPROVED_RULES },
    format: 'json',
  })
  // Guardrail: drop anything that cites a rule we don't know about
  return res.findings.filter((f) => APPROVED_RULES.has(f.ruleId))
}` },
  { t: 'Apply fix + score', mode: 'Code', file: 'src/report/useReport.ts',
    prompt: 'When a user clicks "Apply fix", update the canvas preview and recalculate the score. Make it undoable. The score should only be visible to the author.',
    reply: 'The fix state is a Set of finding ids, so toggling it undoes the fix. The score is calculated from the weights of open findings. Nothing is sent to team dashboards.',
    code: `export function useReport(findings: Finding[]) {
  const [fixed, setFixed] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setFixed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const score = 100 - findings
    .filter((f) => !fixed.has(f.id))
    .reduce((sum, f) => sum + WEIGHT[f.severity], 0)

  const label = score >= 90 ? 'Ready for review' : score >= 70 ? 'Almost there' : 'Needs work'
  return { fixed, toggle, score, label } // private: never leaves the client
}` },
]

function Code({ src }: { src: string }) {
  const kw = /\b(import|from|export|default|function|const|return|if|type|async|await|new)\b/g
  return (
    <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.7] text-[#e0e0e0]">
      {src.split('\n').map((line, i) => {
        const c = line.indexOf('//')
        const body = c >= 0 ? line.slice(0, c) : line
        const parts = body.split(/('[^']*'|`[^`]*`|"[^"]*")/g)
        return (
          <div key={i} className="flex" style={{ animation: `skill-rise 400ms ${i * 25}ms cubic-bezier(.22,1,.36,1) both` }}>
            <span className="mr-5 w-5 shrink-0 select-none text-right text-[#525252]">{i + 1}</span>
            <span className="whitespace-pre">
              {parts.map((pt, j) => /^['"`]/.test(pt)
                ? <span key={j} className="text-[#a7f0ba]">{pt}</span>
                : <span key={j} dangerouslySetInnerHTML={{ __html: pt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(kw, '<span style="color:#be95ff">$1</span>') }} />)}
              {c >= 0 && <span className="text-[#8d8d8d] italic">{line.slice(c)}</span>}
            </span>
          </div>
        )
      })}
    </pre>
  )
}

function BuiltWithBob() {
  const [i, setI] = useState(0)
  const st = BOB_STEPS[i]
  return (
    <Wrap id="cc-8" className="bg-[#0b0d12] text-white">
      <Chapter n={8} dark title={<>From design to working code with <span className="text-[#78a9ff]">IBM Bob</span></>} />
      <Lede dark>I didn't want a clickable mock that only pretended to work. I paired with Bob, IBM's AI development partner, to turn the design decisions into a real prototype. I planned the architecture in Plan mode, then built each part in Code mode, reviewing every change Bob made before accepting it.</Lede>

      <div className="reveal mt-14 overflow-hidden rounded-2xl border border-[#393939] bg-[#161616] shadow-[0_50px_120px_-40px_rgba(15,98,254,0.45)]">
        <div className="flex items-center gap-2 border-b border-[#393939] bg-[#0b0d12] px-4 py-2.5 text-[11px] text-white/50">
          <span className="h-2.5 w-2.5 rounded-full bg-[#393939]" /><span className="h-2.5 w-2.5 rounded-full bg-[#393939]" /><span className="h-2.5 w-2.5 rounded-full bg-[#393939]" />
          <span className="ml-3">carbon-iq — IBM Bob</span>
        </div>
        <div className="grid lg:grid-cols-[220px_1fr_360px]">
          <div className="hidden border-r border-[#393939] p-3 text-[12px] lg:block">
            <p className="px-2 pb-2 text-[10px] uppercase tracking-wider text-white/40">Explorer</p>
            {BOB_STEPS.map((x, j) => (
              <button key={x.file} onClick={() => setI(j)} className={`block w-full truncate px-2 py-1.5 text-left font-mono ${i === j ? 'bg-[#262626] text-white' : 'text-white/50 hover:text-white'}`}>{x.file.replace('src/', '')}</button>
            ))}
          </div>
          <div className="min-w-0 border-r border-[#393939]">
            <div className="flex border-b border-[#393939] text-[12px]"><span className="border-t-2 border-[#0f62fe] bg-[#161616] px-4 py-2 font-mono">{st.file.split('/').pop()}</span><span className="ml-auto self-center px-4 text-[11px] text-[#42be65]">+ changes accepted</span></div>
            <div key={i} className="max-h-[440px] overflow-y-auto"><Code src={st.code} /></div>
          </div>
          <div key={'c' + i} className="flex flex-col bg-[#0f0f10]">
            <div className="flex items-center justify-between border-b border-[#393939] px-4 py-2.5 text-[12px]">
              <span className="font-medium">Bob</span>
              <span className="flex gap-1">{['Plan', 'Code'].map((m) => <span key={m} className={`px-2 py-0.5 text-[10px] ${st.mode === m ? 'bg-[#0f62fe]' : 'bg-[#262626] text-white/50'}`}>{m}</span>)}</span>
            </div>
            <div className="flex-1 space-y-4 p-4 text-[13px] leading-relaxed">
              <div className="ml-6 bg-[#262626] p-3" style={{ animation: 'card-in 500ms cubic-bezier(.22,1,.36,1) both' }}><p className="mb-1 text-[10px] uppercase tracking-wider text-white/40">Me</p>{st.prompt}</div>
              <div className="mr-6 border-l-2 border-[#0f62fe] pl-3" style={{ animation: 'card-in 500ms 350ms cubic-bezier(.22,1,.36,1) both' }}><p className="mb-1 text-[10px] uppercase tracking-wider text-[#78a9ff]">Bob</p><span className="text-white/75">{st.reply}</span>
                <p className="mt-2 font-mono text-[11px] text-white/40">✓ edited {st.file}</p></div>
            </div>
            <div className="border-t border-[#393939] p-3"><div className="bg-[#262626] px-3 py-2 text-[12px] text-white/35">Ask Bob to plan, code or review…</div></div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-4">
        {BOB_STEPS.map((x, j) => (
          <button key={x.t} onClick={() => setI(j)} className={`p-4 text-left transition ${i === j ? 'bg-[#0f62fe]' : 'bg-[#161616] hover:bg-[#262626]'}`}>
            <p className={`font-mono text-[11px] ${i === j ? 'text-white/70' : 'text-white/40'}`}>Step 0{j + 1} · {x.mode}</p>
            <p className="mt-1 text-sm font-medium">{x.t}</p>
          </button>
        ))}
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-3">
        {[['I design, Bob builds', 'I wrote prompts the way I write design specs: the user, the constraint, the expected result. Clear briefs got much better code.'], ['Same guardrails as the product', 'I asked Bob for the same thing the tool promises users: deterministic rules where there\'s a right answer, and grounded AI everywhere else.'], ['Days, not sprints', 'Bob let me get from an idea to a working prototype fast, so the playback audience could use the real thing instead of looking at slides.']].map(([a, b], j) => (
          <div key={a} className="reveal border-t border-white/30 pt-6" style={{ transitionDelay: j * 100 + 'ms' }}>
            <p className="text-xl font-semibold tracking-tight">{a}</p>
            <p className="mt-3 leading-relaxed text-white/60">{b}</p>
          </div>
        ))}
      </div>
    </Wrap>
  )
}

/* 09 playback */
function Playback() {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const themes = [
    ['"I\'d use this tomorrow."', 'PMs and sellers saw themselves in the 11pm story straight away.'],
    ['"This gives me my week back."', 'Senior designers liked that the tool repeats their rules for them and still sends the hard problems back to them.'],
    ['"Coach mode is the real idea."', 'Early-career designers responded most to learning while fixing, more than to the score.'],
  ]
  return (
    <section id="cc-10" className="px-6 py-28 text-white md:px-16 md:py-36" style={{ background: G100 }}>
      <div ref={ref} className="mx-auto max-w-[1180px]">
        <Chapter n={10} dark title={<>Playback and <span className="text-[#78a9ff]">impact</span></>} />
        <Lede dark>I presented Carbon IQ at a design playback to a large audience of designers, product managers and engineers. I told it as a story: the 11pm seller first, then the insights, then a live demo of the prototype going from "Needs work" to "Ready for review".</Lede>
        <div className="mt-14 grid grid-cols-12 gap-1.5" aria-hidden>
          {Array.from({ length: 96 }).map((_, i) => (
            <span key={i} className="aspect-square rounded-full transition-all duration-700" style={{ background: seen ? (i % 7 === 0 ? '#ffffff' : i % 3 === 0 ? '#78a9ff' : BLUE) : '#262626', transitionDelay: `${(i % 12) * 40 + Math.floor(i / 12) * 60}ms`, transform: seen ? 'scale(1)' : 'scale(0.5)' }} />
          ))}
        </div>
        <p className="mt-4 text-xs text-white/40">A packed room. Each dot is a seat.</p>
        <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-3">
          {themes.map(([q, d], i) => (
            <div key={q} className="reveal p-7" style={{ background: G100, transitionDelay: i * 100 + 'ms' }}>
              <p className="text-2xl font-semibold leading-snug tracking-tight">{q}</p>
              <p className="mt-3 text-white/60">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/40">Themes from feedback after the session, paraphrased.</p>
        <div className="reveal mt-16 border-l-4 border-[#0f62fe] pl-6 text-xl leading-relaxed text-white/80 md:text-2xl">The idea was <span className="text-white">widely praised for its potential to scale design quality across teams</span>. Many people called it insightful and genuinely helpful.</div>
        <div className="mt-24">
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Impact · from people who used it</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-[1.2fr_1fr_1fr]">
            <div className="reveal p-8" style={{ background: BLUE }}>
              <p className="text-[clamp(4rem,9vw,7rem)] font-semibold leading-none tracking-[-0.06em]">40%</p>
              <p className="mt-4 text-lg leading-snug">faster to get their work to Carbon standard</p>
            </div>
            <div className="reveal p-8" style={{ background: G90 }}>
              <p className="text-2xl font-semibold tracking-tight">No more waiting overnight</p>
              <p className="mt-3 text-white/60">Reviewers are often in a different part of the world. Instead of waiting until the next day, people get feedback in seconds and keep moving.</p>
            </div>
            <div className="reveal p-8" style={{ background: G90 }}>
              <p className="text-2xl font-semibold tracking-tight">Empowered, not scared</p>
              <p className="mt-3 text-white/60">People check their work privately first, so they share it with confidence instead of fear of judgement.</p>
            </div>
          </div>
          <p className="reveal mt-10 max-w-3xl text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-snug tracking-tight">Review overhead went down, screens became more consistent, and design expertise started reaching people who aren't designers.</p>
        </div>
      </div>
    </section>
  )
}

/* 10 reflection */
function Reflection() {
  return (
    <Wrap id="cc-11">
      <Chapter n={11} title="What I'd carry forward" />
      <div className="grid gap-10 md:grid-cols-2">
        <p className="reveal text-xl leading-relaxed text-muted">The hardest part of this product wasn't the AI. It was the tone. If it reads like a compliance tool, people learn to work around it. If it reads like a teammate, people learn Carbon. <span className="text-ink">Every decision here, from the copy to the private score, puts trust first.</span></p>
        <div className="reveal grid gap-px overflow-hidden rounded-2xl bg-line">
          {[['Validate', 'Run a real comment audit at scale to put numbers on the share of rule-based feedback'], ['Pilot', 'Wizard-of-Oz test with a senior designer behind the curtain, to tune the tone'], ['Partner', 'Write the first rule set with the Carbon team so it stays aligned with each Carbon release']].map(([a, b]) => (
            <div key={a} className="bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: BLUE }}>{a}</p><p className="mt-2">{b}</p></div>
          ))}
        </div>
      </div>
    </Wrap>
  )
}

export default function CarbonQACase() {
  useReveal()
  return (
    <main>
      <CaseNav />
      <Hero />
      <Moment />
      <Listening />
      <Insights />
      <Reframe />
      <Concepts />
      <Decisions />
      <BuiltWithBob />
      <Wrap id="cc-9" className="bg-white">
        <Chapter n={9} title="Now try it yourself" />
        <Lede>Here's the whole flow put together. Run a review on the sample page, click a finding to see it on the canvas, apply fixes and watch the score go up. Switch between Coach and Quick mode in the header to compare them.</Lede>
        <div className="reveal mt-12"><Prototype /></div>
      </Wrap>
      <Playback />
      <Reflection />
      <NextProject href="#/welcome" kicker="Public sector · Ireland" title="A warm welcome from the state" accent="#78a9ff" bg={G100} />
    </main>
  )
}
