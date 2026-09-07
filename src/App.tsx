import { useState, useEffect, useRef, useCallback } from "react"
import {
  days,
  type DayId,
  type DayData,
  type Song,
  type ThemeImage,
} from "./data/agomoni"

type YouTubePlayer = {
  cueVideoById: (videoId: string) => void
  loadVideoById: (videoId: string) => void
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  mute: () => void
  unMute: () => void
  getCurrentTime: () => number
  getDuration: () => number
  destroy: () => void
}

type YouTubePlayerEvent = { target: YouTubePlayer }
type YouTubePlayerStateEvent = YouTubePlayerEvent & { data: number }

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      width: string
      height: string
      playerVars: Record<string, string | number>
      events: {
        onReady: (event: YouTubePlayerEvent) => void
        onStateChange: (event: YouTubePlayerStateEvent) => void
        onError: () => void
        onAutoplayBlocked: () => void
      }
    },
  ) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<YouTubeNamespace> | null = null

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise<YouTubeNamespace>((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.()
      if (window.YT?.Player) resolve(window.YT)
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    )

    if (existingScript) {
      existingScript.addEventListener(
        "error",
        () => reject(new Error("YouTube API failed to load")),
        {
          once: true,
        },
      )
      return
    }

    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    script.addEventListener(
      "error",
      () => reject(new Error("YouTube API failed to load")),
      {
        once: true,
      },
    )
    document.head.appendChild(script)
  }).catch((error) => {
    youtubeApiPromise = null
    throw error
  })

  return youtubeApiPromise
}

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, "")

    if (hostname === "youtu.be")
      return parsed.pathname.split("/").filter(Boolean)[0] ?? null
    if (hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v")
      const [, route, videoId] = parsed.pathname.split("/")
      if (["embed", "shorts", "live"].includes(route)) return videoId || null
    }
  } catch {
    return null
  }

  return null
}

function formatPlayerTime(seconds: number, fallback = "0:00") {
  if (!Number.isFinite(seconds) || seconds < 0) return fallback
  const wholeSeconds = Math.floor(seconds)
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconPlay({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}
function IconPause({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}
function IconSkipBack({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="19,20 9,12 19,4" />
      <rect x="5" y="4" width="2" height="16" rx="1" />
    </svg>
  )
}
function IconSkipForward({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,4 15,12 5,20" />
      <rect x="17" y="4" width="2" height="16" rx="1" />
    </svg>
  )
}
function IconVolume({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
      <path d="M19.07,4.93a10,10,0,0,1,0,14.14" />
      <path d="M15.54,8.46a5,5,0,0,1,0,7.07" />
    </svg>
  )
}
function IconChevronUp({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="18,15 12,9 6,15" />
    </svg>
  )
}
function IconChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  )
}
function IconSound({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    )
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
      <path d="M19.07,4.93a10,10,0,0,1,0,14.14" />
      <path d="M15.54,8.46a5,5,0,0,1,0,7.07" />
    </svg>
  )
}
function IconMenu() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
function IconClose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconExternal({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

// ── Review Badge ─────────────────────────────────────────────────────────────

function ReviewBadge() {
  return (
    <span
      className="pill inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{
        background: "rgba(255,160,0,0.18)",
        color: "#FFB300",
        border: "1px solid rgba(255,160,0,0.3)",
      }}
    >
      ⚠ NEEDS REVIEW
    </span>
  )
}

// ── Responsive Header ─────────────────────────────────────────────────────────

function Header({
  activeDay,
  onDayChange,
  muted,
  onToggleMute,
}: {
  activeDay: DayData
  onDayChange: (id: DayId) => void
  muted: boolean
  onToggleMute: () => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [open])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-6 md:px-12 pointer-events-auto"
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
      }}
    >
      {/* Brand & Chapter Indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className="bengali font-bold tracking-wide select-none"
          style={{
            fontSize: "clamp(20px, 4vw, 24px)",
            color: "#F2EDE6",
            textShadow: "0 2px 16px rgba(0,0,0,0.7)",
          }}
        >
          আগমনী
        </span>
        <span
          className="pill hidden xs:inline-block px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(242,237,230,0.5)",
            fontSize: 9,
          }}
        >
          AGOMONI
        </span>
        <span
          className="pill sm:hidden px-2 py-0.5 rounded-full font-bold"
          style={{
            color: activeDay.accent,
            background: `rgba(${hexToRgb(activeDay.accent)},0.14)`,
            border: `1px solid ${activeDay.accent}44`,
            fontSize: 9,
          }}
        >
          {String(activeDay.seq).padStart(2, "0")}/05
        </span>
      </div>

      {/* Right Controls Group */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Theme / Day Selector */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="theme-switch-pill flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2"
            aria-expanded={open}
            aria-controls="theme-menu"
          >
            <span
              className="pill font-bold"
              style={{
                color: "#fff",
                fontSize: "clamp(9px, 2.2vw, 10px)",
                letterSpacing: "0.1em",
              }}
            >
              <span className="hidden sm:inline">
                {String(activeDay.seq).padStart(2, "0")} —{" "}
                {activeDay.name.toUpperCase()}
              </span>
              <span className="sm:hidden">{activeDay.name.toUpperCase()}</span>
            </span>
            <span style={{ color: activeDay.accent }}>
              <IconChevronDown size={12} />
            </span>
          </button>

          {open && (
            <div
              id="theme-menu"
              className="theme-menu absolute top-full mt-2 right-0 rounded-2xl p-1.5 sm:p-2 flex flex-col shadow-2xl z-50"
              style={{ width: "min(280px, calc(100vw - 24px))" }}
            >
              {days.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onDayChange(d.id)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between text-left rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors"
                  style={{
                    fontSize: 11,
                    letterSpacing: ".12em",
                    color:
                      d.id === activeDay.id
                        ? activeDay.accent
                        : "rgba(242,237,230,.64)",
                    fontWeight: d.id === activeDay.id ? 700 : 500,
                    background:
                      d.id === activeDay.id
                        ? `rgba(${hexToRgb(activeDay.accent)},.12)`
                        : "transparent",
                  }}
                >
                  <span className="truncate">
                    {String(d.seq).padStart(2, "0")} — {d.name.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      opacity: d.id === activeDay.id ? 1 : 0,
                      color: activeDay.accent,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    CURRENT
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live counter */}
        <div
          className="glass flex h-8 sm:h-9 min-w-8 sm:min-w-9 items-center justify-center gap-1.5 rounded-full px-2 sm:px-2.5"
          aria-label="1 user online"
          title="1 user online"
        >
          <span
            className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 9px rgba(52,211,153,0.9)" }}
            aria-hidden="true"
          />
          <span
            style={{
              color: "rgba(242,237,230,0.82)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            1
          </span>
        </div>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={onToggleMute}
          className="glass flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-colors active:scale-95"
          style={{ color: muted ? "rgba(242,237,230,0.42)" : activeDay.accent }}
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          <IconSound muted={muted} />
        </button>
      </div>
    </header>
  )
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "200,169,110"
}

// ── Vertical Day Control ──────────────────────────────────────────────────────

function DayControl({
  activeDay,
  onDayChange,
}: {
  activeDay: DayData
  onDayChange: (id: DayId) => void
}) {
  return (
    <div
      className="fixed right-6 top-1/2 z-40 flex flex-col items-end gap-4 hidden md:flex"
      style={{ transform: "translateY(-50%)" }}
    >
      {days.map((d) => {
        const isActive = d.id === activeDay.id
        return (
          <button
            key={d.id}
            onClick={() => onDayChange(d.id)}
            className="flex items-center gap-2.5 group transition-all duration-300"
            aria-label={`Go to ${d.name}`}
          >
            <span
              className="transition-all duration-300"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? activeDay.accent : "rgba(242,237,230,0.30)",
                opacity: isActive ? 1 : 0,
              }}
            >
              {String(d.seq).padStart(2, "0")} — {d.name.toUpperCase()}
            </span>
            <div className="flex flex-col items-center" style={{ gap: 2 }}>
              <div
                className="transition-all duration-500"
                style={{
                  width: isActive ? 2 : 1,
                  height: isActive ? 28 : 0,
                  background: activeDay.accent,
                  borderRadius: 2,
                  opacity: isActive ? 0.9 : 0,
                }}
              />
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 8 : 5,
                  height: isActive ? 8 : 5,
                  background: isActive
                    ? activeDay.accent
                    : "rgba(242,237,230,0.30)",
                  boxShadow: isActive
                    ? `0 0 8px ${activeDay.accent}88`
                    : "none",
                }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Info Pills ────────────────────────────────────────────────────────────────

function InfoPills({
  day,
  image,
  index,
}: {
  day: DayData
  image: ThemeImage
  index: number
}) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <Pill label={`IMAGE ${String(index + 1).padStart(2, "0")} / 05`} />
      <Pill label={image.usage} />
      <Pill
        label={`${day.songs.filter((song) => song.status !== "DUPLICATE").length} SONGS`}
      />
      <Pill label={image.id.toUpperCase()} />
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span
      className="pill px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px]"
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(242,237,230,0.60)",
      }}
    >
      {label}
    </span>
  )
}

// ── Floating Image Cards ──────────────────────────────────────────────────────

function FloatingCards({ day }: { day: DayData }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      {/* Secondary image card */}
      <button
        onClick={() => setLightbox(day.secondaryUrl)}
        className="absolute bottom-36 right-8 md:bottom-44 md:right-24 z-30 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.03]"
        style={{
          width: 140,
          height: 190,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "#111",
        }}
        aria-label="View secondary image"
      >
        <img
          src={day.secondaryUrl}
          alt={`${day.name} — ${day.secondaryImageId}`}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end p-2"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)",
          }}
        >
          <span className="pill" style={{ color: "rgba(242,237,230,0.70)" }}>
            {day.secondaryImageId}
          </span>
        </div>
      </button>

      {/* Music artwork card */}
      <div
        className="absolute top-28 right-8 md:top-32 md:right-24 z-30 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          width: 80,
          height: 80,
          border: `1px solid ${day.accent}44`,
          background: "#111",
        }}
      >
        <img
          src={day.artworkUrl}
          alt={`Music artwork — ${day.musicArtworkId}`}
          className="w-full h-full object-cover"
        />
        {/* NEEDS REVIEW badge overlay for screenshot art */}
        <div
          className="absolute inset-0 flex items-end justify-center p-1"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
          }}
        >
          <span
            className="pill"
            style={{ fontSize: 8, color: "rgba(242,237,230,0.55)" }}
          >
            ARTWORK
          </span>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Enlarged view"
            className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-6 rounded-full p-2 glass"
            onClick={() => setLightbox(null)}
            style={{ color: "rgba(242,237,230,0.80)" }}
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
      )}
    </>
  )
}

// ── Music Player ──────────────────────────────────────────────────────────────

function MusicPlayer({
  day,
  muted,
  onAutoplayFallback,
}: {
  day: DayData
  muted: boolean
  onAutoplayFallback: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerReady, setPlayerReady] = useState(false)
  const [playbackMessage, setPlaybackMessage] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playerHostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const shouldPlayRef = useRef(false)
  const autoplayFallbackAttemptedRef = useRef(false)

  const songs = day.songs.filter((s) => s.status !== "DUPLICATE")
  const current = songs[trackIdx] ?? songs[0]
  const currentVideoId = current ? getYouTubeVideoId(current.url) : null
  const songCountRef = useRef(songs.length)
  songCountRef.current = songs.length

  useEffect(() => {
    let cancelled = false

    loadYouTubeApi()
      .then((youtube) => {
        if (cancelled || !playerHostRef.current) return

        playerRef.current = new youtube.Player(playerHostRef.current, {
          width: "356",
          height: "200",
          playerVars: {
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return
              playerRef.current = event.target
              if (muted) event.target.mute()
              setPlayerReady(true)
            },
            onStateChange: (event) => {
              if (event.data === 1) {
                shouldPlayRef.current = true
                setPlaying(true)
                setPlaybackMessage(null)
              } else if (event.data === 2 || event.data === 5) {
                shouldPlayRef.current = false
                setPlaying(false)
              } else if (event.data === 0) {
                setPlaying(false)
                if (songCountRef.current > 1) {
                  shouldPlayRef.current = true
                  setTrackIdx((index) => (index + 1) % songCountRef.current)
                } else {
                  shouldPlayRef.current = false
                }
              }

              const nextDuration = event.target.getDuration()
              const nextElapsed = event.target.getCurrentTime()
              if (Number.isFinite(nextDuration) && nextDuration > 0)
                setDuration(nextDuration)
              if (Number.isFinite(nextElapsed) && nextElapsed >= 0)
                setElapsed(nextElapsed)
            },
            onError: () => {
              shouldPlayRef.current = false
              setPlaying(false)
              setPlaybackMessage(
                "This mapped YouTube track is currently unavailable.",
              )
            },
            onAutoplayBlocked: () => {
              if (!autoplayFallbackAttemptedRef.current) {
                autoplayFallbackAttemptedRef.current = true
                shouldPlayRef.current = true
                onAutoplayFallback()
                playerRef.current?.mute()
                playerRef.current?.playVideo()
                setPlaybackMessage(
                  "Autoplay started muted. Use the speaker button for sound.",
                )
                return
              }

              shouldPlayRef.current = false
              setPlaying(false)
              setPlaybackMessage(
                "Playback was blocked by the browser. Press play to try again.",
              )
            },
          },
        })
      })
      .catch(() => {
        if (!cancelled)
          setPlaybackMessage(
            "YouTube could not be loaded. Check your connection and try again.",
          )
      })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
    // The YouTube player is created once; track and mute changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    autoplayFallbackAttemptedRef.current = false
    shouldPlayRef.current = true
    setTrackIdx(0)
    setProgress(0)
    setElapsed(0)
    setDuration(0)
    setPlaying(false)
    setPlaybackMessage(null)
  }, [day.id])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !playerReady || !currentVideoId) return

    setProgress(0)
    setElapsed(0)
    setDuration(0)
    setPlaybackMessage(null)

    if (shouldPlayRef.current) player.loadVideoById(currentVideoId)
    else player.cueVideoById(currentVideoId)
  }, [currentVideoId, playerReady])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !playerReady) return
    if (muted) player.mute()
    else player.unMute()
  }, [muted, playerReady])

  useEffect(() => {
    if (playing) {
      const syncProgress = () => {
        const player = playerRef.current
        if (!player) return
        const nextElapsed = player.getCurrentTime()
        const nextDuration = player.getDuration()

        if (Number.isFinite(nextElapsed) && nextElapsed >= 0)
          setElapsed(nextElapsed)
        if (Number.isFinite(nextDuration) && nextDuration > 0) {
          setDuration(nextDuration)
          setProgress(
            Math.min(100, Math.max(0, (nextElapsed / nextDuration) * 100)),
          )
        }
      }

      syncProgress()
      intervalRef.current = setInterval(() => {
        syncProgress()
      }, 500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing])

  const selectTrack = (index: number, startPlaying = shouldPlayRef.current) => {
    if (!songs.length) return
    shouldPlayRef.current = startPlaying
    setPlaybackMessage(null)

    if (index === trackIdx) {
      if (startPlaying && playerReady && playerRef.current)
        playerRef.current.playVideo()
      else if (startPlaying) setPlaybackMessage("Loading the YouTube player…")
      return
    }

    setTrackIdx(index)
  }

  const prev = () => selectTrack((trackIdx - 1 + songs.length) % songs.length)
  const next = () => selectTrack((trackIdx + 1) % songs.length)

  const togglePlayback = () => {
    if (!currentVideoId) {
      setPlaybackMessage("This song does not have a valid YouTube URL.")
      return
    }

    if (!playerReady || !playerRef.current) {
      shouldPlayRef.current = true
      setPlaybackMessage("Loading the YouTube player…")
      return
    }

    setPlaybackMessage(null)
    if (playing) {
      shouldPlayRef.current = false
      playerRef.current.pauseVideo()
    } else {
      shouldPlayRef.current = true
      playerRef.current.playVideo()
    }
  }

  const elapsedStr = formatPlayerTime(elapsed)
  const durationStr = duration > 0 ? formatPlayerTime(duration) : "--:--"

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          width: 356,
          height: 200,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <div ref={playerHostRef} />
      </div>

      <div
        className="fixed left-1/2 z-50 rounded-2xl shadow-2xl transition-all duration-300 pointer-events-auto"
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom))",
          transform: "translateX(-50%)",
          background: "rgba(10,8,16,0.86)",
          backdropFilter: "blur(22px) saturate(1.6)",
          WebkitBackdropFilter: "blur(22px) saturate(1.6)",
          border: "1px solid rgba(255,255,255,0.10)",
          width: expanded
            ? "min(420px, calc(100vw - 1.25rem))"
            : "min(350px, calc(100vw - 1.25rem))",
        }}
      >
        {/* Collapsed / main row */}
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3">
          {/* Artwork */}
          <div
            className="relative shrink-0 rounded-xl overflow-hidden shadow"
            style={{ width: 40, height: 40, background: "#222" }}
          >
            <img
              src={day.artworkUrl}
              alt="cover"
              className="w-full h-full object-cover"
            />
            {current?.status === "NEEDS REVIEW" && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                <span style={{ fontSize: 8, color: "#FFB300" }}>⚠</span>
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1 min-w-0">
              <p
                className="truncate"
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#F2EDE6",
                  lineHeight: 1.3,
                }}
              >
                {current?.status === "NEEDS REVIEW" &&
                current.title === "MISSING"
                  ? "— Title Pending Review"
                  : current?.title}
              </p>
              {current?.status === "NEEDS REVIEW" && (
                <span style={{ fontSize: 8, color: "#FFB300", flexShrink: 0 }}>
                  ⚠
                </span>
              )}
            </div>
            <p
              className="truncate"
              style={{
                fontSize: 10,
                color: "rgba(242,237,230,0.48)",
                fontWeight: 500,
              }}
            >
              {current?.artist === "MISSING"
                ? "Artist pending"
                : current?.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <CtrlBtn onClick={prev} label="Previous">
              <IconSkipBack />
            </CtrlBtn>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex items-center justify-center rounded-full transition-all active:scale-95"
              style={{
                width: 34,
                height: 34,
                background: day.accent,
                color: "#0A0B14",
                flexShrink: 0,
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <IconPause size={14} /> : <IconPlay size={14} />}
            </button>
            <CtrlBtn onClick={next} label="Next">
              <IconSkipForward />
            </CtrlBtn>
          </div>

          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 p-1.5 sm:p-2 transition-colors active:scale-90"
            style={{ color: "rgba(242,237,230,0.50)" }}
            aria-label={expanded ? "Collapse player" : "Expand player"}
          >
            {expanded ? <IconChevronDown /> : <IconChevronUp />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-3 pb-2">
          <div
            className="py-2 -my-1.5 cursor-pointer touch-manipulation"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const nextProgress = Math.min(
                100,
                Math.max(0, ((e.clientX - rect.left) / rect.width) * 100),
              )
              setProgress(nextProgress)
              if (duration > 0) {
                const nextElapsed = (nextProgress / 100) * duration
                setElapsed(nextElapsed)
                playerRef.current?.seekTo(nextElapsed, true)
              }
            }}
          >
            <div className="player-progress">
              <div
                className="player-progress-fill"
                style={{ width: `${progress}%`, background: day.accent }}
              />
            </div>
          </div>
          <div
            className="flex justify-between -mt-1"
            style={{
              fontSize: 9,
              color: "rgba(242,237,230,0.35)",
              fontWeight: 500,
            }}
          >
            <span>{elapsedStr}</span>
            <span>{durationStr}</span>
          </div>
          {playbackMessage && (
            <p
              className="mt-1 truncate"
              role="status"
              style={{ fontSize: 9, color: "rgba(255,179,0,0.82)" }}
              title={playbackMessage}
            >
              {playbackMessage}
            </p>
          )}
        </div>

        {/* Expanded playlist */}
        {expanded && (
          <div
            className="max-h-[46dvh] sm:max-h-[50vh] overflow-y-auto overscroll-contain"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="px-3 py-2 flex items-center justify-between sticky top-0 backdrop-blur-md z-10"
              style={{ background: "rgba(10,8,16,0.92)" }}
            >
              <span
                className="pill"
                style={{ color: "rgba(242,237,230,0.45)" }}
              >
                {String(day.seq).padStart(2, "0")} — {day.name.toUpperCase()}{" "}
                PLAYLIST
              </span>
              <IconVolume />
            </div>
            <div className="pb-2">
              {songs.map((song, i) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  index={i}
                  active={i === trackIdx}
                  accent={day.accent}
                  onClick={() => {
                    selectTrack(i, true)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function CtrlBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full transition-colors"
      style={{ color: "rgba(242,237,230,0.55)" }}
      aria-label={label}
    >
      {children}
    </button>
  )
}

function TrackRow({
  song,
  index,
  active,
  accent,
  onClick,
}: {
  song: Song
  index: number
  active: boolean
  accent: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 transition-colors text-left"
      style={{ background: active ? "rgba(255,255,255,0.06)" : "transparent" }}
    >
      <span
        style={{
          fontSize: 10,
          color: active ? accent : "rgba(242,237,230,0.30)",
          fontWeight: 600,
          width: 18,
          flexShrink: 0,
        }}
      >
        {active ? "▶" : String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className="truncate"
            style={{
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              color: active ? "#F2EDE6" : "rgba(242,237,230,0.65)",
            }}
          >
            {song.title === "MISSING" ? "— Pending Review" : song.title}
          </p>
          {song.status === "NEEDS REVIEW" && (
            <span style={{ fontSize: 9, color: "#FFB300", flexShrink: 0 }}>
              ⚠
            </span>
          )}
        </div>
        <p
          className="truncate"
          style={{ fontSize: 10, color: "rgba(242,237,230,0.38)" }}
        >
          {song.artist === "MISSING" ? "Artist TBC" : song.artist}
        </p>
      </div>
      <a
        href={song.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 p-1"
        style={{ color: "rgba(242,237,230,0.30)" }}
        aria-label="Open on YouTube"
      >
        <IconExternal />
      </a>
    </button>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({
  day,
  onDayChange,
}: {
  day: DayData
  onDayChange: (id: DayId) => void
}) {
  const [slideIndex, setSlideIndex] = useState(0)
  const touchStartRef = useRef<{ x: number y: number } | null>(null)
  const currentSlide = day.slides[slideIndex] ?? day.slides[0]

  const moveSlide = useCallback(
    (direction: -1 | 1) => {
      setSlideIndex(
        (index) => (index + direction + day.slides.length) % day.slides.length,
      )
    },
    [day.slides.length],
  )

  return (
    <section
      className="relative w-full h-screen h-[100dvh] overflow-hidden day-scene"
      style={{ background: day.bg }}
      onTouchStart={(event) => {
        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        }
      }}
      onTouchEnd={(event) => {
        if (!touchStartRef.current) return
        const deltaX = event.changedTouches[0].clientX - touchStartRef.current.x
        const deltaY = event.changedTouches[0].clientY - touchStartRef.current.y
        touchStartRef.current = null
        if (
          Math.abs(deltaX) > 40 &&
          Math.abs(deltaX) > Math.abs(deltaY) * 1.3
        ) {
          moveSlide(deltaX < 0 ? 1 : -1)
        }
      }}
    >
      <button
        type="button"
        className="absolute inset-0 z-0 h-full w-full cursor-e-resize overflow-hidden"
        onClick={() => moveSlide(1)}
        aria-label={`View next ${day.name} image`}
      >
        {day.slides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 hero-transition"
            style={{
              opacity: index === slideIndex ? 1 : 0,
              transform: index === slideIndex ? "scale(1)" : "scale(1.025)",
            }}
          >
            <img
              src={slide.url}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
              style={{ opacity: 0.48 }}
            />
            <img
              src={slide.url}
              alt={`${day.name} — ${slide.usage} — ${slide.id}`}
              className={`absolute inset-0 h-full w-full ${
                slide.fit === "contain" ? "object-contain" : "object-cover"
              }`}
            />
          </div>
        ))}

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${day.overlayFrom} 0%, ${day.overlayTo} 46%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.42) 100%)`,
            transition: "background 700ms ease",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 26%, rgba(0,0,0,0.62) 100%)",
          }}
        />
      </button>

      {/* Main Content Area */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col px-4 sm:px-8 md:px-14 pt-16 sm:pt-20 md:pt-16 pb-28 md:pb-36">
        <div className="flex max-w-xl flex-1 flex-col justify-center py-2 sm:py-4">
          <div className="mb-2 sm:mb-3">
            <InfoPills day={day} image={currentSlide} index={slideIndex} />
          </div>

          <h1
            className="bengali leading-none mb-1 sm:mb-2"
            style={{
              fontSize: "clamp(36px, 9vw, 84px)",
              color: "#F2EDE6",
              fontWeight: 700,
              textShadow: "0 4px 32px rgba(0,0,0,0.5)",
            }}
          >
            {day.bengali}
          </h1>
          <h2
            className="leading-none mb-3 sm:mb-5"
            style={{
              fontSize: "clamp(10px, 2.2vw, 15px)",
              letterSpacing: "0.22em",
              color: "rgba(242,237,230,0.55)",
              fontWeight: 600,
            }}
          >
            THE JOURNEY OF MAA DURGA
          </h2>

          {/* Chapter indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-5">
            <div style={{ width: 24, height: 1, background: day.accent }} />
            <span
              className="leading-none"
              style={{
                fontSize: "clamp(10px, 2.2vw, 13px)",
                letterSpacing: "0.22em",
                color: day.accent,
                fontWeight: 700,
              }}
            >
              {String(day.seq).padStart(2, "0")} — {day.name.toUpperCase()}
            </span>
          </div>

          <p
            style={{
              fontSize: "clamp(18px, 4.5vw, 36px)",
              fontWeight: 300,
              color: "rgba(242,237,230,0.90)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {day.theme}
          </p>
          <p
            className="mt-1.5 sm:mt-2"
            style={{
              fontSize: "clamp(10px, 2.2vw, 13px)",
              color: "rgba(242,237,230,0.42)",
              letterSpacing: "0.04em",
            }}
          >
            {day.atmosphere}
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className="pill rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[10px]"
              style={{
                background: day.accent,
                color: "#0A0B14",
                fontWeight: 700,
              }}
            >
              {currentSlide.usage}
            </span>
            <span
              className="pill text-[9px] sm:text-[10px]"
              style={{ color: "rgba(242,237,230,0.58)" }}
            >
              <span className="sm:hidden">SWIPE OR TAP TO EXPLORE</span>
              <span className="hidden sm:inline">CLICK OR USE ARROWS</span>
            </span>
            {currentSlide.needsReview && <ReviewBadge />}
          </div>
        </div>
      </div>

      {/* Desktop Navigation Arrows */}
      <button
        type="button"
        onClick={() => moveSlide(-1)}
        className="theme-arrow theme-arrow-left hidden sm:flex"
        aria-label="Previous image"
      >
        <span aria-hidden>←</span>
        <small>PREVIOUS IMAGE</small>
      </button>
      <button
        type="button"
        onClick={() => moveSlide(1)}
        className="theme-arrow theme-arrow-right hidden sm:flex"
        aria-label="Next image"
      >
        <small>NEXT IMAGE</small>
        <span aria-hidden>→</span>
      </button>

      {/* Desktop Slide Thumbnails & Day Progress Control */}
      <div className="pointer-events-auto absolute bottom-28 left-1/2 z-30 w-[min(92vw,620px)] -translate-x-1/2 hidden md:block">
        <div className="mb-3 flex items-center justify-center gap-3">
          {days.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onDayChange(theme.id)}
              className="flex items-center gap-1.5 transition-all duration-300"
              aria-label={theme.name}
            >
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: theme.id === day.id ? 22 : 6,
                  height: 4,
                  background:
                    theme.id === day.id ? day.accent : "rgba(242,237,230,0.30)",
                }}
              />
              {theme.id === day.id && (
                <span
                  className="pill"
                  style={{ color: day.accent, fontSize: 9 }}
                >
                  {theme.name}
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-2 rounded-2xl p-2"
          style={{
            background: "rgba(8,7,12,0.58)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
          }}
        >
          {day.slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setSlideIndex(index)}
              className="relative overflow-hidden rounded-xl transition-all duration-300"
              style={{
                width: index === slideIndex ? 74 : 52,
                height: 48,
                border:
                  index === slideIndex
                    ? `2px solid ${day.accent}`
                    : "1px solid rgba(255,255,255,0.12)",
                opacity: index === slideIndex ? 1 : 0.62,
              }}
              aria-label={`${day.name} image ${index + 1}: ${slide.usage}`}
              aria-current={index === slideIndex ? "true" : undefined}
            >
              <img
                src={slide.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <span
                className="absolute bottom-1 right-1 rounded-full px-1.5 py-0.5"
                style={{
                  background: "rgba(0,0,0,0.68)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 8,
                  fontWeight: 700,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Slide Navigation: Sleek Segmented Progress Bars & Day Jump */}
      <div className="pointer-events-auto absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 w-[min(92vw,360px)] md:hidden">
        {/* Day Jump Dots */}
        <div className="mb-2 flex items-center justify-center gap-2.5">
          {days.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onDayChange(theme.id)}
              className="p-1 flex items-center"
              aria-label={`Jump to ${theme.name}`}
            >
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: theme.id === day.id ? 16 : 5,
                  height: 4,
                  background:
                    theme.id === day.id ? day.accent : "rgba(242,237,230,0.28)",
                  boxShadow:
                    theme.id === day.id ? `0 0 8px ${day.accent}88` : "none",
                }}
              />
            </button>
          ))}
        </div>

        {/* Slide Segmented Progress Bars & Counter */}
        <div
          className="glass-light flex items-center justify-between gap-2 rounded-full px-3 py-1.5 shadow-lg"
          style={{
            background: "rgba(10,8,16,0.65)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex flex-1 items-center gap-1.5">
            {day.slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setSlideIndex(index)}
                className="group relative flex-1 py-1.5"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      index === slideIndex
                        ? day.accent
                        : "rgba(242,237,230,0.25)",
                    boxShadow:
                      index === slideIndex ? `0 0 6px ${day.accent}99` : "none",
                  }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-white/10">
            <span
              className="pill font-semibold"
              style={{ fontSize: 9, color: "rgba(242,237,230,0.72)" }}
            >
              {String(slideIndex + 1).padStart(2, "0")} / 05
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Scroll Chapters ───────────────────────────────────────────────────────────

function ScrollChapters() {
  return (
    <section id="journey" className="relative">
      {days.map((day) => (
        <ChapterSection key={day.id} day={day} />
      ))}
    </section>
  )
}

function ChapterSection({ day }: { day: DayData }) {
  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row"
      style={{ background: day.bg }}
    >
      {/* Full-width photo panel */}
      <div
        className="relative md:w-1/2 h-72 md:h-auto overflow-hidden"
        style={{ minHeight: 320 }}
      >
        <img
          src={day.heroUrl}
          alt={`${day.name} — hero`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${day.bg} 0%, transparent 40%, transparent 60%, ${day.bg} 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: `linear-gradient(to top, ${day.bg}, transparent)`,
          }}
        />
        {/* Image ID label */}
        <div className="absolute top-4 left-4">
          <span
            className="pill px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(242,237,230,0.55)",
            }}
          >
            {day.heroImageId}
          </span>
        </div>
      </div>

      {/* Content panel */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-14 py-14 md:py-20">
        {/* Day number */}
        <div className="flex items-center gap-3 mb-4">
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: day.accentMuted.replace("0.15)", "0.12)"),
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(day.seq).padStart(2, "0")}
          </span>
          <div>
            <p
              className="bengali"
              style={{
                fontSize: 22,
                color: day.accent,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {day.bengali}
            </p>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "rgba(242,237,230,0.45)",
                fontWeight: 600,
              }}
            >
              {day.name.toUpperCase()}
            </p>
          </div>
        </div>

        <h3
          style={{
            fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700,
            color: "#F2EDE6",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          {day.theme}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "rgba(242,237,230,0.45)",
            letterSpacing: "0.06em",
            marginBottom: 20,
          }}
        >
          {day.atmosphere}
        </p>

        {/* Editorial copy placeholder */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "rgba(242,237,230,0.38)",
              fontStyle: "italic",
            }}
          >
            Editorial copy required — see REVIEW sheet
          </p>
        </div>

        {/* Featured song */}
        {day.songs.filter((s) => s.status !== "DUPLICATE")[0] && (
          <SongCard
            song={day.songs.filter((s) => s.status !== "DUPLICATE")[0]}
            accent={day.accent}
          />
        )}

        {/* Secondary image strip */}
        <div className="mt-8 flex gap-3">
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{
              width: 80,
              height: 80,
              background: "#222",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={day.secondaryUrl}
              alt={day.secondaryImageId}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{
              width: 80,
              height: 80,
              background: "#222",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={day.artworkUrl}
              alt={day.musicArtworkId}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="flex-1 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px dashed rgba(255,255,255,0.10)",
            }}
          >
            <span className="pill" style={{ color: "rgba(242,237,230,0.25)" }}>
              {day.imageCount} IMAGES
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SongCard({ song, accent }: { song: Song accent: string }) {
  return (
    <a
      href={song.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl p-3 transition-colors"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        textDecoration: "none",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 36, height: 36, background: accent, color: "#0A0B14" }}
      >
        <IconPlay size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="truncate"
            style={{ fontSize: 12, fontWeight: 600, color: "#F2EDE6" }}
          >
            {song.title === "MISSING" ? "— Pending Review" : song.title}
          </p>
          {song.status === "NEEDS REVIEW" && <ReviewBadge />}
        </div>
        <p
          className="truncate"
          style={{ fontSize: 11, color: "rgba(242,237,230,0.45)" }}
        >
          {song.artist === "MISSING" ? "Artist TBC" : song.artist}
        </p>
      </div>
      <IconExternal size={12} />
    </a>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="py-12 px-8 md:px-14"
      style={{
        background: "#07070F",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div
            className="bengali mb-1"
            style={{ fontSize: 28, color: "#F2EDE6", fontWeight: 700 }}
          >
            আগমনী
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.20em",
              color: "rgba(242,237,230,0.35)",
              fontWeight: 600,
            }}
          >
            THE JOURNEY OF MAA DURGA
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            ["05", "PUJA CHAPTERS"],
            ["25", "VISUAL ASSETS"],
            ["18", "MUSIC LINKS"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#F2EDE6",
                  lineHeight: 1,
                }}
              >
                {n}
              </p>
              <p
                className="pill"
                style={{ color: "rgba(242,237,230,0.35)", marginTop: 4 }}
              >
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="mt-10"
        style={{
          fontSize: 10,
          color: "rgba(242,237,230,0.22)",
          lineHeight: 1.8,
        }}
      >
        <p>
          Content and asset mapping traceable to
          AGOMONI_Durga_Puja_Website_Assets.xlsx. Rows marked NEEDS REVIEW are
          pending editorial confirmation.
        </p>
        <p className="mt-1">
          Photography is served locally from the supplied AGOMONI_Website_Assets
          package; flagged sources remain pending review.
        </p>
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeDayId, setActiveDayId] = useState<DayId>("mahalaya")
  const [muted, setMuted] = useState(false)

  const activeDay = days.find((d) => d.id === activeDayId)!

  const handleDayChange = useCallback((id: DayId) => {
    setActiveDayId(id)
  }, [])

  const handleAutoplayFallback = useCallback(() => {
    setMuted(true)
  }, [])

  return (
    <div
      className="day-transition h-screen h-[100dvh] overflow-hidden relative"
      style={{ background: activeDay.bg }}
    >
      <Header
        activeDay={activeDay}
        onDayChange={handleDayChange}
        muted={muted}
        onToggleMute={() => setMuted((value) => !value)}
      />
      <Hero key={activeDay.id} day={activeDay} onDayChange={handleDayChange} />
      <MusicPlayer
        day={activeDay}
        muted={muted}
        onAutoplayFallback={handleAutoplayFallback}
      />
    </div>
  )
}
