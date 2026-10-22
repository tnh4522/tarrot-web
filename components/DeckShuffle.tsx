'use client'

import { useState, useEffect, useCallback } from 'react'
import { TarotCard, DrawnCard, SpreadPosition } from '@/types/tarot'
import { TAROT_CARDS } from '@/data/tarot-cards'

interface DeckShuffleProps {
  cardCount: number
  positions: SpreadPosition[]
  onComplete: (cards: DrawnCard[]) => void
}

export default function DeckShuffle({ cardCount, positions, onComplete }: DeckShuffleProps) {
  const [phase, setPhase] = useState<'intro' | 'shuffling' | 'picking' | 'done'>('intro')
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [fanCards, setFanCards] = useState<{ card: TarotCard; index: number; angle: number; x: number }[]>([])

  const shuffle = useCallback(() => {
    const deck = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
    setShuffledDeck(deck)
    
    // Create fan display - show 20 cards spread in a fan
    const displayed = deck.slice(0, 20)
    const totalAngle = 60
    const startAngle = -totalAngle / 2
    const fan = displayed.map((card, i) => ({
      card,
      index: i,
      angle: startAngle + (totalAngle / (displayed.length - 1)) * i,
      x: (i - displayed.length / 2) * 28,
    }))
    setFanCards(fan)
  }, [])

  const handleStartShuffle = () => {
    setPhase('shuffling')
    shuffle()
    setTimeout(() => {
      setPhase('picking')
    }, 1800)
  }

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index)) return
    if (selectedCards.length >= cardCount) return

    const newSelected = [...selectedCards, index]
    setSelectedCards(newSelected)

    if (newSelected.length === cardCount) {
      setPhase('done')
      setTimeout(() => {
        const drawn: DrawnCard[] = newSelected.map((idx, i) => ({
          card: fanCards[idx].card,
          position: positions[i],
          isReversed: Math.random() > 0.65,
        }))
        onComplete(drawn)
      }, 600)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        padding: '32px 16px',
      }}
    >
      {phase === 'intro' && (
        <div
          style={{ textAlign: 'center', animation: 'fade-in-up 0.6s ease-out' }}
          className="animate-fade-in-up"
        >
          <div
            style={{ fontSize: '4rem', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.8))' }}
            className="animate-bounce-subtle"
          >
            🎴
          </div>
          <h3
            className="font-heading gradient-text-mystic"
            style={{ fontSize: '22px', marginBottom: '12px' }}
          >
            Chuẩn Bị Tâm Linh
          </h3>
          <p
            className="font-body text-muted"
            style={{ fontSize: '16px', maxWidth: '400px', lineHeight: 1.7 }}
          >
            Hãy hít thở sâu, tập trung vào câu hỏi của bạn và để năng lượng dẫn đường khi bạn chọn bài.
          </p>
          <div className="divider-violet" style={{ width: '200px', margin: '24px auto' }} />
          <button
            id="btn-shuffle-deck"
            className="btn-primary"
            onClick={handleStartShuffle}
            style={{ fontSize: '16px', padding: '14px 36px' }}
          >
            <span>🔀</span>
            Xáo Bài & Rút Quẻ
          </button>
        </div>
      )}

      {phase === 'shuffling' && (
        <div
          style={{ textAlign: 'center' }}
          className="animate-fade-in"
        >
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 24px' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '80px',
                  height: '126px',
                  marginLeft: '-40px',
                  marginTop: '-63px',
                  background: 'linear-gradient(135deg, #1a1435, #0d0920)',
                  border: '1px solid rgba(212, 160, 23, 0.4)',
                  borderRadius: '8px',
                  animation: `spin-slow ${1.5 + i * 0.2}s linear infinite`,
                  transformOrigin: `${20 + i * 15}px ${30 + i * 10}px`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              />
            ))}
          </div>
          <p className="font-heading text-violet" style={{ fontSize: '18px', letterSpacing: '0.1em' }}>
            Đang Xáo Bài...
          </p>
          <p className="text-muted font-ui" style={{ fontSize: '13px', marginTop: '8px' }}>
            Hãy tập trung vào câu hỏi của bạn
          </p>
        </div>
      )}

      {(phase === 'picking' || phase === 'done') && (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ marginBottom: '12px' }}>
            <span
              className="font-heading gradient-text-gold"
              style={{ fontSize: '16px' }}
            >
              {selectedCards.length === cardCount
                ? '✨ Đã chọn xong!'
                : `Chọn ${cardCount - selectedCards.length} lá bài nữa`}
            </span>
          </div>

          {/* Progress indicator */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
            {Array.from({ length: cardCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '32px',
                  height: '4px',
                  borderRadius: '2px',
                  background: i < selectedCards.length
                    ? 'linear-gradient(90deg, var(--color-violet), var(--color-violet-glow))'
                    : 'var(--color-surface-2)',
                  transition: 'background 0.3s ease',
                  boxShadow: i < selectedCards.length ? '0 0 8px rgba(109, 40, 217, 0.5)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Fan of cards */}
          <div
            style={{
              position: 'relative',
              height: '180px',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              perspective: '800px',
            }}
          >
            {fanCards.map((item, i) => {
              const isSelected = selectedCards.includes(i)
              const isDisabled = selectedCards.length >= cardCount && !isSelected
              return (
                <div
                  key={i}
                  id={`deck-card-${i}`}
                  className={`deck-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isDisabled && handleCardClick(i)}
                  style={{
                    left: `calc(50% + ${item.x}px - 40px)`,
                    bottom: '0',
                    transform: `rotate(${item.angle}deg)`,
                    transformOrigin: 'bottom center',
                    opacity: isDisabled ? 0.3 : isSelected ? 1 : 0.9,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    zIndex: isSelected ? 20 : i,
                    borderColor: isSelected
                      ? 'rgba(167, 139, 250, 0.9)'
                      : 'rgba(212, 160, 23, 0.3)',
                    boxShadow: isSelected
                      ? '0 0 30px rgba(109, 40, 217, 0.7), 0 -20px 0 0 rgba(109,40,217,0.1)'
                      : undefined,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Card back design */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      border: '1px solid rgba(212, 160, 23, 0.2)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(109, 40, 217, 0.03) 5px, rgba(109, 40, 217, 0.03) 10px)',
                    }}
                  >
                    {isSelected && (
                      <div style={{ fontSize: '16px', filter: 'drop-shadow(0 0 6px rgba(167, 139, 250, 0.9))' }}>
                        ✦
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <p
            className="font-body text-muted"
            style={{ fontSize: '14px', marginTop: '24px', fontStyle: 'italic' }}
          >
            Hãy để trực giác dẫn đường bạn đến những lá bài đúng
          </p>
        </div>
      )}
    </div>
  )
}
