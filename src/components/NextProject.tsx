type Props = { href: string; title: string; kicker: string; accent: string; bg?: string }

/** Compact closing card for case studies linking to the next project. */
export default function NextProject({ href, title, accent, bg = '#111111' }: Props) {
  return (
    <section aria-label="End of case study" className="px-6 pb-10 pt-12 md:px-16 md:pb-12 md:pt-16">
      <div className="mx-auto max-w-[1180px]">
        <a href={href} className="group relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl px-6 py-5 text-white transition duration-300 hover:-translate-y-0.5 md:px-8 md:py-6" style={{ background: bg }}>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-white/50">Next project</p>
            <p className="mt-1 truncate text-lg font-semibold tracking-[-0.02em] md:text-xl">{title}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-black transition duration-300 group-hover:translate-x-1" style={{ background: accent }}>→</span>
        </a>
      </div>
    </section>
  )
}
