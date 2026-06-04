import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rophyl_download_history'
const MAX_HISTORY = 20

export function useDownloadHistory() {
  const [history, setHistory] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {
      setHistory([])
    }
  }, [])

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const updated = [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        },
        ...prev.filter((h) => h.url !== entry.url), // avoid exact duplicates
      ].slice(0, MAX_HISTORY)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const removeFromHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }

  return { history, addToHistory, removeFromHistory, clearHistory }
}