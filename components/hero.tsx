'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const HERO_VIDEO = '/Brand_Hero_Video.mov'
const HERO_IMAGE = '/safari-hero-image.jpg'

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.play().catch(() => {})
    }

    if (video.readyState >= 2) {
      play()
    } else {
      video.addEventListener('loadeddata', play)
      video.addEventListener('canplay', play)
      return () => {
        video.removeEventListener('loadeddata', play)
        video.removeEventListener('canplay', play)
      }
    }
  }, [isDesktop])

  return (
    <section className="w-full bg-black pt-0 lg:pt-10">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-0 pt-10 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-4 lg:gap-8 items-stretch w-full lg:h-[390px] lg:min-h-0">
          {/* Left: Copy - on desktop matches video column height */}
          <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left min-h-0 lg:h-[48vh] pl-0 lg:pl-8 pb-10 lg:pb-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white uppercase tracking-tight mb-2 sm:mb-3 leading-[1.1]">
              New Arrivals
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-md mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed lg:max-w-sm">
              Curated styles for every moment. Quality fabrics, modern fits, delivered to you.
            </p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6 sm:mb-8 text-xs text-white/60 uppercase tracking-wider">
              <span>Premium fabrics</span>
              <span className="text-white/40">·</span>
              <span>Thoughtful design</span>
              <span className="text-white/40">·</span>
              <span>Made to last</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
              <Link href="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-5 sm:px-7 py-2 sm:py-2.5 h-10 sm:h-11 bg-white hover:bg-white/90 text-black text-xs sm:text-sm font-medium uppercase tracking-widest rounded-sm"
                >
                  Shop Collection
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-5 sm:px-7 py-2 sm:py-2.5 h-10 sm:h-11 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-xs sm:text-sm font-medium uppercase tracking-widest rounded-sm transition-colors"
                >
                  Gifts
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Brand video (or Safari mobile image) - slightly wider column */}
          <div className="order-1 lg:order-2 relative w-full h-[220px] sm:h-[280px] lg:h-[390px] rounded-sm overflow-hidden bg-black">
            {!isDesktop ? (
              <Image
                src={HERO_IMAGE}
                alt="Bixlay brand"
                fill
                className="object-contain object-center"
              />
            ) : (
              <video
                ref={videoRef}
                src={HERO_VIDEO}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-contain object-center"
                aria-label="Bixlay brand video"
              />
            )}
            {/* Left-edge fade to blend into black background */}
            <div
              className="absolute inset-y-0 left-0 w-24 sm:w-32 lg:w-40 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to right, rgb(0 0 0) 0%, transparent 100%)',
              }}
              aria-hidden
            />
            {/* Right-edge fade to blend into black background */}
            <div
              className="absolute inset-y-0 right-0 w-24 sm:w-32 lg:w-40 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to left, rgb(0 0 0) 0%, transparent 100%)',
              }}
              aria-hidden
            />
            {/* Top-edge fade */}
            <div
              className="absolute inset-x-0 top-0 h-6 sm:h-8 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to bottom, rgb(0 0 0) 0%, transparent 100%)',
              }}
              aria-hidden
            />
            {/* Bottom-edge fade */}
            <div
              className="absolute inset-x-0 bottom-0 h-6 sm:h-8 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to top, rgb(0 0 0) 0%, transparent 100%)',
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  )
}
