import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CARD_FILES } from './cardFiles'

type Folder = { key: string; title: string; sub: string; tab: string; body: string; ink: string; bg: string }

export const FOLDERS: Record<string, Folder> = {
  '1st-street-intervention': { key: '1st-street-intervention', title: '1st Street Intervention', sub: 'Handwritten answers, Grafton Street', tab: '#d9b98a', body: '#ecd3a8', ink: '#5a3d18', bg: '#f6efe4' },
  '2nd-street-intervention': { key: '2nd-street-intervention', title: '2nd Street Intervention', sub: 'Printed question cards with age', tab: '#7fae8a', body: '#a9d1b2', ink: '#1f4a2b', bg: '#eef6e9' },
  'exhibition-cards': { key: 'exhibition-cards', title: 'Exhibition Cards', sub: 'Comfort food, from the exhibition', tab: '#c98aa8', body: '#e6b9cd', ink: '#5e1f40', bg: '#fff4f8' },
}

const src = (k: string, f: string) => `/research-cards/${k}/${f}`

function FolderCard({ f, onOpen }: { f: Folder; onOpen: () => void }) {
  const files = CARD_FILES[f.key] ?? []
  const peek = [files[0], files[Math.floor(files.length / 2)], files[files.length - 1]]
  return (
    <button onClick={onOpen} className="group relative block w-full text-left focus:outline-none" aria-label={`Open ${f.title}, ${files.length} cards`}>
      <div className="relative h-[280px] md:h-[320px]">
        <div className="absolute inset-x-0 bottom-0 top-6 rounded-[22px] rounded-tl-none" style={{ background: f.tab }} />
        <div className="absolute left-0 top-0 h-8 w-40 rounded-t-[16px]" style={{ background: f.tab }} />
        {peek.map((p, i) => (
          <div key={i} className="absolute top-10 w-[42%] transition-transform duration-500 ease-out group-hover:-translate-y-10" style={{ left: `${8 + i * 25}%`, transitionDelay: `${i * 60}ms` }}>
            <img src={src(f.key, p)} alt="" loading="lazy" className="h-44 w-full rounded-lg bg-white object-cover shadow-lg md:h-52" style={{ transform: `rotate(${(i - 1) * 6}deg)` }} />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-[58%] origin-bottom rounded-[22px] p-6 shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:[transform:perspective(900px)_rotateX(-14deg)]" style={{ background: f.body, color: f.ink }}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{f.title}</p>
                <p className="mt-1 text-sm opacity-75">{f.sub}</p>
              </div>
              <span className="relative flex h-3 w-3 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: f.ink }} /><span className="relative h-3 w-3 rounded-full" style={{ background: f.ink }} /></span>
            </div>
            <div className="flex items-end justify-end">
              <span className="rounded-full px-4 py-2 text-sm font-medium text-white transition-all group-hover:px-5" style={{ background: f.ink }}>Open folder →</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

function Gallery({ f, onClose }: { f: Folder; onClose: () => void }) {
  const files = CARD_FILES[f.key] ?? []
  const [i, setI] = useState<number | null>(null)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (i !== null) setI(null); else onClose() }
      if (i !== null && e.key === 'ArrowRight') setI((i + 1) % files.length)
      if (i !== null && e.key === 'ArrowLeft') setI((i - 1 + files.length) % files.length)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [i, files.length, onClose])
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ background: f.bg }}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/10 bg-white/70 px-6 py-4 backdrop-blur md:px-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: f.ink }}>Research folder · {files.length} cards</p>
          <p className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">{f.title}</p>
        </div>
        <button onClick={onClose} className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">← Back to case study</button>
      </div>
      <div className="mx-auto max-w-7xl columns-2 gap-4 px-6 py-10 md:columns-3 md:px-12 lg:columns-4">
        {files.map((p, n) => (
          <button key={p} onClick={() => setI(n)} className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] transition hover:-translate-y-1">
            <img src={src(f.key, p)} alt={p.replace(/^\d+-|\.jpg$/g, '').replace(/-/g, ' ')} loading="lazy" className="w-full" />
          </button>
        ))}
      </div>
      {i !== null && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/85 p-4" onClick={() => setI(null)}>
          <img src={src(f.key, files[i])} alt="" className="max-h-[88vh] max-w-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setI((i - 1 + files.length) % files.length) }} className="absolute left-4 h-12 w-12 rounded-full bg-white/15 text-2xl text-white" aria-label="Previous">‹</button>
          <button onClick={e => { e.stopPropagation(); setI((i + 1) % files.length) }} className="absolute right-4 h-12 w-12 rounded-full bg-white/15 text-2xl text-white" aria-label="Next">›</button>
          <button onClick={() => setI(null)} className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-sm text-white">Close</button>
          <p className="absolute bottom-4 font-mono text-xs text-white/70">{i + 1} / {files.length}</p>
        </div>
      )}
    </div>
  )
}

export default function CardFolders({ keys }: { keys: string[] }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <>
      <div className={`grid gap-6 ${keys.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {keys.map(k => <FolderCard key={k} f={FOLDERS[k]} onOpen={() => setOpen(k)} />)}
      </div>
      {open && createPortal(<Gallery f={FOLDERS[open]} onClose={() => setOpen(null)} />, document.body)}
    </>
  )
}
