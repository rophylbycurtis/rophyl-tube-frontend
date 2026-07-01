import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds to handle cold starts
})

// Response interceptor — clean up error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage = error.code === 'ECONNABORTED'
        ? 'Server is waking up, please try again in a moment...'
        : 'Cannot connect to server. Please try again in a moment.'
    } else {
      const detail = error.response?.data?.detail || ''

      if (error.response.status === 429) {
        error.userMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (detail.includes('Video unavailable')) {
        error.userMessage = 'This video is unavailable or has been removed.'
      } else if (detail.includes('Private video')) {
        error.userMessage = 'This video is private and cannot be downloaded.'
      } else if (detail.includes('age')) {
        error.userMessage = 'This video is age-restricted and requires sign-in.'
      } else if (detail.includes('copyright') || detail.includes('blocked')) {
        error.userMessage = 'This video is blocked due to copyright restrictions.'
      } else if (detail.includes('live')) {
        error.userMessage = 'Live streams cannot be downloaded while broadcasting.'
      } else if (detail.includes('does not exist') || detail.includes('not exist')) {
        error.userMessage = 'This playlist or video does not exist.'
      } else if (detail.includes('blocking') || detail.includes('bot') || detail.includes('Sign in')) {
        error.userMessage = detail
      } else if (detail.includes('Unable to extract')) {
        error.userMessage = 'Could not extract video info. The URL may not be supported.'
      } else if (error.response.status === 404) {
        error.userMessage = 'Resource not found.'
      } else if (error.response.status === 500) {
        error.userMessage = 'Server error. Please try again.'
      } else {
        error.userMessage = detail || 'Something went wrong. Please try again.'
      }
    }

    return Promise.reject(error)
  }
)

export const getVideoInfo = (url) =>
  api.post('/api/info/', { url })

export const getSingleVideoInfo = (url) =>
  api.post('/api/info/video', { url })

export const startDownload = (payload) =>
  api.post('/api/download/start', payload)

export const startPlaylistDownload = (payload) =>
  api.post('/api/download/playlist', payload)

export const getDownloadStatus = (jobId) =>
  api.get(`/api/download/status/${jobId}`)

export const getFileUrl = (jobId) =>
  `${BASE_URL}/api/download/file/${jobId}`

export default api