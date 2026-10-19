import NextProject from '../components/NextProject'
import { useEffect, useRef, useState } from 'react'
import govLogo from '../assets/gov-logo.png'
import R2AApp, { type Screen } from './R2AApp'
import CardFolders from './CardFolders'
import CookbookReader from './Cookbook'

/* palette pulled from the cookbook */
const PLUM = '#8a2b5e'
const PINK = '#f4c6d4'
const CREAM = '#fbf6f1'
const NAVY = '#1d2a6b'

const IMG: Record<string, [number, number]> = {
  cover: [3444, 1698], streets: [3456, 1832], cards: [3412, 1844], expo: [2776, 1234], kitchens: [2830, 1614],
  potluck: [2628, 1630], spreads1: [2308, 1796], spreads2: [2316, 1644], sketches: [2528, 1780], deck: [2724, 762],
  wall: [2898, 1460], bento: [2960, 1736], hero: [3434, 1672], logo: [938, 564], hand: [1986, 1500], envelopes: [3436, 1562],
  midfi: [2922, 1458], ui: [2656, 1392],
}

/** Shows a region (fractions 0–1) of one of the project slides, so real photos can be pulled out of screenshots. */
function Crop({ src, x0 = 0, y0 = 0, x1 = 1, y1 = 1, className = '', alt = '' }: { src: string; x0?: number; y0?: number; x1?: number; y1?: number; className?: string; alt?: string }) {
  const [w, h] = IMG[src]
  const cw = x1 - x0, ch = y1 - y0
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${cw * w} / ${ch * h}` }}>
      <img src={`/r2a/${src}.png`} alt={alt} loading="lazy" draggable={false} className="absolute max-w-none select-none" style={{ width: `${100 / cw}%`, left: `${(-x0 / cw) * 100}%`, top: `${(-y0 / ch) * 100}%` }} />
    </div>
  )
}
const Logo = ({ className = '', invert }: { className?: string; invert?: boolean }) => (
  <Crop src="logo" x0={0.11} y0={0.2} x1={0.93} y1={0.86} alt="Recipes to adult" className={`${className} ${invert ? '[&_img]:invert mix-blend-screen' : 'mix-blend-multiply'}`} />
)

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.01 })
    const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((n) => {
      io.observe(n)
      // Fallback: reveal anything already in or above the viewport
      if (n.getBoundingClientRect().top < window.innerHeight * 0.95) n.classList.add('in')
    })
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', scan, { passive: true, capture: true })
    window.addEventListener('resize', scan)
    return () => { io.disconnect(); mo.disconnect(); window.removeEventListener('scroll', scan, true); window.removeEventListener('resize', scan) }
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
function Count({ to, suffix = '', run }: { to: number; suffix?: string; run: boolean }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{v}{suffix}</>
}

const CHAPTERS = ['Overview', 'The spark', 'The streets', 'What we heard', 'The strategy', 'The recipes', 'The cookbook', 'The exhibition', 'Real kitchens', 'The app', 'What failed', 'Outcomes', 'Reflection']
function Kicker({ n, dark }: { n: number; dark?: boolean }) {
  return <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-muted'}`}>{String(n).padStart(2, '0')} / {CHAPTERS[n]}</p>
}
const H2 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`reveal mt-5 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] ${className}`}>{children}</h2>
)
const Wrap = ({ children, id, className = '', style }: { children: React.ReactNode; id?: string; className?: string; style?: React.CSSProperties }) => (
  <section id={id} className={`px-6 py-28 md:px-16 md:py-36 ${className}`} style={style}><div className="mx-auto max-w-[1180px]">{children}</div></section>
)
const Hand = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <span className={`block font-hand leading-tight ${className}`}>{children}</span>

function CaseNav() {
  const [p, setP] = useState(0)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1))
      let a = 0
      CHAPTERS.forEach((_, i) => { const el = document.getElementById('r-' + i); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) a = i })
      setActive(a)
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]"><div className="h-full origin-left" style={{ background: PLUM, transform: `scaleX(${p})` }} /></div>
      <aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1480px]:block">
        <ul className="space-y-1.5">
          {CHAPTERS.map((c, i) => (
            <li key={c}><button onClick={() => document.getElementById('r-' + i)?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-[11px] leading-none transition-colors duration-300" style={{ color: active === i ? PLUM : '#a3a39e' }}>
              <span className="h-1 w-1 rounded-full transition-opacity duration-300" style={{ background: PLUM, opacity: active === i ? 1 : 0 }} />
              <span className={active === i ? 'font-medium' : 'hover:text-ink'}>{c}</span>
            </button></li>
          ))}
        </ul>
      </aside>
    </>
  )
}

/* ---------------- 0. hero ---------------- */
function Hero() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const [y, setY] = useState(0)
  useEffect(() => { const on = () => setY(window.scrollY); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on) }, [])
  return (
    <section id="r-0" style={{ background: CREAM }}>
      <div className="relative overflow-hidden px-6 pb-24 pt-32 md:px-16 md:pt-36">
        <div className="mx-auto max-w-[1180px]">
          <div className="reveal flex flex-wrap items-center justify-between gap-6 border-b border-black/10 pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Case study · with Dependr for the Irish Government</p>
            <img src={govLogo} alt="Department of Public Expenditure, NDP Delivery and Reform" className="h-10 w-auto md:h-11" />
          </div>
          <div className="mt-14 grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="reveal w-full max-w-[460px]"><Logo /></div>
              <p className="reveal mt-10 text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.04em]">What does becoming an adult<br />in Ireland <span className="hl" style={{ color: PLUM }}>really</span> look like?</p>
            </div>
            <div className="reveal relative mx-auto h-[440px] w-full max-w-[540px] md:h-[480px]" style={{ transform: `translateY(${y * -0.04}px)` }}>
              <figure className="absolute left-0 top-0 z-10 w-[62%] -rotate-[4deg] bg-white p-2.5 pb-12 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] transition duration-500 hover:rotate-[-2deg]">
                <img src="/r2a/photo-7.jpg" alt="Strangers writing answers at the How to Adult board on Grafton Street" className="aspect-[4/3] w-full object-cover" />
                <Hand className="absolute inset-x-2 bottom-3 whitespace-nowrap text-center text-lg md:text-xl">part kitchen, part confession booth</Hand>
              </figure>
              <figure className="absolute bottom-0 right-0 w-[58%] rotate-[5deg] bg-white p-2.5 pb-12 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] transition duration-500 hover:rotate-[3deg]">
                <img src="/r2a/photo-8.jpg" alt="Chandana talking with people at the board" className="aspect-[4/3] w-full object-cover" />
                <Hand className="absolute inset-x-2 bottom-3 text-center text-lg md:text-xl">Grafton St, Dublin</Hand>
              </figure>
            </div>
          </div>

          <div className="reveal mt-24 grid gap-12 border-t border-black/10 pt-10 md:grid-cols-[1fr_1.1fr_1fr] md:gap-16">
            <div>
              <p className="text-[clamp(3.5rem,6vw,5rem)] font-medium leading-none tracking-[-0.03em] text-ink">5<span className="ml-2 text-2xl tracking-tight">months</span></p>
              <div className="mt-6 flex gap-1">{['Listen', 'Make', 'Test', 'Extend'].map((p, i) => <div key={p} className="flex-1"><div className="h-1.5 rounded-full" style={{ background: PLUM, opacity: 0.3 + i * 0.22 }} /><p className="mt-2 text-xs text-muted">{p}</p></div>)}</div>
            </div>
            <div><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">What I owned</p><p className="mt-4 text-[19px] leading-[1.5]">End-to-end, solo: street research, storytelling, the cookbook's writing and layout, the exhibition, testing and the app's UX/UI.</p></div>
            <div><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">What I made</p><ul className="mt-4 space-y-2 text-[19px] leading-[1.5]">{['A printed cookbook', 'A street exhibition', 'A mobile app'].map((t, i) => <li key={t} className="flex items-center gap-3"><span className="font-mono text-xs">0{i + 1}</span>{t}</li>)}</ul></div>
          </div>
          <div className="reveal mt-24 grid gap-12 md:grid-cols-[240px_1fr] md:gap-16">
            <dl className="space-y-6 self-end text-sm">
              {[['Focus', 'User research, storytelling, print, UX/UI'], ['Users', 'Irish young adults, 16–20, stepping into independence'], ['Worked with', 'Dependr and 250+ strangers in Dublin'], ['Platform', 'Cookbook, exhibition + mobile app'], ['Presented to', 'Department of Public Expenditure, NDP Delivery and Reform']].map(([a, b]) => (
                <div key={a}><dt className="text-muted">{a}</dt><dd className="mt-1 font-medium text-ink">{b}</dd></div>
              ))}
            </dl>
            <div>
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PLUM }}>TL;DR</p>
              <div className="rounded-2xl bg-white p-7 ring-1 ring-black/5 md:p-10">
                <p className="text-[19px] leading-[1.75] text-muted md:text-[21px]">
                  Irish young adults told me how-to-adult advice <span className="text-ink">sounds like a lecture</span>. So I stopped writing advice and <span className="font-medium text-ink">collected 250+ real stories on the streets of Dublin</span>, turning them into a cookbook where every ingredient is a metaphor for growing up. It <mark className="rounded-[3px] box-decoration-clone px-1" style={{ background: 'rgba(200,90,140,0.16)', color: PLUM }}>made cooking feel like a story</mark>, <mark className="rounded-[3px] box-decoration-clone px-1" style={{ background: 'rgba(200,90,140,0.16)', color: PLUM }}>130 of 160 recipe cards went home</mark> and <mark className="rounded-[3px] box-decoration-clone px-1" style={{ background: 'rgba(200,90,140,0.16)', color: PLUM }}>an app now carries it into everyday life</mark>.
                </p>
              </div>
            </div>
          </div>
          <div ref={ref} className="mt-24 grid grid-cols-2 gap-x-10 gap-y-12 border-t border-black/10 pt-10 md:grid-cols-4">
            {[[250, '+', 'stories collected'], [81, '%', 'of take-away cards taken'], [45, '/60', 'visitors read a recipe fully'], [92, '%', 'completed the story-recipe flow']].map(([n, s, l]) => (
              <div key={l as string}><p className="text-4xl font-medium tracking-[-0.025em] md:text-5xl" style={{ color: PLUM }}><Count to={n as number} suffix={s as string} run={seen} /></p><p className="mt-2 text-sm text-muted">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 1. spark ---------------- */
function Spark() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  const words = "I moved to Ireland at 22, on my own for the first time. I knew I was technically an adult, but I didn't feel like one. I had to figure out healthcare, groceries, public transport, rent, and somehow also figure out who I was in all of it.".split(' ')
  return (
    <section id="r-1" className="text-white" style={{ background: NAVY }}>
      <div ref={ref} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-screen items-center px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1180px]">
            <Kicker n={1} dark />
            <p className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.05em]">Adulthood hit me <span className="hl" style={{ color: PINK }}>like a train.</span></p>
            <p className="mt-10 max-w-4xl text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-snug tracking-[-0.02em]">
              {words.map((w, i) => <span key={i} className="transition-colors duration-300" style={{ color: p * 1.5 > i / words.length ? '#fff' : 'rgba(255,255,255,0.18)' }}>{w} </span>)}
            </p>
            <p className="mt-10 text-xl transition-all duration-700 md:text-2xl" style={{ opacity: p > 0.7 ? 1 : 0, transform: `translateY(${p > 0.7 ? 0 : 20}px)`, color: PINK }}>So I started wondering: is this just me, or is everyone feeling this?</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 2. streets ---------------- */
function Streets() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  return (
    <Wrap id="r-2" style={{ background: CREAM }}>
      <Kicker n={2} />
      <H2>So I took the question to the streets of Dublin.</H2>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted">Surveys get polite answers. I wanted honest ones. I built two street interventions on Grafton Street that asked strangers two questions, and left pens and blank cards. <Hand className="!inline text-2xl">(Definitely learnt how to talk to a stranger.)</Hand></p>
      <div ref={ref} className="reveal mt-14 grid gap-px overflow-hidden rounded-3xl bg-line md:grid-cols-3">
        {[[250, '+', 'Handwritten entries', 'Answers left on cards and the board by strangers, aged 16 to 78.'], [4, '', 'Books read', 'Desk research on adulthood, food and belonging to frame the questions.'], [5, '', 'Deep interviews', 'Follow-up conversations to hear the stories behind the cards.']].map(([n, s, l, d], i) => (
          <div key={l as string} className="flex items-start gap-5 bg-white p-6 md:p-8">
            <p className="font-mono text-[11px] tracking-widest" style={{ color: PLUM }}>0{i + 1}</p>
            <div>
              <p className="text-5xl font-semibold leading-none tracking-[-0.04em] md:text-6xl" style={{ color: i === 0 ? PLUM : undefined }}><Count to={n as number} suffix={s as string} run={seen} /></p>
              <p className="mt-4 font-semibold tracking-tight">{l}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-14">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-widest" style={{ color: PLUM }}>The raw data · open a folder and read every card</p>
        <CardFolders keys={['1st-street-intervention', '2nd-street-intervention']} />
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-[260px_260px]">
        <figure className="reveal group relative overflow-hidden rounded-3xl md:col-span-5 md:row-span-2">
          <img src="/r2a/street-1.jpg" alt="Chandana beside the How to Adult board on a Dublin street" loading="lazy" className="h-[460px] w-full object-cover object-[50%_35%] transition duration-[1200ms] group-hover:scale-105 md:h-full" />
          <Hand className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-1.5 text-xl">the board, and one very proud designer</Hand>
        </figure>
        <figure className="reveal group relative overflow-hidden rounded-3xl md:col-span-4">
          <img src="/r2a/street-3.jpg" alt="People gathering around the board" loading="lazy" className="h-[260px] w-full object-cover object-[40%_60%] transition duration-[1200ms] group-hover:scale-105 md:h-full" />
        </figure>
        <figure className="reveal group relative overflow-hidden rounded-3xl md:col-span-3 md:row-span-2">
          <img src="/r2a/street-2.jpg" alt="Handwritten answers pinned to the yarn" loading="lazy" className="h-[460px] w-full object-cover object-[60%_60%] transition duration-[1200ms] group-hover:scale-105 md:h-full" />
          <p className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/92 p-4 text-sm leading-snug shadow-lg"><span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: PLUM }}>Age 73</span><br />"It takes a village! People now need to look down at their phones less and look up at the sky more."</p>
        </figure>
        <figure className="reveal group relative overflow-hidden rounded-3xl md:col-span-4">
          <img src="/r2a/street-4.jpg" alt="Strangers writing their answers" loading="lazy" className="h-[260px] w-full object-cover object-[50%_65%] transition duration-[1200ms] group-hover:scale-105 md:h-full" />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">Strangers queued to write. Ages 16 to 73.</figcaption>
        </figure>
      </div>
    </Wrap>
  )
}

/* ---------------- 3. heard ---------------- */
function Heard() {
  const [ref, seen] = useInView<HTMLDivElement>(0.35)
  const stats = [[65, 'of young adults find cooking and meal planning stressful when living alone.'], [70, 'connect more deeply to shared personal stories than to online advice or government guides.'], [80, 'said learning to cook for themselves made them feel "a step closer to independence."'], [90, "want to feel relatable and 'fit in' to the idea of adulthood rather than define it themselves."]] as const
  return (
    <Wrap id="r-3" className="bg-white">
      <Kicker n={3} />
      <H2>The problem wasn't a lack of information. <span className="text-muted">It was a lack of recognition.</span></H2>
      <div ref={ref} className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {stats.map(([n, t], i) => (
          <div key={n} className="reveal border-t border-line pt-6" style={{ transitionDelay: i * 90 + 'ms' }}>
            <p className="text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.06em]" style={{ color: NAVY }}><Count to={n} suffix="%" run={seen} /></p>
            <p className="mt-4 max-w-md text-lg leading-snug">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-24 grid gap-4 md:grid-cols-3">
        {[['Food is the first test', 'Cooking was the first true test of independence, and also comfort, culture and a connection to home.', '"Moving out for the first time and eating canned beans every night."'], ['Money is freedom and burden', 'Paid work meant pride, and also managing others, first holidays and imposter syndrome.', '"Juggling everything: job, taxes, and everything life throws at me."'], ['Growing up happens inside', 'Adulthood was less about milestones and more about identity, healing and internal alignment.', '"I don\u2019t actually feel like an adult. Mentally I still feel immature."']].map(([a, b, q], i) => (
          <div key={a} className="reveal group flex flex-col rounded-3xl p-7 transition duration-500 hover:-translate-y-1" style={{ background: '#f9e6ef', transitionDelay: i * 90 + 'ms' }}>
            <Hand className="text-2xl" >{q}</Hand>
            <div className="mt-auto pt-10"><p className="text-xl font-semibold tracking-tight" style={{ color: PLUM }}>{a}</p><p className="mt-2 text-[15px] leading-relaxed text-ink/75">{b}</p></div>
          </div>
        ))}
      </div>
    </Wrap>
  )
}

/* ---------------- 4. reframe ---------------- */
const DECISIONS = [
  ['Start with food, not finance.', 'Rent, tax and jobs came up constantly, but they are heavy and abstract. Cooking is daily, low-stakes and emotional. It\u2019s a doorway into the bigger conversations.', '65% stressed by cooking alone · 80% tied it to independence'],
  ['Stories over instructions.', 'Guides already exist and nobody reads them. Every recipe is anchored in a real quote, so people recognise themselves before they learn anything.', '70% connect more to stories than to guides'],
  ['Print before pixels.', 'A cookbook was the cheapest, fastest way to test whether the tone landed. I proved the emotion in public before investing in an app.', '130/160 cards taken home'],
  ['Cut what people won\u2019t do.', 'Potlucks tested well on paper and died in real life. I killed the feature and moved community into a lightweight wall that costs nothing to join.', 'Potluck interest 4/10 \u2192 0/10'],
] as const
function Reframe() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useProgress(ref)
  return (
    <section id="r-4">
      <div ref={ref} className="relative h-[200vh]" style={{ background: PLUM }}>
        <div className="sticky top-0 flex h-screen items-center px-6 text-white md:px-16">
          <div className="mx-auto max-w-[1180px]">
            <Kicker n={4} dark />
            <p className="mt-8 text-[clamp(2rem,4.8vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              <span>They didn't need more advice about adulthood. </span>
              <span className="transition-opacity duration-700" style={{ opacity: p > 0.3 ? 1 : 0.18 }}>They needed to recognise themselves </span>
              <span className="transition-opacity duration-700" style={{ opacity: p > 0.5 ? 1 : 0.18, color: PINK }}>in someone else's story.</span>
            </p>
            <p className="mt-10 max-w-xl text-lg text-white/70 transition-opacity duration-700" style={{ opacity: p > 0.65 ? 1 : 0 }}>70% preferred personal stories to official guides. 80% tied cooking to independence. The answer was sitting at the intersection: <b className="text-white">stories you can cook.</b></p>
          </div>
        </div>
      </div>
      <Wrap className="bg-white">
        <p className="reveal font-mono text-[11px] uppercase tracking-widest text-muted">How might we</p>
        <p className="reveal mt-5 max-w-4xl text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.035em]">How might we translate the challenges of adulthood into <span className="hl" style={{ color: PLUM }}>small moments that make young adults feel supported</span> through shared, fun, relatable stories?</p>
        <p className="reveal mt-24 font-mono text-[11px] uppercase tracking-widest text-muted">Four calls that shaped everything after</p>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {DECISIONS.map(([t, why, ev], i) => (
            <div key={t} className="reveal group grid gap-4 py-9 transition-colors md:grid-cols-[80px_1fr_1fr] md:gap-10" style={{ transitionDelay: i * 80 + 'ms' }}>
              <p className="font-mono text-sm" style={{ color: PLUM }}>0{i + 1}</p>
              <p className="text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-1">{t}</p>
              <div><p className="text-[16px] leading-relaxed text-muted">{why}</p><p className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ background: '#f9e6ef', color: PLUM }}>{ev}</p></div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

/* ---------------- 5. recipes deck ---------------- */
const DECK = [
  { d: 'Cappuccino', s: 'First sip of adulthood', bg: '#efe3d3', fg: '#7a2e1b', ing: [['35ml espresso', 'Freedom and independence'], ['Steamed milk', 'Everyday responsibilities'], ['1 tsp sugar', 'Legal right to drink alcohol']] },
  { d: 'Avocado Toast', s: 'Becoming financially conscious', bg: '#dfeec8', fg: '#3f6b2a', ing: [['1 slice sourdough', 'Student loan debt'], ['\u00bd avocado', 'Therapy sessions'], ['Chilli flakes', 'Your sudden interest in tax rebates']] },
  { d: 'Gin & Tonic', s: 'Social life after 25', bg: '#f3e4dc', fg: '#e0533d', ing: [['45ml gin', 'Your social anxiety'], ['100ml tonic', 'The energy you have left'], ['Slice of lime', 'The one friend who still makes plans']] },
  { d: 'Instant Noodles', s: 'The post-payday budget meal', bg: '#3b6fd1', fg: '#ffffff', ing: [['1 pack noodles', 'Your paycheck'], ['Flavour sachet', 'Rent, WiFi and utility bills'], ['Boiling water', 'Emotional burnout']] },
  { d: 'Scrambled Eggs', s: 'The morning after your first job', bg: '#eef3c9', fg: '#8a3b1e', ing: [['2 eggs', 'Excitement and dread'], ['1 tbsp milk', 'Your unrealistic expectations'], ['Salt & pepper', 'Rejection emails and HR follow-ups']] },
  { d: 'Pasta', s: 'How to impress your first date', bg: '#f6efe6', fg: '#9b2d6b', ing: [['100g spaghetti', 'Your confidence'], ['Tomato sauce', 'Childhood dreams'], ['Parmesan', 'The version of yourself you pretend to be']] },
  { d: 'Herbal Tea', s: 'The evening routine you lie about', bg: '#1e2433', fg: '#ffffff', ing: [['1 bag chamomile', 'The illusion of calm'], ['1 tsp honey', 'Scrolling TikTok until 2am'], ['Hot water', '"Tomorrow will be different"']] },
  { d: 'Champagne', s: 'Small wins that feel huge', bg: '#f6c9de', fg: '#2e2a6b', ing: [['Bubbles', 'Doing laundry before 11pm'], ['Glass', 'The fragile balance of your routine'], ['Cork', 'Built-up stress waiting to pop']] },
]
function Recipes() {
  const [flip, setFlip] = useState<number | null>(null)
  return (
    <Wrap id="r-5" style={{ background: CREAM }}>
      <Kicker n={5} />
      <H2>What if every life event was a recipe, and <span className="hl" style={{ color: PLUM }}>every ingredient a feeling?</span></H2>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted">From an ideation workshop of six directions, one idea made people laugh and then go quiet: a cookbook where the dish is a moment of growing up, and the ingredients are metaphors for what it really feels like. <b className="text-ink">Hover a card to read its ingredients.</b></p>
      <div className="reveal mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 [perspective:1400px]">
        {DECK.map((c, i) => {
          const on = flip === i
          return (
            <button key={c.d} onMouseEnter={() => setFlip(i)} onMouseLeave={() => setFlip(null)} onClick={() => setFlip(on ? null : i)} className="relative aspect-[3/4] text-left" style={{ animation: `card-in 600ms ${i * 60}ms cubic-bezier(.22,1,.36,1) both` }}>
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d]" style={{ transform: on ? 'rotateY(180deg)' : 'none' }}>
                <div className="absolute inset-0 flex flex-col justify-between rounded-2xl p-5 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.5)] [backface-visibility:hidden]" style={{ background: c.bg, color: c.fg }}>
                  <p className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[0.95]">{c.d}</p>
                  <div><svg viewBox="0 0 100 8" className="mb-3 w-2/3 opacity-60"><path d="M0 4 Q 6 0 12 4 T 24 4 T 36 4 T 48 4 T 60 4 T 72 4 T 84 4 T 96 4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg><p className="font-serif text-lg italic leading-tight">{c.s}</p></div>
                </div>
                <div className="absolute inset-0 flex flex-col rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ background: c.bg, color: c.fg }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">Ingredient metaphors</p>
                  <ul className="mt-auto space-y-3">{c.ing.map(([a, b]) => <li key={a}><p className="font-display text-[15px] leading-tight">{a}</p><p className="text-xs opacity-80">{b}</p></li>)}</ul>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="reveal mt-16 flex flex-wrap gap-2">
        {['Moving out of home for the first time', 'Loneliness & cooking for one', 'First day in college', 'Caring for a loved one', 'Rent-week panic', 'Being sick alone', 'Pub culture, first nights out', 'Homesick in a new city'].map((t) => (
          <span key={t} className="rounded-full bg-white px-4 py-2 text-sm">{t}</span>
        ))}
      </div>
      <p className="reveal mt-3 text-sm text-muted">Life events gathered from the street interventions, each one became a recipe.</p>
    </Wrap>
  )
}

/* ---------------- 6. flip book ---------------- */
// To swap in high-res pages later: replace these crops with <img src="/r2a/book/page-x.jpg" />.
const P = (src: 'spreads1' | 'spreads2', x0: number, y0: number, x1: number, y1: number) => <Crop src={src} x0={x0} y0={y0} x1={x1} y1={y1} className="h-full w-full [&_img]:!h-auto" />
function PageFill({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">{children}</div>
}
const SHEETS: { front: React.ReactNode; back: React.ReactNode }[] = [
  { front: <div className="flex h-full flex-col justify-between p-[8%]" style={{ background: '#e9b3c4' }}><Logo className="w-[85%]" /><p className="text-[clamp(8px,1vw,12px)] text-[#5b1d3d]">Created by Chandana Keerthi · This book is about facing adulthood challenges through recipes.</p></div>,
    back: <PageFill>{P('spreads1', 0.009, 0.082, 0.496, 0.521)}</PageFill> },
  { front: <PageFill>{P('spreads1', 0.51, 0.082, 0.997, 0.521)}</PageFill>, back: <PageFill>{P('spreads1', 0.009, 0.549, 0.496, 0.989)}</PageFill> },
  { front: <PageFill>{P('spreads1', 0.51, 0.549, 0.997, 0.989)}</PageFill>, back: <PageFill>{P('spreads2', 0.006, 0.009, 0.492, 0.49)}</PageFill> },
  { front: <PageFill>{P('spreads2', 0.506, 0.009, 0.992, 0.49)}</PageFill>, back: <PageFill>{P('spreads2', 0.006, 0.519, 0.49, 0.999)}</PageFill> },
  { front: <PageFill>{P('spreads2', 0.506, 0.519, 0.991, 0.999)}</PageFill>,
    back: <div className="flex h-full flex-col items-center justify-center gap-4 p-[10%] text-center" style={{ background: PLUM }}><Logo invert className="w-[60%]" /><p className="text-[clamp(9px,1.1vw,14px)] text-white/80">More recipes coming soon.</p></div> },
]
function FlipBook() {
  const [f, setF] = useState(0)
  const n = SHEETS.length
  const next = () => setF((v) => Math.min(n, v + 1))
  const prev = () => setF((v) => Math.max(0, v - 1))
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  })
  const shift = f === 0 ? '-25%' : f === n ? '25%' : '0%'
  return (
    <div>
      <div className="relative mx-auto w-full max-w-[1100px] [perspective:2600px]" style={{ aspectRatio: '2.84 / 1' }}>
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)]" style={{ transform: `translateX(${shift})` }}>
          {SHEETS.map((s, i) => {
            const turned = f > i
            return (
              <div key={i} className="absolute left-1/2 top-0 h-full w-1/2 origin-left cursor-pointer transition-transform duration-[1100ms] ease-[cubic-bezier(.65,0,.35,1)] [transform-style:preserve-3d]" style={{ transform: `rotateY(${turned ? -180 : 0}deg)`, zIndex: turned ? i : n - i }} onClick={() => (turned ? prev() : next())}>
                <div className="absolute inset-0 overflow-hidden rounded-r-md shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] [backface-visibility:hidden]">{s.front}<div className="pointer-events-none absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black/15 to-transparent" /></div>
                <div className="absolute inset-0 overflow-hidden rounded-l-md shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]">{s.back}<div className="pointer-events-none absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-black/15 to-transparent" /></div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center gap-6">
        <button onClick={prev} disabled={f === 0} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-ink disabled:opacity-30">←</button>
        <div className="flex gap-1.5">{Array.from({ length: n + 1 }, (_, i) => <button key={i} onClick={() => setF(i)} className="h-1.5 rounded-full transition-all duration-500" style={{ width: f === i ? 28 : 8, background: f === i ? PLUM : '#d8d4cc' }} />)}</div>
        <button onClick={next} disabled={f === n} className="grid h-11 w-11 place-items-center rounded-full text-white transition disabled:opacity-30" style={{ background: PLUM }}>→</button>
      </div>
      <p className="mt-4 text-center text-sm text-muted">Click the pages or use your arrow keys to read.</p>
    </div>
  )
}
function Cookbook() {
  return (
    <Wrap id="r-6" className="bg-white">
      <Kicker n={6} />
      <H2>The cookbook. <span className="text-muted">Go on, read it.</span></H2>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted">Every spread pairs a recipe with the real words of someone who lived it. The recipe page is playful and bold; the facing page is quiet, typed like a confession. The contrast is the point: laugh first, then recognise yourself.</p>
      <div className="reveal mt-16"><CookbookReader /></div>
      <div className="reveal mt-20 grid gap-4 md:grid-cols-3">
        {[['Metaphor ingredients', '"Instant coffee: tears in a cup." Humour makes hard topics approachable.'], ['Real quotes, facing page', 'Each recipe is grounded in an actual story from the streets.'], ['Print first, on purpose', 'A physical book is something you share at a table, with flatmates, or with your mum.']].map(([a, b]) => (
          <div key={a} className="rounded-2xl p-6" style={{ background: CREAM }}><p className="font-semibold">{a}</p><p className="mt-2 text-[15px] leading-relaxed text-muted">{b}</p></div>
        ))}
      </div>
    </Wrap>
  )
}

/* ---------------- 7. exhibition ---------------- */
function Exhibition() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  return (
    <Wrap id="r-7" style={{ background: CREAM }}>
      <Kicker n={7} />
      <H2>Part kitchen, part confession booth, <span className="hl" style={{ color: PLUM }}>part social experiment.</span></H2>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted">Before building anything digital, I tested the idea in public. An exhibition with a wall-sized question board, the cookbook on a table, and take-away recipe cards anyone could keep.</p>
      <div className="reveal mt-14 grid gap-3 md:grid-cols-[1.5fr_1fr]">
        <figure className="group relative overflow-hidden rounded-3xl bg-[#e9d9c0]"><img src="/r2a/photo-1.jpg" alt="The Becoming an Adult exhibition board" className="h-[420px] w-full object-cover object-[50%_30%] transition duration-[1200ms] group-hover:scale-105 md:h-[520px]" /><Hand className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-1.5 text-xl">research, themes and real quotes, all on one wall</Hand></figure>
        <figure className="group relative overflow-hidden rounded-3xl"><img src="/r2a/photo-2.jpg" alt="A visitor smiling while reading a recipe card" className="h-[420px] w-full object-cover object-[45%_40%] transition duration-[1200ms] group-hover:scale-105 md:h-[520px]" /><Hand className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-1.5 text-xl">the exact reaction I hoped for</Hand></figure>
      </div>
      <div ref={ref} className="mt-6 grid gap-px overflow-hidden rounded-3xl bg-line md:grid-cols-3">
        <div className="bg-white p-8">
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1e6ea" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke={PLUM} strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={seen ? 19 : 100} style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)' }} /></svg>
            <p className="absolute inset-0 grid place-items-center text-2xl font-semibold"><Count to={81} suffix="%" run={seen} /></p>
          </div>
          <p className="mt-5 text-xl font-semibold tracking-tight">130 of 160 cards taken home</p>
          <p className="mt-1 text-sm text-muted">6 recipes × 26 cards each.</p>
        </div>
        <div className="bg-white p-8"><p className="text-6xl font-semibold tracking-[-0.05em]"><Count to={45} run={seen} /><span className="text-muted">/60</span></p><p className="mt-5 text-xl font-semibold tracking-tight">read a recipe fully</p><p className="mt-1 text-sm text-muted">Most lingered on: First Winter Alone Stew, Love at First Bite, Breakup Meal.</p></div>
        <div className="bg-white p-8"><p className="text-6xl font-semibold tracking-[-0.05em]"><Count to={60} suffix="+" run={seen} /></p><p className="mt-5 text-xl font-semibold tracking-tight">gallery entries</p><p className="mt-1 text-sm text-muted">New stories added to the wall by visitors.</p></div>
      </div>
      <div className="reveal relative mt-6 grid items-center gap-10 overflow-hidden rounded-3xl p-10 text-white md:p-16 lg:grid-cols-[1.3fr_1fr]" style={{ background: NAVY }}>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Theft as flattery</p>
          <p className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1] tracking-[-0.045em]">Two cookbooks were <span className="hl" style={{ color: PINK }}>stolen</span> from the exhibition.</p>
          <p className="mt-6 max-w-xl text-lg text-white/70">I can only assume the stories were too relatable to leave behind. In an odd way, it was the clearest sign that the work had connected.</p>
        </div>
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-white/50">What visitors left behind · open the folder</p>
          <CardFolders keys={['exhibition-cards']} />
        </div>
      </div>
      <p className="reveal mt-10 max-w-3xl text-2xl font-medium leading-snug tracking-tight">Engagement was highest with recipes that wove together themes of <span className="hl" style={{ color: PLUM }}>love, family and care.</span></p>
    </Wrap>
  )
}

/* ---------------- 8. kitchens ---------------- */
function Kitchens() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  const moments = [
    ['At the shop', 'I watched how they decided what to buy, noticing hesitation around quantities and cost.', '"I\u2019m 21, I don\u2019t know how to cook."'],
    ['While cooking', 'They read the recipe aloud, laughing at the metaphors, saying how "fun and easy" it felt next to a traditional recipe.', '"To me recipes felt less like a task, it was a fun experience."'],
    ['During the meal', 'The dish was received with excitement and pride. The storytelling kept them engaged to the last bite.', '"I didn\u2019t know I could make something that tastes good."'],
  ] as const
  return (
    <Wrap id="r-8" className="bg-white">
      <Kicker n={8} />
      <H2>Then I followed the book home, into real kitchens.</H2>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {moments.map(([a, b, q], i) => (
          <div key={a} className="reveal flex flex-col rounded-3xl p-7 md:p-8" style={{ background: CREAM }}>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: PLUM }}>0{i + 1} · {a}</p>
            <p className="mt-3 text-base leading-relaxed text-muted">{b}</p>
            <Hand className="mt-auto pt-8 text-2xl md:text-[1.75rem]">{q}</Hand>
          </div>
        ))}
      </div>
      <div className="reveal mt-4 grid gap-4 md:grid-cols-3">
        <figure className="group relative overflow-hidden rounded-3xl"><img src="/r2a/photo-3.jpg" alt="Two young adults cooking together" loading="lazy" className="aspect-[16/10] w-full object-cover object-center transition duration-[1200ms] group-hover:scale-105" /><figcaption className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">Cooking from the book, 9pm on a weeknight</figcaption></figure>
        <figure className="group relative overflow-hidden rounded-3xl"><img src="/r2a/photo-4.jpg" alt="Participants holding the cookbook and a recipe card" loading="lazy" className="aspect-[16/10] w-full object-cover object-center transition duration-[1200ms] group-hover:scale-105" /><figcaption className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">Proud owners of a first home-cooked meal</figcaption></figure>
        <figure className="group relative overflow-hidden rounded-3xl"><img src="/r2a/photo-5.jpg" alt="A bowl of stew next to a recipe card reading Home is sometimes a stew" loading="lazy" className="aspect-[16/10] w-full object-cover object-center transition duration-[1200ms] group-hover:scale-105" /><Hand className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-1.5 text-xl">the First Winter Alone Stew</Hand></figure>
      </div>
      <div ref={ref} className="reveal mt-24 grid gap-10 rounded-3xl p-8 md:grid-cols-[1fr_1.2fr] md:p-12" style={{ background: '#f9e6ef' }}>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: PLUM }}>Emotional response · 9 young adults</p>
          <div className="mt-6 space-y-5">
            {[['Comforted and connected', 75], ['Excited and curious', 65], ['Overwhelmed and unsure', 15]].map(([l, v], i) => (
              <div key={l as string}><div className="flex justify-between text-sm"><span>{l}</span><span className="font-medium">{v}%</span></div>
                <div className="mt-2 h-2 rounded-full bg-white"><div className="h-full rounded-full transition-all duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]" style={{ width: seen ? `${v}%` : '0%', background: i === 2 ? '#c9aab8' : PLUM, transitionDelay: i * 150 + 'ms' }} /></div></div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {['"The colours are so pretty."', '"I\u2019ve read it twice already and keep discovering little things that make me laugh."', '"The book feels so warm and comforting; my mom and I read it together."'].map((q) => <Hand key={q} className="rounded-2xl bg-white p-5 text-2xl">{q}</Hand>)}
        </div>
      </div>
    </Wrap>
  )
}

/* ---------------- 9. app ---------------- */
const STEW = [
  ['Potatoes', 'Filling and cheap, the student special', 4, 'medium'],
  ['Onion', 'Makes you cry less than your bank account', 1, 'large'],
  ['Garlic', 'The flavour you can actually afford', 3, 'cloves'],
  ['Chicken stock', 'Liquid gold in a cube', 1, 'litre'],
  ['Thyme', 'Makes it fancy (optional but recommended)', 2, 'sprigs'],
] as const
const STEPS = ['Heat oil in a large pot. Brown the chicken on all sides.', 'Add onion and garlic. Let them soften, like your expectations.', 'Add potatoes and stock. Bring to a gentle boil.', 'Lower the heat. Simmer while you call someone you miss.', 'Season, add thyme, and serve your cosy creation.']
function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative mx-auto h-[600px] w-[300px] shrink-0 overflow-hidden rounded-[46px] border-[10px] border-[#111] bg-white shadow-[0_50px_100px_-40px_rgba(29,42,107,0.55)] ${className}`}><div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#111]" />{children}</div>
}
const CAPS: Record<Screen, string> = { home: 'A calm, story-first home', recipes: 'Recipes led by emotion', cook: 'Step-by-step, story-voiced', rank: 'Winter comfort, ranked', bento: 'Compose tonight\'s box', wall: 'A shared food diary' }
function LivePhone({ start, title }: { start: Screen; title: string }) {
  const [sc, setSc] = useState<Screen>(start)
  return (
    <div className="shrink-0">
      <R2AApp screen={sc} onScreen={setSc} />
      <p className="mt-6 text-lg font-medium" style={{ color: NAVY }}>{CAPS[start]}</p>
      <p className="text-muted">{title}</p>
    </div>
  )
}
function AppChapter() {
  const [tab, setTab] = useState(0)
  const feats: { t: string; s: Screen; d: string; m: string[][] }[] = [
    { t: 'Today', s: 'home', d: 'One story first. Home opens on a single immersive hero, then reads in a calm, clear order: today\'s featured bento, one story from the diary, and a preview of the winter comfort ranking.', m: [] },
    { t: 'Stories', s: 'recipes', d: 'Recipes lead with emotion. "The rainy-day comfort bowl" comes first, the dish second. A featured story at the top, then consistent cards below, filtered by mood.', m: [] },
    { t: 'Cooking', s: 'cook', d: 'Each recipe opens as a story: who it belongs to, why it matters, what you need and what others said. Then you cook step by step with the storyteller\'s voice, a timer and one clear action.', m: [['19', 'testers'], ['92%', 'figured out the flow'], ['+30%', 'vs. previous structure'], ['16/19', 'liked the new visuals']] },
    { t: 'Ranking', s: 'rank', d: 'Winter comfort, ranked. Number one gets a large pastel card with its dish spilling over the edge. The rest follow in clean rows, each with a strong numeral and a plate breaking out of its card.', m: [] },
    { t: 'Bento', s: 'bento', d: 'Compose tonight\'s box by dragging from the pantry. The app describes your box back to you in a sentence and nudges gently, without numbers.', m: [['12', 'testers'], ['95%', 'figured out the flow'], ['~4 min', 'to complete'], ['12/15', 'liked the new visuals']] },
    { t: 'Diary', s: 'wall', d: 'The strongest experience. A food journal shared with friends: large photos in soft frosted cards, short emotional captions, a dot rating, quiet comments and double-tap to like. "You" sums up your winter in meals.', m: [] },
  ]
  return (
    <Wrap id="r-9" style={{ background: CREAM }}>
      <Kicker n={9} />
      <H2>From the page to the pocket.</H2>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted">The book proved the emotion. The app had to carry it into Tuesday-night dinners. I sketched flows on paper, built four rounds of wireframes, and kept one rule: <b className="text-ink">it should feel like the book, not like a nutrition app.</b></p>
      <div className="reveal mt-14">
        <div className="inline-flex rounded-full bg-white p-1">
          {feats.map((f, i) => <button key={f.t} onClick={() => setTab(i)} className="rounded-full px-5 py-2.5 text-sm font-medium transition" style={tab === i ? { background: NAVY, color: '#fff' } : { color: '#6e6e6e' }}>{f.t}</button>)}
        </div>
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[auto_1fr]">
          <div><R2AApp screen={feats[tab].s} onScreen={(sc) => setTab(feats.findIndex((f) => f.s === sc))} /></div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: PLUM }}>Try it · this phone is interactive</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{feats[tab].t}</p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{feats[tab].d}</p>
            {feats[tab].m.length > 0 && <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line">
              {feats[tab].m.map(([a, b]) => <div key={b} className="bg-white p-5"><p className="text-3xl font-semibold tracking-[-0.04em]" style={{ color: NAVY }}>{a}</p><p className="mt-1 text-sm text-muted">{b}</p></div>)}
            </div>}
          </div>
        </div>
      </div>
      <div className="reveal mt-24">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Every screen · tap, cook and explore</p>
        <div className="-mx-6 mt-8 flex gap-8 overflow-x-auto px-6 pb-6 md:-mx-16 md:px-16">
          {feats.map((f) => <LivePhone key={f.s} start={f.s} title={f.t} />)}
        </div>
      </div>
    </Wrap>
  )
}

/* ---------------- 10. failed ---------------- */
function Failed() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4)
  return (
    <Wrap id="r-10" className="bg-white">
      <Kicker n={10} />
      <H2>Not everything worked. <span className="text-muted">The potluck flopped.</span></H2>
      <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted">The third feature was community potlucks: discover, join or host a shared meal through the app. I ran real ones to test it. Interest fell with every round.</p>
      <div ref={ref} className="reveal mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex h-72 items-end gap-6 rounded-3xl p-8" style={{ background: CREAM }}>
          {[['1st potluck', 4], ['2nd', 2], ['3rd', 0]].map(([l, v], i) => (
            <div key={l as string} className="flex flex-1 flex-col items-center gap-3">
              <p className="text-2xl font-semibold">{v}/10</p>
              <div className="w-full rounded-t-xl transition-all duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)]" style={{ height: seen ? `${Math.max(4, (v as number) * 14)}px` : '0px', background: (v as number) ? PLUM : '#d8c6ce', transitionDelay: i * 200 + 'ms' }} />
              <p className="text-sm text-muted">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid content-center gap-4">
          <div className="rounded-3xl p-7" style={{ background: CREAM }}><Hand className="text-3xl leading-snug">"Though it was super fun, I wouldn't spend so much time thinking what to buy for the potluck."</Hand></div>
          <div className="rounded-3xl p-7" style={{ background: CREAM }}><Hand className="text-3xl leading-snug">"Tell me it's free food, I'll come hehe."</Hand></div>
        </div>
      </div>
      <div className="reveal mt-10 rounded-3xl p-8 md:p-10" style={{ background: '#f9e6ef' }}>
        <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: PLUM }}>What it taught me</p>
        <p className="mt-3 max-w-3xl text-2xl font-medium leading-snug tracking-tight">People loved the connection but not the effort of planning it. Community has to cost almost nothing to join, so I moved it into the lightweight community wall instead.</p>
      </div>
      <div className="reveal mt-16 grid gap-4 md:grid-cols-3">
        {[['4', 'complete wireframe rounds', 'Visual hierarchy took real iteration to get right.'], ['Print ≠ screen', 'Making the book\u2019s fonts work in an app', 'Display type was kept for titles only; body text moved to a readable sans.'], ['More fun', 'Colours needed more joy', 'The palette was pushed brighter to match the book\u2019s personality.']].map(([a, b, c]) => (
          <div key={b} className="rounded-2xl border border-line p-6"><p className="text-3xl font-semibold tracking-[-0.03em]" style={{ color: NAVY }}>{a}</p><p className="mt-2 font-medium">{b}</p><p className="mt-1 text-sm text-muted">{c}</p></div>
        ))}
      </div>
    </Wrap>
  )
}

/* ---------------- 11. outcomes ---------------- */
function Outcomes() {
  const items = [['250+', 'stories collected on Dublin streets'], ['130/160', 'take-away recipe cards kept'], ['45/60', 'visitors read a recipe fully'], ['75%', 'of testers felt comforted and connected'], ['92%', 'completed the story-recipe flow (+30%)'], ['95%', 'completed the bento flow'], ['2', 'cookbooks stolen. The best review.']]
  return (
    <section id="r-11" className="px-6 py-28 text-white md:px-16 md:py-36" style={{ background: '#140f1c' }}>
      <div className="mx-auto max-w-[1180px]">
        <Kicker n={11} dark />
        <H2>What it added up to.</H2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([a, b], i) => (
            <div key={b} className={`reveal bg-[#140f1c] p-8 transition-colors duration-500 hover:bg-[#1e1628] ${i === items.length - 1 ? 'lg:col-span-2' : ''}`} style={{ transitionDelay: i * 60 + 'ms' }}>
              <p className="text-5xl font-semibold tracking-[-0.05em]" style={{ color: i === items.length - 1 ? PINK : '#fff' }}>{a}</p>
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
    <section id="r-12" className="px-6 py-32 md:px-16 md:py-44" style={{ background: CREAM }}>
      <div className="mx-auto max-w-[1180px]">
        <Kicker n={12} />
        <p className="reveal mt-10 text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[1] tracking-[-0.05em]">Nobody feels ready for adulthood. <span className="hl" style={{ color: PLUM }}>But everyone can follow a recipe</span>, especially one written by someone who has been there.</p>
        <div className="reveal mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {[['Design the feeling first', 'The cookbook proved the emotion before a single screen existed. That made every app decision easier.'], ['Test in the real world', 'Streets, exhibitions and kitchens told me more than any prototype could.'], ['Let failure edit you', 'The potluck flopped, and the product got simpler and better because of it.']].map(([a, b]) => (
            <div key={a}><p className="font-medium">{a}</p><p className="mt-2 leading-relaxed text-muted">{b}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function RecipesCase() {
  useReveal()
  return (
    <main>
      <CaseNav />
      <Hero /><Spark /><Streets /><Heard /><Reframe /><Recipes /><Cookbook /><Exhibition /><Kitchens /><AppChapter /><Failed /><Outcomes /><Reflection /><NextProject href="#/maximo" kicker="Enterprise SaaS · IBM" title="IBM Maximo: helping users reach value faster" accent={PINK} bg="#140f1c" />
    </main>
  )
}
