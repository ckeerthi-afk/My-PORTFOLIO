import NextProject from '../components/NextProject'
import { useEffect, useRef, useState } from 'react'

/* palette from the project's graphic style */
const INK = '#3b1c7a'
const CREAM = '#fbfaf6'
const PINK = '#faace6'
const BUTTER = '#fbf3c4'
const LILAC = '#c7c9f7'
const SAGE = '#cfe8b8'
const CHAR = '#383333'
const BLUSH = '#fbeef7'

const IMG: Record<string, [number, number]> = { mother: [1496, 1674], workshop: [1656, 558], feet: [1542, 1436], journey: [1914, 1728], hand: [1286, 694], testing: [1336, 1468], box: [1352, 1722], sketches: [1026, 842] }
const FILE: Record<string, number> = { mother: 1, workshop: 2, feet: 3, journey: 5, hand: 6, testing: 7, box: 8, sketches: 9 }

function Crop({ src, x0 = 0, y0 = 0, x1 = 1, y1 = 1, className = '', alt = '' }: { src: string; x0?: number; y0?: number; x1?: number; y1?: number; className?: string; alt?: string }) {
  const [w, h] = IMG[src]
  const cw = x1 - x0, ch = y1 - y0
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${cw * w} / ${ch * h}` }}>
      <img src={`/welcome/${FILE[src]}.png`} alt={alt} loading="lazy" draggable={false} className="absolute max-w-none select-none" style={{ width: `${100 / cw}%`, left: `${(-x0 / cw) * 100}%`, top: `${(-y0 / ch) * 100}%` }} />
    </div>
  )
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}
function useInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}
function useProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); setP(Math.min(1, Math.max(0, -r.top / ((r.height - window.innerHeight) || 1)))) }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [ref])
  return p
}
function Count({ to, suffix = '', run, pad = 0 }: { to: number; suffix?: string; run: boolean; pad?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{String(v).padStart(pad, '0')}{suffix}</>
}

/* soft shapes from the original deck */
function Blob({ kind, color, className = '' }: { kind: 'flower' | 'burst' | 'clover'; color: string; className?: string }) {
  const pts = (n: number, r: number, ri: number) => Array.from({ length: n * 2 }, (_, i) => { const rr = i % 2 ? ri : r; const t = (i * Math.PI) / n; return `${50 + Math.cos(t) * rr},${50 + Math.sin(t) * rr}` }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className={`flower-drift pointer-events-none absolute ${className}`} aria-hidden>
      {kind === 'burst' && <polygon points={pts(16, 48, 36)} fill={color} />}
      {kind === 'flower' && <g fill={color}>{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={50 + Math.cos((i * Math.PI) / 4) * 26} cy={50 + Math.sin((i * Math.PI) / 4) * 26} r={20} />)}<circle cx="50" cy="50" r="30" /></g>}
      {kind === 'clover' && <g fill={color}>{[[30, 30], [70, 30], [30, 70], [70, 70]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r={24} />)}<circle cx="50" cy="50" r="26" /></g>}
    </svg>
  )
}

const CHAPTERS = ['Overview', 'The cliff edge', 'What we heard', 'The app', 'The Baby Box', 'What mothers felt', 'Why it worked', 'Six months on']

/* editorial act breaks: one mother's moment carries the story between chapters */
function Interlude({ act, title, moment, line, tone = CREAM, dark }: { act: string; title: string; moment: string; line: React.ReactNode; tone?: string; dark?: boolean }) {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-16 md:py-32" style={{ background: tone, color: dark ? '#fff' : INK }}>
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[220px_1fr]">
        <div className="reveal">
          <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? 'text-white/55' : 'text-muted'}`}>Act {act}</p>
          <p className="mt-2 text-2xl font-medium tracking-tight">{title}</p>
          <span className="mt-6 block h-px w-16" style={{ background: dark ? PINK : INK, opacity: 0.5 }} />
        </div>
        <div className="reveal">
          <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? 'text-white/55' : 'text-muted'}`}>{moment}</p>
          <p className="mt-5 max-w-3xl text-[clamp(1.6rem,3.2vw,2.75rem)] font-light leading-[1.15] tracking-[-0.03em]">{line}</p>
        </div>
      </div>
    </section>
  )
}
function Kicker({ n, dark }: { n: number; dark?: boolean }) {
  return <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? 'text-white/55' : 'text-muted'}`}>{String(n).padStart(2, '0')} / {CHAPTERS[n]}</p>
}
const H2 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`reveal mt-6 max-w-[22ch] text-[clamp(2rem,3.8vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.022em] ${className}`}>{children}</h2>
)
const Wrap = ({ children, id, className = '', style }: { children: React.ReactNode; id?: string; className?: string; style?: React.CSSProperties }) => (
  <section id={id} className={`relative overflow-hidden px-6 py-24 md:px-16 md:py-32 ${className}`} style={style}><div className="relative mx-auto max-w-[1180px]">{children}</div></section>
)

/* a single insight that owns the screen */
function Statement({ eyebrow, children, source, tone = '#fff', dark, align = 'left' }: { eyebrow: string; children: React.ReactNode; source?: string; tone?: string; dark?: boolean; align?: 'left' | 'right' }) {
  return (
    <section className="flex items-center px-6 py-28 md:py-36 md:px-16" style={{ background: tone, color: dark ? '#fff' : INK }}>
      <div className={`mx-auto w-full max-w-[1180px] `}>
        <p className={`reveal font-mono uppercase ${dark ? 'text-white/50' : 'text-muted'}`}>{eyebrow}</p>
        <p className="display reveal mt-8 text-[clamp(2.1rem,4.6vw,4.1rem)] leading-[1.08] tracking-[-0.024em]">{children}</p>
        {source && <p className={`reveal mt-10 text-[15px] ${dark ? 'text-white/60' : 'text-muted'}`}>— {source}</p>}
      </div>
    </section>
  )
}

function CaseNav() {
  const [p, setP] = useState(0)
  const [active, setActive] = useState(0)
  const [dark, setDark] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1))
      let a = 0
      CHAPTERS.forEach((_, i) => { const el = document.getElementById('w-' + i); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) a = i })
      setActive(a)
      // sample the page background behind the nav to keep labels legible
      const nav = navRef.current
      if (nav) {
        const r = nav.getBoundingClientRect()
        const prev = nav.style.pointerEvents; nav.style.visibility = 'hidden'
        let el = document.elementFromPoint(r.left + 4, r.top + r.height / 2) as HTMLElement | null
        nav.style.visibility = ''; nav.style.pointerEvents = prev
        let lum = 1
        while (el) { const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0.5)) { lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255; break } el = el.parentElement }
        setDark(lum < 0.5)
      }
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]"><div className="h-full origin-left" style={{ background: INK, transform: `scaleX(${p})` }} /></div>
      <aside ref={navRef} className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1480px]:block">
        <ul className="space-y-1.5">
          {CHAPTERS.map((c, i) => (
            <li key={c}><button onClick={() => document.getElementById('w-' + i)?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-[11px] leading-none transition-colors duration-300" style={{ color: active === i ? (dark ? PINK : INK) : dark ? 'rgba(255,255,255,0.6)' : '#a3a39e' }}>
              <span className="h-1 w-1 rounded-full transition-opacity duration-300" style={{ background: dark ? PINK : INK, opacity: active === i ? 1 : 0 }} />
              <span className={active === i ? 'font-medium' : dark ? 'hover:text-white' : 'hover:text-ink'}>{c}</span>
            </button></li>
          ))}
        </ul>
      </aside>
    </>
  )
}

/* ---------------- phone + app screens ----------------
   App system: plum (primary), lavender (secondary), sage (accent), warm off-white (bg).
   Spacing 8/16/24/32/48 · type 40/32/24/20/16/14 · weights 400/600 only. */
const A = { bg: '#f6f5fa', plum: '#251754', lav: '#dfe3fb', lavInk: '#4d55b8', sage: '#bfe5b2', sageInk: '#7a5bb5', cream: '#e6dfd3', rose: '#f4b3d3', ink: '#1f1a2e', mute: '#8a8597', line: '#ebe8f2', peri: '#aab6ee', lilac: '#c9aedd', pinkSoft: '#fbe3ef' }
const SHADOW = '0 1px 2px rgba(20,20,22,0.03), 0 12px 28px -18px rgba(20,20,22,0.18)'
function Phone({ children, className = '', tint = A.bg }: { children: React.ReactNode; className?: string; tint?: string }) {
  return (
    <div className={`relative mx-auto h-[640px] w-[316px] shrink-0 overflow-hidden rounded-[48px] border-[8px] border-[#1d1a1f] shadow-[0_50px_100px_-40px_rgba(37,23,84,0.45)] ${className}`} style={{ background: tint, fontFamily: 'Figtree, system-ui, sans-serif', color: A.ink }}>
      <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1d1a1f]" />
      {children}
    </div>
  )
}
const Scroll = ({ children }: { children: React.ReactNode }) => <div className="h-full overflow-y-auto px-6 pb-28 pt-14 [scrollbar-width:none]">{children}</div>
const Meta = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <p className={`text-[14px] ${className}`} style={{ color: A.mute }}>{children}</p>
const Title = ({ children }: { children: React.ReactNode }) => <h3 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">{children}</h3>
const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => <div className={`rounded-[28px] bg-white p-6 ${className}`} style={{ boxShadow: SHADOW, ...style }}>{children}</div>
const MOODS = [
  { k: 'Calm', c: A.sage, face: 'M36 58 Q50 70 64 58' },
  { k: 'Okay', c: A.cream, face: 'M37 62 L63 62' },
  { k: 'Low', c: A.rose, face: 'M36 66 Q50 55 64 66' },
] as const
function MoodFace({ m, size = 56, active }: { m: (typeof MOODS)[number]; size?: number; active?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="transition-transform duration-500" style={{ transform: active ? 'scale(1.08)' : 'none' }} aria-hidden>
      <circle cx="50" cy="50" r="48" fill={m.c} />
      {active && <circle cx="50" cy="50" r="47" fill="none" stroke={A.plum} strokeWidth="2.5" />}
      <circle cx="39" cy="44" r="3.5" fill={A.ink} /><circle cx="61" cy="44" r="3.5" fill={A.ink} />
      <path d={m.face} fill="none" stroke={A.ink} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}
const TAB_ICONS = [
  'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z',
  'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM4 10h16M8 3.5v4M16 3.5v4',
  'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 20c0-3 2.5-5.5 5.5-5.5S14 17 14 20M14.5 14.6c3 0 6 1.9 6 5.4',
  'M4 7h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 7l8 6 8-6',
]
function NavPill({ tab, setTab }: { tab: number; setTab?: (n: number) => void }) {
  const items = ['Today', 'Visits', 'Village', 'Letters']
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-around px-2 pb-6 pt-2" style={{ background: `linear-gradient(to top, ${A.bg} 70%, transparent)` }}>
      {items.map((t, i) => {
        const on = tab === i
        return (
          <button key={t} onClick={() => setTab?.(i)} className="flex w-16 flex-col items-center gap-1 text-[12px] transition" style={{ color: on ? A.plum : A.mute, fontWeight: on ? 600 : 400 }}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={on ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round"><path d={TAB_ICONS[i]} /></svg>{t}
          </button>
        )
      })}
    </div>
  )
}

/* Today: the mood check-in is the hero; everything else sits quietly below */
const WEEK0 = [0, 0, 1, 2, 0, 1] as number[]
function TodayScreen({ boxOffer, onBox }: { boxOffer?: boolean; onBox?: () => void }) {
  const [mood, setMood] = useState<number | null>(null)
  const week = [...WEEK0, mood ?? -1]
  return (
    <Scroll>
      <Meta>Week 24 · Thursday</Meta>
      <h3 className="mt-2 text-[40px] font-semibold leading-[1.02] tracking-[-0.03em]">Morning,<br />Lilly</h3>
      <div className="mt-8 rounded-[32px] p-6" style={{ background: A.plum, color: '#fff' }}>
        {mood === null ? (
          <>
            <p className="text-[24px] font-semibold leading-[1.2]">How are you feeling today?</p>
            <div className="mt-6 flex justify-between">{MOODS.map((m, i) => <button key={m.k} onClick={() => setMood(i)} className="flex flex-col items-center gap-2 text-[14px] text-white/80"><MoodFace m={m} size={60} />{m.k}</button>)}</div>
          </>
        ) : (
          <div style={{ animation: 'card-in 450ms both' }}>
            <MoodFace m={MOODS[mood]} size={44} />
            <p className="mt-4 text-[24px] font-semibold leading-[1.2]">{mood === 2 ? 'Thank you for telling us.' : 'You\u2019re doing beautifully.'}</p>
            <p className="mt-2 text-[16px] leading-[1.5] text-white/75">{mood === 2 ? 'Low days are normal. Your midwife is here if you\u2019d like to talk.' : 'Your strength is already shaping someone very special.'}</p>
            <button onClick={() => setMood(null)} className="mt-6 rounded-full bg-white px-4 py-2 text-[14px] font-semibold" style={{ color: A.plum }}>{mood === 2 ? 'Message my midwife' : 'Done'}</button>
          </div>
        )}
      </div>
      {boxOffer && (
        <button onClick={onBox} className="mt-4 w-full rounded-[28px] p-6 text-left" style={{ background: A.lav, animation: 'card-in 500ms both' }}>
          <Meta className="!text-[#6b5a86]">For you, if you need it</Meta>
          <p className="mt-2 text-[20px] font-semibold leading-[1.25]">Your Baby Box is ready to order</p>
          <p className="mt-4 text-[14px] font-semibold" style={{ color: A.plum }}>See what's inside →</p>
        </button>
      )}
      <div className="mt-12">
        <p className="text-[16px] font-semibold">This week</p>
        <div className="mt-4 flex justify-between">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2"><span className="h-8 w-8 rounded-full transition" style={{ background: week[i] >= 0 ? MOODS[week[i]].c : 'transparent', border: week[i] < 0 ? `1.5px dashed ${A.line}` : 'none' }} /><span className="text-[12px]" style={{ color: A.mute }}>{d}</span></div>
        ))}</div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t pt-6" style={{ borderColor: A.line }}>
        <div><Meta>Next visit</Meta><p className="mt-1 text-[16px] font-semibold">Tue 25 March · 10:30</p></div><span style={{ color: A.mute }}>→</span>
      </div>
    </Scroll>
  )
}
function VisitsScreen() {
  const [rec, setRec] = useState(false)
  const [bring, setBring] = useState(false)
  return (
    <Scroll>
      <Title>Visits</Title>
      <Meta className="mt-2">Your care, all in one place.</Meta>
      <div className="mt-8 rounded-[32px] p-6 text-white" style={{ background: A.lavInk }}>
        <p className="text-[14px] text-white/70">Next · in 4 days</p>
        <p className="mt-4 text-[32px] font-semibold leading-none tracking-[-0.02em]">Tue 25 Mar</p>
        <p className="mt-2 text-[20px]">10:30</p>
        <p className="mt-6 text-[16px] font-semibold">Booking visit · Dating scan</p>
        <p className="mt-1 text-[14px] text-white/70">Rotunda Antenatal Clinic</p>
        <button onClick={() => setBring((b) => !b)} className="mt-6 flex w-full items-center justify-between border-t border-white/15 pt-4 text-[14px]">What to bring<span>{bring ? '−' : '+'}</span></button>
        {bring && <p className="mt-2 text-[14px] leading-[1.5] text-white/75" style={{ animation: 'card-in 300ms both' }}>Urine sample, PPS number, previous notes</p>}
      </div>
      <button onClick={() => setRec((r) => !r)} className="mt-4 flex w-full items-center gap-4 rounded-[28px] bg-white p-6 text-left" style={{ boxShadow: SHADOW }}>
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: A.lav }}>
          {rec && <span className="absolute inset-0 animate-ping rounded-full" style={{ background: A.lav }} />}
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke={A.plum} strokeWidth="2"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
        </span>
        <span><span className="block text-[16px] font-semibold">{rec ? 'Recording…' : 'Record this visit'}</span><Meta>{rec ? 'Tap to stop. We\u2019ll write the notes.' : 'Plain-language notes afterwards'}</Meta></span>
      </button>
      <p className="mt-12 text-[16px] font-semibold">Later</p>
      {[['04', 'Apr', 'GP combined care', '14:30 · Local GP surgery'], ['18', 'Apr', 'Antenatal class', '19:00 · Online']].map(([d, m, t, s]) => (
        <div key={t} className="flex items-center gap-4 border-b py-4" style={{ borderColor: A.line }}>
          <div className="w-10 text-center"><p className="text-[20px] font-semibold leading-none">{d}</p><p className="text-[12px]" style={{ color: A.mute }}>{m}</p></div>
          <div><p className="text-[16px] font-semibold">{t}</p><Meta>{s}</Meta></div>
        </div>
      ))}
    </Scroll>
  )
}
function LettersScreen() {
  const prompts = ['How I felt today', 'A letter to my future self', 'Baby names we love']
  const [pr, setPr] = useState(0)
  const [text, setText] = useState('')
  const [sent, setSent] = useState<[string, string][]>([['Mar 21', 'It was like bubbles at first, then a flutter.'], ['Mar 14', 'Picnic at 2am. Chocolate, then crisps. I\u2019m not even surprised anymore.']])
  return (
    <Scroll>
      <Title>Letters</Title>
      <Meta className="mt-2">For you now, or for her one day.</Meta>
      <div className="mt-8 rounded-[32px] bg-white p-6" style={{ boxShadow: SHADOW }}>
        <button onClick={() => setPr((p) => (p + 1) % prompts.length)} className="text-[14px]" style={{ color: A.lavInk }}>{prompts[pr]} ↻</button>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Dear little one…" className="mt-4 h-32 w-full resize-none bg-transparent text-[20px] leading-[1.45] outline-none" style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: A.ink }} />
        <button onClick={() => { if (text.trim()) { setSent((s) => [['Today', text.trim()], ...s]); setText('') } }} className="mt-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white" style={{ background: A.plum, opacity: text.trim() ? 1 : 0.4 }}>Seal letter</button>
      </div>
      <p className="mt-12 text-[16px] font-semibold">Your letters</p>
      {sent.map(([d, l], i) => (
        <div key={d + l} className="mt-4 rounded-[24px] p-6" style={{ background: [A.pinkSoft, A.lav, '#efe6f7'][i % 3], animation: i === 0 ? 'card-in 400ms both' : undefined }}>
          <Meta>{d}</Meta>
          <p className="mt-2 line-clamp-2 text-[20px] italic leading-[1.35]" style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}>{l}</p>
        </div>
      ))}
    </Scroll>
  )
}
const BOX_ITEMS = { 'For you': ['Maternity towels', 'Nipple balm', 'Breastfeeding multivitamin', 'Tummy butter', 'Nipple shields', 'Postpartum peri bottle'], 'For baby': ['Thermometer', 'Feeding bottle', 'Pacifier', 'Muslin cloths', 'Soft bibs', 'Baby nail clippers'] } as const
function BoxScreen({ onBack }: { onBack?: () => void }) {
  const [have, setHave] = useState<string[]>([])
  const [open, setOpen] = useState<string>('For you')
  const [state, setState] = useState<'pick' | 'done' | 'skip'>('pick')
  const total = BOX_ITEMS['For you'].length + BOX_ITEMS['For baby'].length
  if (state !== 'pick') return (
    <div className="flex h-full flex-col justify-center px-6 text-center" style={{ animation: 'card-in 500ms both' }}>
      <div className="mx-auto"><MoodFace m={MOODS[0]} size={88} /></div>
      <p className="mt-8 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">{state === 'done' ? 'Your box is on its way' : 'No problem at all'}</p>
      <p className="mt-4 text-[16px] leading-[1.5]" style={{ color: A.mute }}>{state === 'done' ? `${total - have.length} essentials, packed for you. Tracking arrives two weeks before your due date.` : 'You can change your mind any time before your due date.'}</p>
      <button onClick={() => { setState('pick'); onBack?.() }} className="mx-auto mt-8 rounded-full px-6 py-3 text-[14px] font-semibold text-white" style={{ background: A.plum }}>Back to today</button>
    </div>
  )
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-14 [scrollbar-width:none]">
        {onBack && <button onClick={onBack} className="text-[14px]" style={{ color: A.mute }}>← Today</button>}
        <div className="mt-2"><Title>Your Baby Box</Title></div>
        <Meta className="mt-2">Untick anything you already have.</Meta>
        <div className="mt-8 space-y-4">
          {Object.entries(BOX_ITEMS).map(([g, list]) => {
            const on = open === g, kept = list.filter((x) => !have.includes(x)).length
            return (
              <Card key={g} className="!p-0" style={{ background: g === 'For you' ? A.pinkSoft : A.lav }}>
                <button onClick={() => setOpen(on ? '' : g)} className="flex w-full items-center justify-between p-6 text-left"><span><span className="block text-[20px] font-semibold">{g}</span><Meta>{kept} of {list.length} items</Meta></span><span className="text-[20px]" style={{ color: A.mute }}>{on ? '−' : '+'}</span></button>
                {on && <ul className="px-6 pb-4">{list.map((it) => { const off = have.includes(it); return (
                  <li key={it}><button onClick={() => setHave((h) => (off ? h.filter((x) => x !== it) : [...h, it]))} className="flex w-full items-center gap-4 border-t py-4 text-left text-[16px]" style={{ borderColor: A.line, color: off ? A.mute : A.ink }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition" style={{ background: off ? 'transparent' : A.sageInk, border: off ? `1.5px solid ${A.line}` : 'none' }}>{!off && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="3"><path d="m5 12 5 5 9-10" /></svg>}</span>
                    <span className={off ? 'line-through' : ''}>{it}</span>
                  </button></li>) })}</ul>}
              </Card>
            )
          })}
        </div>
      </div>
      <div className="flex gap-2 px-6 pb-8 pt-4">
        <button onClick={() => setState('skip')} className="flex-1 rounded-full py-3 text-[14px]" style={{ color: A.mute }}>I'm all set</button>
        <button onClick={() => setState('done')} className="flex-[1.6] rounded-full py-3 text-[14px] font-semibold text-white" style={{ background: A.plum }}>Send {total - have.length} items</button>
      </div>
    </div>
  )
}
function WelcomeScreen() {
  return (
    <div className="flex h-full flex-col justify-center px-6 text-center">
      <Meta>It's official</Meta>
      <div className="mx-auto mt-8 grid h-28 w-28 place-items-center rounded-full" style={{ background: A.lav }}><svg viewBox="0 0 24 24" className="h-10 w-10" fill={A.plum}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg></div>
      <p className="mt-8 text-[20px]">Welcome to the world,</p>
      <p className="mt-1 text-[40px] font-semibold leading-none tracking-[-0.03em]">Aoife</p>
      <Meta className="mt-4">Born 2 April · 3.4 kg</Meta>
      <Card className="mt-12 text-left"><p className="text-[16px] font-semibold">Unlocked for 6 weeks</p><Meta className="mt-1">Feeding guides · Ask a midwife · Local groups</Meta></Card>
    </div>
  )
}
function AskScreen() {
  const [msgs, setMsgs] = useState([['me', 'Is it normal that she feeds every hour at night?'], ['mw', 'Completely normal in the first weeks, it\u2019s called cluster feeding. You\u2019re doing so well.']])
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-14"><Title>Siobhán</Title><Meta className="mt-1">Midwife · replies in ~15 min</Meta></div>
      <div className="flex-1 space-y-4 overflow-y-auto px-6 pt-8 [scrollbar-width:none]">{msgs.map(([w, t], i) => <p key={i} className={`max-w-[85%] rounded-[24px] px-4 py-3 text-[16px] leading-[1.45] ${w === 'me' ? 'ml-auto text-white' : 'bg-white'}`} style={{ background: w === 'me' ? A.plum : undefined, boxShadow: w === 'me' ? 'none' : SHADOW, animation: 'card-in 400ms both' }}>{t}</p>)}</div>
      <div className="flex flex-wrap gap-2 px-6 pb-8 pt-4">{['When should I worry?', 'Find a group near me'].map((q) => <button key={q} onClick={() => setMsgs((m) => [...m, ['me', q], ['mw', q === 'Find a group near me' ? 'There\u2019s a Tuesday coffee morning 0.8 km away. Six mums are going.' : 'Fewer than 6 wet nappies a day, or very sleepy? Call us straight away.']])} className="rounded-full px-4 py-2 text-[14px]" style={{ background: A.lav, color: A.plum }}>{q}</button>)}</div>
    </div>
  )
}
function ProudScreen() {
  return (
    <Scroll>
      <Meta>Aoife · 6 months</Meta>
      <div className="mt-2"><Title>Her firsts</Title></div>
      <div className="mt-8 border-l-2 pl-6" style={{ borderColor: A.lav }}>
        {[['First smile', '6 weeks'], ['First vaccine', 'Badge earned'], ['Rolled over', '4 months'], ['First laugh', '4 months']].map(([t, s], i) => (
          <div key={t} className="relative pb-6" style={{ animation: `card-in 500ms ${i * 100}ms both` }}><span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full" style={{ background: [A.rose, A.sage, A.peri, A.lilac][i] }} /><p className="text-[20px] font-semibold">{t}</p><Meta>{s}</Meta></div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-full py-3 text-[14px] font-semibold text-white" style={{ background: A.plum }}>Share her scrapbook</button>
    </Scroll>
  )
}


/* ---------------- 0. hero ---------------- */
/* landing-only cursor trail: small pink and butter flowers bloom and fade behind the pointer */
export function FlowerTrail() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = ref.current, host = box?.parentElement
    if (!box || !host || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return
    let last = 0, lx = -999, ly = -999, n = 0
    const petals = (c: string) => Array.from({ length: 8 }, (_, i) => `<circle cx="${50 + Math.cos((i * Math.PI) / 4) * 26}" cy="${50 + Math.sin((i * Math.PI) / 4) * 26}" r="20" fill="${c}"/>`).join('') + `<circle cx="50" cy="50" r="30" fill="${c}"/>`
    const burst = (c: string) => `<polygon fill="${c}" points="${Array.from({ length: 32 }, (_, i) => { const r = i % 2 ? 36 : 48, t = (i * Math.PI) / 16; return `${50 + Math.cos(t) * r},${50 + Math.sin(t) * r}` }).join(' ')}"/>`
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now()
      if (now - last < 22 || Math.hypot(x - lx, y - ly) < 12) return
      last = now; lx = x; ly = y
      const palette = ['#faace6', '#f5d96a', '#f7c4e3', '#fbe58f', '#c9aedd', '#bfe5b2']
      for (let k = 0; k < 2 + Math.floor(Math.random() * 2); k++) {
        n++
        const size = 10 + Math.random() * 26, color = palette[Math.floor(Math.random() * palette.length)]
        const ox = (Math.random() - 0.5) * 34, oy = (Math.random() - 0.5) * 34
        const el = document.createElement('div')
        el.innerHTML = `<svg viewBox="0 0 100 100" width="${size}" height="${size}">${n % 3 ? petals(color) : burst(color)}${n % 3 ? '<circle cx="50" cy="50" r="12" fill="#fff" opacity="0.85"/>' : ''}</svg>`
        el.style.cssText = `position:absolute;left:${x + ox - size / 2}px;top:${y + oy - size / 2}px;pointer-events:none`
        box.appendChild(el)
        const rot = (Math.random() - 0.5) * 360, dx = (Math.random() - 0.5) * 60, dy = 30 + Math.random() * 60
        el.animate([
          { transform: 'scale(0) rotate(0deg)', opacity: 0 },
          { transform: `scale(1.15) rotate(${rot * 0.3}deg)`, opacity: 1, offset: 0.15 },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.4}px) scale(1) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.4) rotate(${rot}deg)`, opacity: 0 },
        ], { duration: 1800 + Math.random() * 1400, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => el.remove()
      }
    }
    host.addEventListener('pointermove', move)
    return () => host.removeEventListener('pointermove', move)
  }, [])
  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" />
}

function Hero() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [y, setY] = useState(0)
  useEffect(() => { const on = () => setY(window.scrollY); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on) }, [])
  return (
    <section id="w-0" className="text-[#1f1a2e]" style={{ background: '#f6f3ee' }}>
      <div className="relative overflow-hidden px-6 pb-24 pt-32 md:px-16 md:pt-36">
        <FlowerTrail />
        <Blob kind="burst" color={PINK} className="right-[8%] top-28 h-14 w-14" />
        <Blob kind="flower" color={BUTTER} className="left-[4%] top-[88%] h-12 w-12" />
        <div className="mx-auto max-w-[1180px]">
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.14em] text-[#6f6a7a]">Case study · Service design · Public sector, Ireland</p>
          <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <h1 className="reveal text-[clamp(2.75rem,5.6vw,5.25rem)] font-light leading-[1.05] tracking-[-0.03em]" style={{ color: '#1f1a2e' }}>A warm<br /><b className="font-medium" style={{ color: '#c2408a' }}>welcome</b><br />from the state.</h1>
              <p className="reveal mt-8 max-w-lg text-[clamp(1.15rem,1.6vw,1.4rem)] leading-snug" style={{ color: '#1f1a2e' }}>Every baby born in Ireland gets a birth certificate. We asked what it would mean to give every mother <span className="hl">a welcome</span>: a companion app and a Baby Box that stay with her long after the hospital doors close.</p>
            </div>
            <div className="relative h-[480px] md:h-[580px]">
              <div className="absolute left-0 top-0 w-[64%] overflow-hidden rounded-[30px] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)]" style={{ transform: `translateY(${y * -0.05}px) rotate(-2deg)`, animation: 'card-in 900ms cubic-bezier(.22,1,.36,1) both' }}>
                <img src="/welcome/research-wall.png" alt="Sorting interview notes on a wall of sticky notes" draggable={false} className="aspect-[4/5] w-full select-none object-cover" style={{ objectPosition: '62% 45%' }} />
              </div>
              <div className="absolute bottom-0 right-0 origin-bottom-right scale-[0.78]" style={{ transform: `translateY(${y * -0.12}px) rotate(4deg) scale(0.78)`, animation: 'card-in 900ms 200ms cubic-bezier(.22,1,.36,1) both' }}><Phone><TodayScreen /></Phone></div>
            </div>
          </div>

          <div className="reveal mt-24 grid gap-12 border-t border-black/10 pt-10 md:grid-cols-[1fr_1.1fr_1fr] md:gap-16">
            <div>
              <p className="text-[clamp(3.5rem,6vw,5rem)] font-medium leading-none tracking-[-0.03em]" style={{ color: '#1f1a2e' }}>1<span className="ml-2 text-2xl tracking-tight text-[#1f1a2e]">month</span></p>
              <div className="mt-6 flex gap-1">{['Listen', 'Map', 'Design', 'Test'].map((p, i) => <div key={p} className="flex-1"><div className="h-1.5 rounded-full" style={{ background: INK, opacity: 0.3 + i * 0.22 }} /><p className="mt-2 text-xs text-[#6f6a7a]">{p}</p></div>)}</div>
            </div>
            <div><p className="font-mono uppercase text-[#6f6a7a]">What I owned</p><p className="mt-4 text-[19px] leading-[1.5]">UX/UI design in a small team: research, information architecture, wireframes, hi-fi UI, design system and the Baby Box experience.</p></div>
            <div><p className="font-mono uppercase text-[#6f6a7a]">What we made</p><ul className="mt-4 space-y-2 text-[19px] leading-[1.5]">{['A service blueprint', 'A companion app', 'A physical Baby Box'].map((t, i) => <li key={t} className="flex items-center gap-3"><span className="font-mono text-xs" style={{ color: '#1f1a2e' }}>0{i + 1}</span>{t}</li>)}</ul></div>
          </div>
          <div className="reveal mt-24 grid gap-12 md:grid-cols-[240px_1fr] md:gap-16">
            <dl className="space-y-6 self-end text-sm">
              {[['Focus', 'Service design, user research, UX/UI, physical product'], ['Users', 'Pregnant women and new mothers across Ireland'], ['Worked with', 'The HSE, midwives and expecting mothers'], ['Platform', 'Mobile app + Baby Box'], ['Presented to', 'Department of Public Expenditure, NDP Delivery and Reform']].map(([a, b]) => (
                <div key={a}><dt className="text-[#6f6a7a]">{a}</dt><dd className="mt-1 font-medium" style={{ color: '#1f1a2e' }}>{b}</dd></div>
              ))}
            </dl>
            <div>
            <p className="mb-6 font-mono uppercase" style={{ color: INK }}>TL;DR</p>
            <div className="rounded-2xl bg-white p-7 ring-1 ring-black/5 md:p-10">
              <p className="text-[19px] leading-[1.75] text-[#6f6a7a] md:text-[21px]">
                In Ireland, care is close during pregnancy but <span style={{ color: '#1f1a2e' }}>drops away the moment mothers leave the hospital</span>. Our research showed mothers didn't want another app; they wanted to feel less alone. We designed <span className="font-medium" style={{ color: '#1f1a2e' }}>a calm companion app and an opt-in Baby Box</span> that <mark className="rounded-[3px] box-decoration-clone px-1" style={{ background: 'rgba(250,172,230,0.35)', color: '#c2408a' }}>stay with her for six months</mark>, <mark className="rounded-[3px] box-decoration-clone px-1" style={{ background: 'rgba(250,172,230,0.35)', color: '#c2408a' }}>bring her village closer</mark> and <mark className="rounded-[3px] box-decoration-clone px-1" style={{ background: 'rgba(250,172,230,0.35)', color: '#c2408a' }}>make the state's welcome feel personal</mark>.
              </p>
            </div>
            </div>
          </div>
          <div ref={ref} className="mt-24 grid grid-cols-2 gap-x-10 gap-y-12 border-t border-black/10 pt-10 md:grid-cols-4">
            {[['94%', 'task success in testing'], ['4.6/5', 'rated calming by mothers'], ['30', 'mothers shaped the Baby Box'], ['6 months', 'of support, not 6 days']].map(([n, l], i) => (
              <div key={l} className="transition-all duration-700" style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(12px)', transitionDelay: i * 100 + 'ms' }}><p className="text-4xl font-medium tracking-[-0.025em] md:text-5xl" style={{ color: INK }}>{n}</p><p className="mt-2 text-sm text-[#6f6a7a]">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 1. the gap ---------------- */
function Gap() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  const care = [92, 90, 88, 95, 30, 22, 18, 25]
  const labels = ['12 wks', '20 wks', '28 wks', 'Birth', 'Day 3', 'Week 2', 'Week 4', 'Week 6']
  const shown = Math.round(p * 1.4 * care.length)
  return (
    <section id="w-1" className="text-white" style={{ background: INK }}>
      <div ref={ref} className="relative h-[230vh]">
        <div className="sticky top-0 flex h-screen items-center px-6 md:px-16">
          <div className="mx-auto grid w-full max-w-[1180px] items-center gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <Kicker n={1} dark />
              <p className="mt-6 text-[clamp(2.25rem,4.4vw,4rem)] font-light leading-[1.05] tracking-[-0.03em]">"The moment I walked out of the hospital, <b className="font-medium" style={{ color: PINK }}>I had no idea what to do first.</b>"</p>
              <p className="mt-8 max-w-md text-lg text-white/70 transition-opacity duration-700" style={{ opacity: p > 0.5 ? 1 : 0 }}>Ireland's population keeps growing. 1 in 4 families is a one-parent family. 24.4% of births are to mothers who aren't Irish, often far from family. The support doesn't scale with any of it.</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Contact with care, as mothers described it</p>
              <div className="mt-6 flex h-64 items-end gap-2">
                {care.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-2xl transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ height: i < shown ? `${v * 2.4}px` : '4px', background: i < 4 ? LILAC : PINK, opacity: i < shown ? 1 : 0.2 }} />
                    <p className="text-[10px] text-white/55">{labels[i]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xl transition-all duration-700 md:text-2xl" style={{ opacity: p > 0.7 ? 1 : 0, color: PINK }}>The cliff edge is exactly when questions peak.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 2. listening ---------------- */
function Listening() {
  const [q, setQ] = useState(0)
  const quotes = [
    ["Childbirth shouldn't be viewed as mundane. It's extraordinary, and should be celebrated. You're making a new citizen.", 'Mother & nurse'],
    ["Care can drop off after birth. Mothers have lots of questions, but midwives don't have the time.", 'Service designer'],
    ["People don't know their neighbours anymore. They're not used to connecting locally.", 'Midwife'],
  ]
  return (
    <Wrap id="w-2" style={{ background: CREAM }}>
      <Kicker n={2} />
      <H2 className="text-[#3b1c7a]">We couldn't design for mothers until we understood <span className="text-muted">what happened after the hospital doors closed.</span></H2>
      <p className="reveal mt-10 max-w-[44ch] text-[clamp(1.3rem,1.9vw,1.65rem)] leading-[1.45]" style={{ color: INK }}>
        So we sat down with <b className="font-semibold">10+ mothers</b>, raising <b className="font-semibold">20+ children</b> between them, alongside <b className="font-semibold">3 midwives</b> and <b className="font-semibold">2 service designers</b>.
      </p>
      <p className="reveal mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-muted">Then we spread hundreds of sticky notes across tables and walls until the same few feelings kept surfacing.</p>
      <div className="reveal mt-24 grid items-end gap-6 md:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-[20px]"><Crop src="workshop" x0={0.515} y0={0.05} x1={0.995} y1={0.95} alt="Clustering sticky notes on a wall" /></div>
        <p className="pb-2 text-[15px] leading-[1.6] text-muted md:max-w-[28ch]">Affinity mapping: every note was a moment a mother described. The clusters became the findings in the next chapter.</p>
      </div>
      <figure className="mt-24">
        <p className="reveal font-mono uppercase text-muted">The voices we kept returning to</p>
        <blockquote key={q} className="display mt-8 max-w-[24ch] text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.12] tracking-[-0.022em]" style={{ color: INK, animation: 'card-in 600ms both' }}>"{quotes[q][0]}"</blockquote>
        <figcaption className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px]">
          {quotes.map(([, w], i) => (
            <button key={w} onClick={() => setQ(i)} className="border-b pb-1 transition-colors" style={{ color: q === i ? INK : '#9a9a95', borderColor: q === i ? INK : 'transparent' }}>{w}</button>
          ))}
        </figcaption>
      </figure>
    </Wrap>
  )
}

/* ---------------- 3. insights ---------------- */
function ThemeArtifact({ k }: { k: number }) {
  if (k === 0) return (
    <div className="flex h-16 items-end gap-1.5" aria-hidden>{[90, 88, 94, 96, 28, 20, 16, 22].map((v, i) => <span key={i} className="w-3 rounded-full" style={{ height: `${v * 0.6}px`, background: i < 4 ? LILAC : PINK }} />)}<span className="ml-3 self-center text-sm text-muted">contact with care, before and after birth</span></div>
  )
  if (k === 1) return (
    <div className="flex items-center gap-4 text-sm text-muted" aria-hidden><span className="rounded-md border border-line bg-white px-3 py-2 font-mono text-[11px] tracking-widest">FORM BR-1 · BIRTH REGISTRATION</span><span>was the only thing that arrived.</span></div>
  )
  if (k === 2) return (
    <div className="flex max-w-md items-center gap-3 rounded-full px-5 py-3 text-[15px]" style={{ background: BLUSH, color: INK, boxShadow: `inset 0 0 0 1px ${PINK}` }} aria-hidden><svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="#c04f9d" strokeWidth="2"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>is it normal baby feeds every hour<span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium" style={{ color: "#c04f9d" }}>3:12 a.m.</span></div>
  )
  return (
    <div className="flex items-baseline gap-3" aria-hidden><span className="text-5xl font-medium tracking-[-0.03em]" style={{ color: INK }}>3 days</span><span className="text-sm text-muted">the longest one mother went without talking to another adult</span></div>
  )
}
function Heard() {
  const themes = [
    ['Care dropped off after birth', 'Care can drop off after birth. Mothers have lots of questions, but midwives don\u2019t have the time.', 'Service designer'],
    ['Recognition was missing', 'Childbirth shouldn\u2019t be viewed as mundane. It\u2019s extraordinary. You\u2019re making a new citizen.', 'Mother & nurse'],
    ['Information felt fragmented', 'I\u2019d end up on YouTube at 3 a.m. because I felt silly calling anyone with a question that small.', 'Mother of two'],
    ['Isolation appeared quickly', 'My partner went back to work and I went days without an adult conversation.', 'First-time mother'],
  ]
  return (
    <section id="w-2" className="bg-white px-6 md:px-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex min-h-[90vh] flex-col justify-center py-24">
          <Kicker n={2} />
          <h2 className="reveal mt-10 text-[clamp(2.6rem,6.2vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.03em]" style={{ color: INK }}>Nobody said they needed an app.<br /><span className="text-muted">They said they felt alone.</span></h2>
          <p className="reveal mt-14 max-w-[52ch] text-[clamp(1.1rem,1.4vw,1.3rem)] leading-[1.65] text-[#4a4a4a]">Through interviews, we discovered that mothers weren't asking for new technology. They were asking for <b className="font-semibold" style={{ color: INK }}>guidance, recognition, connection and reassurance</b> after leaving the hospital.</p>
        </div>
        {themes.map(([t, q, who], i) => (
          <article key={t} className="grid gap-10 border-t border-line py-24 md:grid-cols-[1fr_1.35fr] md:gap-20 md:py-32">
            <div className="reveal">
              <p className="font-mono uppercase text-muted">Theme 0{i + 1}</p>
              <h3 className="display mt-5 max-w-[14ch] text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.06] tracking-[-0.025em]" style={{ color: INK }}>{t}</h3>
            </div>
            <div className="reveal" style={{ transitionDelay: '150ms' }}>
              <blockquote className="max-w-[30ch] text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.4] text-[#2b2b2b]"><span style={{ color: PINK }}>“</span>{q}<span style={{ color: PINK }}>”</span></blockquote>
              <p className="mt-4 text-sm text-muted">{who}</p>
              <div className="mt-12"><ThemeArtifact k={i} /></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------- 4. ecosystem ---------------- */
const ECO = [
  ['Midwives & public-health nurses', 'Close', 'A quick view of how she\u2019s doing, and fewer manual check-ins.'],
  ['Partners & family', 'Close', 'A shared view of her wellbeing, and practical ways to help.'],
  ['Other mothers', 'Close', 'Someone due the same month, a few streets away.'],
  ['Obstetricians', 'Care', 'Mood and symptom history over time, with early alerts for risk.'],
  ['Mental-health counsellors', 'Care', 'A gentle referral path, and context before the first session.'],
  ['Hospitals & maternity wards', 'Care', 'A birth that\u2019s celebrated at the bedside, not just registered.'],
  ['Clinic admins', 'Care', 'Less paperwork, and clear service quality signals.'],
  ['Programme owners', 'Wider', 'Fair access for every mother, and privacy built in.'],
  ['Baby Box suppliers', 'Wider', 'Accurate orders, so less ends up wasted.'],
  ['Community hubs & NGOs', 'Wider', 'A way to reach mothers with local groups and events.'],
  ['Researchers & regulators', 'Wider', 'De-identified insight, with consent she can trust.'],
] as const
function Stakeholders() {
  const [sel, setSel] = useState<number | null>(null)
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const radius = { Close: 24, Care: 36, Wider: 46 } as const
  const tierIdx = (i: number) => ECO.filter((e, j) => j < i && e[1] === ECO[i][1]).length
  const tierN = (t: string) => ECO.filter((e) => e[1] === t).length
  const pos = (i: number) => {
    const t = ECO[i][1]; const off = { Close: -90, Care: -50, Wider: -25 }[t]
    const a = ((off + (360 / tierN(t)) * tierIdx(i)) * Math.PI) / 180
    return [50 + Math.cos(a) * radius[t], 50 + Math.sin(a) * radius[t]]
  }
  const cur = sel === null ? null : ECO[sel]
  return (
    <section className="px-6 py-24 md:px-16 md:py-32" style={{ background: CREAM }}>
      <div className="mx-auto max-w-[1180px]">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-mono uppercase text-muted">Who has to show up</p>
            <h2 className="reveal mt-6 max-w-[20ch] text-[clamp(2rem,3.8vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.022em]" style={{ color: INK }}>She's at the centre. <span className="text-muted">Eleven groups have to show up for her.</span></h2>
          </div>
          <figure>
            <div className="overflow-hidden rounded-[24px]"><img src="/welcome/workshop-sorting.png" alt="Team members writing and sorting sticky notes on a table during a research workshop" loading="lazy" draggable={false} className="aspect-[16/10] w-full select-none object-cover transition duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.02]" style={{ objectPosition: '50% 55%' }} /></div>
          </figure>
        </div>
        <div className="mt-6 grid items-center gap-16 lg:grid-cols-[1.25fr_1fr]">
          <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[560px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              {ECO.map((_, i) => { const [x, y] = pos(i); const on = sel === i; return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={on ? INK : '#d9d3e6'} strokeWidth={on ? 0.4 : 0.2} strokeDasharray={on ? '0' : '0.8 0.8'} style={{ opacity: seen ? 1 : 0, transition: `opacity 600ms ${i * 80}ms, stroke 300ms` }} /> })}
            </svg>
            <div className="absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-8 ring-white" style={{ boxShadow: `0 20px 60px -20px ${INK}66` }}>
              <Crop src="mother" x0={0.06} y0={0.08} x1={0.46} y1={0.44} className="h-full w-full" alt="A mother holding her newborn" />
            </div>
            <p className="absolute left-1/2 top-[64%] -translate-x-1/2 text-sm font-medium" style={{ color: INK }}>Her</p>
            {ECO.map(([n, t], i) => {
              const [x, y] = pos(i); const on = sel === i
              return (
                <button key={n} onClick={() => setSel(on ? null : i)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x + '%', top: y + '%', opacity: seen ? 1 : 0, transform: `translate(-50%,-50%) scale(${seen ? 1 : 0.6})`, transition: `all 500ms ${300 + i * 80}ms` }} aria-pressed={on} aria-label={n}>
                  <span className="block rounded-full transition-all duration-300 group-hover:scale-125" style={{ width: t === 'Close' ? 18 : t === 'Care' ? 14 : 11, height: t === 'Close' ? 18 : t === 'Care' ? 14 : 11, background: on ? INK : t === 'Close' ? PINK : t === 'Care' ? LILAC : '#e7e2ef', boxShadow: on ? `0 0 0 6px ${BLUSH}` : 'none' }} />
                  <span className="absolute left-1/2 top-full mt-2 w-28 -translate-x-1/2 text-center text-[12px] leading-tight transition-colors" style={{ color: on ? INK : '#7a7a7a', fontWeight: on ? 600 : 400 }}>{n}</span>
                </button>
              )
            })}
          </div>
          <div className="min-h-[220px]">
            {cur ? (
              <div key={sel} style={{ animation: 'card-in 450ms both' }}>
                <p className="font-mono uppercase text-muted">{cur[1] === 'Close' ? 'Closest to her' : cur[1] === 'Care' ? 'Around her care' : 'The wider system'}</p>
                <p className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-[1.15] tracking-[-0.02em]" style={{ color: INK }}>{cur[0]}</p>
                <p className="mt-4 max-w-[40ch] text-lg leading-[1.6] text-[#4a4a4a]">{cur[2]}</p>
                <button onClick={() => setSel(((sel ?? 0) + 1) % ECO.length)} className="mt-8 text-sm font-medium" style={{ color: INK }}>Next: {ECO[((sel ?? 0) + 1) % ECO.length][0]} →</button>
              </div>
            ) : (
              <div>
                <p className="max-w-[34ch] text-[clamp(1.3rem,2vw,1.65rem)] leading-[1.4]" style={{ color: INK }}>The closer someone sits to her, the more she feels it when they don't show up.</p>
                <p className="mt-6 text-[15px] text-muted">Tap anyone around her to see what they need for this to work.</p>
                <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted">{[['Closest to her', PINK], ['Around her care', LILAC], ['The wider system', '#e7e2ef']].map(([l, c]) => <span key={l} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{l}</span>)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
/* ---------------- 5. journey ---------------- */
const FEEL = [['Finding out', 2], ['8 wks', 1], ['12 wks', 1], ['20 wks', 2], ['28 wks', 1], ['36 wks', 0], ['Birth', 3], ['Home', 2], ['Week 1', 1], ['Week 2', 2], ['Week 4', 0], ['Week 6', -1], ['Back to work', -1]] as const
function Journey() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [hover, setHover] = useState<number | null>(null)
  const W = 1000, H = 260
  const pt = (i: number) => [40 + (i * (W - 80)) / (FEEL.length - 1), 130 - FEEL[i][1] * 32] as const
  const d = FEEL.map((_, i) => { const [x, y] = pt(i); return `${i ? 'L' : 'M'}${x} ${y}` }).join(' ')
  const notes: Record<number, string> = { 6: 'Joy, relief, and full support around her.', 10: 'Partner back at work. Visits slow down.', 11: 'Lowest point: alone, exhausted, unsure who to ask.', 12: 'Juggling work, appointments and a baby.' }
  return (
    <Wrap id="w-5" className="bg-white">
      <Kicker n={5} />
      <H2 className="text-[#3b1c7a]">We mapped how it <span className="hl">feels</span>, not just what happens.</H2>
      <p className="reveal mt-8 max-w-[60ch] text-lg leading-[1.65] text-muted">A journey and experience map from finding out to returning to work, built from the interviews. The curve told the story more clearly than any quote.</p>
      <div ref={ref} className="reveal relative mt-12 overflow-x-auto rounded-[28px] p-6 md:p-10" style={{ background: CREAM }}>
        <svg viewBox={`0 0 ${W} ${H + 40}`} className="min-w-[720px]">
          <line x1="20" x2={W - 20} y1="130" y2="130" stroke="#ddd" strokeDasharray="4 6" />
          <text x="20" y="20" fontSize="12" fill="#999">Supported</text><text x="20" y={H} fontSize="12" fill="#999">Alone</text>
          <rect x={pt(9)[0]} y="10" width={pt(12)[0] - pt(9)[0] + 20} height={H - 10} rx="20" fill={PINK} opacity={0.25} />
          <text x={pt(9)[0] + 14} y="34" fontSize="12" fill={INK} fontWeight="600">Where we focused</text>
          <path d={d} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={seen ? 0 : 1} style={{ transition: 'stroke-dashoffset 2s cubic-bezier(.22,1,.36,1)' }} />
          {FEEL.map(([l, v], i) => { const [x, y] = pt(i); const c = v >= 2 ? SAGE : v >= 1 ? BUTTER : PINK; return (
            <g key={l} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer" style={{ opacity: seen ? 1 : 0, transition: `opacity 500ms ${300 + i * 90}ms` }}>
              <circle cx={x} cy={y} r={hover === i ? 15 : 11} fill={c} stroke={INK} strokeWidth="1.5" style={{ transition: 'r 200ms' }} />
              <text x={x} y={H + 30} fontSize="11" fill="#666" textAnchor="middle">{l}</text>
            </g>
          ) })}
        </svg>
        <p className="mt-2 min-h-[28px] text-lg" style={{ color: INK }}>{hover !== null ? (notes[hover] ?? FEEL[hover][0]) : 'Hover the curve to read the moments that mattered.'}</p>
      </div>
      <details className="reveal group mt-6 rounded-[28px] border border-line p-6">
        <summary className="cursor-pointer list-none font-medium" style={{ color: INK }}>See the original team journey map <span className="text-muted transition group-open:rotate-45">+</span></summary>
        <div className="mt-6 overflow-hidden rounded-2xl"><Crop src="journey" x0={0.01} y0={0.4} x1={0.99} y1={0.995} alt="Full journey map with actions, touchpoints, pain points and opportunities" /></div>
      </details>
    </Wrap>
  )
}

/* ---------------- 6. reframe ---------------- */
function Reframe() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  const hmw = [
    ['"At 3 a.m. I\u2019m stuck Googling questions I\u2019m too shy to ask."', 'Trusted, bite-sized answers from professionals, on demand.', 'How might we deliver reliable advice the moment a question arises, so parents can ditch late-night guesswork?'],
    ['"The moment I walked out of the hospital, I had no idea what to do first."', 'A clear, step-by-step roadmap for the first days and weeks.', 'How might we give new parents an easy-to-follow guide so they never feel lost once they leave maternity care?'],
    ['"I can go days without speaking to another adult."', 'Low-pressure ways to connect with nearby parents and supports.', 'How might we help mothers form supportive local connections without adding stress to their day?'],
  ]
  return (
    <section id="w-6">
      <div ref={ref} className="relative h-[200vh]" style={{ background: '#2a1557' }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 text-white md:px-16">
          <div className="pointer-events-none absolute right-[6%] top-1/2 hidden w-[280px] -translate-y-1/2 overflow-hidden rounded-[28px] opacity-80 lg:block" style={{ transform: `translateY(calc(-50% + ${(0.5 - p) * 80}px))` }}><Crop src="feet" x0={0.345} y0={0.57} x1={0.572} y1={0.83} alt="A newborn's feet" /></div>
          <div className="relative mx-auto w-full max-w-[1180px]">
            <Kicker n={6} dark />
            <p className="mt-8 max-w-3xl text-[clamp(1.9rem,3.8vw,3.4rem)] font-light leading-[1.04] tracking-[-0.025em]">
              <span>How might we offer timely advice and essentials </span>
              <span className="transition-opacity duration-700" style={{ opacity: p > 0.3 ? 1 : 0.18 }}>that make new Irish mothers feel </span>
              <b className="font-medium transition-opacity duration-700" style={{ opacity: p > 0.5 ? 1 : 0.18, color: PINK }}>both supported and proud?</b>
            </p>
            <p className="mt-10 max-w-xl text-lg text-white/70 transition-opacity duration-700" style={{ opacity: p > 0.65 ? 1 : 0 }}>"Supported" answers the drop-off in care. <b className="text-white">"Proud" answers the missing recognition.</b> Most maternity tools only do the first.</p>
          </div>
        </div>
      </div>
      <Wrap className="bg-white">
        <p className="reveal font-mono text-[11px] uppercase tracking-widest text-muted">From what we heard, to what we designed for</p>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {hmw.map(([pr, need, st], i) => (
            <div key={st} className="reveal group grid gap-4 py-9 md:grid-cols-[60px_1fr_1fr_1.3fr] md:gap-8" style={{ transitionDelay: i * 80 + 'ms' }}>
              <p className="font-mono text-sm" style={{ color: INK }}>0{i + 1}</p>
              <p className="text-lg italic text-muted">{pr}</p>
              <p className="text-[16px] leading-relaxed">{need}</p>
              <p className="text-xl font-medium leading-snug tracking-tight transition-transform duration-500 group-hover:translate-x-1" style={{ color: INK }}>{st}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ---------------- 7. service blueprint ---------------- */
const BP = [
  ['Third trimester', '6–8 weeks before birth', 'Registers pregnancy in the app; short needs survey', 'Companion app, bite-sized tips, Baby Box opt-in', 'Civil registry verifies PPS; midwife portal flags eligibility', 'Health database, identity verification'],
  ['Preparation', '2 weeks before birth', 'Push: "Your Baby Box is ready"', 'Tracking link and a preview of what\u2019s inside', 'Logistics prints label; warehouse picks items', 'Fulfilment centre, parcel tracking'],
  ['Birth & hospital', 'Day 0', 'Gives birth; scans the crib-card QR', 'Congratulations screen; newborn content unlocks', 'Hospital admin logs the birth', 'Maternity-ward Wi-Fi QR, birth registry'],
  ['Baby Box arrives', '0–3 days', 'Opens the box; guided unboxing in the app', 'Physical Baby Box with a thank-you note', 'Content team pushes tutorials', 'Customer service CRM'],
  ['Early weeks', '0–6 weeks', 'Logs feeds and moods; chats with a midwife; books a clinic', 'Ask-a-midwife chat, booking, community', 'Midwives reply via secure tool; booking syncs', 'Telehealth, appointment engine, moderation'],
  ['Pride & community', '6 weeks – 6 months', 'Shares milestones; earns a vaccination badge', 'Digital scrapbook, shareable certificate', 'Analytics track engagement; feedback survey', 'Analytics dashboard, survey tool'],
]
const LANES = ['She does', 'She sees', 'Behind the scenes', 'Systems']
function Service() {
  const [col, setCol] = useState(0)
  return (
    <Wrap id="w-7" style={{ background: CREAM }}>
      <Kicker n={7} />
      <H2 className="text-[#3b1c7a]">Warmth has to be <span className="hl">real</span> behind the scenes, too.</H2>
      <p className="reveal mt-8 max-w-[60ch] text-lg leading-[1.65] text-muted">The service blueprint lined up what the mother does, what she sees, and everything the State, hospitals and suppliers need to do behind the scenes, so every touchpoint is real, not wishful.</p>
      <div className="reveal mt-12 flex gap-2 overflow-x-auto pb-2">
        {BP.map((b, i) => <button key={b[0]} onClick={() => setCol(i)} className="shrink-0 rounded-full px-4 py-2 text-sm transition" style={{ background: col === i ? INK : '#fff', color: col === i ? '#fff' : INK }}><span className="mr-2 font-mono text-xs opacity-60">0{i + 1}</span>{b[0]}</button>)}
      </div>
      <div className="reveal mt-4 overflow-hidden rounded-[28px] bg-white">
        <div className="grid border-b border-line md:grid-cols-[180px_1fr]"><p className="p-5 font-mono text-[11px] uppercase tracking-widest text-muted">When</p><p key={col} className="p-5 text-2xl font-medium tracking-tight" style={{ color: INK, animation: 'card-in 400ms both' }}>{BP[col][1]}</p></div>
        {LANES.map((l, i) => (
          <div key={l} className="grid border-b border-line last:border-0 md:grid-cols-[180px_1fr]">
            <p className="p-5 text-sm font-medium" style={{ color: i < 2 ? INK : '#8a8a8a', background: i < 2 ? (i ? '#f5f6fd' : BLUSH) : '#fafafa' }}>{l}{i === 1 && <span className="block text-[11px] font-normal text-muted">line of visibility ↓</span>}</p>
            <p key={col + l} className="p-5 text-lg leading-snug" style={{ animation: `card-in 400ms ${i * 60}ms both` }}>{BP[col][i + 2]}</p>
          </div>
        ))}
      </div>
      <p className="reveal mt-10 text-sm text-muted">Tip: each stage maps to a screen in the app below.</p>
    </Wrap>
  )
}

/* ---------------- 8. the app ---------------- */
function VillageScreen() {
  const [hugs, setHugs] = useState<Record<number, boolean>>({})
  const [going, setGoing] = useState(false)
  const [buddy, setBuddy] = useState(false)
  const posts = [['Niamh', '31 weeks · Cork', 'Anyone else awake with heartburn? Solidarity from Cork.', 12], ['Amara', '29 weeks · Dublin 8', 'First kicks today. My partner finally felt them too.', 34]] as const
  return (
    <Scroll>
      <Title>Village</Title>
      <Meta className="mt-2">Due in March · 214 mums</Meta>
      <div className="mt-8 rounded-full bg-white px-6 py-4 text-[16px]" style={{ boxShadow: SHADOW, color: A.mute }}>Share how you're doing…</div>
      {posts.map(([n, m, t, c], i) => (
        <div key={n} className="border-b py-6" style={{ borderColor: A.line }}>
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full text-[14px] font-semibold" style={{ background: i ? A.rose : A.peri, color: A.ink }}>{n[0]}</span><div><p className="text-[16px] font-semibold leading-tight">{n}</p><p className="text-[12px]" style={{ color: A.mute }}>{m}</p></div></div>
          <p className="mt-4 text-[16px] leading-[1.5]">{t}</p>
          <div className="mt-4 flex gap-6 text-[14px]" style={{ color: A.mute }}>
            <button onClick={() => setHugs((h) => ({ ...h, [i]: !h[i] }))} className="flex items-center gap-1.5 transition" style={{ color: hugs[i] ? A.plum : A.mute, fontWeight: hugs[i] ? 600 : 400 }}><span style={{ transform: hugs[i] ? 'scale(1.2)' : 'none' }}>{hugs[i] ? '♥' : '♡'}</span>{c + (hugs[i] ? 1 : 0)} hugs</button>
            <span>Reply</span>
          </div>
        </div>
      ))}
      <Card className="mt-8">
        <Meta>Near you · Tue 10:30</Meta>
        <p className="mt-1 text-[20px] font-semibold">Bump & baby coffee</p>
        <Meta className="mt-1">0.8 km · {going ? 7 : 6} mums going</Meta>
        <button onClick={() => setGoing((g) => !g)} className="mt-6 w-full rounded-full py-3 text-[14px] font-semibold transition" style={{ background: going ? A.sage : A.plum, color: going ? A.sageInk : '#fff' }}>{going ? 'You\u2019re going ✓' : "I'll go"}</button>
      </Card>
      <Card className="mt-4">
        {buddy ? (
          <div style={{ animation: 'card-in 400ms both' }}><p className="text-[20px] font-semibold">Meet Chloe</p><Meta className="mt-1">32 weeks · first-time mum · 1.2 km</Meta><button className="mt-6 w-full rounded-full py-3 text-[14px] font-semibold" style={{ background: A.lav, color: A.plum }}>Say hello</button></div>
        ) : (
          <button onClick={() => setBuddy(true)} className="w-full text-left"><p className="text-[20px] font-semibold">Find a bump buddy</p><Meta className="mt-1">One mum nearby, due when you are.</Meta><p className="mt-6 text-[14px] font-semibold" style={{ color: A.plum }}>Match me →</p></button>
        )}
      </Card>
    </Scroll>
  )
}

const STAGES = [
  { t: 'Today', s: 'How do you feel today?', d: 'The app opens with one question, not a dashboard. Each tap fills her week, so a run of low days becomes visible, to her and to her midwife if she chooses.', screen: 'today' },
  { t: 'Visits', s: 'Never forget what was said', d: 'Where, when and what to bring. She can record the appointment and get plain-language notes afterwards.', screen: 'visits' },
  { t: 'Village', s: 'Mums due when you are', d: 'A small group of mothers due the same month, local meet-ups she can join in one tap, and a bump buddy nearby. Built because "I went days without adult conversation."', screen: 'village', isNew: true },
  { t: 'Letters', s: 'Letters to herself, and her baby', d: 'A gentle journal with prompts. Testers called it the part that made them cry, in a good way.', screen: 'letters' },
  { t: 'Before birth', s: 'The Baby Box offer', d: 'An opt-in, not a default. She unticks what she already has, so less goes to waste.', screen: 'box' },
  { t: 'Birth', s: 'A welcome, not a form', d: 'Scanning the crib-card QR in hospital turns registration into a celebration, and unlocks newborn support.', screen: 'welcome' },
  { t: '0–6 weeks', s: 'Answers at 3 a.m.', d: 'Ask-a-midwife chat for the "silly" questions, replies in about 15 minutes.', screen: 'ask' },
  { t: '6 months', s: 'Pride', d: 'Milestones, a vaccination badge and a keepsake scrapbook. A small way of saying: we see you, well done.', screen: 'proud' },
] as const
/* ---------------- app showcase: every screen, centre phone walks through ---------------- */
const TOUR = [
  { k: 'Today', f: 'Mood check-in', d: 'One question each morning. Her week fills with colour, and low runs are noticed early.', v: () => <TodayScreen /> },
  { k: 'Visits', f: 'Appointments & recording', d: 'Where, when, what to bring, plus plain-language notes from every visit.', v: () => <VisitsScreen /> },
  { k: 'Village', f: 'Due-date groups & bump buddy', d: 'Mums due the same month, local meet-ups and one nearby buddy.', v: () => <VillageScreen /> },
  { k: 'Letters', f: 'Letters to her baby', d: 'A gentle journal with prompts, sealed for later.', v: () => <LettersScreen /> },
  { k: 'Baby Box', f: 'Opt-in care package', d: 'She unticks what she already has, and the rest is sent to her door.', v: () => <BoxScreen /> },
  { k: 'Birth', f: 'A welcome, not a form', d: 'One QR scan in hospital celebrates the birth and unlocks newborn support.', v: () => <WelcomeScreen /> },
  { k: 'Ask', f: 'Ask a midwife', d: 'Answers to the 3 a.m. questions, usually within 15 minutes.', v: () => <AskScreen /> },
  { k: 'Pride', f: 'Milestones & scrapbook', d: 'First smiles, vaccine badges and a keepsake she can share.', v: () => <ProudScreen /> },
]
function MiniPhone({ children, scale = 0.78 }: { children: React.ReactNode; scale?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: 316 * scale, height: 640 * scale }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}><Phone className="!mx-0">{children}</Phone></div>
    </div>
  )
}
/* a fully usable phone: its own tab state, so every screen can be explored in place */
function LivePhone({ start }: { start: number }) {
  const [k, setK] = useState(start)
  const t = TOUR[k]
  return (
    <div className="shrink-0">
      <MiniPhone><div key={k} className="h-full" style={{ animation: 'card-in 400ms both' }}>{t.v()}</div>{k < 4 && <NavPill tab={k} setTab={setK} />}</MiniPhone>
      <p className="mt-4 text-[15px] font-medium" style={{ color: INK }}>{t.f}</p>
      <p className="text-sm text-muted">{t.k}{k !== start && <button onClick={() => setK(start)} className="ml-2 underline">reset</button>}</p>
    </div>
  )
}
function Showcase() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  useEffect(() => {
    if (!seen || paused) return
    const t = setTimeout(() => setI((n) => (n + 1) % TOUR.length), 4000)
    return () => clearTimeout(t)
  }, [i, seen, paused])
  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 md:px-16 md:py-32" style={{ background: BLUSH }}>
      <div className="mx-auto max-w-[1180px]">
        <p className="font-mono uppercase text-muted">Meet the app</p>
        <h2 className="reveal mt-6 max-w-[22ch] text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.08] tracking-[-0.022em]" style={{ color: INK }}>Eight screens. <span className="text-muted">One calm companion, from bump to six months.</span></h2>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative mx-auto">
            <Phone><div key={i} className="h-full" style={{ animation: 'card-in 600ms both' }}>{TOUR[i].v()}</div>{i < 4 && <NavPill tab={i} />}</Phone>
            <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: INK }}><span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: PINK }} />{paused ? 'Paused' : 'Walking through'} · {i + 1}/{TOUR.length}</span>
          </div>
          <ol className="border-t border-black/10">
            {TOUR.map((t, k) => {
              const on = k === i
              return (
                <li key={t.k} className="border-b border-black/10">
                  <button onClick={() => setI(k)} className="relative flex w-full items-baseline gap-5 py-4 text-left">
                    <span className="w-6 shrink-0 text-sm tabular-nums text-muted">0{k + 1}</span>
                    <span className="flex-1">
                      <span className="block text-[19px] transition-colors" style={{ color: on ? INK : '#6e6e6e', fontWeight: on ? 600 : 400 }}>{t.f}</span>
                      <span className="grid transition-all duration-500" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}><span className="overflow-hidden"><span className="block max-w-[46ch] pt-1.5 text-[15px] leading-[1.6] text-[#4a4a4a]">{t.d}</span></span></span>
                    </span>
                    <span className="text-xs text-muted">{t.k}</span>
                    {on && <span className="absolute bottom-0 left-0 h-[2px] rounded-full" style={{ background: INK, animation: paused ? 'none' : 'tour-fill 4000ms linear both', width: paused ? '100%' : undefined }} />}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      <div className="mx-auto mt-24 max-w-[1180px]">
        <p className="font-mono uppercase text-muted">Every screen · tap, type and explore</p>
        <div className="-mx-6 mt-8 flex gap-8 overflow-x-auto px-6 pb-6 md:-mx-16 md:px-16">
          {TOUR.map((t, k) => <LivePhone key={t.k} start={k} />)}
        </div>
      </div>
    </section>
  )
}

function AppChapter() {
  const [st, setSt] = useState(0)
  const screen = STAGES[st].screen
  let view: React.ReactNode
  if (screen === 'today') view = <TodayScreen />
  else if (screen === 'visits') view = <VisitsScreen />
  else if (screen === 'village') view = <VillageScreen />
  else if (screen === 'letters') view = <LettersScreen />
  else if (screen === 'box') view = <BoxOffer />
  else if (screen === 'welcome') view = <WelcomeScreen />
  else if (screen === 'ask') view = <AskScreen />
  else view = <ProudScreen />
  return (
    <Wrap id="w-3" className="bg-white">
      <Kicker n={3} />
      <H2 className="text-[#3b1c7a]">A companion that asks how she is, <span className="text-muted">and connects her to mums like her.</span></H2>
      <p className="reveal mt-8 max-w-[60ch] text-lg leading-[1.65] text-muted">Every screen answers one of the three needs: guidance, connection or recognition. <b className="text-ink">Choose a moment and try the phone, it's live.</b></p>
      <div className="mt-16 grid items-start gap-16 lg:grid-cols-[1fr_auto]">
        <ol className="border-t border-line">
          {STAGES.map((s, i) => {
            const on = st === i
            return (
              <li key={s.t} className="border-b border-line">
                <button onClick={() => setSt(i)} className="flex w-full items-baseline gap-6 py-5 text-left" aria-expanded={on}>
                  <span className="w-24 shrink-0 text-sm text-muted">{s.t}</span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[19px] transition-colors" style={{ color: on ? INK : '#555', fontWeight: on ? 600 : 400 }}>{s.s}{'isNew' in s && <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: PINK, color: INK }}>New</span>}</span>
                    <span className="grid transition-all duration-500" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}><span className="overflow-hidden"><span className="block max-w-[48ch] pt-2 text-[15px] leading-[1.6] text-muted">{s.d}</span></span></span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="lg:sticky lg:top-24">
          <Phone><div key={screen} className="h-full" style={{ animation: 'card-in 500ms both' }}>{view}</div>{st < 4 && <NavPill tab={st} setTab={setSt} />}</Phone>
        </div>
      </div>
      <div className="mt-24 grid gap-12 border-t border-line pt-12 md:grid-cols-3">
        {[['Due-date groups', 'Small circles of mums due the same month. Anyone can reply, nobody has to post.'], ['Send a hug', 'A one-tap way to say "me too" on tired days, without needing the words.'], ['Bump buddy', 'One nearby mum, matched by due date, so the first coffee is easier to say yes to.']].map(([a, b]) => (
          <div key={a} className="reveal"><p className="text-[19px] font-medium" style={{ color: INK }}>{a}</p><p className="mt-2 text-[15px] leading-[1.6] text-muted">{b}</p></div>
        ))}
      </div>
    </Wrap>
  )
}
function BoxOffer() {
  const [open, setOpen] = useState(false)
  return open ? <BoxScreen onBack={() => setOpen(false)} /> : <TodayScreen boxOffer onBox={() => setOpen(true)} />
}

/* ---------------- 9. baby box ---------------- */
function BabyBox() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  return (
    <Wrap id="w-4" style={{ background: CREAM }}>
      <Blob kind="clover" color={SAGE} className="left-[2%] top-[40%] h-14 w-14" />
      <Kicker n={4} />
      <H2 className="text-[#3b1c7a]">The Baby Box: <span className="hl">a thank-you you can hold.</span></H2>
      <p className="reveal mt-8 max-w-[60ch] text-lg leading-[1.65] text-muted">Practical and symbolic. We asked 30 mothers for the "wish-I'd-known" items, the things you only realise you need after bringing baby home, and curated a box that cares for the mother as much as the baby.</p>
      <div className="reveal mt-12 grid gap-3 md:grid-cols-[1.3fr_1fr]">
        <div className="relative min-h-[320px] overflow-hidden rounded-[28px]"><img src="/welcome/box-opening.png" alt="A mother opening her Baby Box to a Thank You note and a letter addressed Dear Mammy" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" style={{ objectPosition: "50% 40%" }} /></div>
        <div ref={ref} className="flex flex-col justify-between rounded-[28px] p-8" style={{ background: BLUSH }}>
          <p className="text-[clamp(3.5rem,6vw,5rem)] font-light leading-none tracking-[-0.03em]" style={{ color: INK }}><Count to={30} run={seen} /></p>
          <p className="text-2xl font-light leading-tight" style={{ color: INK }}>mothers interviewed to decide what goes inside.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm" style={{ color: INK }}>{Object.entries(BOX_ITEMS).map(([g, l]) => <div key={g}><p className="font-medium">{g}</p><ul className="mt-1 space-y-0.5 opacity-80">{l.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
        </div>
      </div>
      <div className="reveal relative mt-3 overflow-hidden rounded-[28px]">
        <img src="/welcome/box-contents.png" alt="Inside the Baby Box: maternity towels, nipple balm, multivitamins, tummy butter, nipple shields, muslin cloth, thermometer, antiseptic cream, different nipples, sipper bottle and pacifier" loading="lazy" className="block w-full select-none" draggable={false} />
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <div className="reveal rounded-[28px] bg-white p-8"><p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: INK }}>Why an opt-in?</p><p className="mt-4 text-2xl font-light leading-snug" style={{ color: INK }}>Not every mother needs a box. Asking first, and letting her untick what she has, puts public money where it's needed and <b className="font-medium">reduces waste.</b></p></div>
        <div className="reveal rounded-[28px] bg-white p-8"><p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: INK }}>Why physical?</p><p className="mt-4 text-2xl font-light leading-snug" style={{ color: INK }}>An app can't be held. Opening the lid to "Thank you" is the moment the State's <b className="font-medium">recognition becomes real.</b></p></div>
      </div>
    </Wrap>
  )
}

/* ---------------- 10. testing ---------------- */
/* illustration: a run of low days becomes visible, and turns into a gentle nudge */
function MoodNudge() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  const week = [0, 0, 1, 1, 2, 2, 2]
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[460px] py-6" aria-label="Illustration: a week of moods drifting from calm to low, followed by a gentle prompt to message her midwife">
      <div className="flex items-end justify-between">
        {week.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-3" style={{ opacity: seen ? 1 : 0, transform: seen ? `translateY(${m * 14}px)` : 'translateY(30px)', transition: `all 700ms cubic-bezier(.22,1,.36,1) ${i * 120}ms` }}>
            <MoodFace m={MOODS[m]} size={48} />
            <span className="text-xs text-white/50">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="mt-4 h-6 w-full" aria-hidden>
        <path d="M2 4 C30 4, 45 10, 60 16 L98 16" fill="none" stroke={PINK} strokeWidth="1.2" strokeDasharray="3 2" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: seen ? 0 : 1, transition: 'stroke-dashoffset 1.6s ease 600ms' }} />
      </svg>
      <div className="ml-auto mt-6 max-w-[300px] rounded-[24px] bg-white p-5" style={{ color: INK, opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(16px) scale(.96)', transition: 'all 600ms cubic-bezier(.22,1,.36,1) 1.4s', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: BLUSH }}><svg viewBox="0 0 24 24" className="h-4 w-4" fill="#c04f9d"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg></span>
          <p className="text-sm text-muted">A few low days in a row</p>
        </div>
        <p className="mt-3 text-[17px] font-medium leading-snug">Would you like to talk to Siobhán, your midwife?</p>
        <div className="mt-4 flex gap-2 text-sm"><span className="rounded-full px-4 py-2 font-medium text-white" style={{ background: INK }}>Message her</span><span className="rounded-full px-4 py-2 text-muted">Not now</span></div>
      </div>
    </div>
  )
}

function Testing() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  const bars = [['Task success', 94, '17 / 18 tasks'], ['"Is the colour scheme calming?"', 92, '4.6 / 5'], ['"Looks professional enough for clinical use"', 88, '4.4 / 5']] as const
  return (
    <Wrap id="w-5" className="bg-white">
      <Kicker n={5} />
      <H2 className="text-[#3b1c7a]">Mothers said it felt <span className="hl">calm</span>. <span className="text-muted">That was the whole point.</span></H2>
      <p className="reveal mt-8 max-w-[60ch] text-lg leading-[1.65] text-muted">We tested the hi-fi prototype with pregnant women and new mothers. The tension we had to balance: warm without feeling like a toy, trustworthy without feeling like a hospital.</p>
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div ref={ref} className="space-y-7">
          {bars.map(([l, v, s], i) => (
            <div key={l} className="reveal"><div className="flex justify-between gap-4 text-[15px]"><span>{l}</span><span className="font-medium" style={{ color: INK }}>{s}</span></div>
              <div className="mt-2 h-3 rounded-full" style={{ background: BLUSH }}><div className="h-full rounded-full transition-all duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]" style={{ width: seen ? `${v}%` : '0%', background: [INK, '#c04f9d', '#8f91e0'][i], transitionDelay: i * 150 + 'ms' }} /></div></div>
          ))}
        </div>
        <div className="overflow-hidden rounded-[28px]"><img src="/welcome/box-flatlay.png" alt="The open Baby Box with notes for mum and baby, surrounded by its essentials" loading="lazy" draggable={false} className="aspect-[4/3] w-full select-none object-cover" style={{ objectPosition: "45% 50%" }} /></div>
      </div>
      <div className="mt-24 grid gap-x-16 gap-y-12 border-t border-line pt-12 md:grid-cols-2">
        {["I like that the app doesn't look too hospital-like. It's calming.", "It's amazing to see how much my body and my feelings have changed throughout my pregnancy.", 'This would definitely help me organise my dates. As a working woman it\u2019s so difficult to be up to date.', "It's so clean and the colours are so cute."].map((q, i) => (
          <figure key={q} className="reveal" style={{ transitionDelay: i * 80 + 'ms' }}><span className="block h-1 w-8 rounded-full" style={{ background: [PINK, LILAC, SAGE, PINK][i] }} /><blockquote className="mt-5 text-[clamp(1.25rem,1.8vw,1.55rem)] leading-[1.4]" style={{ color: INK }}>"{q}"</blockquote><figcaption className="mt-3 text-sm text-muted">Tester, {i % 2 ? 'new mother' : 'pregnant, 2nd trimester'}</figcaption></figure>
        ))}
      </div>
      <div className="reveal relative mt-16 grid items-center gap-8 overflow-hidden rounded-[32px] p-8 text-white md:grid-cols-[1fr_1.2fr] md:p-14" style={{ background: INK }}>
        <div><p className="font-mono text-[11px] uppercase tracking-widest text-white/50">The quote that changed our priorities</p><p className="mt-5 text-[clamp(1.6rem,2.8vw,2.5rem)] font-light leading-tight tracking-tight">"After giving birth I fell into depression and had no idea how long I'd been feeling low. <b className="font-medium" style={{ color: PINK }}>This would help new mothers reach out to a doctor sooner.</b>"</p><p className="mt-6 text-white/70">So mood tracking moved from a feature to the front door. A run of low days now surfaces a gentle nudge to contact her midwife.</p></div>
        <MoodNudge />
      </div>
    </Wrap>
  )
}

/* ---------------- 11. outcomes ---------------- */
function Outcomes() {
  const items = [['94%', 'task success, 17 of 18 tasks'], ['4.6/5', 'rated calming by testers'], ['4.4/5', 'professional enough for clinical use'], ['30', 'mothers shaped the Baby Box'], ['6', 'service stages, one connected journey'], ['11', 'stakeholder groups mapped'], ['1', 'warm welcome for every new citizen']]
  return (
    <section id="w-6" className="px-6 py-28 text-white md:px-16 md:py-36" style={{ background: '#1b0f36' }}>
      <div className="mx-auto max-w-[1180px]">
        <Kicker n={6} dark />
        <H2>What it added up to.</H2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([a, b], i) => (
            <div key={b} className={`reveal bg-[#1b0f36] p-8 transition-colors duration-500 hover:bg-[#26164a] ${i === items.length - 1 ? 'lg:col-span-2' : ''}`} style={{ transitionDelay: i * 60 + 'ms' }}>
              <p className="text-5xl font-light tracking-[-0.03em]" style={{ color: i === items.length - 1 ? PINK : '#fff' }}>{a}</p>
              <p className="mt-3 text-white/65">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 12. reflection ---------------- */
function Reflection() {
  return (
    <section id="w-7" className="relative overflow-hidden px-6 py-32 md:px-16 md:py-44" style={{ background: CREAM }}>
      <Blob kind="flower" color={BUTTER} className="right-[10%] top-24 h-16 w-16" />
      <Blob kind="burst" color={PINK} className="bottom-40 left-[6%] h-12 w-12" />
      <div className="relative mx-auto max-w-[1180px]">
        <Kicker n={7} />
        <p className="reveal mt-10 max-w-3xl text-[clamp(1.2rem,1.7vw,1.5rem)] leading-relaxed" style={{ color: INK }}>Lilly is six months in. She still logs a mood most mornings. She's opened three letters she wrote while pregnant. The Tuesday coffee group knows her daughter's name. Nothing dramatic happened. <b className="font-medium">She just never had to feel like she was on her own.</b></p>
        <p className="reveal mt-16 text-[clamp(2.1rem,4.2vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em]" style={{ color: INK }}>Support isn't a feature. <b className="font-medium">It's a feeling</b>, and it has to last longer than the hospital stay.</p>
        <div className="reveal mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {[['Design the service, then the screen', 'The blueprint made sure every warm moment in the app had a real process behind it.'], ['Tone is a feature', 'Testers trusted the app because it didn\u2019t look clinical. Colour and type did real work here.'], ['Next: midwife side', 'With more time, I\u2019d design the midwife dashboard and pilot the low-mood nudge with a maternity ward.']].map(([a, b]) => (
            <div key={a}><p className="font-medium" style={{ color: INK }}>{a}</p><p className="mt-2 leading-relaxed text-muted">{b}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function WelcomeCase() {
  useReveal()
  return (
    <main className="welcome">
      <CaseNav />
      <Hero />
      <Interlude act="I" title="The quiet after" moment="Meet Lilly · Day 3 · 3:12 a.m." line={<>Lilly is home with her daughter. The ward was busy and kind. Now the house is silent, the baby won't settle, and <b className="font-medium">she has no idea who she's allowed to call.</b></>} />
      <Gap />
      <Heard /><Stakeholders />
      <Interlude act="II" title="Designing" moment="From what we heard, to what we made" line={<>Every decision answers one question: <b className="font-medium">what would have helped Lilly at 3 a.m., and what would make her feel proud?</b></>} tone="#2a1557" dark />
      <Showcase /><AppChapter /><BabyBox />
      <Interlude act="III" title="The proof" moment="Back to the mothers" line={<>A warm idea only counts if it works for a tired woman holding a phone in one hand. <b className="font-medium">So we asked mothers to try it.</b></>} tone={BLUSH} />
      <Testing /><Outcomes /><Reflection />
      <NextProject href="#/recipes" kicker="Service design · Ireland" title="Recipes to Adult" accent={PINK} bg={INK} />
    </main>
  )
}
