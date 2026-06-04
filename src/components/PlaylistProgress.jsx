import { motion } from 'framer-motion'
import { ListVideo, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function PlaylistProgress({ job }) {
  if (!job) return null

  const { status, percent, completed_videos, total_videos, current_title, failed } = job

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-4"
    >
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {status === 'done'
              ? <CheckCircle2 className="w-4 h-4 text-green-400" />
              : <Loader2 className="w-4 h-4 text-brand-red animate-spin" />
            }
            <span className="text-brand-text text-sm font-semibold">
              {status === 'done' ? 'Playlist downloaded!' : 'Downloading playlist...'}
            </span>
          </div>
          <span className="text-brand-red font-bold text-sm">{percent ?? 0}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-brand-darker rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-red"
            initial={{ width: 0 }}
            animate={{ width: `${percent ?? 0}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-3 text-brand-subtext text-xs">
          <span className="flex items-center gap-1.5">
            <ListVideo className="w-3.5 h-3.5 text-brand-red" />
            {completed_videos ?? 0} / {total_videos ?? 0} videos
          </span>
          {failed?.length > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <XCircle className="w-3.5 h-3.5" />
              {failed.length} failed
            </span>
          )}
        </div>

        {/* Current video being downloaded */}
        {current_title && status !== 'done' && (
          <p className="text-brand-muted text-xs mt-2 line-clamp-1">
            Downloading: <span className="text-brand-text">{current_title}</span>
          </p>
        )}

        {/* Failed list */}
        {status === 'done' && failed?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brand-border">
            <p className="text-red-400 text-xs font-semibold mb-1">Failed downloads:</p>
            {failed.map((title, i) => (
              <p key={i} className="text-brand-muted text-xs line-clamp-1">· {title}</p>
            ))}
          </div>
        )}

      </div>
    </motion.div>
  )
}