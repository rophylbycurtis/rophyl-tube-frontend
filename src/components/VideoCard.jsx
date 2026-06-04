import { motion } from 'framer-motion'
import { Clock, Eye, ThumbsUp, Calendar, User } from 'lucide-react'
import { formatDuration, formatViews, formatUploadDate } from '../utils/format'

export default function VideoCard({ info }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-8"
    >
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">

        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-brand-darker">
          <img
            src={info.thumbnail}
            alt={info.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/80 text-white
                          text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(info.duration)}
          </div>
          {info.is_live && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand-red text-white
                            text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <h2 className="text-brand-text font-semibold text-sm sm:text-base leading-snug line-clamp-2">
            {info.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-brand-subtext text-xs">
            {info.uploader && (
              <span className="flex items-center gap-1.5">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">{info.uploader}</span>
              </span>
            )}
            {info.view_count && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red shrink-0" />
                {formatViews(info.view_count)}
              </span>
            )}
            {info.like_count && (
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red shrink-0" />
                {formatViews(info.like_count)}
              </span>
            )}
            {info.upload_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red shrink-0" />
                {formatUploadDate(info.upload_date)}
              </span>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  )
}