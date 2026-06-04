import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="w-full border-b border-brand-border bg-brand-darker/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-red red-glow-sm flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 4h5.5L4 10.5V16h12V4H4z" fill="white" opacity="0.15"/>
              <path d="M3 3h14v14H3V3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 7l5 3-5 3V7z" fill="white"/>
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-brand-text font-bold text-base sm:text-lg tracking-tight">
              Rophyl <span className="text-brand-red">Tube</span>
            </span>
            <span className="text-brand-subtext text-[9px] sm:text-[10px] font-medium tracking-widest uppercase">
              Downloader
            </span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-brand-subtext text-xs sm:text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse shrink-0" />
          <span className="hidden sm:inline">Powered by Rophyl by Curtis</span>
          <span className="sm:hidden text-[10px]">Rophyl by Curtis</span>
        </motion.div>

      </div>
    </header>
  )
}