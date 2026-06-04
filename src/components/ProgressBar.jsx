import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { formatSpeed, formatFilesize } from '../utils/format'

export default function ProgressBar({ job }) {
  if (!job) return null

  const { status, percent, speed, eta, downloaded_bytes, total_bytes, error } = job

  const statusConfig = {
    queued:      { label: 'Queued...',     color: 'bg-brand-muted',   icon: Loader2 },
    downloading: { label: 'Downloading',   color: 'bg-brand-red',     icon: Zap },
    processing:  { label: 'Processing...',  color: 'bg-yellow-500',    icon: Loader2 },
    done:        { label: 'Complete!',      color: 'bg-green-500',     icon: CheckCircle2 },
    error:       { label: 'Failed',         color: 'bg-red-700',       icon: XCircle },
  }

  const cfg = statusConfig[status] || statusConfig.queued
  const Icon = cfg.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto mt-4"
      >
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">

          {/* Status header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${
                status === 'done' ? 'text-green-400' :
                status === 'error' ? 'text-red-400' :
                status === 'processing' ? 'text-yellow-400 animate-spin' :
                status === 'downloading' ? 'text-brand-red' :
                'text-brand-muted animate-spin'
              }`} />
              <span className="text-brand-text text-sm font-semibold">{cfg.label}</span>
            </div>
            <span className="text-brand-red font-bold text-sm">
              {status === 'done' ? '100%' : `${percent ?? 0}%`}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 bg-brand-darker rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${cfg.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${status === 'done' ? 100 : percent ?? 0}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Stats row */}
          {status === 'downloading' && (
            <div className="flex flex-wrap gap-4 mt-3 text-brand-subtext text-xs">
              {speed && (
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-brand-red" />
                  {formatSpeed(speed)}
                </span>
              )}
              {eta > 0 && (
                <span>ETA: {eta}s</span>
              )}
              {downloaded_bytes && total_bytes && (
                <span>
                  {formatFilesize(downloaded_bytes)} / {formatFilesize(total_bytes)}
                </span>
              )}
            </div>
          )}

          {/* Error message */}
          {status === 'error' && error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  )
}