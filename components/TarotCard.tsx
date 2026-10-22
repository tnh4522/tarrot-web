'use client'

import { useState, useEffect } from 'react'
import { TarotCard } from '@/types/tarot'

interface TarotCardProps {
  card: TarotCard
  isReversed?: boolean
  isFlipped?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => void
  showLabel?: boolean
  position?: string
  animationDelay?: number
}

const SUIT_COLORS: Record<string, string> = {
  major: '#c4b5fd',
  wands: '#fbbf24',
  cups: '#60a5fa',
  swords: '#a1a1aa',
  pentacles: '#4ade80',
}

const SUIT_LABELS: Record<string, string> = {
  major: 'Ẩn Chính',
  wands: 'Gậy',
  cups: 'Cốc',
  swords: 'Kiếm',
  pentacles: 'Tiền',
}

const SIZES = {
  sm: { scene: { width: '100px', height: '158px' }, emoji: '2rem', nameSize: '10px' },
  md: { scene: { width: '130px', height: '205px' }, emoji: '2.5rem', nameSize: '11px' },
  lg: { scene: { width: '160px', height: '253px' }, emoji: '3rem', nameSize: '12px' },
  xl: { scene: { width: '190px', height: '300px' }, emoji: '3.5rem', nameSize: '13px' },
}

export default function TarotCardComponent({
  card,
  isReversed = false,
  isFlipped = false,
  size = 'md',
  onClick,
  showLabel = true,
  position,
  animationDelay = 0,
}: TarotCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), animationDelay)
    const t2 = setTimeout(() => setFlipped(isFlipped), animationDelay + 100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isFlipped, animationDelay])

  const dims = SIZES[size]
  const suitColor = SUIT_COLORS[card.suit]

  const handleClick = () => {
    if (onClick) onClick()
    else setFlipped(!flipped)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {position && (
        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            textAlign: 'center',
          }}
        >
          {position}
        </div>
      )}

      {/* 3D Card */}
      <div
        className="card-scene"
        style={{ ...dims.scene, cursor: onClick ? 'pointer' : 'default' }}
        onClick={handleClick}
      >
        <div
          className="card-3d"
          style={{
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Back of card */}
          <div className="card-face card-back">
            <div className="card-back-pattern">
              <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.8))' }}>
                ✦
              </div>
            </div>
          </div>

          {/* Front of card */}
          <div
            className="card-face card-front"
            style={{
              transform: isReversed ? 'rotateY(180deg) rotateZ(180deg)' : 'rotateY(180deg)',
              background: `linear-gradient(180deg, var(--color-dark) 0%, var(--color-void) 100%)`,
              borderColor: suitColor + '80',
              boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px ${suitColor}30`,
            }}
          >
            {/* Decorative corner */}
            <div
              style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                right: '6px',
                bottom: '6px',
                border: `1px solid ${suitColor}30`,
                borderRadius: '8px',
                pointerEvents: 'none',
              }}
            />

            {/* Card number */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                color: suitColor + 'aa',
              }}
            >
              {card.number}
            </div>

            {/* Main emoji */}
            <div
              style={{
                fontSize: dims.emoji,
                marginBottom: '8px',
                filter: `drop-shadow(0 0 12px ${suitColor})`,
                lineHeight: 1,
              }}
            >
              {card.image}
            </div>

            {/* Card name */}
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: dims.nameSize,
                color: 'var(--color-text)',
                textAlign: 'center',
                letterSpacing: '0.05em',
                lineHeight: 1.3,
                padding: '0 4px',
              }}
            >
              {card.nameVi}
            </div>

            {/* Reversed indicator */}
            {isReversed && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '8px',
                  color: '#f87171',
                  letterSpacing: '0.1em',
                  background: 'rgba(239, 68, 68, 0.15)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                NGƯỢC
              </div>
            )}

            {/* Suit badge */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontFamily: 'var(--font-ui)',
                fontSize: '8px',
                color: suitColor,
                background: suitColor + '20',
                border: `1px solid ${suitColor}40`,
                padding: '1px 5px',
                borderRadius: '3px',
                letterSpacing: '0.05em',
              }}
            >
              {SUIT_LABELS[card.suit]}
            </div>
          </div>
        </div>
      </div>

      {/* Label below card */}
      {showLabel && flipped && (
        <div
          style={{
            textAlign: 'center',
            animation: 'fade-in-up 0.4s ease-out',
          }}
        >
          <div
            className="font-heading"
            style={{
              fontSize: '13px',
              color: suitColor,
              letterSpacing: '0.05em',
            }}
          >
            {card.nameVi}
          </div>
          {isReversed && (
            <div
              style={{
                fontSize: '10px',
                color: '#f87171',
                fontFamily: 'var(--font-ui)',
                marginTop: '2px',
              }}
            >
              (Ngược)
            </div>
          )}
        </div>
      )}
    </div>
  )
}
