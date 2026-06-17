import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SkeletonLoader from './components/SkeletonLoader'
import VideoCard from './components/VideoCard'
import FormatSelector from './components/FormatSelector'
import ProgressBar from './components/ProgressBar'
import DownloadButton from './components/DownloadButton'
import DownloadHistory from './components/DownloadHistory'
import PlaylistView from './components/PlaylistView'
import PlaylistProgress from './components/PlaylistProgress'
import InstallPrompt from './components/InstallPrompt'
import { useDownloadHistory } from './hooks/useDownloadHistory'
import { getVideoInfo, getSingleVideoInfo, startDownload,
         startPlaylistDownload, getDownloadStatus, getFileUrl } from './api/client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState(null)
  const [playlistInfo, setPlaylistInfo] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState(null)
  const [job, setJob] = useState(null)
  const [jobId, setJobId] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [playlistJob, setPlaylistJob] = useState(null)
  const [error, setError] = useState(null)
  const [serverWaking, setServerWaking] = useState(false)
  const pollRef = useRef(null)
  const playlistPollRef = useRef(null)

  const { history, addToHistory, removeFromHistory, clearHistory } = useDownloadHistory()

  // Wake up the backend on app load
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(() => setServerWaking(false))
      .catch(() => setServerWaking(false))
  }, [])

  const clearError = () => setError(null)

  // --- Fetch info ---
  const handleSearch = async (url) => {
    setLoading(true)
    setVideoInfo(null)
    setPlaylistInfo(null)
    setSelectedOptions(null)
    if (!downloading) {
      setJob(null)
      setJobId(null)
      setDownloadUrl(null)
      setPlaylistJob(null)
    }
    setError(null)

    try {
      const res = await getVideoInfo(url)
      const data = res.data

      if (data.type === 'playlist') {
        setPlaylistInfo({ ...data, url })
        toast.success(`Playlist found — ${data.count} videos`)
      } else {
        setVideoInfo({ ...data, url })
        toast.success('Video found!')
      }
    } catch (err) {
      const msg = err.userMessage || 'Could not fetch video info'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // --- Single video from playlist ---
  const handleSelectSingleFromPlaylist = async (entry) => {
    setLoading(true)
    setPlaylistInfo(null)
    setVideoInfo(null)
    if (!downloading) {
      setJob(null)
      setJobId(null)
      setDownloadUrl(null)
    }
    setError(null)

    try {
      const res = await getSingleVideoInfo(entry.url)
      setVideoInfo({ ...res.data, url: entry.url })
      toast.success('Video loaded!')
    } catch (err) {
      const msg = err.userMessage || 'Could not load video info'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // --- Reload from history ---
  const handleReload = (item) => {
    handleSearch(item.url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- Single video download ---
  const handleDownload = async () => {
    if (!selectedOptions || !videoInfo) {
      toast.error('Please select a format first')
      return
    }

    setDownloading(true)
    setJob({ status: 'queued', percent: 0 })
    setDownloadUrl(null)
    setError(null)

    try {
      const res = await startDownload({
        url: videoInfo.url,
        title: videoInfo.title,
        ...selectedOptions,
      })

      const id = res.data.job_id
      setJobId(id)
      toast.success('Download started!')

      addToHistory({
        url: videoInfo.url,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        format_type: selectedOptions.format_type,
        ext: selectedOptions.convert_to || selectedOptions.ext,
      })

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await getDownloadStatus(id)
          const data = statusRes.data
          setJob(data)

          if (data.status === 'done') {
            clearInterval(pollRef.current)
            setDownloading(false)
            const fileUrl = getFileUrl(id)
            setDownloadUrl(fileUrl)
            toast.success('Download complete!')

            // Auto-trigger the file save
            const link = document.createElement('a')
            link.href = fileUrl
            link.download = ''
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else if (data.status === 'error') {
            clearInterval(pollRef.current)
            setDownloading(false)
            const msg = data.error || 'Download failed'
            setError(msg)
            toast.error(msg)
          }
        } catch (err) {
          clearInterval(pollRef.current)
          setDownloading(false)
          const msg = err.userMessage || 'Lost connection to server'
          setError(msg)
          toast.error(msg)
        }
      }, 1500)

    } catch (err) {
      const msg = err.userMessage || 'Failed to start download'
      setError(msg)
      toast.error(msg)
      setDownloading(false)
      setJob(null)
    }
  }

  // --- Playlist download ---
  const handlePlaylistDownload = async (options) => {
    setDownloading(true)
    setPlaylistJob({
      status: 'queued',
      percent: 0,
      total_videos: options.entries.length,
      completed_videos: 0
    })
    setError(null)

    try {
      const res = await startPlaylistDownload(options)
      const id = res.data.job_id
      toast.success(`Downloading ${options.entries.length} videos...`)

      options.entries.forEach((entry) => {
        addToHistory({
          url: entry.url,
          title: entry.title,
          thumbnail: entry.thumbnail,
          format_type: options.format_type,
          ext: options.convert_to || options.ext,
        })
      })

      playlistPollRef.current = setInterval(async () => {
        try {
          const statusRes = await getDownloadStatus(id)
          const data = statusRes.data
          setPlaylistJob(data)

          if (data.status === 'done') {
            clearInterval(playlistPollRef.current)
            setDownloading(false)
            toast.success(`Done! ${data.completed_videos} videos downloaded`)
          } else if (data.status === 'error') {
            clearInterval(playlistPollRef.current)
            setDownloading(false)
            toast.error('Playlist download failed')
          }
        } catch (err) {
          clearInterval(playlistPollRef.current)
          setDownloading(false)
          toast.error('Lost connection to server')
        }
      }, 2000)

    } catch (err) {
      const msg = err.userMessage || 'Failed to start playlist download'
      setError(msg)
      toast.error(msg)
      setDownloading(false)
      setPlaylistJob(null)
    }
  }

  return (
    <div className="min-h-screen bg-brand-darker">
      <Header />

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-text mb-3 tracking-tight leading-tight">
            Download Anything,{' '}
            <span className="text-brand-red">Instantly</span>
          </h1>
          <p className="text-brand-subtext text-sm sm:text-base max-w-xl mx-auto px-2">
            Paste any video, audio, or playlist URL and get it in any format.
          </p>
        </motion.div>

        {/* Server waking banner */}
        {serverWaking && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-brand-card
                       border border-brand-border flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse shrink-0" />
            <p className="text-brand-subtext text-sm">
              Server is starting up, this may take a moment...
            </p>
          </motion.div>
        )}

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 px-4 py-3 rounded-xl bg-red-900/20
                       border border-red-700/40 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2">
              <span className="text-brand-red text-lg leading-none mt-0.5">⚠</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-brand-muted hover:text-brand-text transition-colors shrink-0 text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Skeleton */}
        {loading && <SkeletonLoader />}

        {/* Playlist view */}
        {playlistInfo && !loading && (
          <>
            <PlaylistView
              playlist={playlistInfo}
              onDownloadSelected={handlePlaylistDownload}
              onSelectSingle={handleSelectSingleFromPlaylist}
              loading={downloading}
            />
            <PlaylistProgress job={playlistJob} />
          </>
        )}

        {/* Single video view */}
        {videoInfo && !loading && (
          <>
            <VideoCard info={videoInfo} />
            <FormatSelector
              formats={videoInfo.formats}
              subtitles={videoInfo.subtitles}
              onChange={setSelectedOptions}
            />

            {selectedOptions && !job && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-4"
              >
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
                             bg-brand-red hover:bg-brand-redHover text-white font-bold text-base
                             red-glow transition-all duration-200 active:scale-95"
                >
                  Download Now
                </button>
              </motion.div>
            )}

            <ProgressBar job={job} />
            <DownloadButton job={job} downloadUrl={downloadUrl} />

            {/* New download button */}
            {job && (job.status === 'done' || job.status === 'error') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-3"
              >
                <button
                  onClick={() => {
                    setJob(null)
                    setJobId(null)
                    setDownloadUrl(null)
                    setSelectedOptions(null)
                    setVideoInfo(null)
                    setError(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="w-full py-3 rounded-2xl border border-brand-border
                             text-brand-muted hover:text-brand-text hover:border-brand-red/40
                             text-sm font-semibold transition-all duration-200"
                >
                  ＋ Start a New Download
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Download History */}
        <DownloadHistory
          history={history}
          onRemove={removeFromHistory}
          onClear={clearHistory}
          onReload={handleReload}
        />

      </main>

      <footer className="text-center text-brand-muted text-xs py-6 border-t border-brand-border mt-8 px-4 w-full">
        Rophyl Tube Downloader · Powered by{' '}
        <span className="text-brand-red font-semibold">Rophyl by Curtis</span>
        {' '}· Built by{' '}
        <span className="text-brand-red font-semibold">25RCodes</span>
      </footer>

      <InstallPrompt />
    </div>
  )
}