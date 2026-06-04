import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setVisible(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setVisible(false)
    }
    setPrompt(null)
  }

  if (installed || !visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50"
      >
        <div className="bg-brand-card border border-brand-red/30 rounded-2xl p-4
                        shadow-2xl red-glow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center
                            justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-brand-text text-sm font-semibold">
                Install Rophyl Tube
              </p>
              <p className="text-brand-subtext text-xs mt-0.5">
                Add to your home screen for quick access — works offline too.
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                             bg-brand-red hover:bg-brand-redHover text-white
                             text-xs font-semibold transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App
                </button>
                <button
                  onClick={() => setVisible(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border
                             text-brand-muted hover:text-brand-text text-xs
                             font-semibold transition-all"
                >
                  Not now
                </button>
              </div>
            </div>

            <button
              onClick={() => setVisible(false)}
              className="text-brand-muted hover:text-brand-text transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}