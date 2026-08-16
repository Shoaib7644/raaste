"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PresenceMessage, Realtime, RealtimeChannel } from 'ably'
import { useMusicPlayer } from '../lib/MusicPlayerContext'

const CHANNEL_NAME = 'raaste:listeners'
const HEARTBEAT_INTERVAL_MS = 25 * 1000
const PRESENCE_EXPIRY_MS = 55 * 1000
const SESSION_ID_STORAGE_KEY = 'raaste.listenerSessionId'
const CLIENT_ID_PATTERN = /^raaste-listener-[a-zA-Z0-9_-]{16,80}$/

type ListenerPresenceData = {
  status: 'listening'
  lastSeen: number
}

function createClientId() {
  try {
    const storedId = window.sessionStorage.getItem(SESSION_ID_STORAGE_KEY)
    if (storedId && CLIENT_ID_PATTERN.test(storedId)) {
      return storedId
    }
  } catch {
    // Session storage is only an anti-duplicate convenience across refreshes.
  }

  const randomId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36)

  const clientId = `raaste-listener-${randomId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  try {
    window.sessionStorage.setItem(SESSION_ID_STORAGE_KEY, clientId)
  } catch {
    // A fresh in-memory ID still works when storage is unavailable.
  }

  return clientId
}

function isFreshListener(member: PresenceMessage, now: number) {
  const data = member.data as Partial<ListenerPresenceData> | undefined

  return (
    data?.status === 'listening' &&
    typeof data.lastSeen === 'number' &&
    now - data.lastSeen <= PRESENCE_EXPIRY_MS
  )
}

export default function ActiveListenerCount() {
  const { isPlaying, playerState } = useMusicPlayer()
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [listenerCount, setListenerCount] = useState<number | null>(null)
  const clientIdRef = useRef('')
  const realtimeRef = useRef<Realtime | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const heartbeatRef = useRef<number | null>(null)
  const enteredRef = useRef(false)
  const subscribedRef = useRef(false)
  const setupPromiseRef = useRef<Promise<RealtimeChannel> | null>(null)
  const shouldBePresentRef = useRef(false)

  useEffect(() => {
    const syncVisibility = () => setIsPageVisible(!document.hidden)

    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    window.addEventListener('focus', syncVisibility)
    window.addEventListener('blur', syncVisibility)

    return () => {
      document.removeEventListener('visibilitychange', syncVisibility)
      window.removeEventListener('focus', syncVisibility)
      window.removeEventListener('blur', syncVisibility)
    }
  }, [])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  const refreshCount = useCallback(async () => {
    const channel = channelRef.current
    if (!channel) return

    try {
      const members = await channel.presence.get({ waitForSync: true })
      const now = Date.now()
      const activeListeners = new Set(
        members
          .filter((member) => isFreshListener(member, now))
          .map((member) => member.clientId)
      )

      setListenerCount(activeListeners.size > 0 ? activeListeners.size : null)
    } catch {
      setListenerCount(null)
    }
  }, [])

  const ensureChannel = useCallback(async () => {
    if (channelRef.current) {
      return channelRef.current
    }

    if (setupPromiseRef.current) {
      return setupPromiseRef.current
    }

    setupPromiseRef.current = (async () => {
      if (!clientIdRef.current) {
        clientIdRef.current = createClientId()
      }

      const Ably = await import('ably')
      const realtime = new Ably.Realtime({
        authMethod: 'GET',
        authUrl: `/api/ably-token?clientId=${encodeURIComponent(clientIdRef.current)}`,
        clientId: clientIdRef.current,
        autoConnect: false,
        transportParams: {
          remainPresentFor: PRESENCE_EXPIRY_MS,
        },
      })

      realtime.connection.on((stateChange) => {
        if (['failed', 'suspended', 'closed'].includes(stateChange.current)) {
          enteredRef.current = false
          stopHeartbeat()
          setListenerCount(null)
        }
      })

      const channel = realtime.channels.get(CHANNEL_NAME)
      realtimeRef.current = realtime
      channelRef.current = channel
      realtime.connect()

      return channel
    })()

    try {
      return await setupPromiseRef.current
    } finally {
      setupPromiseRef.current = null
    }
  }, [stopHeartbeat])

  const leavePresence = useCallback(async () => {
    stopHeartbeat()

    const channel = channelRef.current
    if (!channel) {
      enteredRef.current = false
      setListenerCount(null)
      return
    }

    try {
      if (enteredRef.current) {
        await channel.presence.leave({ status: 'stopped', lastSeen: Date.now() })
      }
    } catch {
      // Presence is best-effort; the player should never depend on it.
    } finally {
      enteredRef.current = false
      setListenerCount(null)
      await refreshCount()
    }
  }, [refreshCount, stopHeartbeat])

  const joinPresence = useCallback(async () => {
    try {
      const channel = await ensureChannel()

      if (!shouldBePresentRef.current) return

      if (!subscribedRef.current) {
        await channel.presence.subscribe(['enter', 'leave', 'update'], () => {
          void refreshCount()
        })
        subscribedRef.current = true
      }

      const data: ListenerPresenceData = {
        status: 'listening',
        lastSeen: Date.now(),
      }

      if (enteredRef.current) {
        await channel.presence.update(data)
      } else {
        await channel.presence.enter(data)
        enteredRef.current = true
      }

      await refreshCount()

      if (!heartbeatRef.current) {
        heartbeatRef.current = window.setInterval(() => {
          const currentChannel = channelRef.current

          if (!currentChannel || !enteredRef.current || !shouldBePresentRef.current) {
            void leavePresence()
            return
          }

          currentChannel.presence
            .update({ status: 'listening', lastSeen: Date.now() } satisfies ListenerPresenceData)
            .then(refreshCount)
            .catch(() => {
              enteredRef.current = false
              stopHeartbeat()
              setListenerCount(null)
            })
        }, HEARTBEAT_INTERVAL_MS)
      }
    } catch {
      enteredRef.current = false
      stopHeartbeat()
      setListenerCount(null)
    }
  }, [ensureChannel, leavePresence, refreshCount, stopHeartbeat])

  useEffect(() => {
    const handlePageExit = () => {
      shouldBePresentRef.current = false
      void leavePresence()
      realtimeRef.current?.close()
    }

    window.addEventListener('pagehide', handlePageExit)
    window.addEventListener('beforeunload', handlePageExit)

    return () => {
      window.removeEventListener('pagehide', handlePageExit)
      window.removeEventListener('beforeunload', handlePageExit)
      handlePageExit()
    }
  }, [leavePresence])

  useEffect(() => {
    const playingState = typeof window !== 'undefined' ? window.YT?.PlayerState?.PLAYING ?? 1 : 1
    const shouldBePresent = isPlaying && playerState === playingState && isPageVisible
    shouldBePresentRef.current = shouldBePresent

    const presenceTimer = window.setTimeout(() => {
      if (shouldBePresentRef.current) {
        void joinPresence()
      } else {
        void leavePresence()
      }
    }, 0)

    return () => window.clearTimeout(presenceTimer)
  }, [isPageVisible, isPlaying, joinPresence, leavePresence, playerState])

  if (!listenerCount) {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute -top-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold tracking-[0.08em] text-print-paper/72 sm:-top-7 sm:text-xs"
      aria-live="polite"
    >
      <span className="mr-1 text-[10px] text-[rgba(112,141,89,0.92)]" aria-hidden="true">
        ●
      </span>
      {listenerCount} listening
    </div>
  )
}
