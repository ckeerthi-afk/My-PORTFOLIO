import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const TOTAL = 76
const pg = (n: number) => `/cookbook/p-${String(n).padStart(2, '0')}.jpg`
// PDF page 1 = front cover, page 2 = back cover, 3..76 = the book
const INNER = Array.from({ length: TOTAL - 2 }, (_, i) => i + 3)
// views: 0 = front cover, 1..n = spreads, last = back cover
const SPREADS: [number, number][] = []
for (let i = 0; i < INNER.length; i += 2) SPREADS.push([INNER[i], INNER[i + 1] ?? 0])
const LAST = SPREADS.length + 1

function Reader({ onClose }: { onClose: () => void }) {
  const [v, setV] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const go = (d: 1 | -1) => { setDir(d); setV(x => Math.min(LAST, Math.max(0, x + d))) }
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  // preload neighbours
  useEffect(() => {
    const s = SPREADS[v] ?? []
    s.forEach(n => { if (n) new Image().src = pg(n) })
  }, [v])

  const single = v === 0 || v === LAST
  const label = v === 0 ? 'Front cover' : v === LAST ? 'Back cover' : `Pages ${v * 2 - 1}–${v * 2}`
  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#2a1020' }}>
      <div className="flex items-center justify-between gap-4 px-6 py-4 text-white md:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">The cookbook · {label}</p>
          <p className="text-lg font-semibold tracking-[-0.02em]">Recipes to Adult</p>
        </div>
        <button onClick={onClose} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black">← Back to case study</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-20">
        <div key={v} className="flex h-full max-h-[82vh] items-center justify-center [perspective:2000px]" style={{ animation: `${dir > 0 ? 'cbIn' : 'cbInBack'} .55s cubic-bezier(.22,1,.36,1)` }}>
          {single ? (
            <img src={pg(v === 0 ? 1 : 2)} alt={label} className="h-full max-h-[82vh] w-auto rounded-md shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]" />
          ) : (
            <div className="relative flex h-full max-h-[82vh] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
              {SPREADS[v - 1].map((n, i) => n ? (
                <img key={n} src={pg(n)} alt={`Page ${n - 2}`} className={`h-full max-h-[82vh] w-auto max-w-[45vw] object-contain ${i === 0 ? 'rounded-l-md' : 'rounded-r-md'}`} />
              ) : <div key="blank" className="aspect-[702/1000] h-full rounded-r-md bg-[#f4c4cc]" />)}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            </div>
          )}
        </div>
        <button onClick={() => go(-1)} disabled={v === 0} className="absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 disabled:opacity-20 md:left-6" aria-label="Previous page">‹</button>
        <button onClick={() => go(1)} disabled={v === LAST} className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 disabled:opacity-20 md:right-6" aria-label="Next page">›</button>
      </div>
      <div className="px-6 pb-5 md:px-10">
        <input type="range" min={0} max={LAST} value={v} onChange={e => { const n = +e.target.value; setDir(n >= v ? 1 : -1); setV(n) }} className="w-full accent-pink-300" aria-label="Jump to page" />
      </div>
      <style>{`@keyframes cbIn{from{opacity:0;transform:rotateY(-18deg) translateX(40px)}to{opacity:1;transform:none}}@keyframes cbInBack{from{opacity:0;transform:rotateY(18deg) translateX(-40px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

export default function Cookbook({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="group relative mx-auto block w-full max-w-[300px] text-left [perspective:1400px] focus:outline-none" aria-label="Open the Recipes to Adult cookbook">
        <div className="relative transition-transform duration-700 ease-out [transform-style:preserve-3d] [transform:rotateY(-22deg)_rotateX(4deg)] group-hover:[transform:rotateY(-8deg)_rotateX(2deg)_translateY(-8px)]">
          {/* page block */}
          <div className="absolute inset-y-[1.5%] right-[-14px] w-4 rounded-r-sm bg-[repeating-linear-gradient(90deg,#fff_0_2px,#e9dfe2_2px_3px)] [transform:translateZ(-8px)]" />
          <img src={pg(1)} alt="Recipes to Adult cookbook cover" className="relative w-full rounded-r-md rounded-l-sm shadow-[20px_30px_60px_-20px_rgba(0,0,0,0.55)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-5 rounded-l-sm bg-gradient-to-r from-black/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-tr from-transparent via-white/0 to-white/25 opacity-0 transition group-hover:opacity-100" />
        </div>
        <div className={`mt-8 flex items-center justify-between ${dark ? 'text-white' : 'text-ink'}`}>
          <p className="text-sm"><span className="font-semibold">{TOTAL - 2} pages</span> <span className="opacity-60">· the printed cookbook</span></p>
          <span className={`rounded-full px-4 py-2 text-sm font-medium transition-all group-hover:px-5 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>Read it →</span>
        </div>
      </button>
      {open && createPortal(<Reader onClose={() => setOpen(false)} />, document.body)}
    </>
  )
}
