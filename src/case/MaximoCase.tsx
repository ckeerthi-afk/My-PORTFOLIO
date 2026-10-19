import NextProject from '../components/NextProject'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import IbmLogo from '../components/IbmLogo'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Asset, Attachment, Barcode, Bullhorn, Calendar, Camera, Chat, Checkmark, CloudUpload, Document, Filter, Help, List, Location, Map, Meter, Notification, Pause, Play, Purchase, Renew, Report, Scan, Search, Settings, Task, Time, Tools, UserFollow, WarningAlt, ArrowLeft, ArrowRight, Edit, Close } from '@carbon/icons-react'
import tour1 from '@/assets/maximo/tour-1.png'
import tour2 from '@/assets/maximo/tour-2.png'
import appCard from '@/assets/maximo/app-card.png'

const BLUE = '#0f62fe'

/* ---------- shared bits ---------- */
function useCaseReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}
function useProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setP(Math.min(1, Math.max(0, -r.top / (total || 1))))
    }
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [ref])
  return p
}

const CHAPTERS = ['Overview', 'Adoption gap', 'Research', 'MaintainX', 'Insight', 'Opportunities', 'Concepts', 'Cognitive load', 'Execution', 'Mobile', 'Visual design', 'Outcomes', 'Reflection']

function Chapter({ n, title, kicker, dark }: { n: number; title: React.ReactNode; kicker?: string; dark?: boolean }) {
  return (
    <div className="reveal mb-6 md:mb-8">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-muted'}`}>{String(n).padStart(2, '0')} / {kicker ?? CHAPTERS[n - 1]}</p>
      <h2 className="mt-5 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">{title}</h2>
    </div>
  )
}
const Wrap = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`px-6 py-28 md:px-16 md:py-40 ${className}`}><div className="mx-auto max-w-[1180px]">{children}</div></section>
)
const Lede = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`reveal max-w-2xl text-lg leading-relaxed md:text-xl ${dark ? 'text-white/70' : 'text-muted'}`}>{children}</p>
)
const Placeholder = ({ label, className = '' }: { label: string; className?: string }) => (
  <div className={`flex items-center justify-center rounded-xl border border-dashed border-ink/20 bg-[repeating-linear-gradient(45deg,transparent_0_10px,rgba(0,0,0,0.025)_10px_20px)] p-6 text-center font-mono text-[11px] uppercase tracking-widest text-muted ${className}`}>{label}</div>
)

/* ---------- progress + chapter nav ---------- */
function CaseNav() {
  const [p, setP] = useState(0)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1))
      let a = 0
      CHAPTERS.forEach((_, i) => { const el = document.getElementById('ch-' + (i + 1)); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) a = i })
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
            <li key={c}><button onClick={() => document.getElementById('ch-' + (i + 1))?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-[11px] leading-none transition-colors duration-300" style={{ color: active === i ? BLUE : '#a3a39e' }}>
              <span className="h-1 w-1 rounded-full transition-opacity duration-300" style={{ background: BLUE, opacity: active === i ? 1 : 0 }} />
              <span className={active === i ? 'font-medium' : 'hover:text-ink'}>{c}</span>
            </button></li>
          ))}
        </ul>
      </aside>
    </>
  )
}

/* ---------- 1. hero + tldr ---------- */
const HERO_SKILLS = ['User research', 'Journey mapping', 'Onboarding design', 'Carbon Design System', 'Prototyping', 'Usability testing']

function GhostCursor({ wrap, target, onClick }: { wrap: React.RefObject<HTMLDivElement | null>; target: React.RefObject<HTMLSpanElement | null>; onClick: (open: boolean) => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [phase, setPhase] = useState<'hidden' | 'enter' | 'move' | 'click' | 'rest' | 'leave'>('hidden')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onClick(true); return }
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const run = () => {
      const w = wrap.current?.getBoundingClientRect(), t = target.current?.getBoundingClientRect()
      if (!w || !t) return
      const goal = { x: t.left - w.left + t.width / 2, y: t.top - w.top + t.height / 2 }
      setPos({ x: w.width * 0.85, y: w.height * 0.95 }); setPhase('enter'); onClick(false)
      at(500, () => { setPhase('move'); setPos(goal) })
      at(1900, () => setPhase('click'))
      at(2150, () => { onClick(true); setPhase('rest') })
      at(2900, () => { setPhase('leave'); setPos({ x: goal.x + 60, y: goal.y + 70 }) })
      at(6800, () => onClick(false))
      at(7800, run)
    }
    at(1200, run)
    return () => timers.forEach(clearTimeout)
  }, [wrap, target, onClick])
  const visible = phase === 'move' || phase === 'click' || phase === 'rest' || phase === 'enter'
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-30 hidden md:block" style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: phase === 'move' ? 'transform 1.3s cubic-bezier(.65,0,.25,1)' : phase === 'leave' ? 'transform .9s ease-in, opacity .9s ease' : 'opacity .4s ease', opacity: visible ? 1 : 0 }}>
      {phase === 'click' && <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full" style={{ background: BLUE, opacity: 0.35, animation: 'ghost-ping .5s ease-out forwards' }} />}
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: phase === 'click' ? 'scale(.82)' : 'scale(1)', transition: 'transform .15s ease', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.25))' }}>
        <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="#161616" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <style>{'@keyframes ghost-ping{from{transform:scale(.4);opacity:.5}to{transform:scale(2.2);opacity:0}}'}</style>
    </div>
  )
}

function HeroMock() {
  const wrap = useRef<HTMLDivElement>(null)
  const next = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-[980px]">
      <GhostCursor wrap={wrap} target={next} onClick={setOpen} />
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_50px_120px_-40px_rgba(0,30,120,0.55)]">
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] bg-[#161616] px-4 py-2.5 text-[11px] text-white"><span className="font-semibold">IBM</span> Maximo <span className="text-white/40">/ Get started</span></div>
        <div className="grid md:grid-cols-[180px_1fr]">
          <div className="hidden border-r border-[#e0e0e0] bg-[#f4f4f4] p-4 text-[12px] md:block">
            {['Home', 'Assets', 'Work orders', 'Locations', 'Inventory', 'Reports'].map((t, i) => <p key={t} className={`py-1.5 ${i === 0 ? 'font-medium text-[#0f62fe]' : 'text-muted'}`}>{t}</p>)}
          </div>
          <div className="p-6 md:p-8">
            <p className="text-xs text-muted">Welcome, Priya · Maintenance lead</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">Let's get your first work order running.</p>
            <div className="mt-5 h-1.5 bg-[#e0e0e0]"><div className="case-fill h-full" style={{ background: BLUE }} /></div>
            <div className="mt-5 grid gap-2.5 md:grid-cols-2">
              {['Add your site', 'Import 3 sample assets', 'Invite a technician', 'Create a work order'].map((s, i) => (
                <div key={s} className="flex items-center gap-3 border border-[#e0e0e0] p-3 text-sm">
                  <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] text-white ${i < 2 ? '' : 'border border-[#c6c6c6]'}`} style={i < 2 ? { background: BLUE } : {}}>{i < 2 ? '✓' : ''}</span>{s}
                  {i === 2 && <span ref={next} className="ml-auto px-2 py-1 text-[10px] text-white" style={{ background: BLUE }}>Next</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-[58%] z-20 hidden w-[min(420px,80%)] -translate-x-1/2 overflow-hidden rounded-xl border border-[#c6c6c6] bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.08),0_40px_80px_-20px_rgba(0,20,80,0.55)] md:block" style={{ opacity: open ? 1 : 0, transform: `translate(-50%, ${open ? 0 : 14}px) scale(${open ? 1 : 0.96})`, transition: 'opacity .5s ease, transform .6s cubic-bezier(.2,.8,.2,1)' }}>
        <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: BLUE }}>Skills used on this project</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {HERO_SKILLS.map((k, i) => <span key={k} className="rounded-full border border-[#a6c8ff] bg-[#edf5ff] px-3 py-1 text-xs font-medium text-[#0043ce]" style={{ opacity: open ? 1 : 0, transform: `translateY(${open ? 0 : 6}px)`, transition: `all .4s ease ${open ? 0.15 + i * 0.07 : 0}s` }}>{k}</span>)}
        </div>
      </div>
      <div className="absolute -bottom-8 -right-4 hidden w-64 rounded-xl bg-white p-4 text-sm shadow-xl md:block" style={{ animation: 'case-float 6s ease-in-out infinite' }}>
        <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: BLUE }}>Tip</p>
        <p className="mt-1">Technicians can close work orders from their phone. Invite one now?</p>
        <p className="mt-2 border-t border-[#e0e0e0] pt-2 text-[12px] italic text-muted">Designer's note: the best onboarding is the one users forget they did.</p>
      </div>
    </div>
  )
}

function Hero() {
  const tldr = [
    ['Challenge', 'Maximo is powerful, but many new users never reached the moment where its value became clear. For mid-size businesses, that gap meant churn before adoption.'],
    ['My role', 'UX Designer working alongside a senior designer. I led competitive journey mapping, ran sales and support research, and designed onboarding and guidance concepts.'],
    ['Approach', 'Reframed the problem from "missing features" to "missing understanding", then designed around the first moment of value rather than the full feature set.'],
    ['Outcome', 'Findings presented to 150+ stakeholders. In testing, participants found Small SaaS easier to understand and navigate than traditional Maximo.'],
  ]
  return (
    <section id="ch-1" className="relative overflow-hidden">
      <div className="relative overflow-hidden px-6 pb-24 pt-28 md:px-16 md:pt-32" style={{ background: 'radial-gradient(120% 80% at 50% 0%, #4589ff 0%, #0f62fe 40%, #001d6c 100%)' }}>
        <div className="grad-blob grad-blob-0" style={{ background: '#78a9ff' }} />
        <div className="grad-blob grad-blob-1" style={{ background: '#0043ce' }} />
        <div className="relative mx-auto max-w-[1180px] text-white">
          <div className="reveal flex flex-wrap items-center gap-5"><span className="grid h-10 place-items-center rounded-lg bg-white px-3"><IbmLogo className="h-6" /></span><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">Case study · IBM Maximo Small SaaS</p></div>
          <h1 className="reveal mt-4 max-w-5xl text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] md:text-[clamp(3rem,6.5vw,6.5rem)]">Helping users reach value faster</h1>
          <p className="reveal mt-5 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">How research, onboarding strategy, and workflow simplification helped make IBM Maximo more approachable for mid-sized businesses.</p>
          <div className="reveal mt-10 md:mt-12"><HeroMock /></div>
        </div>
      </div>
      <div className="px-6 py-24 md:px-16">
        <div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[260px_1fr]">
          <dl className="reveal space-y-6 text-sm">
            {[['Role', 'UX Designer'], ['Team', 'Senior designer, PM, sales and support partners'], ['Context', 'Internship project within IBM'], ['Industry', 'Enterprise SaaS · Asset management'], ['Focus', 'Strategy, onboarding, adoption, discoverability, visual design']].map(([a, b]) => (
              <div key={a}><dt className="text-muted">{a}</dt><dd className="mt-1 font-medium">{b}</dd></div>
            ))}
          </dl>
          <div>
            <p className="reveal font-mono text-[11px] uppercase tracking-[0.2em] text-muted">TL;DR</p>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-2">
              {tldr.map(([a, b], i) => (
                <div key={a} className="reveal bg-white p-7 md:p-8" style={{ transitionDelay: i * 80 + 'ms' }}>
                  <p className="text-sm font-medium" style={{ color: BLUE }}>{a}</p>
                  <p className="mt-3 text-[17px] leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 2. adoption gap ---------- */
function AdoptionGap() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  const words = 'Most users never experienced the moment where Maximo\u2019s value became clear.'.split(' ')
  const stages = [['Sign up', 1], ['First login', 0.78], ['Setup', 0.5], ['First work order', 0.28], ['Value', 0.14]] as const
  return (
    <section id="ch-2" className="bg-[#0b0d12] text-white">
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-screen items-center px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1180px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">02 / The adoption gap</p>
            <p className="mt-8 max-w-5xl text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              {words.map((w, i) => (<span key={i} className="transition-colors duration-300" style={{ color: p * 1.6 > i / words.length ? '#fff' : 'rgba(255,255,255,0.15)' }}>{w} </span>))}
            </p>
            <div className="mt-12 grid gap-10 md:grid-cols-2" style={{ opacity: Math.min(1, Math.max(0, (p - 0.55) * 4)), transform: `translateY(${Math.max(0, 1 - (p - 0.55) * 4) * 30}px)` }}>
              <p className="text-xl leading-relaxed text-white/70">This wasn't a feature problem. <span className="text-white">It was an understanding problem.</span> Maximo could do almost everything. New teams just couldn't see how to get it to do <i>their</i> thing.</p>
              <div className="space-y-2.5">
                {stages.map(([s, w], i) => (
                  <div key={s} className="flex items-center gap-4 text-sm">
                    <span className="w-32 shrink-0 text-white/60">{s}</span>
                    <div className="h-7 flex-1 rounded-sm bg-white/5"><div className="h-full rounded-sm transition-all duration-700" style={{ width: `${w * 100 * Math.min(1, Math.max(0, (p - 0.6) * 3))}%`, background: i === stages.length - 1 ? BLUE : 'rgba(255,255,255,0.25)', transitionDelay: i * 80 + 'ms' }} /></div>
                  </div>
                ))}
                <p className="pt-2 text-xs text-white/40">Illustrative shape of the journey, not measured data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 3. research ---------- */
const METHODS = [
  { k: 'Competitor journeys', d: 'Signed up for and walked through competitor products end to end, documenting every screen from discovery to first value.', art: 'journey' },
  { k: 'Sales interviews', d: 'Interviewed sales to learn where deals stalled, what prospects asked first, and which demos actually landed.', art: 'quotes' },
  { k: 'Support journeys', d: 'Traced support tickets back to the moments in the product that created them. Many questions were really onboarding gaps.', art: 'tickets' },
  { k: 'AI-assisted synthesis', d: 'Used AI transcription and clustering to turn hours of conversation into themes quickly, then validated them with the senior designer.', art: 'board' },
] as const

function Artifact({ kind }: { kind: string }) {
  if (kind === 'journey') return (
    <div className="grid grid-cols-6 gap-2 text-[11px]">
      {['Discover', 'Provision', 'Login', 'Setup', 'Deploy', 'Aha'].map((s, i) => (
        <div key={s} className="space-y-2">
          <p className="font-medium">{s}</p>
          <div className="h-16 rounded-md bg-[#e8f0ff]" />
          <div className="rounded-md p-2" style={{ background: ['#fff1c2', '#ffd6e0', '#fff1c2', '#ffd6e0', '#d9f2e3', '#d9f2e3'][i] }}>{['Pricing visible', 'Wait for access', 'Blank dashboard', 'Too many fields', 'Invite friction', 'Value is late'][i]}</div>
        </div>
      ))}
    </div>
  )
  if (kind === 'quotes') return (
    <div className="grid gap-3 md:grid-cols-2">
      {['"Prospects ask how fast they can be up and running before they ask about features."', '"The demo works when we show one work order going from request to done."', '"Smaller teams don\u2019t have an admin to set everything up."', '"They want to see their own assets in it, not ours."'].map((q) => (
        <blockquote key={q} className="rounded-xl bg-white p-4 text-sm leading-relaxed shadow-sm">{q}<p className="mt-2 text-[11px] text-muted">Sales interview · paraphrased</p></blockquote>
      ))}
    </div>
  )
  if (kind === 'tickets') return (
    <div className="space-y-2">
      {[['How do I add a location?', 'Setup'], ['Where do technicians see their work?', 'Deployment'], ['Which fields are required?', 'Setup'], ['How do I invite my team?', 'Deployment'], ['What should I do first?', 'First login']].map(([q, s]) => (
        <div key={q} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm shadow-sm"><span>{q}</span><span className="rounded-full bg-[#e8f0ff] px-2.5 py-1 text-[11px]" style={{ color: BLUE }}>{s}</span></div>
      ))}
    </div>
  )
  return (
    <div className="relative h-full min-h-[240px]">
      {[['Value comes late', 18, 10, '#fff1c2'], ['No starting point', 52, 6, '#ffd6e0'], ['Admin-heavy setup', 30, 44, '#d9f2e3'], ['Roles need different paths', 64, 46, '#e8f0ff'], ['Fields overwhelm', 8, 62, '#ffd6e0'], ['Demo data helps', 46, 72, '#fff1c2']].map(([t, x, y, c], i) => (
        <div key={t as string} className="absolute w-[34%] rounded-md p-3 text-xs shadow-sm" style={{ left: x + '%', top: y + '%', background: c as string, transform: `rotate(${(i % 3) - 1}deg)` }}>{t}</div>
      ))}
    </div>
  )
}

function Research() {
  const [view, setView] = useState<string[] | null>(null)
  useEffect(() => {
    if (!view) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setView(null)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [view])
  const [m, setM] = useState(0)
  return (
    <Wrap id="ch-3">
      <Chapter n={3} title="Understanding why users never reached value" />
      <Lede>Working alongside a senior designer, I treated this like an investigation. Instead of asking what users wanted, we asked where, exactly, the journey broke, and who already saw it breaking every day.</Lede>
      <div className="reveal mt-16 grid gap-6 lg:grid-cols-[360px_1fr]">
        <ul className="space-y-2">
          {METHODS.map((x, i) => (
            <li key={x.k}><button onClick={() => setM(i)} onMouseEnter={() => setM(i)} className={`w-full rounded-2xl p-5 text-left transition-all duration-500 ${m === i ? 'bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]' : 'hover:bg-white/60'}`}>
              <div className="flex items-center gap-3"><span className="font-mono text-xs" style={{ color: m === i ? BLUE : '#9a9a9a' }}>0{i + 1}</span><span className="font-medium">{x.k}</span></div>
              <div className={`grid transition-all duration-500 ${m === i ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><p className="overflow-hidden text-sm leading-relaxed text-muted">{x.d}</p></div>
            </button></li>
          ))}
        </ul>
        <div className="rounded-3xl bg-[#ececE8] p-6 md:p-10">
          <div key={m} style={{ animation: 'card-in 600ms cubic-bezier(.22,1,.36,1) both' }}>
            <div className="mb-6 flex items-center justify-between"><p className="text-sm font-medium">{METHODS[m].k}</p><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Artifact</p></div>
            <Artifact kind={METHODS[m].art} />
          </div>
        </div>
      </div>
      <div className="reveal mt-6 grid gap-4 md:grid-cols-3">
        {[['mural', 'Competitive benchmark board in Mural'], ['journey', 'Onboarding journey map, IBM vs MaintainX'], ['synthesis', 'Research methodology and synthesis']].map(([f, c]) => (
          <button type="button" key={f} onClick={() => setView([f, c])} className="group block overflow-hidden rounded-2xl bg-white text-left ring-1 ring-black/5">
            <div className="grid h-52 place-items-center bg-white p-3"><img src={`/maximo/${f}.png`} alt={c} loading="lazy" className="max-h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]" /></div>
            <p className="flex items-center justify-between border-t border-black/5 px-4 py-3 text-sm text-muted">{c}<span className="text-xs transition group-hover:text-ink">View</span></p>
          </button>
        ))}
      </div>
      {view && createPortal(
        <div role="dialog" aria-modal="true" aria-label={view[1]} onClick={() => setView(null)} className="fixed inset-0 z-[100] flex flex-col bg-black/85 p-4 backdrop-blur-sm md:p-8">
          <div className="flex items-center justify-between pb-4 text-white">
            <p className="text-sm">{view[1]}</p>
            <button type="button" onClick={() => setView(null)} aria-label="Close" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#161616] transition hover:bg-white/85">Close <Close size={18} /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <img src={`/maximo/${view[0]}.png`} alt={view[1]} className="mx-auto block h-auto w-full min-w-[900px]" />
          </div>
        </div>,
        document.body,
      )}
    </Wrap>
  )
}

/* ---------- 4. maintainx ---------- */
const STAGES = [
  { s: 'Discovery', mx: 'Self-serve sign-up and transparent plans let teams try the product immediately.', mo: 'A sales-led path. Teams typically need a conversation before they see the product.', f: 'Curiosity cools while waiting for a demo.', r: 'Offer a self-serve trial path for mid-size teams.', o: 'Demo environment' },
  { s: 'Provisioning', mx: 'A workspace is ready almost instantly after sign-up.', mo: 'Environments are configured for the customer, which takes time and coordination.', f: 'The first impression is a wait, not the product.', r: 'Pre-provision a starter workspace with sensible defaults.', o: 'Guided setup' },
  { s: 'First login', mx: 'Asks who you are and what you want to do, then shapes the first screen around it.', mo: 'A dense, capable workspace with no clear starting point.', f: '"What should I do first?" was a recurring support question.', r: 'Welcome users by role and give them one clear next step.', o: 'Role-based onboarding' },
  { s: 'Setup', mx: 'A short checklist and sample data make progress visible.', mo: 'Many configuration screens and fields stand between the user and their first result.', f: 'Setup feels like work before any value appears.', r: 'Checklist onboarding with sample assets; defer advanced fields.', o: 'Checklist onboarding' },
  { s: 'Deployment', mx: 'Inviting technicians to a mobile app is a first-class step.', mo: 'Rolling out to technicians is a separate, admin-led effort.', f: 'Value depends on the team, but the team arrives last.', r: 'Make inviting a technician part of onboarding.', o: 'Feature discovery' },
  { s: 'Aha moment', mx: 'The first work order is created and closed on day one.', mo: 'The aha arrives much later, after configuration is complete.', f: 'Many users leave before reaching it.', r: 'Design the whole journey around the first completed work order.', o: 'Progressive disclosure' },
]

function MaintainX() {
  const [i, setI] = useState(0)
  const [side, setSide] = useState<'mx' | 'mo'>('mx')
  const st = STAGES[i]
  return (
    <Wrap id="ch-4" className="bg-white">
      <Chapter n={4} title={<>Learning from <span className="hl" style={{ color: BLUE }}>MaintainX</span></>} />
      <Lede>MaintainX wins mid-size teams by getting them to value fast. I mapped its onboarding journey stage by stage against Maximo's, looking only at one question: what does each product do to get a new team to its first real result?</Lede>
      <div className="reveal mt-16">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] h-px bg-line" />
          <div className="absolute left-0 top-[18px] h-px transition-all duration-700" style={{ width: `${(i / (STAGES.length - 1)) * 100}%`, background: BLUE }} />
          <div className="relative grid grid-cols-6">
            {STAGES.map((x, j) => (
              <button key={x.s} onClick={() => setI(j)} className="group flex flex-col items-center gap-3 text-center">
                <span className={`grid h-9 w-9 place-items-center rounded-full border text-xs transition-all duration-500 ${j <= i ? 'border-transparent text-white' : 'border-line bg-white text-muted group-hover:border-ink'}`} style={j <= i ? { background: BLUE } : {}}>{j + 1}</span>
                <span className={`text-xs md:text-sm ${j === i ? 'font-medium text-ink' : 'text-muted'}`}>{x.s}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-paper p-6 md:p-8">
            <div className="inline-flex rounded-full bg-white p-1 text-sm">
              {(['mx', 'mo'] as const).map((k) => (
                <button key={k} onClick={() => setSide(k)} className={`rounded-full px-4 py-2 transition ${side === k ? 'bg-ink text-white' : 'text-muted'}`}>{k === 'mx' ? 'MaintainX' : 'Maximo'}</button>
              ))}
            </div>
            <p key={i + side} className="mt-8 text-2xl font-medium leading-snug tracking-tight" style={{ animation: 'card-in 500ms cubic-bezier(.22,1,.36,1) both' }}>{side === 'mx' ? st.mx : st.mo}</p>
            <div className="mt-8 flex gap-2">
              {STAGES.map((_, j) => <span key={j} className="h-1 flex-1 rounded-full" style={{ background: j <= i ? (side === 'mx' ? '#24a148' : '#da1e28') : '#e3e0d8', opacity: j <= i ? 1 - (side === 'mo' ? 0 : 0) : 1 }} />)}
            </div>
            <p className="mt-3 text-xs text-muted">{side === 'mx' ? 'Each stage moves the user toward value.' : 'Each stage adds effort before value appears.'}</p>
          </div>
          <div key={i} className="grid gap-px overflow-hidden rounded-3xl bg-line" style={{ animation: 'card-in 600ms cubic-bezier(.22,1,.36,1) both' }}>
            {[['Friction', st.f, '#da1e28'], ['Recommendation', st.r, BLUE], ['Opportunity', st.o, '#24a148']].map(([a, b, c]) => (
              <div key={a} className="bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: c }}>{a}</p><p className="mt-2 text-lg leading-snug">{b}</p></div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => setI(Math.max(0, i - 1))} className="text-sm text-muted hover:text-ink disabled:opacity-30" disabled={i === 0}>← Previous stage</button>
          <button onClick={() => setI(Math.min(STAGES.length - 1, i + 1))} className="text-sm font-medium disabled:opacity-30" disabled={i === STAGES.length - 1}>Next stage →</button>
        </div>
      </div>
    </Wrap>
  )
}

/* ---------- 5. insight ---------- */
function Insight() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  return (
    <section id="ch-5">
      <div ref={ref} className="relative h-[200vh]" style={{ background: BLUE }}>
        <div className="sticky top-0 flex h-screen items-center px-6 text-white md:px-16">
          <div className="mx-auto max-w-[1180px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">05 / The insight</p>
            <blockquote className="mt-8 text-[clamp(2rem,4.8vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              <span>Users weren't struggling because Maximo lacked functionality. </span>
              <span className="transition-opacity duration-700" style={{ opacity: p > 0.25 ? 1 : 0.2 }}>They were struggling because they weren't reaching the moment where that functionality became </span>
              <span className="relative inline-block transition-all duration-700" style={{ opacity: p > 0.45 ? 1 : 0.2 }}>valuable.<span className="absolute -bottom-1 left-0 h-1 bg-white transition-all duration-700" style={{ width: p > 0.5 ? '100%' : '0%' }} /></span>
            </blockquote>
          </div>
        </div>
      </div>
      <Wrap>
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Why this changed the direction</p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {[['From features to moments', 'We stopped asking what to add and started asking what the user needed to see first.'], ['From one path to many', 'A maintenance lead and a technician need different first experiences. Onboarding became role-aware.'], ['From UI to the whole journey', 'Sales, support and provisioning are part of the experience. Design had to reach beyond the screen.']].map(([a, b], i) => (
            <div key={a} className="reveal border-t border-ink pt-6" style={{ transitionDelay: i * 100 + 'ms' }}>
              <p className="text-2xl font-semibold tracking-tight">{a}</p>
              <p className="mt-3 leading-relaxed text-muted">{b}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ---------- 6. relationship map ---------- */
const FINDINGS = ['Value arrives after setup, not before', 'Roles start from very different places', 'Prospects want to see their own work', 'Support questions cluster at setup', 'Fields overwhelm new users']
const OPPS = ['Role-based onboarding', 'Checklist onboarding', 'Demo environments', 'Guided setup', 'Feature discovery', 'Progressive disclosure']
const LINKS: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 0], [1, 4], [2, 2], [2, 3], [3, 3], [3, 1], [3, 4], [4, 5], [4, 3]]
const WHY: Record<number, string> = {
  0: 'If value only appears after setup, the fastest fix is to show value first, and to make setup visibly finite.',
  1: 'A lead configures; a technician executes. One onboarding cannot serve both well.',
  2: 'A demo with realistic data lets teams picture their own work before investing in setup.',
  3: 'Support tickets marked the exact screens where guidance was missing.',
  4: 'Most fields matter later. Showing them all up front made the product feel harder than it is.',
}

function OpportunityMap() {
  const [h, setH] = useState<number | null>(null)
  const ROW = 72, H = Math.max(FINDINGS.length, OPPS.length) * ROW
  const fy = (i: number) => (H - FINDINGS.length * ROW) / 2 + i * ROW + ROW / 2
  const oy = (i: number) => i * ROW + ROW / 2
  const active = (f: number) => h === null || h === f
  return (
    <Wrap id="ch-6" className="bg-white">
      <Chapter n={6} title="From findings to opportunities" />
      <Lede>Every opportunity had to trace back to something we actually observed. Hover a finding to see which opportunities it justified, and why.</Lede>
      <div className="reveal mt-16 hidden grid-cols-[1fr_200px_1fr] md:grid" style={{ height: H }} onMouseLeave={() => setH(null)}>
        <ul className="relative">
          {FINDINGS.map((f, i) => (
            <li key={f} onMouseEnter={() => setH(i)} className="absolute right-0 flex w-full cursor-pointer items-center justify-end" style={{ top: fy(i) - 24, height: 48 }}>
              <span className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${h === i ? 'border-transparent text-white' : 'border-line bg-paper'} ${active(i) ? 'opacity-100' : 'opacity-35'}`} style={h === i ? { background: BLUE } : {}}>{f}</span>
            </li>
          ))}
        </ul>
        <svg width="200" height={H} className="overflow-visible">
          {LINKS.map(([f, o], k) => {
            const on = h === f
            return <path key={k} d={`M0 ${fy(f)} C 100 ${fy(f)}, 100 ${oy(o)}, 200 ${oy(o)}`} fill="none" stroke={on ? BLUE : '#d6d4cd'} strokeWidth={on ? 2 : 1} pathLength={1} className="case-path" style={{ opacity: h === null || on ? 1 : 0.25, transition: 'all 400ms' }} />
          })}
        </svg>
        <ul className="relative">
          {OPPS.map((o, i) => {
            const on = h !== null && LINKS.some(([f, oo]) => f === h && oo === i)
            return (
              <li key={o} className="absolute left-0 flex items-center" style={{ top: oy(i) - 24, height: 48 }}>
                <span className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${on ? 'bg-ink text-white' : 'bg-paper'} ${h === null || on ? 'opacity-100' : 'opacity-35'}`}>{o}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="reveal mt-10 min-h-[88px] rounded-2xl bg-paper p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Rationale</p>
        <p key={h ?? -1} className="mt-2 text-lg" style={{ animation: 'card-in 400ms cubic-bezier(.22,1,.36,1) both' }}>{h === null ? 'Five findings, six opportunities, and no idea without evidence behind it.' : WHY[h]}</p>
      </div>
      <ul className="mt-8 space-y-3 md:hidden">{FINDINGS.map((f, i) => <li key={f} className="rounded-xl bg-paper p-4 text-sm"><b>{f}</b><p className="mt-1 text-muted">{WHY[i]}</p></li>)}</ul>
    </Wrap>
  )
}

/* ---------- 7. six concepts ---------- */
const CONCEPTS = [
  { t: 'Role-based onboarding', p: 'Leads and technicians start from different places but saw the same first screen.', a: 'Ask one question at first login and shape the starting view around that role.', o: 'Each person sees a relevant first step instead of the whole product.', x: 'Requires role logic and content for every persona; wrong guesses must be easy to change.' },
  { t: 'Checklist onboarding', p: 'Setup felt endless because progress was invisible.', a: 'A short, finite checklist ending in the first completed work order.', o: 'Setup feels achievable, and the aha moment becomes the finish line.', x: 'Checklists can feel like homework if they grow; it must stay short.' },
  { t: 'Demo environments', p: 'Teams had to invest in setup before seeing any value.', a: 'A pre-filled workspace with realistic assets and work orders to explore.', o: 'Value is visible on day one, before any configuration.', x: 'Moving from demo data to real data needs a clean, trusted transition.' },
  { t: 'Guided setup', p: 'Configuration screens assumed an expert admin.', a: 'Step-by-step setup with defaults, examples and plain-language help.', o: 'Mid-size teams without a dedicated admin can configure confidently.', x: 'Guides can slow down experts; they need a clear way to skip.' },
  { t: 'Feature discovery', p: 'Valuable capabilities stayed hidden until someone needed support.', a: 'Contextual promotion cards that surface the next useful feature at the right moment.', o: 'Users grow into the product instead of hunting for it.', x: 'Too many prompts become noise; timing and frequency must be controlled.' },
  { t: 'Progressive disclosure', p: 'Forms showed every field up front.', a: 'Show essential fields first and reveal advanced ones when needed.', o: 'Lower cognitive load without removing power.', x: 'Hidden fields must stay findable for power users.' },
]
const ICON: Record<string, string> = {
  role: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  check: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  demo: 'M3 5h18v11H3zM8 20h8M12 16v4M10 8.5v4l3.5-2z',
  guide: 'M5 4v16M5 5h11l-2 3.5 2 3.5H5',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5',
  problem: 'M12 3 2 20h20L12 3Zm0 6v5m0 3v.5',
  approach: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  outcome: 'M4 17l5-5 4 4 7-8M15 8h5v5',
  trade: 'M12 4v16M5 8h14M5 8l-3 6h6L5 8Zm14 0-3 6h6l-3-6Z',
}
const Ico = ({ d, className = 'h-5 w-5' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d} /></svg>
)
const CONCEPT_ICONS = ['role', 'check', 'demo', 'guide', 'spark', 'layers']
function Concepts() {
  const [c, setC] = useState(0)
  const x = CONCEPTS[c]
  return (
    <Wrap id="ch-7">
      <Chapter n={7} title="Six ways to solve the same problem" />
      <Lede>Each concept attacks the same goal, getting a new team to its first moment of value, from a different angle. Comparing them side by side made the trade-offs explicit for the team.</Lede>
      <div className="reveal mt-12 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
        <div className="grid grid-cols-2 gap-3">
          {CONCEPTS.map((k, i) => {
            const on = c === i
            return (
              <button key={k.t} onClick={() => setC(i)} onMouseEnter={() => setC(i)} className={`flex h-[112px] flex-col justify-between rounded-2xl p-4 text-left transition-all duration-500 ${on ? 'text-white shadow-[0_20px_50px_-28px_rgba(15,98,254,0.8)]' : 'bg-white hover:-translate-y-0.5'}`} style={on ? { background: BLUE } : {}}>
                <span className="flex items-center justify-between">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${on ? 'bg-white/15' : 'bg-[#edf3ff]'}`} style={on ? {} : { color: BLUE }}><Ico d={ICON[CONCEPT_ICONS[i]]} /></span>
                  <span className={`font-mono text-[11px] ${on ? 'text-white/70' : 'text-muted'}`}>0{i + 1}</span>
                </span>
                <span className="text-[15px] font-semibold leading-tight tracking-tight">{k.t}</span>
              </button>
            )
          })}
        </div>
        <div key={c} className="flex flex-col rounded-3xl bg-white p-6 md:p-8" style={{ animation: 'card-in 550ms cubic-bezier(.22,1,.36,1) both' }}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: BLUE }}><Ico d={ICON[CONCEPT_ICONS[c]]} /></span>
            <div><p className="font-mono text-[11px] text-muted">Concept 0{c + 1}</p><p className="text-2xl font-semibold leading-tight tracking-[-0.03em]">{x.t}</p></div>
          </div>
          <div className="mt-6 grid flex-1 gap-3 sm:grid-cols-2">
            {([['Problem', x.p, 'problem'], ['Approach', x.a, 'approach'], ['Expected outcome', x.o, 'outcome'], ['Trade-off', x.x, 'trade']] as const).map(([a, b, ic], i) => (
              <div key={a} className={`rounded-xl p-4 ${i === 3 ? 'bg-[#fff6e5]' : 'bg-[#f6f7f9]'}`}>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: i === 3 ? '#b8860b' : BLUE }}><Ico d={ICON[ic]} className="h-4 w-4" />{a}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrap>
  )
}

/* ---------- 8. cognitive load ---------- */
const FIELDS: [string, 0 | 1 | 2][] = [
  ['Asset number', 0], ['Description', 0], ['Location', 0], ['Status', 0], ['Type', 0], ['Priority', 0],
  ['Manufacturer', 1], ['Model', 1], ['Serial number', 1], ['Install date', 1], ['Warranty expiry', 1],
  ['Vendor', 2], ['Purchase price', 2], ['Replacement cost', 2], ['GL account', 2], ['Meter group', 2], ['Failure class', 2], ['Parent asset', 2], ['Rotating item', 2], ['Calendar', 2], ['Shift', 2], ['Budget code', 2],
]
const TIER = [['Essential', '#0f62fe', '#e8f0ff'], ['Useful later', '#8a6d00', '#fff4cc'], ['Advanced', '#6f6f6f', '#ececea']] as const
function CognitiveLoad() {
  const [s, setS] = useState(0)
  const steps = ['Before', 'Audit', 'Prioritise', 'After']
  const shown = s === 3 ? FIELDS.filter((f) => f[1] === 0) : s === 2 ? [...FIELDS].sort((a, b) => a[1] - b[1]) : FIELDS
  useEffect(() => { const id = setTimeout(() => setS((v) => (v + 1) % 4), s === 3 ? 3200 : 2000); return () => clearTimeout(id) }, [s])
  return (
    <Wrap id="ch-8" className="bg-white">
      <Chapter n={8} title="Reducing cognitive load" />
      <style>{'@keyframes step-bar{from{width:0}to{width:100%}}'}</style>
      <Lede>A new asset in Maximo could present dozens of fields on day one. Most of them matter, just not yet. I audited the fields new users actually touched, grouped them by when they're needed, and proposed showing only the essentials first.</Lede>
      <div className="reveal mt-16 grid gap-10 lg:grid-cols-[260px_1fr]">
        <div>
          <ol className="space-y-1">
            {steps.map((x, i) => (
              <li key={x}><button onClick={() => setS(i)} className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition duration-300 ${s === i ? 'bg-paper' : 'hover:bg-paper/60'}`}>
                <span className="grid h-6 w-6 place-items-center rounded-full text-[11px]" style={s === i ? { background: BLUE, color: '#fff' } : { background: '#ececea' }}>{i + 1}</span>
                <span className={s === i ? 'font-medium' : 'text-muted'}>{x}</span>
                {s === i && <span key={s} className="absolute bottom-0 left-0 h-0.5" style={{ background: BLUE, animation: `step-bar ${s === 3 ? 3200 : 2000}ms linear forwards` }} />}
              </button></li>
            ))}
          </ol>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line">
            <div className="bg-white p-4"><p className="text-3xl font-semibold tracking-tight">{shown.length}</p><p className="text-xs text-muted">fields visible</p></div>
            <div className="bg-white p-4"><p className="text-3xl font-semibold tracking-tight" style={{ color: BLUE }}>{s === 3 ? 'Low' : s === 0 ? 'High' : '…'}</p><p className="text-xs text-muted">cognitive load</p></div>
          </div>
          <p className="mt-3 text-xs text-muted">Field list is representative, for illustration.</p>
        </div>
        <div className="relative h-[560px] overflow-hidden rounded-3xl bg-paper p-6 md:p-8">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-paper to-transparent" />
          <div className="mb-5 flex items-center justify-between"><p className="font-medium">New asset</p>{s >= 1 && <div className="flex gap-3 text-[11px]">{TIER.map(([t, c]) => <span key={t} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{t}</span>)}</div>}</div>
          <LayoutGroup>
            <motion.div layout className="grid gap-2.5 sm:grid-cols-2" transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map(([f, t]) => (
                  <motion.div key={f} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1, borderColor: s >= 1 ? TIER[t][1] + '55' : '#e3e0d8', backgroundColor: s >= 1 && s < 3 ? TIER[t][2] : '#ffffff' }} exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }} transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, default: { duration: 0.45, ease: 'easeOut' } }} className="rounded-lg border px-3 py-2.5">
                    <p className="text-[11px] text-muted">{f}</p><div className="mt-1 h-3 rounded bg-[#f1f1ef]" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence>{s === 3 && <motion.button layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }} exit={{ opacity: 0 }} className="mt-4 text-sm font-medium" style={{ color: BLUE }}>+ Show {FIELDS.length - shown.length} more fields</motion.button>}</AnimatePresence>
          </LayoutGroup>
        </div>
      </div>
      <p className="reveal mt-12 max-w-3xl text-2xl font-medium leading-snug tracking-tight">Simplicity didn't come from removing capability. It came from deciding <span className="hl" style={{ color: BLUE }}>when</span> each piece of information earns its place.</p>
    </Wrap>
  )
}

/* ---------- 9. execution ---------- */
const DECISIONS = [
  { q: 'Why make the first work order the finish line?', a: 'It was the moment sales said demos landed and the moment MaintainX optimised for. Everything before it is setup; everything after it is value.' },
  { q: 'Why ask about role before anything else?', a: 'One question at login cost seconds but removed whole screens of irrelevant guidance for each persona.' },
  { q: 'Why promotion cards instead of tours?', a: 'Tours front-load information users can\u2019t use yet. Cards appear when a feature becomes relevant and can be dismissed.' },
  { q: 'Why keep the checklist visible but collapsible?', a: 'Visible progress motivates; forced progress frustrates. Users can tuck it away and return to it.' },
]
function Execution() {
  const [o, setO] = useState(0)
  const flow = ['Sign up', 'Choose role', 'Starter workspace', 'Checklist', 'First work order', 'Discover next feature']
  return (
    <Wrap id="ch-9">
      <Chapter n={9} title="Designing for the 1% who stay" />
      <Lede>Strategy turned into a flow built around one outcome. Every screen had a single job: move the user one step closer to their first completed work order.</Lede>
      <div className="reveal mt-16 flex flex-wrap items-center gap-2">
        {flow.map((f, i) => (
          <div key={f} className="flex items-center gap-2">
            <span className="rounded-full px-4 py-2.5 text-sm font-medium" style={i === 4 ? { background: BLUE, color: '#fff' } : { background: '#fff' }}>{f}</span>
            {i < flow.length - 1 && <span className="text-muted">→</span>}
          </div>
        ))}
      </div>
      <div className="reveal mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 sm:col-span-2">
            <p className="text-xs text-muted">Onboarding concept · role selection</p>
            <p className="mt-2 text-lg font-semibold">What brings you to Maximo?</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">{['I manage maintenance', 'I do the work', 'I\u2019m just exploring'].map((r, i) => <div key={r} className="rounded-lg border p-3" style={i === 0 ? { borderColor: BLUE, background: '#e8f0ff' } : { borderColor: '#e3e0d8' }}>{r}</div>)}</div>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs text-muted">Guidance pattern · tooltip</p>
            <div className="mt-4 rounded-lg bg-[#161616] p-3 text-xs text-white">Locations group your assets. Start with one building.<div className="mt-2 flex justify-end gap-2"><span className="text-white/60">Skip</span><span>Got it</span></div></div>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs text-muted">Feature promotion · card</p>
            <div className="mt-4 rounded-lg p-3 text-xs text-white" style={{ background: BLUE }}>New: schedule preventive maintenance for this asset.<p className="mt-2 font-medium">Try it →</p></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">Decisions, not screens</p>
          {DECISIONS.map((d, i) => (
            <button key={d.q} onClick={() => setO(i)} className={`w-full rounded-2xl p-5 text-left transition ${o === i ? 'bg-white shadow-[0_20px_50px_-35px_rgba(0,0,0,0.35)]' : 'hover:bg-white/60'}`}>
              <p className="font-medium">{d.q}</p>
              <div className={`grid transition-all duration-500 ${o === i ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><p className="overflow-hidden text-sm leading-relaxed text-muted">{d.a}</p></div>
            </button>
          ))}
        </div>
      </div>
    </Wrap>
  )
}

/* ---------- 10. visual design ---------- */
type Ico = typeof Calendar
const TOUR_STAGES = ['Start', 'Prepare', 'Execute', 'Record', 'Close'] as const
const TOUR: { stage: number; title: string; hint: string; tip: string; chips: [Ico, string][]; img?: string }[] = [
  { stage: 0, title: 'Open Maximo Mobile', tip: 'Tap My Schedule', hint: 'Sign in and let the app sync.', chips: [[Document, 'Technician app'], [Renew, 'Sync']] },
  { stage: 0, title: 'View assigned work orders', tip: 'Your assigned work', hint: 'Open "My Schedule" to see today\u2019s jobs.', chips: [[List, 'My work list'], [Document, 'Work order']] },
  { stage: 0, title: 'Accept the job', tip: 'Tap Accept', hint: 'Accepting tells your lead you\u2019re on it.', chips: [[UserFollow, 'Accept'], [Close, 'Reject']] },
  { stage: 1, title: 'Review the asset', tip: 'Asset details', hint: 'Check history before you head out.', chips: [[Asset, 'Asset'], [Location, 'Location']] },
  { stage: 1, title: 'Check materials and tools', tip: 'Planned materials', hint: 'Reserve parts so they\u2019re ready.', chips: [[Tools, 'Tools'], [Purchase, 'Materials']] },
  { stage: 1, title: 'Read the safety plan', tip: 'Hazards and precautions', hint: 'Know the risks before you start.', chips: [[WarningAlt, 'Safety'], [Document, 'Plan']] },
  { stage: 2, title: 'Start the timer', tip: 'Tap Start work', hint: 'Labour time is logged automatically.', chips: [[Play, 'Start'], [Time, 'Labour']] },
  { stage: 2, title: 'Follow the task list', tip: 'Tick off each task', hint: 'One task at a time, in order.', chips: [[Task, 'Tasks'], [Checkmark, 'Done']] },
  { stage: 2, title: 'Pause if blocked', tip: 'Pause, don\u2019t abandon', hint: 'Waiting on a part? Pause and add a reason.', chips: [[Pause, 'Pause'], [Chat, 'Reason']] },
  { stage: 3, title: 'Log meter readings', tip: 'Enter reading', hint: 'Readings drive preventive maintenance.', chips: [[Meter, 'Meter'], [Scan, 'Scan']] },
  { stage: 3, title: 'Add photos and notes', tip: 'Attach evidence', hint: 'A photo saves a follow-up call.', chips: [[Camera, 'Photo'], [Attachment, 'Attach']] },
  { stage: 3, title: 'Report a follow-up', tip: 'Create service request', hint: 'Spotted something else? Flag it here.', chips: [[Bullhorn, 'Service request']] },
  { stage: 4, title: 'Complete the work order', tip: 'Change status', hint: 'Mark it complete once everything is logged.', chips: [[Checkmark, 'Complete'], [Edit, 'Status']] },
  { stage: 4, title: 'Sync to the office', tip: 'Sent to your lead', hint: 'Your lead sees it the moment you\u2019re back online.', chips: [[CloudUpload, 'Upload'], [Renew, 'Sync']] },
]
const GALLERY: [Ico, string][] = [[Calendar, 'Schedule'], [Tools, 'Work orders'], [Map, 'Map'], [Bullhorn, 'Service request'], [Renew, 'Sync'], [Asset, 'Asset'], [Location, 'Location'], [Meter, 'Meter'], [Task, 'Task'], [Play, 'Start'], [Pause, 'Pause'], [Time, 'Labour'], [Camera, 'Photo'], [Attachment, 'Attach'], [Scan, 'Scan'], [Barcode, 'Barcode'], [WarningAlt, 'Hazard'], [Purchase, 'Materials'], [Report, 'Report'], [Filter, 'Filter'], [Search, 'Search'], [Notification, 'Alerts'], [Settings, 'Settings'], [Help, 'Help']]

function MockScreen({ step }: { step: (typeof TOUR)[number] }) {
  const [Main] = step.chips[0]
  return (
    <div className="flex h-full flex-col bg-white text-[10px]">
      <div className="flex items-center justify-between border-b border-[#e0e0e0] px-3 py-2.5"><span className="font-medium">14866 · Pump repair</span><span className="rounded-full bg-[#e8f0ff] px-2 py-0.5 text-[9px]" style={{ color: BLUE }}>{TOUR_STAGES[step.stage]}</span></div>
      <div className="space-y-2 p-3">
        {[0, 1, 2, 3].map((r) => (
          <div key={r} className={`relative flex items-center gap-2.5 rounded-md border p-2.5 ${r === 1 ? 'border-[#0f62fe]' : 'border-[#e0e0e0]'}`}>
            <span className="grid h-6 w-6 place-items-center rounded" style={{ background: r === 1 ? BLUE : '#f4f4f4', color: r === 1 ? '#fff' : '#6f6f6f' }}>{r === 1 ? <Main size={14} /> : <Document size={12} />}</span>
            <div className="flex-1"><div className={`h-2 rounded ${r === 1 ? 'w-24 bg-[#161616]/70' : 'w-20 bg-[#e0e0e0]'}`} /><div className="mt-1.5 h-1.5 w-28 rounded bg-[#f1f1ef]" /></div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between bg-[#161616] px-3 py-2 text-[8px] text-white/70"><span>IBM Maximo Application Suite</span><Renew size={10} /></div>
    </div>
  )
}

function GuidedTour() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => { const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 }); if (ref.current) io.observe(ref.current); return () => io.disconnect() }, [])
  useEffect(() => { if (!auto || !seen) return; const id = setTimeout(() => setI((v) => (v + 1) % TOUR.length), 2600); return () => clearTimeout(id) }, [i, auto, seen])
  const go = (n: number) => { setAuto(false); setI(Math.max(0, Math.min(TOUR.length - 1, n))) }
  const st = TOUR[i]
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <div ref={ref} className="overflow-hidden rounded-3xl bg-[#f4f4f4] shadow-[0_40px_90px_-40px_rgba(0,30,120,0.45)]">
      <div className="px-6 pt-7 md:px-8"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6f6f6f]">Guided tour · Maximo Mobile</p><p className="mt-2 text-2xl font-light tracking-tight text-[#161616] md:text-3xl">Your work order, one screen at a time.</p></div>
      <div className="mt-6 grid grid-cols-5 gap-1 border-b border-[#e0e0e0] bg-white px-4 pt-3 md:px-6">
        {TOUR_STAGES.map((x, k) => (
          <button key={x} onClick={() => go(TOUR.findIndex((t) => t.stage === k))} className="pb-3 text-left">
            <div className="h-1 overflow-hidden bg-[#e0e0e0]"><motion.div className="h-full" style={{ background: BLUE }} animate={{ width: k < st.stage ? '100%' : k === st.stage ? `${((TOUR.filter((t) => t.stage === k).findIndex((t) => t === st) + 1) / TOUR.filter((t) => t.stage === k).length) * 100}%` : '0%' }} transition={{ duration: 0.5, ease }} /></div>
            <p className={`mt-2 text-[13px] transition-colors ${k === st.stage ? 'font-semibold' : 'text-[#8d8d8d]'}`} style={k === st.stage ? { color: BLUE } : {}}>{x}</p>
          </button>
        ))}
      </div>
      <div className="grid items-center gap-8 p-6 md:grid-cols-[230px_1fr] md:gap-10 md:p-8">
        <div className="relative mx-auto h-[420px] w-[230px] overflow-hidden rounded-[28px] border-[6px] border-[#161616] bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease }}>
              {st.img ? <img src={st.img} alt={st.title} className="h-full w-full object-cover object-[50%_42%]" /> : <MockScreen step={st} />}
            </motion.div>
          </AnimatePresence>
          {!st.img && (
            <motion.div key={'tip' + i} className="pointer-events-none absolute left-3 top-[86px] z-10" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}>
              <span className="absolute -left-1 -top-1 h-9 w-9 rounded-full border-2 border-white" style={{ background: BLUE + '55', animation: 'tour-pulse 1.6s ease-out infinite' }} />
              <span className="ml-12 mt-1 inline-block whitespace-nowrap bg-[#161616] px-2.5 py-1.5 text-[11px] font-medium text-white">{st.tip}</span>
            </motion.div>
          )}
        </div>
        <div className="flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }}>
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-base text-white" style={{ background: BLUE }}>{i + 1}</span>
                <div><p className="font-mono text-[11px] tracking-[0.15em]" style={{ color: BLUE }}>{TOUR_STAGES[st.stage].toUpperCase()} · {i + 1} OF {TOUR.length}</p><p className="mt-1 text-xl font-medium tracking-tight text-[#161616]">{st.title}</p></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {st.chips.map(([I, l]) => <span key={l} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 text-[13px] font-medium ring-1 ring-black/5"><span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: BLUE }}><I size={14} /></span>{l}</span>)}
              </div>
              <p className="mt-4 text-[15px] text-[#393939]">{st.hint}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto grid grid-cols-2 pt-8 text-sm">
            <button onClick={() => go(i - 1)} disabled={i === 0} className="flex items-center justify-between bg-[#393939] px-4 py-3 text-white transition disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8]">Back <ArrowLeft size={18} /></button>
            <button onClick={() => go(i === TOUR.length - 1 ? 0 : i + 1)} className="flex items-center justify-between px-4 py-3 text-white transition hover:brightness-110" style={{ background: BLUE }}>{i === TOUR.length - 1 ? 'Restart' : 'Next'} <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
      <style>{'@keyframes tour-pulse{0%{box-shadow:0 0 0 0 rgba(15,98,254,.45)}100%{box-shadow:0 0 0 18px rgba(15,98,254,0)}}'}</style>
    </div>
  )
}

function MobileTour() {
  const [hover, setHover] = useState<number | null>(null)
  const options = [
    ['Redesign the app', 'Unify every module behind one icon and navigation system.', 'Out of reach', 'Mobile is built by several product teams. Getting them all to agree would take longer than our users could wait.'],
    ['Icon gallery', 'A Carbon-inspired reference of every icon and what it means.', 'Explored, shelved', 'It explained what an icon was, not when to use it.'],
    ['Guided tour', 'Teach the app inside the real job, stage by stage.', 'Recommended · adopted', 'Works with the app as it is today, and needs no cross-team rebuild.'],
  ]
  return (
    <Wrap id="ch-10" className="bg-white">
      <Chapter n={10} title="Taking onboarding into the field" kicker="Maximo Mobile" />
      <Lede>The same gap followed technicians onto their phones. Maximo Mobile sits at 2.5 stars on the Play Store, and reviews kept saying the same thing: people didn't know which icon to tap, or when.</Lede>

      <div className="reveal mt-14 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
        <div className="bg-white p-6"><p className="text-5xl font-semibold tracking-tight">2.5<span className="text-2xl text-muted">/5</span></p><p className="mt-2 text-sm text-muted">Play Store rating, Maximo Mobile</p></div>
        <div className="bg-white p-6"><p className="text-2xl font-medium leading-snug tracking-tight">"Which icon am I supposed to use?"</p><p className="mt-2 text-sm text-muted">The most common complaint in reviews</p></div>
        <div className="bg-white p-6"><p className="text-2xl font-medium leading-snug tracking-tight">Many teams, one app</p><p className="mt-2 text-sm text-muted">Each module is owned by a different team, with its own patterns</p></div>
      </div>

      <div className="reveal mt-24 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">The strategic call</p>
        <p className="mt-4 text-3xl font-medium leading-tight tracking-tight md:text-4xl">We couldn't fix the whole app. So I recommended we <span className="hl" style={{ color: BLUE }}>fix the way in</span>.</p>
        <p className="mt-5 text-lg leading-relaxed text-muted">Our team couldn't rebuild it, but we could bridge the gap with onboarding. I weighed three options against one question: what helps a technician finish their first job soonest?</p>
      </div>
      <div className="reveal mt-10 grid gap-4 md:grid-cols-3">
        {options.map(([t, d, tag, why], k) => (
          <div key={t} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} className="rounded-2xl border p-6 transition duration-300" style={k === 2 ? { borderColor: BLUE, background: '#f5f8ff' } : { borderColor: '#e3e0d8', opacity: hover === k ? 1 : 0.75 }}>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: k === 2 ? BLUE : '#8d8d8d' }}>{tag}</p>
            <p className="mt-3 text-xl font-semibold tracking-tight">{t}</p>
            <p className="mt-2 text-sm text-muted">{d}</p>
            <p className="mt-5 border-t border-line pt-4 text-sm">{why}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-28 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Iteration 01 · Icon gallery</p>
          <p className="mt-4 text-3xl font-medium leading-tight tracking-tight">A dictionary tells you what a word means, not when to say it.</p>
          <p className="mt-5 leading-relaxed text-muted">My first move was a gallery of every Mobile icon, inspired by IBM's Carbon icon library. It was tidy and complete, but it didn't help. A technician in front of a broken pump doesn't need a glossary. They need to know what to tap next. I shelved it and moved to teaching the icons inside the real flow.</p>
        </div>
        <div className="relative rounded-3xl bg-paper p-5">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {GALLERY.map(([I, l], k) => (
              <div key={l} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg bg-white text-[#161616] transition hover:-translate-y-0.5 hover:shadow-md" style={{ animation: `card-in 400ms ${k * 25}ms both` }}>
                <I size={20} /><span className="px-1 text-center text-[9px] leading-tight text-muted">{l}</span>
              </div>
            ))}
          </div>
          <span className="absolute -right-3 -top-3 rotate-3 rounded-full bg-[#161616] px-3 py-1.5 text-xs font-medium text-white">Shelved: no "when"</span>
        </div>
      </div>

      <div className="reveal mt-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Recommendation · Guided tour</p>
        <p className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight">Borrowed from MaintainX's checklist onboarding, shaped around a real work order.</p>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">I broke a technician's day into five stages that match how the job actually happens. Each step teaches one icon at the moment it's needed. The team took the guided tour forward from my proposal.</p>
      </div>
      <div className="reveal mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <GuidedTour />
        <div className="space-y-6 self-center">
          {[['Five stages, one job', 'Start, Prepare, Execute, Record and Close mirror the real order of work, so the tour feels like doing the job.'], ['Icons taught in context', 'Every step pairs a spotlight with the exact icon and its name. It covers what the gallery missed: when.'], ['Always skippable, always resumable', 'Progress bars show where you are. Back and Next keep the user in control.'], ['Works with today\u2019s app', 'It sits on top of existing modules, so no team had to rebuild anything to ship it.']].map(([t, d], k) => (
            <div key={t} className="flex gap-4"><span className="mt-1 font-mono text-xs" style={{ color: BLUE }}>0{k + 1}</span><div><p className="font-semibold">{t}</p><p className="mt-1 text-sm leading-relaxed text-muted">{d}</p></div></div>
          ))}
        </div>
      </div>
    </Wrap>
  )
}

function VisualDesign() {
  const [v, setV] = useState<'trad' | 'new'>('new')
  return (
    <Wrap id="ch-11" className="bg-white">
      <Chapter n={11} title="Visual design as product communication" />
      <Lede>The guided tour only helps if technicians get the app in the first place. Inside Maximo, the mobile app was announced with a plain notification that was easy to miss. I redesigned that moment as a promotional card that sells the benefit, borrowing from modern SaaS while staying inside Carbon, and used design critiques to earn stakeholder buy-in.</Lede>
      <div className="reveal mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl bg-paper p-6 md:p-10">
          <div className="inline-flex rounded-full bg-white p-1 text-sm">
            {(['trad', 'new'] as const).map((k) => <button key={k} onClick={() => setV(k)} className={`rounded-full px-4 py-2 transition ${v === k ? 'bg-ink text-white' : 'text-muted'}`}>{k === 'trad' ? 'Traditional pattern' : 'What I designed'}</button>)}
          </div>
          <div className="mt-10 flex min-h-[220px] items-center justify-center">
            {v === 'trad' ? (
              <div key="t" className="w-full max-w-sm border border-[#c6c6c6] bg-white p-4 text-sm" style={{ animation: 'card-in 500ms both' }}>
                <p className="font-medium">Notification</p><p className="mt-1 text-muted">Maximo Mobile is available. See documentation for installation details.</p><p className="mt-3 text-xs" style={{ color: BLUE }}>Learn more</p>
              </div>
            ) : (
              <img key="n" src={appCard} alt="Promotional card: Download the Maximo app" className="w-full max-w-sm shadow-[0_30px_60px_-25px_rgba(40,20,120,0.6)]" style={{ animation: 'card-in 500ms both' }} />
            )}
          </div>
        </div>
        <div className="space-y-px overflow-hidden rounded-3xl bg-line">
          {[['Benefit first', '"Take Maximo with you wherever your work happens" leads, not "Maximo Mobile is available".'], ['Show the job', 'Assets, work orders and updates, named in the words technicians use.'], ['One clear action', '"Get the app" replaces a documentation link that sent people away.'], ['Modern SaaS, still Carbon', 'Gradient and illustration to signal "this is for you", built on Carbon tokens.'], ['Bridge to the tour', 'Downloading is the first step. The guided tour takes over the moment the app opens.']].map(([a, b]) => (
            <div key={a} className="bg-white p-5"><p className="text-sm font-medium">{a}</p><p className="mt-1 text-sm text-muted">{b}</p></div>
          ))}
        </div>
      </div>
    </Wrap>
  )
}

/* ---------- 11. outcomes ---------- */
function Outcomes() {
  const items = [
    ['150+', 'stakeholders', 'Findings presented across design, sales and support.'],
    ['Easier', 'to understand', 'In user testing, participants found Small SaaS easier to understand and navigate than traditional Maximo.'],
    ['Shaped', 'onboarding', 'Research fed directly into onboarding discussions for the product.'],
    ['Informed', 'activation', 'Recommendations informed future thinking around guidance and activation.'],
    ['Widened', 'the lens', 'Support interactions became part of the product conversation, not only the interface.'],
  ]
  return (
    <section id="ch-12" className="bg-[#0b0d12] px-6 py-28 text-white md:px-16 md:py-40">
      <div className="mx-auto max-w-[1180px]">
        <Chapter n={12} title="Outcomes & influence" dark />
        <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-6">
          {items.map(([a, b, c], i) => (
            <div key={b} className={`reveal group bg-[#0b0d12] p-8 transition-colors duration-500 hover:bg-[#121722] ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`} style={{ transitionDelay: i * 80 + 'ms' }}>
              <p className={`${i === 0 ? 'text-7xl' : 'text-4xl'} font-semibold tracking-[-0.05em]`} style={i === 0 ? { color: '#78a9ff' } : {}}>{a}</p>
              <p className="mt-1 text-white/60">{b}</p>
              <p className="mt-8 leading-relaxed text-white/80">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- 12. reflection ---------- */
function Reflection() {
  return (
    <section id="ch-13" className="px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto max-w-[1180px]">
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.2em] text-muted">12 / Reflection</p>
        <blockquote className="reveal mt-10 text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[1] tracking-[-0.05em]">
          Great SaaS experiences are not defined by how many features they offer. <span className="hl" style={{ color: BLUE }}>They are defined by how quickly users understand how those features create value.</span>
        </blockquote>
        <div className="reveal mt-24 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {[['What I\u2019d push next', 'Instrument the journey so activation is measured, not assumed.'], ['What I learned', 'The best onboarding work often happens outside the product: in sales calls and support queues.'], ['What I carry forward', 'Design for the moment of value first, then everything that leads to it.']].map(([a, b]) => (
            <div key={a}><p className="font-medium">{a}</p><p className="mt-2 leading-relaxed text-muted">{b}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function MaximoCase() {
  useCaseReveal()
  return (
    <main className="case">
      <CaseNav />
      <Hero />
      <AdoptionGap />
      <Research />
      <MaintainX />
      <Insight />
      <OpportunityMap />
      <Concepts />
      <CognitiveLoad />
      <Execution />
      <MobileTour />
      <VisualDesign />
      <Outcomes />
      <Reflection />
      <NextProject href="#/carbon-iq" kicker="AI tool · IBM" title="Carbon IQ: Grammarly for design" accent="#78a9ff" bg="#0b1220" />
    </main>
  )
}
