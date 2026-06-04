import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle2, Check } from 'lucide-react'

export default function DownloadButton({ job, downloadUrl }) {
  const [saved, setSaved] = useState(false)

  if (!job || job.status !== 'done' || !downloadUrl) return null

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    textDecoration: 'none',
  }

  const linkStyle = { ...baseStyle, backgroundColor: '#E8001D', cursor: 'pointer' }
  const savedStyle = { ...baseStyle, backgroundColor: '#16a34a', cursor: 'default', opacity: 0.8 }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl mx-auto mt-4">
        {saved ? (
          <div style={savedStyle}>
            <Check size={20} />
            Saved to Device
          </div>
        ) : (
          <a href={downloadUrl} download style={linkStyle} onClick={() => setSaved(true)}>
            <CheckCircle2 size={20} />
            Save to Device
            <Download size={20} />
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  )
}