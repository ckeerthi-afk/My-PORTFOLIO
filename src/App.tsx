import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import WaterGarden from './components/WaterGarden'
import govLogo from './assets/gov-logo.png'
import IbmLogo from './components/IbmLogo'
import MaximoCase from './case/MaximoCase'
import RecipesCase from './case/RecipesCase'
import WelcomeCase, { FlowerTrail } from './case/WelcomeCase'
import CarbonQACase, { GridTrail } from './case/CarbonQACase'
import Garden, { type Bloom, BLOOMS } from './components/Garden'

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{children}</p>
)

function BudLogo({ size = 'h-7 w-7' }: { size?: string }) {
  const p = (r: number, n: number, rot = 0, ri?: number) => Array.from({ length: n }, (_, i) => { const rr = ri !== undefined && i % 2 ? ri : r; const t = ((rot + (i * 360) / n - 90) * Math.PI) / 180; return `${Math.cos(t) * rr},${Math.sin(t) * rr}` }).join(' ')
  const ease = 'transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] origin-center [transform-box:fill-box]'
  return (
    <svg viewBox="-16 -16 32 32" className={`hydrangea ${size} shrink-0 overflow-visible`}>
      <g className={`${ease} group-hover:scale-[0.3] group-hover:opacity-0`}>
        <polygon points={p(10, 5)} style={{ fill: 'var(--h-petal)', stroke: 'var(--h-petal)' }} strokeWidth={2} strokeLinejoin="round" />
        <circle r={1.8} style={{ fill: 'var(--h-ring)' }} />
      </g>
      <g className={`${ease} scale-[0.3] -rotate-[72deg] opacity-0 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100`}>
        <polygon points={p(13, 10, 0, 7.5)} style={{ fill: 'var(--h-openPetal)', stroke: 'var(--h-openPetal)' }} strokeWidth={2.5} strokeLinejoin="round" />
        <circle r={8.5} style={{ fill: 'var(--h-openHalo)' }} />
        <polygon points={p(8.5, 10, 18, 5)} style={{ fill: 'var(--h-openInner)' }} />
        <circle r={3.5} style={{ fill: 'var(--h-ring)' }} />
        <circle r={1.2} fill="#eef1cc" />
      </g>
    </svg>
  )
}

function Nav() {
  return (
    <>
    <a href="#" onClick={(e) => { e.preventDefault(); if (window.location.hash) window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Back to the main page" className="group fixed left-5 top-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-line bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] transition hover:scale-105 md:left-8"><BudLogo size="h-8 w-8" /></a>
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
      <nav className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-paper/80 p-1.5 text-sm backdrop-blur-md">
        {['Work', 'About'].map((l) => (
          <a key={l} href={l === 'About' ? '#skills' : '#work'} className="rounded-full px-4 py-2 text-muted transition hover:bg-white hover:text-ink">{l}</a>
        ))}
        <a href="mailto:c.keerthi0421@gmail.com?subject=Hi%20Chandana" target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-4 py-2 text-paper transition hover:opacity-80">Say hi</a>
      </nav>
    </header>
    </>
  )
}

function Portrait() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="View full photo of Chandana" className="shrink-0 cursor-zoom-in rounded-full transition duration-300 hover:scale-105">
        <img src="/chandana-2.jpg" alt="Chandana Keerthi Pediredla" className="h-16 w-16 rounded-full object-cover object-[50%_45%] ring-4 ring-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]" />
      </button>
      {open && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Photo of Chandana" onClick={() => setOpen(false)} className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-black/80 p-6 backdrop-blur-sm" style={{ animation: 'fade-in 250ms ease both' }}>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm text-ink transition hover:bg-white/85">Close ✕</button>
          <figure onClick={(e) => e.stopPropagation()} className="cursor-default" style={{ animation: 'card-in 400ms cubic-bezier(.22,1,.36,1) both' }}>
            <img src="/chandana-2.jpg" alt="Chandana Keerthi Pediredla" className="max-h-[80vh] w-auto rounded-3xl shadow-2xl" />
            <figcaption className="mt-4 text-center text-sm text-white/80">Chandana Keerthi Pediredla · UX Designer at IBM</figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  )
}

function Hero() {
  const [bloom, setBloom] = useState<Bloom | null>(null)
  return (
    <section id="top" className="relative mx-auto grid min-h-screen max-w-[1440px] items-center gap-12 px-6 pt-28 pb-16 md:px-16 lg:grid-cols-[1fr_1fr]">
      <div className="relative z-20 max-w-xl">
        <div className="flex items-center gap-4">
          <Portrait />
          <div>
            <p className="text-lg font-semibold tracking-tight">Chandana</p>
            <p className="mt-0.5 text-sm text-muted">UX Designer at IBM</p>
          </div>
        </div>
        <h1 className="mt-14 text-[clamp(2.5rem,4.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          I design the moment complex products start <span className="hydrangea hl" style={{ color: 'var(--h-openHalo)' }}>making sense</span>.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          UX Designer at IBM who turns complex enterprise software into products teams adopt from day one. I bring the strategy, not just the screens.
        </p>
        <div className="mt-10 flex items-center gap-6 text-sm">
          <a href="#work" className="group rounded-full bg-ink px-5 py-3 text-paper transition hover:opacity-80">View my work <span className="inline-block transition group-hover:translate-x-0.5">→</span></a>
        </div>
      </div>
      <div id="garden" className="relative">
        <Garden onBloom={setBloom} />
      </div>
    </section>
  )
}

const accent = { color: 'var(--h-openHalo)' }

function Section({ id, n, label, title, children }: { id?: string; n: string; label: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className={`mx-auto max-w-[1280px] px-6 md:px-16 ${id === 'work' ? 'pb-32 pt-8' : 'py-32'}`}>
      <div className="reveal group mb-16 grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-6">
        {label && <p className="col-start-2 mb-3 text-sm text-muted">{n} — {label}</p>}
        <BudLogo size="col-start-1 mt-[0.15em] h-[clamp(2rem,3.6vw,3.25rem)] w-[clamp(2rem,3.6vw,3.25rem)]" />
        <h2 className="max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

const PATHS = [
  { k: 'Recruiters', line: 'The 60-second version.', color: '#0f62fe', bg: '#e3ebff', cta: 'View my work →',
    pitch: "UX Designer at IBM who turns complex enterprise software into products teams adopt from day one. I bring the strategy, not just the screens.",
    items: [['Now', 'UX Designer, IBM Maximo'], ['Focus', 'Onboarding, adoption, workflow simplification'], ['Proof', '< 30 min to first value for mid-size teams'], ['Looking for', 'Product, UX and SaaS design roles']] },
  { k: 'Designers', line: 'How the thinking happens.', color: '#b8456a', bg: '#fbe4ec', cta: 'Read the process →',
    pitch: 'Product Designer designing the controls, guardrails, and feedback loops that shape human-AI interactions.',
    items: [['Research first', 'Interviews and audits before pixels'], ['Systems over screens', 'Flows, states and Carbon components'], ['Prototype in code', 'HTML, CSS, JS and p5.js'], ['Agentic AI', 'Guardrails and trust in AI-assisted flows']] },
  { k: 'Curious minds', line: 'The wandering side.', color: '#2f7d5b', bg: '#e1f1e6', cta: 'Wander the garden →',
    pitch: 'Curiosity is where my best work starts. I build with code, Arduino and 3D, and grow gardens out of SVG just to see what happens.',
    items: [['The garden', 'This site, hand-built in SVG'], ['Automotive', 'A futuristic F77 superbike console'], ['Physical', 'Arduino rituals and flood wayfinding'], ['Experiments', 'Creative coding and AI prototypes']] },
]

function OpenBud() {
  return <span className="inline-block [&_g:first-child]:scale-[0.3] [&_g:first-child]:opacity-0 [&_g:last-child]:rotate-0 [&_g:last-child]:scale-100 [&_g:last-child]:opacity-100"><BudLogo size="h-7 w-7" /></span>
}

function Journey() {
  const [open, setOpen] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  const hover = (i: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(i), 140) }
  return (
    <section id="journey" className="mx-auto max-w-[1280px] px-6 py-20 md:px-16">
      <div className="reveal flex flex-col gap-3 lg:h-[440px] lg:flex-row">
        {PATHS.map((p, i) => {
          const on = open === i
          return (
            <button key={p.k} onMouseEnter={() => hover(i)} onMouseLeave={() => window.clearTimeout(timer.current)} onClick={() => setOpen(i)} style={{ background: p.bg }}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl p-6 text-left text-ink transition-all duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)] will-change-[flex-grow] md:p-8 ${on ? 'lg:flex-[2.4]' : 'lg:flex-1 hover:brightness-[0.98]'}`}>
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/60 blur-3xl transition-transform duration-[1500ms] group-hover:translate-x-[-30%] group-hover:translate-y-[20%]" />
              {on ? (
                <div key="open" className="relative flex flex-1 flex-col" style={{ animation: 'card-in 700ms 820ms cubic-bezier(.22,1,.36,1) both' }}>
                  <h3 className="flex flex-wrap items-baseline gap-x-4 text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                    <span className="text-muted">For</span><span>{p.k}</span>
                  </h3>
                  <p className="mt-4 max-w-xl text-[15px] font-medium leading-relaxed tracking-[-0.01em] md:text-base">{p.pitch}</p>
                  <ul className="mt-auto grid overflow-hidden pt-6 sm:grid-cols-2">
                    {p.items.map(([t, d], j) => (
                      <li key={t} className={`bg-white/55 p-4 ${j % 2 === 0 ? 'sm:border-r' : ''} ${j < 2 ? 'border-b' : ''} ${j === 0 ? 'rounded-tl-2xl' : ''} ${j === 1 ? 'rounded-tr-2xl' : ''} ${j === 2 ? 'rounded-bl-2xl' : ''} ${j === 3 ? 'rounded-br-2xl' : ''}`} style={{ borderColor: p.bg }}>
                        <p className="text-xs uppercase tracking-wider" style={{ color: p.color }}>{t}</p>
                        <p className="mt-1.5 text-sm leading-snug">{d}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div key="closed" className="relative mt-auto pt-16 lg:pt-0" style={{ animation: 'card-in 600ms 700ms cubic-bezier(.22,1,.36,1) both' }}>
                  <p className="text-sm text-muted">For</p>
                  <h3 className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{p.k}</h3>
                  <p className="mt-3 text-muted">{p.line}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function MaximoPreview() {
  const steps = ['Create your site', 'Add first asset', 'Invite a technician', 'Schedule a work order']
  return (
    <div className="flex w-full max-w-[540px] overflow-hidden rounded-xl bg-white text-ink shadow-[0_40px_100px_-30px_rgba(0,20,80,0.6)] transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.02]">
      <div className="hidden w-40 shrink-0 border-r border-line bg-[#f4f4f4] p-4 text-[11px] sm:block">
        <p className="font-semibold">IBM Maximo</p>
        {['Home', 'Assets', 'Work orders', 'Locations', 'Reports'].map((t, i) => (<p key={t} className={`mt-3 ${i === 0 ? 'font-medium text-[#0f62fe]' : 'text-muted'}`}>{t}</p>))}
      </div>
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between"><p className="text-sm font-semibold">Get started</p><span className="text-[11px] text-muted">3 of 4 complete</span></div>
        <div className="mt-3 h-1 bg-[#e0e0e0]"><div className="h-full w-1/4 bg-[#0f62fe] transition-all duration-[1400ms] group-hover:w-3/4" /></div>
        <ul className="mt-4 space-y-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 border border-[#e0e0e0] p-2.5 text-xs">
              <span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] text-white ${i < 3 ? 'bg-[#0f62fe]' : 'border border-[#c6c6c6]'}`}>{i < 3 ? '✓' : ''}</span>{s}
              {i === 3 && <span className="ml-auto bg-[#0f62fe] px-2 py-1 text-[10px] text-white">Start →</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PhonePreview() {
  const moods = ['#bfe5b2', '#f4b3d3', '#aab6ee', '#c9aedd']
  return (
    <div className="h-[340px] w-[180px] overflow-hidden rounded-[32px] border-[7px] border-[#1d1a1f] bg-[#f6f5fa] p-4 text-[#1f1a2e] shadow-[0_40px_100px_-30px_rgba(37,23,84,0.45)] transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:rotate-[-2deg]" style={{ fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a8597]">Week 24 · Thursday</p>
      <p className="mt-1.5 text-[22px] font-semibold leading-[1.02] tracking-[-0.03em]">Morning,<br />Lilly</p>
      <div className="mt-3 rounded-[18px] bg-[#251754] p-3 text-white">
        <p className="text-[11px] font-semibold leading-tight">How are you feeling today?</p>
        <div className="mt-2.5 flex justify-between">{moods.map((c) => <span key={c} className="h-6 w-6 rounded-full" style={{ background: c }} />)}</div>
      </div>
      <div className="mt-2 rounded-[16px] bg-[#dfe3fb] p-3">
        <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[#6b5a86]">For you</p>
        <p className="mt-1 text-[10px] font-semibold leading-tight">Your Baby Box is ready</p>
      </div>
      <p className="mt-3 text-[9px] font-semibold">This week</p>
      <div className="mt-1.5 flex justify-between">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, k) => <span key={k} className="h-4 w-4 rounded-full" style={k < 4 ? { background: moods[k] } : { border: '1px dashed #d9d5e3' }} />)}</div>
    </div>
  )
}

function RecipesPreview() {
  return (
    <div className="h-[340px] w-[180px] rounded-[32px] border-[7px] border-ink bg-[#f7f5ff] p-4 text-ink shadow-[0_40px_100px_-30px_rgba(40,20,100,0.6)] transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:rotate-[2deg]">
      <div className="flex items-start justify-between"><p className="font-serif text-lg leading-none">Make your<br />own bento</p><span className="rounded-full bg-[#3a2399] px-2 py-1 text-[8px] text-white">Start ↗</span></div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[#6d4fe0]">Life recipes</p>
      <div className="mt-2 overflow-hidden rounded-xl bg-[#3a2399] text-white">
        <div className="h-20 bg-[radial-gradient(circle_at_50%_60%,#f2a65a_0_28%,#c8553d_29%_42%,#2b2b2b_43%_60%,#3a2399_61%)]" />
        <div className="p-2.5"><p className="font-serif text-sm leading-tight">My flatmate ghosted me</p><p className="mt-1 text-[8px] text-white/70">One-pot wonder for solo living. Face your challenges.</p></div>
      </div>
      <div className="mt-2 rounded-lg border border-[#ddd5ff] p-2 text-[10px]">First rent payment →</div>
    </div>
  )
}

function CheckPreview() {
  const rows: [string, string, string][] = [['#da1e28', 'Accessibility', 'Button contrast 2.9:1'], ['#f1c21b', 'Components', 'Use Carbon <Button>'], ['#24a148', 'Typography', 'IBM Plex Sans · fixed']]
  return (
    <div className="w-full max-w-[460px] bg-[#161616] p-5 text-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
      <div className="flex items-end justify-between"><div><p className="text-[11px] text-white/50">Carbon alignment</p><p className="text-4xl font-light">94<span className="text-base text-white/40">/100</span></p></div><span className="bg-[#24a148] px-2 py-1 text-[10px]">Ready for review</span></div>
      <ul className="mt-4 divide-y divide-[#393939] border-t border-[#393939]">
        {rows.map(([c, k, t]) => (<li key={t} className="flex items-center gap-3 py-2.5 text-xs"><span className="h-2 w-2 rounded-full" style={{ background: c }} /><span className="w-24 text-white/50">{k}</span>{t}</li>))}
      </ul>
    </div>
  )
}

function Project({ n, title, result, tags, bg, blobs, badge, preview, metric, href, compact, trail, flowers }: { flowers?: boolean; trail?: boolean; compact?: boolean; href?: string; n: string; title: string; result: string; tags: string[]; bg: string; blobs: string[]; badge: React.ReactNode; preview: React.ReactNode; metric?: [string, string] }) {
  return (
    <a href={href} className={`reveal group block cursor-pointer ${compact ? '' : 'mx-auto mb-6 max-w-[1040px]'} rounded-[28px] border border-line bg-white p-3 transition duration-500 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]`}>
      <div className={`relative flex ${compact ? 'h-[clamp(260px,26vw,340px)]' : 'h-[clamp(300px,36vw,460px)]'} items-center justify-center overflow-hidden rounded-[20px] px-6`} style={{ background: bg }}>
        {blobs.map((c, i) => (<div key={i} className={`grad-blob grad-blob-${i}`} style={{ background: c }} />))}
        {trail && <><div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} /><GridTrail /></>}
        {flowers && <FlowerTrail />}
        <div className={`absolute left-6 top-6 z-30 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs backdrop-blur ${flowers ? 'bg-white/70 text-[#251754]' : 'bg-white/15 text-white'}`}>{n}</div>
        <div className={`absolute right-6 top-6 z-30 grid ${compact ? 'h-14 min-w-14 px-3' : 'h-20 min-w-20 px-5'} place-items-center rounded-2xl bg-white/95 text-ink shadow-lg`}>{badge}</div>
        {metric && (<div className="absolute bottom-6 left-6 z-30 hidden rounded-2xl bg-white/15 px-5 py-4 text-white backdrop-blur-md md:block">
          <p className="text-3xl font-semibold tracking-[-0.04em]">{metric[0]}</p><p className="mt-1 max-w-[220px] text-xs text-white/75">{metric[1]}</p>
        </div>)}
        <div className="relative z-10 flex w-full justify-center">{preview}</div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-6 px-5 pb-5 pt-7 md:px-7">
        <div>
          <h3 className={`${compact ? 'text-[clamp(1.2rem,1.6vw,1.4rem)]' : 'text-[clamp(1.35rem,2vw,1.75rem)]'} font-semibold tracking-[-0.03em]`}>{title}</h3>
          <p className="mt-1 text-muted">{result}</p>
          <div className="mt-4 flex flex-wrap gap-2">{tags.map((t) => (<span key={t} className="rounded-full bg-paper px-3.5 py-1.5 text-sm text-muted">{t}</span>))}</div>
        </div>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium">Read case study <span className="transition group-hover:translate-x-1">→</span></span>
      </div>
    </a>
  )
}

function Work() {
  return (
    <Section id="work" n="02" label="" title="Featured projects">
      <Project trail href="#/carbon-iq" n="AI tool · IBM" title="Carbon IQ: Grammarly for design" result="AI design QA that reviews Figma work against Carbon and coaches non-designers to on-brand, accessible screens" tags={['AI product', 'Design systems', 'Strategy', 'Accessibility', 'Carbon']}
        blobs={['#78a9ff', '#161616', '#0043ce']} metric={['40% faster', 'to reach Carbon standard, with no overnight wait for a senior review']}
        bg="radial-gradient(120% 90% at 50% 0%, #0043ce 0%, #262626 55%, #161616 100%)" badge={<IbmLogo className="h-9" />} preview={<CheckPreview />} />
      <Project href="#/maximo" n="Enterprise SaaS · IBM" title="Making a heavyweight enterprise tool feel simple for mid-size teams" result="Time-to-value: first work order scheduled in under 30 minutes, not days" tags={['Enterprise SaaS', 'Agentic AI', 'Onboarding', 'Research', 'Product strategy', 'Carbon']}
        blobs={['#78a9ff', '#0043ce', '#a6c8ff']} metric={['< 30 min', 'From sign-up to first scheduled work order for a mid-size maintenance team']}
        bg="radial-gradient(120% 90% at 50% 0%, #4589ff 0%, #0f62fe 45%, #002d9c 100%)" badge={<IbmLogo className="h-9" />} preview={<MaximoPreview />} />
      <div className="mx-auto grid max-w-[1040px] gap-6 md:grid-cols-2">
      <Project compact flowers href="#/welcome" n="Public sector · Ireland" title="A warm welcome from the state" result="Connecting fragmented services into one guided journey for new parents" tags={['Service design', 'Co-design', 'Journey mapping', 'Public sector']}
        blobs={['#fbe3ef', '#c9aedd', '#bfe5b2']}
        bg="radial-gradient(120% 90% at 50% 0%, #f6f3ee 0%, #dfe3fb 55%, #c9aedd 100%)" badge={<img src={govLogo} alt="Department of Public Expenditure, NDP Delivery and Reform" className="h-7 w-auto" />} preview={<div className="origin-center scale-[0.8]"><PhonePreview /></div>} />
      <Project compact href="#/recipes" n="Service design · Ireland" title="Recipes to Adult" result="Making the transition from teenage years to adulthood simpler and better supported for Irish teens" tags={['Service design', 'Mobile app', 'Youth research', 'Behaviour change']}
        blobs={['#c9b8ff', '#5b3fd1', '#f3d4ff']}
        bg="radial-gradient(120% 90% at 50% 0%, #a58bff 0%, #6d4fe0 50%, #3a2399 100%)" badge={<div className="flex items-center"><img src={govLogo} alt="Department of Public Expenditure, NDP Delivery and Reform" className="h-7 w-auto" /></div>} preview={<div className="relative h-[clamp(260px,26vw,340px)] w-full"><figure className="absolute w-[clamp(100px,12vw,140px)] bg-white p-1.5 pb-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] left-[22%] top-[30%] -rotate-[7deg] group-hover:-rotate-[3deg] group-hover:-translate-x-1"><img src="/r2a/photo-7.jpg" alt="Strangers answering at the How to Adult board" className="aspect-square w-full object-cover object-[60%_50%]" /></figure><figure className="absolute w-[clamp(100px,12vw,140px)] bg-white p-1.5 pb-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] right-[22%] top-[36%] z-10 rotate-[6deg] group-hover:rotate-[3deg] group-hover:translate-x-1"><img src="/r2a/street-1.jpg" alt="Street research in Dublin" className="aspect-square w-full object-cover object-[65%_45%]" /></figure></div>} />
      </div>
    </Section>
  )
}

const SKILLS: [string, string[]][] = [
  ['General', ['Product Thinking', 'Design Strategy', 'Systems Thinking', 'Storytelling', 'Stakeholder Management', 'Facilitation & Workshops', 'Prioritisation', 'Data-informed Decisions', 'Cross-functional Leadership', 'Design Critique', 'Mentoring', 'Accessibility Advocacy', 'Ambiguity to Clarity']],
  ['Product & UX', ['Product Design', 'UX Design', 'UI Design', 'Interaction Design', 'User Research', 'Information Architecture', 'User Flows', 'Wireframing', 'Prototyping', 'Usability Testing', 'UX Audits', 'Competitive Analysis']],
  ['Product & Systems', ['Enterprise SaaS', 'Complex Workflows', 'Design Systems', 'IBM Carbon', 'Component Libraries', 'Reusable UI Patterns', 'Accessibility / WCAG', 'Responsive Design']],
  ['AI-Assisted Design', ['IBM Bob AI', 'Figma AI', 'Microsoft Copilot', 'Rapid Ideation', 'Concept Exploration', 'Prototyping']],
  ['Technical & Prototyping', ['HTML', 'CSS', 'JavaScript', 'p5.js', 'Arduino', 'Unity', 'TouchDesigner', '3D Modelling']],
  ['Research & Service', ['Journey Mapping', 'Service Design', 'Co-design Workshops', 'Personas', 'Service Blueprints', 'Behavioural Analysis', 'Human-Centred Design', 'Design Thinking', 'Data Visualisation']],
  ['Craft & Collaboration', ['Hi-fi & Lo-fi Prototyping', 'Interaction Flows', 'Micro-interactions', 'Motion Design', 'Automotive HMI', 'Visual Hierarchy', 'AR/VR', 'Physical Computing', 'Stakeholder Collaboration', 'Technical Feasibility']],
]
const LOGOS: [string, string][] = [
  ['figma', 'Figma'], ['miro', 'Miro'], ['ibm', 'IBM Carbon'], ['adobeillustrator', 'Illustrator'], ['adobephotoshop', 'Photoshop'], ['adobeaftereffects', 'After Effects'],
  ['html5', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'], ['p5dotjs', 'p5.js'], ['arduino', 'Arduino'], ['unity', 'Unity'],
  ['react', 'React'], ['github', 'GitHub'], ['git', 'Git'], ['google', 'Google UX'], ['githubcopilot', 'Copilot'], ['figma', 'FigJam'],
]

function Logo({ slug, name }: { slug: string; name: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className="group flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-white px-6 py-4">
      {ok ? <img src={`https://cdn.simpleicons.org/${slug}`} alt="" onError={() => setOk(false)} className="h-6 w-6 opacity-50 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0" /> : <span className="grid h-6 w-6 place-items-center rounded bg-line text-[10px] font-semibold">{name[0]}</span>}
      <span className="text-sm font-medium text-muted transition group-hover:text-ink">{name}</span>
    </div>
  )
}

const KEY_SKILLS = new Set(['Product Thinking', 'Systems Thinking', 'Storytelling', 'Ambiguity to Clarity', 'Product Design', 'User Research', 'Information Architecture', 'Usability Testing', 'Enterprise SaaS', 'Complex Workflows', 'Design Systems', 'IBM Carbon', 'IBM Bob AI', 'Rapid Ideation', 'CSS', 'JavaScript', 'p5.js', 'Journey Mapping', 'Service Design', 'Co-design Workshops', 'Micro-interactions', 'Motion Design', 'Automotive HMI'])

function Skills() {
  const [cat, setCat] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setCat((c) => (c + 1) % SKILLS.length), 3500)
    return () => clearTimeout(id)
  }, [cat, paused])
  return (
    <Section id="skills" n="03" label="Skills & tools" title={<>A product designer with a <span className="hydrangea hl" style={accent}>builder's</span> toolkit.</>}>
      <div className="reveal grid gap-10 md:grid-cols-[280px_1fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <ul className="hydrangea border-t border-line">
          {SKILLS.map(([c, list], i) => (
            <li key={c} className="relative"><button onMouseEnter={() => setCat(i)} onClick={() => setCat(i)} className={`flex w-full items-center justify-between border-b border-line py-4 text-left transition ${cat === i ? 'text-ink' : 'text-ink/40 hover:text-ink/70'}`}>
              <span className="font-medium">{c}</span><span className="text-xs text-muted">{String(list.length).padStart(2, '0')}</span>
            </button>
            {cat === i && <span key={cat + String(paused)} className="absolute bottom-0 left-0 h-px" style={{ background: 'var(--h-openHalo)', width: paused ? '100%' : undefined, animation: paused ? 'none' : 'skill-progress 3500ms linear both' }} />}
            </li>
          ))}
        </ul>
        <div key={cat} className="hydrangea flex flex-wrap content-start gap-2.5">
          {SKILLS[cat][1].map((s, i) => {
            const key = KEY_SKILLS.has(s)
            return (
              <span key={s} className={`group/pill rounded-full border px-4 py-2.5 text-[15px] transition hover:-translate-y-0.5 ${key ? 'font-medium' : 'border-line bg-white hover:border-ink'}`}
                style={{ animation: `skill-rise 600ms ${i * 40}ms cubic-bezier(.22,1,.36,1) both`, ...(key ? { borderColor: 'var(--h-openHalo)', color: 'var(--h-ring)', background: 'color-mix(in srgb, var(--h-petal) 35%, white)' } : {}) }}>
                {key && <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full align-middle" style={{ background: 'var(--h-openHalo)' }} />}{s}
              </span>
            )
          })}
        </div>
      </div>
      <div className="reveal relative mt-24 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee flex w-max gap-3">{[...LOGOS, ...LOGOS].map(([s, n], i) => <Logo key={i} slug={s} name={n} />)}</div>
      </div>
      <div className="reveal mt-16 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
        {[['Google', 'UX Design Specialisation'], ['Udemy', 'Git & GitHub: Beginner to Expert'], ['Certification', 'React Fundamentals']].map(([a, b]) => (
          <div key={b} className="group bg-paper p-6 transition hover:bg-white">
            <div className="flex items-center gap-2 text-xs text-muted"><BudLogo size="h-4 w-4" /> Certified · {a}</div>
            <p className="mt-3 font-medium">{b}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

const TESTIMONIALS = [
  { n: 'Karen Gosciminski', r: 'Design Lead, IBM', loc: 'United States', tag: 'Design lead',
    q: "I was impressed by Chandana's ability to [take an unstructured competitive analysis effort and drive it forward]. She took initiative, organized the findings, engaged directly with competitor support, and delivered [clear, actionable recommendations] that were [critical to the project's success]." },
  { n: 'Jenny Qiu', r: 'Senior Designer, IBM', loc: 'United States', tag: 'Senior designer',
    q: 'Chandana consistently demonstrated [initiative, strong ownership, and effective communication]. She [proactively clarified requirements], incorporated feedback thoughtfully, and [collaborated effectively across teams] to keep work moving forward.' },
  { n: 'Ester Monroy', r: 'Visual & Content Designer, IBM', loc: 'Ireland', tag: 'Designer',
    q: 'Chandana combines [strong visual design skills with a genuine growth mindset]. She consistently seeks feedback, embraces new challenges, and delivers [thoughtful, high-quality work]. Her collaborative approach and commitment to learning have made a [meaningful impact on the team and the product].' },
  { n: 'Brijesh Jha', r: 'DGM, R&AE, Renault Nissan', loc: 'India', tag: 'Leadership',
    q: 'During the time I worked with Chandana, I was consistently impressed by her ability to [approach complex problems with both curiosity and structure]. Rather than jumping directly into solutions, she takes the time to understand user needs, business goals, and system constraints before forming recommendations. What stood out most was her [product thinking]. Chandana demonstrated a strong ability to [connect research insights with practical design opportunities], particularly in areas such as onboarding, workflow simplification, and user adoption. She asks thoughtful questions, collaborates effectively across stakeholders, and is [willing to challenge assumptions] when advocating for a better user experience. Beyond her design skills, she brings a growth mindset and a genuine passion for learning. She actively seeks feedback, iterates quickly, and [consistently raises the quality of conversations] around product and customer experience. Chandana has the potential to become a [highly impactful Product Designer], and I would be excited to see how her career continues to grow.' },
]

function Quote({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\])/g).map((part, i) => part.startsWith('[')
    ? <mark key={i} className="box-decoration-clone rounded-[3px] px-1 py-px text-ink" style={{ background: 'color-mix(in srgb, var(--h-petal) 45%, white)' }}>{part.slice(1, -1)}</mark>
    : <span key={i}>{part}</span>)}</>
}

function Testimonials() {
  const [open, setOpen] = useState<number | null>(null)
  const row = useRef<HTMLDivElement>(null)
  const scroll = (d: number) => row.current?.scrollBy({ left: d * 420, behavior: 'smooth' })
  return (
    <Section id="people" n="04" label="Kind words" title={<>Hear from the people I've <span className="hydrangea hl" style={accent}>grown</span> with.</>}>
      <div className="reveal relative">
        <div ref={row} className="hydrangea -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:mx-0 md:px-0">
          {TESTIMONIALS.map((t, i) => {
            const on = open === i
            return (
              <article key={t.n} className="group flex w-[min(86vw,420px)] shrink-0 snap-start flex-col rounded-3xl border border-line bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: 'var(--h-openHalo)' }}>{t.n.split(' ').map((w) => w[0]).join('')}</span>
                  <div className="min-w-0">
                    <p className="font-semibold tracking-tight">{t.n}</p>
                    <p className="text-sm text-muted">{t.r} · {t.loc}</p>
                  </div>
                </div>
                <p className={`mt-6 text-[17px] leading-[1.75] text-muted ${on ? '' : 'line-clamp-6'}`}>“<Quote text={t.q} />”</p>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <button onClick={() => setOpen(on ? null : i)} className="text-sm font-medium transition hover:opacity-70" style={{ color: 'var(--h-ring)' }}>{on ? 'Show less' : 'Read more'}</button>
                  <span className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--h-ring)', background: 'color-mix(in srgb, var(--h-petal) 30%, white)' }}>{t.tag}</span>
                </div>
              </article>
            )
          })}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {[-1, 1].map((d) => (
            <button key={d} onClick={() => scroll(d)} aria-label={d < 0 ? 'Previous' : 'Next'} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-ink">{d < 0 ? '←' : '→'}</button>
          ))}
        </div>
      </div>
    </Section>
  )
}

function WaterSection() {
  return (
    <section id="water" className="mx-auto max-w-[1280px] px-6 pb-16 md:px-16">
      <div className="reveal group mb-10 grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-6">
        <BudLogo size="col-start-1 mt-[0.15em] h-[clamp(2rem,3.6vw,3.25rem)] w-[clamp(2rem,3.6vw,3.25rem)]" />
        <h2 className="max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]">Good ideas need <span className="hydrangea hl" style={accent}>care</span> to grow. Water the garden.</h2>
      </div>
      <div className="overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_rgba(38,119,207,0.45)]"><WaterGarden /></div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">Say hello, I'd love to hear from you.</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="mailto:c.keerthi0421@gmail.com?subject=Hi%20Chandana" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-paper transition hover:opacity-85">c.keerthi0421@gmail.com <span className="transition group-hover:translate-x-0.5">→</span></a>
          <a href="https://www.linkedin.com/in/chandana-keerthi-406654235/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-line px-5 py-3 text-sm transition hover:border-ink">LinkedIn</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    null
  )
}

function useRoute() {
  const [route, setRoute] = useState(window.location.hash)
  useEffect(() => {
    const on = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

function Home() {
  useReveal()
  useEffect(() => {
    // arriving from the case study with an anchor: scroll once the home page is mounted
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])
  return (<><Hero /><Work /><Skills /><Testimonials /><WaterSection /></>)
}

export default function App() {
  void BLOOMS
  const route = useRoute()
  const isCase = route === '#/maximo' || route === '#/recipes' || route === '#/welcome' || route === '#/carbon-iq'
  useEffect(() => { if (isCase) window.scrollTo(0, 0) }, [route, isCase])
  return (<><Nav />{isCase ? <>{route === '#/recipes' ? <RecipesCase key="recipes" /> : route === '#/welcome' ? <WelcomeCase key="welcome" /> : route === '#/carbon-iq' ? <CarbonQACase key="carbon" /> : <MaximoCase key="maximo" />}<WaterSection /></> : <Home key="home" />}<Footer /></>)
}
