import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Music } from 'lucide-react'
import { formatFilesize } from '../utils/format'

export default function FormatSelector({ formats, subtitles, onChange }) {
  const [tab, setTab] = useState('video')
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [convertTo, setConvertTo] = useState(null)
  const [includeSubtitles, setIncludeSubtitles] = useState(false)
  const [subtitleLang, setSubtitleLang] = useState('en')
  const [includeThumbnail, setIncludeThumbnail] = useState(false)

  const notify = (fmt, convert, subs, subsLang, thumb) => {
    onChange({
      format_type: tab,
      format_id: fmt.format_id,
      ext: fmt.ext,
      convert_to: convert,
      include_subtitles: subs,
      subtitle_lang: subsLang,
      include_thumbnail: thumb,
    })
  }

  const handleSelect = (fmt) => {
    setSelectedFormat(fmt)
    setConvertTo(null)
    notify(fmt, null, includeSubtitles, subtitleLang, includeThumbnail)
  }

  const handleConvert = (to) => {
    setConvertTo(to)
    if (selectedFormat) notify(selectedFormat, to, includeSubtitles, subtitleLang, includeThumbnail)
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setSelectedFormat(null)
    setConvertTo(null)
    onChange(null)
  }

  const handleSubtitleToggle = (val) => {
    setIncludeSubtitles(val)
    if (selectedFormat) notify(selectedFormat, convertTo, val, subtitleLang, includeThumbnail)
  }

  const handleThumbnailToggle = (val) => {
    setIncludeThumbnail(val)
    if (selectedFormat) notify(selectedFormat, convertTo, includeSubtitles, subtitleLang, val)
  }

  const audioConvertOptions = ['mp3', 'aac', 'opus', 'flac', 'wav']
  const videoConvertOptions = ['mp4', 'mkv', 'webm']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full mt-4"
    >
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-5">

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'video', label: 'Video', icon: Video },
            { key: 'audio', label: 'Audio Only', icon: Music },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`
                flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 flex-1 sm:flex-none justify-center sm:justify-start
                ${tab === key
                  ? 'bg-brand-red text-white red-glow-sm'
                  : 'bg-brand-darker text-brand-muted hover:text-brand-text border border-brand-border'}
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Format grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 'video' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-brand-subtext text-xs mb-3 uppercase tracking-wider font-medium">
              {tab === 'video' ? 'Select Quality' : 'Select Format'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {(tab === 'video' ? formats.video : formats.audio).map((fmt) => (
                <button
                  key={fmt.format_id}
                  onClick={() => handleSelect(fmt)}
                  className={`
                    flex flex-col items-center justify-center gap-1
                    p-3 rounded-xl border text-sm font-semibold
                    transition-all duration-200 active:scale-95
                    ${selectedFormat?.format_id === fmt.format_id
                      ? 'border-brand-red bg-brand-red/10 text-brand-red red-glow-sm'
                      : 'border-brand-border bg-brand-darker text-brand-text hover:border-brand-red/50'}
                  `}
                >
                  {/* Quality/format label */}
                  <span className="text-base font-bold">{fmt.label}</span>

                  {/* Extension */}
                  {fmt.ext && (
                    <span className="text-[10px] uppercase tracking-wider text-brand-muted">
                      {fmt.ext}
                    </span>
                  )}

                  {/* Filesize if available */}
                  {fmt.filesize && (
                    <span className="text-[10px] text-brand-muted">
                      ~{formatFilesize(fmt.filesize)}
                    </span>
                  )}

                  {/* Bitrate for video if no filesize */}
                  {tab === 'video' && !fmt.filesize && fmt.tbr && (
                    <span className="text-[10px] text-brand-muted">
                      ~{fmt.tbr}kbps
                    </span>
                  )}

                  {/* Audio merged indicator for video formats */}
                  {tab === 'video' && !fmt.has_audio && (
                    <span className="text-[9px] text-brand-muted/70 italic">
                      +audio merged
                    </span>
                  )}

                  {/* Bitrate for audio formats */}
                  {tab === 'audio' && fmt.abr > 0 && (
                    <span className="text-[10px] text-brand-muted">
                      {fmt.abr}kbps
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Convert to */}
        {selectedFormat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-5"
          >
            <p className="text-brand-subtext text-xs mb-3 uppercase tracking-wider font-medium">
              Convert To
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleConvert(null)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95
                  ${!convertTo
                    ? 'border-brand-red bg-brand-red/10 text-brand-red'
                    : 'border-brand-border text-brand-muted hover:border-brand-red/50'}`}
              >
                Original
              </button>
              {(tab === 'audio' ? audioConvertOptions : videoConvertOptions).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleConvert(opt)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all uppercase active:scale-95
                    ${convertTo === opt
                      ? 'border-brand-red bg-brand-red/10 text-brand-red'
                      : 'border-brand-border text-brand-muted hover:border-brand-red/50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Extras */}
        <div className="mt-5 pt-5 border-t border-brand-border flex flex-wrap gap-4">

          {subtitles?.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSubtitleToggle(!includeSubtitles)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative shrink-0
                  ${includeSubtitles ? 'bg-brand-red' : 'bg-brand-border'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300
                  ${includeSubtitles ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-brand-subtext text-xs">Subtitles</span>
              {includeSubtitles && (
                <select
                  value={subtitleLang}
                  onChange={(e) => setSubtitleLang(e.target.value)}
                  className="bg-brand-darker border border-brand-border text-brand-text
                             text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-brand-red"
                >
                  {subtitles.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleThumbnailToggle(!includeThumbnail)}
              className={`w-10 h-5 rounded-full transition-all duration-300 relative shrink-0
                ${includeThumbnail ? 'bg-brand-red' : 'bg-brand-border'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300
                ${includeThumbnail ? 'left-5' : 'left-0.5'}`} />
            </button>
            <span className="text-brand-subtext text-xs">Embed Thumbnail</span>
          </div>

        </div>
      </div>
    </motion.div>
  )
}