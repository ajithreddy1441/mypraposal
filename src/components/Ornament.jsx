// A small gold mark between two lengths of zari border, used to open a section
export default function Ornament({ children, className = '' }) {
  return (
    <div className={`mx-auto flex w-full max-w-xs items-center gap-3 ${className}`} aria-hidden={!children}>
      <span className="zari flex-1" />
      {children && <span className="shrink-0 font-book text-lg italic leading-none text-champagne">{children}</span>}
      <span className="zari flex-1" />
    </div>
  )
}
