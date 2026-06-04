import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListVideo, Clock, CheckSquare, Square, Download,
         ChevronDown, ChevronUp, Music, Video, Loader2 } from 'lucide-react'
import { formatDuration } from '../utils/format'

export default function PlaylistView({ playlist, onDownloadSelected, onSelectSingle, loading }) {
  const [selected, setSelected] = useState([])
  const [expanded, setExpanded] = useState(true)
  const [formatType, setFormatType] = useState('video')
  const [quality, setQuality] = useState('bestvideo+bestaudio')
  const [audioFormat, setAudioFormat] = useState('mp3')

  const toggleItem = (url) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    )
  }

  const toggleAll = () => {
    if (selected.length === playlist.entries.length) {
      setSelected([])
    } else {
      setSelected(playlist.entries.map((e) => e.url))
    }
  }

  const handleDownload = () => {
    const entries = playlist.entries.filter((e) => selected.includes(e.url))
    onDownloadSelected({
      entries,
      format_type: formatType,
      format_id: formatType === 'audio' ? 'bestaudio' : 'bestvideo',
      ext: formatType === 'audio' ? audioFormat : 'mp4',
      convert_to: formatType === 'audio' ? audioFormat : null,
    })
  }

  const videoQualities = [
    { label: 'Best', value: 'bestvideo+bestaudio' },
    { label: '1080p', value: '137+bestaudio' },
    { label: '720p',  value: '136+bestaudio' },
    { label: '480p',  value: '135+bestaudio' },
    { label: '360p',  value: '134+bestaudio' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-8"
    >
      {/* Playlist header card */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red/15 flex items-center
                          justify-center shrink-0">
            <ListVideo className="w-5 h-5 text-brand-red" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-brand-text font-bold text-base sm:text-lg line-clamp-1">
              {playlist.playlist_title || 'Playlist'}
            </h2>
            <p className="text-brand-subtext text-xs sm:text-sm mt-0.5">
              {playlist.uploader && <span>{playlist.uploader} · </span>}
              {playlist.count} videos
            </p>
          </div>
        </div>

        {/* Format selector */}
        <div className="mt-4 pt-4 border-t border-brand-border">
          <p className="text-brand-subtext text-xs uppercase tracking-wider mb-3">
            Download format for all selected
          </p>

          {/* Type tabs */}
          <div className="flex gap-2 mb-3">
            {[
              { key: 'video', label: 'Video', icon: Video },
              { key: 'audio', label: 'Audio', icon: Music },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFormatType(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                  transition-all flex-1 justify-center
                  ${formatType === key
                    ? 'bg-brand-red text-white red-glow-sm'
                    : 'bg-brand-darker border border-brand-border text-brand-muted'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Quality/format pills */}
          <div className="flex flex-wrap gap-2">
            {formatType === 'video'
              ? videoQualities.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQuality(q.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                      ${quality === q.value
                        ? 'border-brand-red bg-brand-red/10 text-brand-red'
                        : 'border-brand-border text-brand-muted hover:border-brand-red/50'}`}
                  >
                    {q.label}
                  </button>
                ))
              : ['mp3', 'aac', 'opus', 'flac'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setAudioFormat(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all uppercase
                      ${audioFormat === f
                        ? 'border-brand-red bg-brand-red/10 text-brand-red'
                        : 'border-brand-border text-brand-muted hover:border-brand-red/50'}`}
                  >
                    {f}
                  </button>
                ))
            }
          </div>
        </div>
      </div>

      {/* Video list */}
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">

        {/* List header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3
                        border-b border-brand-border">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-brand-subtext hover:text-brand-text
                       text-xs transition-colors"
          >
            {selected.length === playlist.entries.length
              ? <CheckSquare className="w-4 h-4 text-brand-red" />
              : <Square className="w-4 h-4" />
            }
            {selected.length === playlist.entries.length ? 'Deselect all' : 'Select all'}
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-brand-muted hover:text-brand-text transition-colors"
          >
            {expanded
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Entries */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="max-h-96 overflow-y-auto divide-y divide-brand-border">
                {playlist.entries.map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className="flex items-center gap-3 px-4 sm:px-5 py-3
                               hover:bg-brand-cardHover transition-colors"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItem(entry.url)}
                      className="shrink-0"
                    >
                      {selected.includes(entry.url)
                        ? <CheckSquare className="w-4 h-4 text-brand-red" />
                        : <Square className="w-4 h-4 text-brand-muted" />
                      }
                    </button>

                    {/* Index */}
                    <span className="text-brand-muted text-xs w-5 text-right shrink-0">
                      {index + 1}
                    </span>

                    {/* Thumbnail */}
                    {entry.thumbnail
                      ? <img
                          src={entry.thumbnail}
                          alt={entry.title}
                          className="w-14 h-10 object-cover rounded-lg shrink-0"
                        />
                      : <div className="w-14 h-10 bg-brand-darker rounded-lg shrink-0" />
                    }

                    {/* Title + duration */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onSelectSingle(entry)}
                        className="text-brand-text text-xs sm:text-sm font-medium
                                   line-clamp-1 hover:text-brand-red transition-colors text-left w-full"
                      >
                        {entry.title}
                      </button>
                      {entry.duration && (
                        <span className="text-brand-muted text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDuration(entry.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download selected button */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-brand-border"
          >
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                         bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm
                         red-glow transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</>
                : <><Download className="w-4 h-4" /> Download {selected.length} video{selected.length > 1 ? 's' : ''}</>
              }
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}