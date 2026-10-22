'use client'

import { useState, useEffect } from 'react'
import { SavedReading } from '@/types/tarot'

const STORAGE_KEY = 'mystic-tarot-readings'

export function saveReading(reading: SavedReading) {
  if (typeof window === 'undefined') return
  const existing: SavedReading[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  localStorage.setItem(STORAGE_KEY, JSON.stringify([reading, ...existing].slice(0, 50)))
}

export function loadReadings(): SavedReading[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export default function ReadingHistory() {
  const [readings, setReadings] = useState<SavedReading[]>([])
  const [selected, setSelected] = useState<SavedReading | null>(null)

  useEffect(() => {
    setReadings(loadReadings())
  }, [])

  const handleDelete = (id: string) => {
    const updated = readings.filter((r) => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setReadings(updated)
    if (selected?.id === id) setSelected(null)
  }

  const handleClearAll = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử quẻ bài không?')) {
      localStorage.removeItem(STORAGE_KEY)
      setReadings([])
      setSelected(null)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (readings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div
          style={{ fontSize: '4rem', marginBottom: '16px', filter: 'drop-shadow(0 0 16px rgba(167, 139, 250, 0.5))' }}
          className="animate-bounce-subtle"
        >
          📜
        </div>
        <h3
          className="font-heading gradient-text-mystic"
          style={{ fontSize: '22px', marginBottom: '12px' }}
        >
          Chưa Có Lịch Sử Quẻ Bài
        </h3>
        <p className="text-muted font-body" style={{ fontSize: '16px' }}>
          Những quẻ bài bạn lưu lại sẽ xuất hiện tại đây
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="font-heading gradient-text-gold" style={{ fontSize: '24px', marginBottom: '4px' }}>
            📜 Lịch Sử Quẻ Bài
          </h2>
          <p className="text-muted font-ui" style={{ fontSize: '13px' }}>
            {readings.length} quẻ đã lưu
          </p>
        </div>
        <button
          id="btn-clear-history"
          className="btn-ghost"
          onClick={handleClearAll}
          style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          🗑️ Xóa Tất Cả
        </button>
      </div>

      {/* Reading List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {readings.map((reading) => (
          <div
            key={reading.id}
            className="glass-card"
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: selected?.id === reading.id ? '1px solid rgba(139, 92, 246, 0.4)' : undefined,
              boxShadow: selected?.id === reading.id ? '0 0 20px rgba(109, 40, 217, 0.2)' : undefined,
            }}
          >
            {/* Reading header */}
            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                cursor: 'pointer',
                gap: '12px',
              }}
              onClick={() => setSelected(selected?.id === reading.id ? null : reading)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '11px',
                      color: 'var(--color-violet-glow)',
                      background: 'rgba(109, 40, 217, 0.15)',
                      border: '1px solid rgba(109, 40, 217, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {reading.spreadName}
                  </span>
                  <span className="text-dim font-ui" style={{ fontSize: '11px' }}>
                    {formatDate(reading.date)}
                  </span>
                </div>
                <p
                  className="font-body"
                  style={{
                    fontSize: '15px',
                    color: 'var(--color-text)',
                    lineHeight: 1.4,
                    marginBottom: '8px',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{reading.question}&rdquo;
                </p>
                {/* Card emojis */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {reading.drawnCards.slice(0, 5).map((dc, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '18px',
                        filter: 'drop-shadow(0 0 4px rgba(167, 139, 250, 0.5))',
                        transform: dc.isReversed ? 'rotate(180deg)' : 'none',
                        display: 'inline-block',
                      }}
                      title={`${dc.card.nameVi}${dc.isReversed ? ' (Ngược)' : ''}`}
                    >
                      {dc.card.image}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  id={`btn-delete-reading-${reading.id}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(reading.id)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-dim)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dim)')}
                  title="Xóa quẻ này"
                >
                  🗑️
                </button>
                <span
                  style={{
                    color: 'var(--color-text-dim)',
                    fontSize: '18px',
                    transition: 'transform 0.3s',
                    transform: selected?.id === reading.id ? 'rotate(180deg)' : 'none',
                  }}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Expanded content */}
            {selected?.id === reading.id && (
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  animation: 'fade-in 0.3s ease-out',
                }}
              >
                {/* Overall message */}
                <div>
                  <div
                    className="font-ui text-muted"
                    style={{ fontSize: '11px', letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}
                  >
                    🌌 Thông Điệp Vũ Trụ
                  </div>
                  <p
                    className="font-body"
                    style={{ fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.7 }}
                  >
                    {reading.reading.overallMessage}
                  </p>
                </div>

                {/* Advice */}
                <div
                  style={{
                    padding: '14px',
                    background: 'rgba(212, 160, 23, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(212, 160, 23, 0.15)',
                  }}
                >
                  <div
                    className="font-ui text-muted"
                    style={{ fontSize: '11px', letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}
                  >
                    💫 Lời Khuyên
                  </div>
                  <p className="font-body" style={{ fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.7 }}>
                    {reading.reading.advice}
                  </p>
                </div>

                {/* Affirmation */}
                {reading.reading.affirmation && (
                  <p
                    className="font-body gradient-text-gold"
                    style={{ fontSize: '16px', fontStyle: 'italic', textAlign: 'center' }}
                  >
                    &ldquo;{reading.reading.affirmation}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
