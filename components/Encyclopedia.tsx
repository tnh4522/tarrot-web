'use client'

import { useState, useMemo } from 'react'
import { TAROT_CARDS } from '@/data/tarot-cards'
import { TarotCard } from '@/types/tarot'

const SUIT_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất Cả', icon: '✦' },
  { value: 'major', label: 'Ẩn Chính', icon: '🌙' },
  { value: 'wands', label: 'Gậy', icon: '🔥' },
  { value: 'cups', label: 'Cốc', icon: '💧' },
  { value: 'swords', label: 'Kiếm', icon: '⚔️' },
  { value: 'pentacles', label: 'Tiền', icon: '💰' },
]

const SUIT_COLORS: Record<string, string> = {
  major: '#c4b5fd',
  wands: '#fbbf24',
  cups: '#60a5fa',
  swords: '#a1a1aa',
  pentacles: '#4ade80',
}

export default function Encyclopedia() {
  const [search, setSearch] = useState('')
  const [suitFilter, setSuitFilter] = useState('all')
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null)
  const [showReversed, setShowReversed] = useState(false)

  const filtered = useMemo(() => {
    return TAROT_CARDS.filter((card) => {
      const matchesSuit = suitFilter === 'all' || card.suit === suitFilter
      const matchesSearch =
        !search ||
        card.nameVi.toLowerCase().includes(search.toLowerCase()) ||
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      return matchesSuit && matchesSearch
    })
  }, [search, suitFilter])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2
          className="font-heading gradient-text-gold"
          style={{ fontSize: '28px', marginBottom: '8px', letterSpacing: '0.08em' }}
        >
          📖 Bách Khoa Toàn Thư Tarot
        </h2>
        <p className="text-muted font-body" style={{ fontSize: '16px' }}>
          Khám phá ý nghĩa sâu sắc của 78 lá bài Tarot
        </p>
      </div>

      {/* Search & Filter */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: 'var(--color-text-dim)',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              id="encyclopedia-search"
              className="input-mystic"
              placeholder="Tìm kiếm lá bài hoặc từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SUIT_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`filter-suit-${opt.value}`}
              onClick={() => setSuitFilter(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: suitFilter === opt.value
                  ? '1px solid rgba(139, 92, 246, 0.6)'
                  : '1px solid var(--color-border)',
                background:
                  suitFilter === opt.value
                    ? 'rgba(109, 40, 217, 0.25)'
                    : 'transparent',
                color:
                  suitFilter === opt.value
                    ? 'var(--color-violet-glow)'
                    : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: suitFilter === opt.value ? 500 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="font-ui" style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '12px' }}>
          Hiển thị {filtered.length} / 78 lá bài
        </div>
      </div>

      {/* Card Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        {filtered.map((card) => (
          <button
            key={card.id}
            id={`card-entry-${card.id}`}
            onClick={() => setSelectedCard(card)}
            style={{
              background: 'rgba(13, 9, 32, 0.7)',
              border: `1px solid ${SUIT_COLORS[card.suit]}30`,
              borderRadius: '12px',
              padding: '16px 12px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = SUIT_COLORS[card.suit] + '60'
              el.style.transform = 'translateY(-4px)'
              el.style.boxShadow = `0 8px 24px ${SUIT_COLORS[card.suit]}20`
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = SUIT_COLORS[card.suit] + '30'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                fontSize: '2rem',
                filter: `drop-shadow(0 0 8px ${SUIT_COLORS[card.suit]}80)`,
              }}
            >
              {card.image}
            </div>
            <div
              className="font-heading"
              style={{
                fontSize: '11px',
                color: 'var(--color-text)',
                lineHeight: 1.3,
              }}
            >
              {card.nameVi}
            </div>
            <span
              style={{
                fontSize: '10px',
                color: SUIT_COLORS[card.suit],
                background: SUIT_COLORS[card.suit] + '15',
                padding: '1px 6px',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {card.arcana === 'major' ? 'Ẩn Chính' : card.suit === 'wands' ? 'Gậy' : card.suit === 'cups' ? 'Cốc' : card.suit === 'swords' ? 'Kiếm' : 'Tiền'}
            </span>
          </button>
        ))}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(5, 3, 15, 0.85)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => e.target === e.currentTarget && setSelectedCard(null)}
        >
          <div
            className="glass-card"
            style={{
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderColor: SUIT_COLORS[selectedCard.suit] + '40',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    fontSize: '3rem',
                    filter: `drop-shadow(0 0 12px ${SUIT_COLORS[selectedCard.suit]})`,
                  }}
                >
                  {selectedCard.image}
                </div>
                <div>
                  <h3
                    className="font-heading"
                    style={{ fontSize: '20px', color: SUIT_COLORS[selectedCard.suit], marginBottom: '4px' }}
                  >
                    {selectedCard.nameVi}
                  </h3>
                  <div className="text-muted font-ui" style={{ fontSize: '13px' }}>
                    {selectedCard.name} • {selectedCard.number && `${selectedCard.number} • `}
                    {selectedCard.planet && `${selectedCard.planet} • `}
                    {selectedCard.element && selectedCard.element.charAt(0).toUpperCase() + selectedCard.element.slice(1)}
                  </div>
                </div>
              </div>
              <button
                id="btn-close-card-modal"
                onClick={() => setSelectedCard(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-dim)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Description */}
              <p className="font-body text-muted" style={{ fontSize: '16px', lineHeight: 1.7 }}>
                {selectedCard.description}
              </p>

              {/* Toggle Upright/Reversed */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(13, 9, 32, 0.8)',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                }}
              >
                <button
                  id="btn-show-upright"
                  onClick={() => setShowReversed(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    background: !showReversed ? 'rgba(109, 40, 217, 0.25)' : 'transparent',
                    color: !showReversed ? 'var(--color-violet-glow)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: !showReversed ? 500 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  ↑ Xuôi
                </button>
                <button
                  id="btn-show-reversed"
                  onClick={() => setShowReversed(true)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    background: showReversed ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    color: showReversed ? '#f87171' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: showReversed ? 500 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  ↓ Ngược
                </button>
              </div>

              {/* Meaning */}
              <div
                style={{
                  background: 'rgba(26, 20, 53, 0.5)',
                  borderRadius: '10px',
                  padding: '16px',
                  border: `1px solid ${!showReversed ? 'rgba(139, 92, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                }}
              >
                <p className="font-body" style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)' }}>
                  {showReversed ? selectedCard.reversedMeaning : selectedCard.uprightMeaning}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <div
                  className="font-ui text-muted"
                  style={{ fontSize: '11px', letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase' }}
                >
                  Từ Khóa {showReversed ? 'Ngược' : 'Xuôi'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(showReversed ? selectedCard.keywordsReversed : selectedCard.keywords).map((kw) => (
                    <span
                      key={kw}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: SUIT_COLORS[selectedCard.suit] + '15',
                        border: `1px solid ${SUIT_COLORS[selectedCard.suit]}30`,
                        color: SUIT_COLORS[selectedCard.suit],
                        fontFamily: 'var(--font-ui)',
                        fontSize: '12px',
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div className="divider-gold" />
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(212, 160, 23, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 160, 23, 0.15)',
                }}
              >
                <p className="font-body gradient-text-gold" style={{ fontSize: '16px', fontStyle: 'italic', lineHeight: 1.6 }}>
                  &ldquo;{selectedCard.advice}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
