import src from '../assets/ibm-logo.png'

// Source image has wide white margins; crop to the mark (approx. x 135–725, y 100–325 of 850×425).
export default function IbmLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <span className={`relative inline-block aspect-[590/225] overflow-hidden ${className}`} role="img" aria-label="IBM">
      <img src={src} alt="" className="absolute max-w-none mix-blend-multiply" style={{ width: '144%', left: '-22.9%', top: '-44.4%' }} />
    </span>
  )
}
