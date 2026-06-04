import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Link2, X, Loader2 } from 'lucide-react'

export default function SearchBar({ onSearch, loading }) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) onSearch(url.trim())
  }

  const handleClear = () => setUrl('')

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      toast.error('Could not access clipboard')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit}>
        <div className={`
          flex items-center gap-2 w-full
          bg-brand-card border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3
          transition-all duration-300
          ${url ? 'border-brand-red red-glow-sm' : 'border-brand-border'}
          focus-within:border-brand-red focus-within:red-glow-sm
        `}>

          <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-muted shrink-0" />

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a URL here..."
            className="flex-1 bg-transparent text-brand-text placeholder:text-brand-muted
                       text-sm focus:outline-none min-w-0"
            disabled={loading}
          />

          {url && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-brand-muted hover:text-brand-text transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!url && (
            <button
              type="button"
              onClick={handlePaste}
              className="text-xs text-brand-muted hover:text-brand-red
                         border border-brand-border hover:border-brand-red
                         px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0"
            >
              Paste
            </button>
          )}

          <button
            type="submit"
            disabled={!url.trim() || loading}
            className={`
              flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold
              transition-all duration-200 shrink-0
              ${url.trim() && !loading
                ? 'bg-brand-red hover:bg-brand-redHover text-white red-glow-sm cursor-pointer active:scale-95'
                : 'bg-brand-border text-brand-muted cursor-not-allowed'}
            `}
          >
            {loading
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span className="hidden sm:inline">Fetching...</span></>
              : <><Search className="w-3.5 h-3.5" /><span className="hidden sm:inline">Search</span></>
            }
          </button>
        </div>
      </form>

      <p className="text-center text-brand-muted text-xs mt-3 px-2">
        Supports YouTube, Twitter/X, Instagram, TikTok, Vimeo & 1000+ more
      </p>
    </motion.div>
  )
}