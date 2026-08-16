// Load the YouTube IFrame Player API asynchronously
declare global {
  interface Window {
    YT: any
    youtubeLoading: boolean
    youtubeAPIPromise?: Promise<void>
    ytPlayer?: any
  }
}

export function loadYouTubeAPI(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube API can only load in the browser'))
  }

  if (window.YT?.Player) {
    window.YT.loaded = true
    return Promise.resolve()
  }

  if (window.youtubeAPIPromise) {
    return window.youtubeAPIPromise
  }

  window.youtubeAPIPromise = new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.YT?.Player) {
      window.YT.loaded = true
      resolve()
      return
    }

    window.youtubeLoading = true

    // Callback when API is ready
    const previousCallback = (window as any).onYouTubeIframeAPIReady
    ;(window as any).onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') {
        previousCallback()
      }
      window.youtubeLoading = false
      if (window.YT) {
        window.YT.loaded = true
      }
      resolve()
    }

    const existingTag = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]')
    if (existingTag) {
      const interval = window.setInterval(() => {
        if (window.YT?.Player) {
          window.clearInterval(interval)
          window.youtubeLoading = false
          window.YT.loaded = true
          resolve()
        }
      }, 50)
      return
    }

    // Create script tag
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true

    // Handle error
    tag.onerror = () => {
      window.youtubeLoading = false
      window.youtubeAPIPromise = undefined
      reject(new Error('Failed to load YouTube API'))
    }

    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
  })

  return window.youtubeAPIPromise
}

// Helper to get the YouTube player instance (if needed)
export function getYouTubePlayer(): any {
  return (window as any).ytPlayer
}
