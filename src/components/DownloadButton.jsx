import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle2 } from 'lucide-react'

export default function DownloadButton({ job, downloadUrl }) {
  if (!job || job.status !== 'done' || !downloadUrl) return null

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px',
    borderRadius: '16px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    border: '1px solid #1e1e2e',
    cursor: 'pointer',
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl mx-auto mt-3">
        <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold mb-3">
          <CheckCircle2 size={18} />
          File saved to your device
        </div>
        <a href={downloadUrl} download style={baseStyle}>
          <Download size={16} />
          Download again
        </a>
      </motion.div>
    </AnimatePresence>
  )
}