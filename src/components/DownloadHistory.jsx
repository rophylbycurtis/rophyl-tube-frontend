import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, X, ChevronDown, ChevronUp, Clock, Video, Music } from 'lucide-react'
import { formatDuration, formatViews } from '../utils/format'

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'Just now'
}

export default function DownloadHistory({ history, onRemove, onClear, onReload }) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between
                   bg-brand-card border border-brand-border rounded-2xl
                   px-4 sm:px-5 py-3.5 transition-all hover:border-brand-red/40"
      >
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-brand-red" />
          <span className="text-brand-text text-sm font-semibold">Download History</span>
          <span className="bg-brand-red/15 text-brand-red text-xs font-bold px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onClear() }}
            className="text-brand-muted hover:text-brand-red text-xs flex items-center gap-1
                       transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear all</span>
          </button>
          {open
            ? <ChevronUp className="w-4 h-4 text-brand-muted" />
            : <ChevronDown className="w-4 h-4 text-brand-muted" />
          }
        </div>
      </button>

      {/* History list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-card border border-t-0 border-brand-border
                            rounded-b-2xl divide-y divide-brand-border">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 px-4 sm:px-5 py-3
                             hover:bg-brand-cardHover transition-colors group"
                >
                  {/* Thumbnail */}
                  {item.thumbnail
                    ? <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-14 h-10 sm:w-16 sm:h-11 object-cover rounded-lg shrink-0"
                      />
                    : <div className="w-14 h-10 sm:w-16 sm:h-11 bg-brand-darker rounded-lg
                                      flex items-center justify-center shrink-0">
                        {item.format_type === 'audio'
                          ? <Music className="w-4 h-4 text-brand-muted" />
                          : <Video className="w-4 h-4 text-brand-muted" />
                        }
                      </div>
                  }

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onReload(item)}
                      className="text-brand-text text-xs sm:text-sm font-medium
                                 line-clamp-1 hover:text-brand-red transition-colors text-left w-full"
                    >
                      {item.title || item.url}
                    </button>
                    <div className="flex items-center gap-2 mt-0.5 text-brand-muted text-[10px] sm:text-xs">
                      <span className="uppercase font-semibold text-brand-red/70">
                        {item.format_type} · {item.ext}
                      </span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-brand-muted hover:text-brand-red transition-colors
                               opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}