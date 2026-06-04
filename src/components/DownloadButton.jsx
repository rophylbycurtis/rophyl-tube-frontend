import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle2 } from 'lucide-react'

export default function DownloadButton({ job, downloadUrl }) {
  if (!job || job.status !== 'done' || !downloadUrl) return null

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    backgroundColor: '#E8001D',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    textDecoration: 'none',
    cursor: 'pointer',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl mx-auto mt-4"
      >
        <a href={downloadUrl} download style={linkStyle}>
          <CheckCircle2 size={20} />
          Save to Device
          <Download size={20} />
        </a>
      </motion.div>
    </AnimatePresence>
  )
}