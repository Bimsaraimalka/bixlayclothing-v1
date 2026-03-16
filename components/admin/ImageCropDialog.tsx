'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const DISPLAY_SIZE = 400
const EXPORT_SIZE = 1200

type Props = {
  open: boolean
  file: File | null
  onConfirm: (blob: Blob) => void
  onCancel: () => void
  uploading?: boolean
}

export function ImageCropDialog({ open, file, onConfirm, onCancel, uploading = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState<{ startX: number; startY: number; startOffset: { x: number; y: number } } | null>(null)
  const lastTouchRef = useRef({ x: 0, y: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !file) {
      setImage(null)
      setOffset({ x: 0, y: 0 })
      setZoom(1)
      setError(null)
      return
    }
    setError(null)
    const img = new window.Image()
    img.onload = () => setImage(img)
    img.onerror = () => setError('Failed to load image')
    img.src = URL.createObjectURL(file)
    return () => URL.revokeObjectURL(img.src)
  }, [open, file])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const d = DISPLAY_SIZE
    canvas.width = d
    canvas.height = d

    const iw = image.naturalWidth
    const ih = image.naturalHeight
    const baseScale = Math.max(d / iw, d / ih)
    const scale = baseScale * zoom

    const drawW = iw * scale
    const drawH = ih * scale
    let x = (d - drawW) / 2 + offset.x
    let y = (d - drawH) / 2 + offset.y

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, d, d)
    ctx.drawImage(image, x, y, drawW, drawH)
  }, [image, offset, zoom])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    if (!open) return
    const handleMouseMove = (e: MouseEvent) => {
      if (!drag) return
      setOffset({
        x: drag.startOffset.x + (e.clientX - drag.startX),
        y: drag.startOffset.y + (e.clientY - drag.startY),
      })
    }
    const handleMouseUp = () => setDrag(null)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [open, drag])

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return
    setDrag({
      startX: e.clientX,
      startY: e.clientY,
      startOffset: { ...offset },
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!image || e.touches.length !== 1) return
    e.preventDefault()
    lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setDrag({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startOffset: { ...offset },
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!drag || e.touches.length !== 1) return
    e.preventDefault()
    const tx = e.touches[0].clientX
    const ty = e.touches[0].clientY
    setOffset((prev) => ({
      x: prev.x + (tx - lastTouchRef.current.x),
      y: prev.y + (ty - lastTouchRef.current.y),
    }))
    lastTouchRef.current = { x: tx, y: ty }
  }

  const handleTouchEnd = () => {
    setDrag(null)
  }

  const handleConfirm = () => {
    if (!image) return

    const out = document.createElement('canvas')
    out.width = EXPORT_SIZE
    out.height = EXPORT_SIZE
    const ctx = out.getContext('2d')
    if (!ctx) return

    const d = DISPLAY_SIZE
    const iw = image.naturalWidth
    const ih = image.naturalHeight
    const baseScale = Math.max(d / iw, d / ih)
    const scale = baseScale * zoom
    const drawW = iw * scale
    const drawH = ih * scale
    const x = (d - drawW) / 2 + offset.x
    const y = (d - drawH) / 2 + offset.y
    const scaleOut = EXPORT_SIZE / d

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE)
    ctx.drawImage(image, x * scaleOut, y * scaleOut, drawW * scaleOut, drawH * scaleOut)

    out.toBlob(
      (blob) => {
        if (blob) onConfirm(blob)
      },
      'image/jpeg',
      0.92
    )
  }

  if (!file) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust image</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Drag the image to position it. Use zoom to scale. The square area will be used as the product image.
        </p>
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {image && (
          <>
            <div className="flex justify-center rounded-lg border border-border bg-muted/30 p-2">
              <canvas
                ref={canvasRef}
                width={DISPLAY_SIZE}
                height={DISPLAY_SIZE}
                className="max-w-full h-auto cursor-grab active:cursor-grabbing touch-none select-none rounded"
                style={{ maxHeight: '60vh' }}
                onMouseDown={handleCanvasMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Zoom</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-muted accent-primary"
              />
            </div>
          </>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!image || uploading}>
            {uploading ? 'Uploading…' : 'Use this image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
