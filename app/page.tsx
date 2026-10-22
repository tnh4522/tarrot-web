'use client'

import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import DeckShuffle from '@/components/DeckShuffle'
import TarotCardComponent from '@/components/TarotCard'
import AIReadingResult from '@/components/AIReadingResult'
import Encyclopedia from '@/components/Encyclopedia'
import ReadingHistory, { saveReading } from '@/components/ReadingHistory'
import { SPREADS } from '@/data/spreads'
import {
  Spread,
  DrawnCard,
  ReadingResponse,
  AITone,
  SavedReading,
} from '@/types/tarot'

type Tab = 'reading' | 'encyclopedia' | 'history' | 'settings'
type ReadingStep = 'setup' | 'shuffle' | 'reveal' | 'result'

const TONE_OPTIONS: { id: AITone; label: string; icon: string; desc: string }[] = [
  { id: 'empathetic', label: 'Thấu Cảm', icon: '💜', desc: 'Ấm áp và đồng cảm' },
  { id: 'direct', label: 'Trực Diện', icon: '⚡', desc: 'Rõ ràng và thực tế' },
  { id: 'mystical', label: 'Huyền Bí', icon: '🌌', desc: 'Thơ ca và tâm linh' },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('reading')

  // Reading state
  const [step, setStep] = useState<ReadingStep>('setup')
  const [userName, setUserName] = useState('')
  const [question, setQuestion] = useState('')
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null)
  const [tone, setTone] = useState<AITone>('empathetic')
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [reading, setReading] = useState<ReadingResponse | null>(null)
  const [isLoadingReading, setIsLoadingReading] = useState(false)

  // Settings
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('gemini-api-key') || ''
    return ''
  })
  const [saveKeyFeedback, setSaveKeyFeedback] = useState('')

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini-api-key', apiKey)
    setSavedApiKey(apiKey)
    setSaveKeyFeedback('✅ Đã lưu API Key thành công!')
    setTimeout(() => setSaveKeyFeedback(''), 3000)
  }

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread)
  }

  const handleStartReading = () => {
    if (!selectedSpread) return
    setStep('shuffle')
  }

  const handleCardsDrawn = useCallback(async (cards: DrawnCard[]) => {
    setDrawnCards(cards)
    setStep('reveal')

    // Short delay to show reveal animation
    setTimeout(async () => {
      setStep('result')
      setIsLoadingReading(true)

      try {
        const res = await fetch('/api/tarot-reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            userName,
            spreadType: selectedSpread?.id,
            drawnCards: cards,
            tone,
            apiKey: savedApiKey,
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setReading(data)
      } catch (err) {
        console.error('Reading error:', err)
      } finally {
        setIsLoadingReading(false)
      }
    }, 1200)
  }, [question, userName, selectedSpread, tone, savedApiKey])

  const handleSaveReading = () => {
    if (!reading || !selectedSpread) return
    const saved: SavedReading = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      userName,
      question,
      spreadName: selectedSpread.nameVi,
      drawnCards,
      reading,
    }
    saveReading(saved)
    alert('✅ Đã lưu quẻ bài thành công!')
  }

  const handleNewReading = () => {
    setStep('setup')
    setSelectedSpread(null)
    setDrawnCards([])
    setReading(null)
    setQuestion('')
    setIsLoadingReading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1 }}>
        {/* ============================
            TAB: READING
            ============================ */}
        {activeTab === 'reading' && (
          <div className="container-app" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
            {step === 'setup' && (
              <div
                style={{ maxWidth: '800px', margin: '0 auto' }}
                className="animate-fade-in-up"
              >
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <div
                    style={{
                      fontSize: '5rem',
                      marginBottom: '20px',
                      display: 'block',
                      filter: 'drop-shadow(0 0 30px rgba(167, 139, 250, 0.8))',
                    }}
                    className="animate-bounce-subtle"
                  >
                    🔮
                  </div>
                  <h1
                    className="font-heading gradient-text-mystic"
                    style={{
                      fontSize: 'clamp(28px, 5vw, 44px)',
                      marginBottom: '12px',
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                    }}
                  >
                    MysticTarot AI
                  </h1>
                  <p
                    className="font-body text-muted"
                    style={{ fontSize: '18px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}
                  >
                    Khám phá hành trình tâm linh của bạn qua những lá bài Tarot được
                    phân tích bởi trí tuệ vũ trụ
                  </p>
                </div>

                {/* Setup Form */}
                <div className="glass-card" style={{ borderRadius: '20px', padding: '32px' }}>
                  {/* Step 1: Name */}
                  <div style={{ marginBottom: '28px' }}>
                    <label
                      className="font-ui text-muted"
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                      }}
                    >
                      ✦ Tên Của Bạn
                    </label>
                    <input
                      id="input-user-name"
                      className="input-mystic"
                      placeholder="Nhập tên để nhận thông điệp cá nhân..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  {/* Step 2: Question */}
                  <div style={{ marginBottom: '28px' }}>
                    <label
                      className="font-ui text-muted"
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                      }}
                    >
                      🌙 Câu Hỏi Của Bạn (Tùy chọn)
                    </label>
                    <textarea
                      id="input-question"
                      className="input-mystic"
                      placeholder="Điều gì đang cần sự hướng dẫn của vũ trụ? Để trống để nhận thông điệp tổng quan..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Step 3: AI Tone */}
                  <div style={{ marginBottom: '28px' }}>
                    <label
                      className="font-ui text-muted"
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                      }}
                    >
                      ⭐ Phong Cách Thầy Bói
                    </label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {TONE_OPTIONS.map((t) => (
                        <button
                          key={t.id}
                          id={`btn-tone-${t.id}`}
                          onClick={() => setTone(t.id)}
                          style={{
                            flex: 1,
                            minWidth: '120px',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: tone === t.id
                              ? '1px solid rgba(139, 92, 246, 0.6)'
                              : '1px solid var(--color-border)',
                            background:
                              tone === t.id
                                ? 'rgba(109, 40, 217, 0.2)'
                                : 'rgba(13, 9, 32, 0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>{t.icon}</div>
                          <div
                            className="font-heading"
                            style={{
                              fontSize: '13px',
                              color: tone === t.id ? 'var(--color-violet-glow)' : 'var(--color-text)',
                              marginBottom: '2px',
                            }}
                          >
                            {t.label}
                          </div>
                          <div
                            className="font-ui"
                            style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}
                          >
                            {t.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Spread Selection */}
                  <div>
                    <label
                      className="font-ui text-muted"
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                      }}
                    >
                      🃏 Chọn Kiểu Trải Bài
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {SPREADS.map((spread) => (
                        <button
                          key={spread.id}
                          id={`btn-spread-${spread.id}`}
                          onClick={() => handleSpreadSelect(spread)}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: selectedSpread?.id === spread.id
                              ? '1px solid rgba(212, 160, 23, 0.5)'
                              : '1px solid var(--color-border)',
                            background:
                              selectedSpread?.id === spread.id
                                ? 'rgba(212, 160, 23, 0.08)'
                                : 'rgba(13, 9, 32, 0.5)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedSpread?.id !== spread.id) {
                              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                              e.currentTarget.style.background = 'rgba(109, 40, 217, 0.05)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedSpread?.id !== spread.id) {
                              e.currentTarget.style.borderColor = 'var(--color-border)'
                              e.currentTarget.style.background = 'rgba(13, 9, 32, 0.5)'
                            }
                          }}
                        >
                          <span style={{ fontSize: '28px', flexShrink: 0 }}>{spread.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                              <span
                                className="font-heading"
                                style={{
                                  fontSize: '15px',
                                  color: selectedSpread?.id === spread.id
                                    ? 'var(--color-gold-light)'
                                    : 'var(--color-text)',
                                }}
                              >
                                {spread.nameVi}
                              </span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-ui)',
                                  fontSize: '11px',
                                  padding: '1px 7px',
                                  borderRadius: '10px',
                                  background: 'rgba(109, 40, 217, 0.15)',
                                  border: '1px solid rgba(109, 40, 217, 0.25)',
                                  color: 'var(--color-violet-glow)',
                                }}
                              >
                                {spread.cardCount} lá
                              </span>
                            </div>
                            <p
                              className="font-ui"
                              style={{
                                fontSize: '12px',
                                color: 'var(--color-text-dim)',
                                lineHeight: 1.5,
                              }}
                            >
                              {spread.description}
                            </p>
                          </div>
                          {selectedSpread?.id === spread.id && (
                            <span style={{ fontSize: '18px', color: 'var(--color-gold-light)', flexShrink: 0 }}>
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <button
                      id="btn-start-reading"
                      className="btn-primary"
                      onClick={handleStartReading}
                      disabled={!selectedSpread}
                      style={{
                        fontSize: '17px',
                        padding: '16px 48px',
                        opacity: !selectedSpread ? 0.4 : 1,
                        cursor: !selectedSpread ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <span>🔮</span>
                      Bắt Đầu Xem Bài
                    </button>
                    {!selectedSpread && (
                      <p
                        className="font-ui text-dim"
                        style={{ fontSize: '12px', marginTop: '8px' }}
                      >
                        Hãy chọn kiểu trải bài để tiếp tục
                      </p>
                    )}
                  </div>
                </div>

                {/* Feature highlights */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginTop: '32px',
                  }}
                >
                  {[
                    { icon: '🤖', title: 'AI Thông Minh', desc: 'Phân tích sâu sắc bằng Gemini AI' },
                    { icon: '🃏', title: '78 Lá Bài', desc: 'Bộ bài Tarot đầy đủ tiếng Việt' },
                    { icon: '💬', title: 'Hỏi Đáp', desc: 'Chat thêm với Thầy Bói AI' },
                    { icon: '📜', title: 'Lưu Quẻ', desc: 'Lưu và xem lại lịch sử' },
                  ].map((feat) => (
                    <div
                      key={feat.title}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(13, 9, 32, 0.5)',
                        border: '1px solid var(--color-border)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feat.icon}</div>
                      <div className="font-heading text-violet" style={{ fontSize: '13px', marginBottom: '4px' }}>
                        {feat.title}
                      </div>
                      <div className="font-ui text-dim" style={{ fontSize: '11px' }}>
                        {feat.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'shuffle' && selectedSpread && (
              <div style={{ maxWidth: '720px', margin: '0 auto' }} className="animate-fade-in">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <button
                    id="btn-back-to-setup"
                    className="btn-ghost"
                    onClick={() => setStep('setup')}
                    style={{ marginBottom: '16px', fontSize: '13px' }}
                  >
                    ← Quay lại
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '28px' }}>{selectedSpread.emoji}</span>
                    <h2 className="font-heading gradient-text-gold" style={{ fontSize: '22px' }}>
                      {selectedSpread.nameVi}
                    </h2>
                  </div>
                  {question && (
                    <p
                      className="font-body text-muted"
                      style={{ fontSize: '15px', marginTop: '8px', fontStyle: 'italic' }}
                    >
                      &ldquo;{question}&rdquo;
                    </p>
                  )}

                  {/* Positions preview */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      marginTop: '16px',
                    }}
                  >
                    {selectedSpread.positions.map((pos, i) => (
                      <span
                        key={pos.id}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontFamily: 'var(--font-ui)',
                          fontSize: '11px',
                          background: 'rgba(109, 40, 217, 0.15)',
                          border: '1px solid rgba(109, 40, 217, 0.25)',
                          color: 'var(--color-violet-glow)',
                        }}
                      >
                        {i + 1}. {pos.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card" style={{ borderRadius: '20px' }}>
                  <DeckShuffle
                    cardCount={selectedSpread.cardCount}
                    positions={selectedSpread.positions}
                    onComplete={handleCardsDrawn}
                  />
                </div>
              </div>
            )}

            {step === 'reveal' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  padding: '40px 0',
                  textAlign: 'center',
                }}
                className="animate-fade-in"
              >
                <div
                  style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(212, 160, 23, 0.8))' }}
                  className="animate-bounce-subtle"
                >
                  ✨
                </div>
                <h2 className="font-heading gradient-text-gold" style={{ fontSize: '24px' }}>
                  Đang Hé Lộ Quẻ Bài...
                </h2>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {drawnCards.map((dc, i) => (
                    <TarotCardComponent
                      key={i}
                      card={dc.card}
                      isReversed={dc.isReversed}
                      isFlipped={true}
                      size="md"
                      position={dc.position.label}
                      animationDelay={i * 400}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 'result' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
                {/* Back button & header */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h2 className="font-heading gradient-text-mystic" style={{ fontSize: '22px' }}>
                        {selectedSpread?.emoji} Kết Quả Quẻ Bài
                      </h2>
                      {question && (
                        <p className="text-muted font-body" style={{ fontSize: '14px', marginTop: '4px', fontStyle: 'italic' }}>
                          &ldquo;{question}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <AIReadingResult
                  drawnCards={drawnCards}
                  reading={reading}
                  isLoading={isLoadingReading}
                  question={question}
                  userName={userName}
                  apiKey={savedApiKey}
                  tone={tone}
                  onSave={handleSaveReading}
                  onNewReading={handleNewReading}
                />
              </div>
            )}
          </div>
        )}

        {/* ============================
            TAB: ENCYCLOPEDIA
            ============================ */}
        {activeTab === 'encyclopedia' && (
          <div className="container-app" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
            <Encyclopedia />
          </div>
        )}

        {/* ============================
            TAB: HISTORY
            ============================ */}
        {activeTab === 'history' && (
          <div
            className="container-app"
            style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '800px' }}
          >
            <ReadingHistory />
          </div>
        )}

        {/* ============================
            TAB: SETTINGS
            ============================ */}
        {activeTab === 'settings' && (
          <div
            className="container-app"
            style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '640px' }}
          >
            <div style={{ marginBottom: '32px' }}>
              <h2 className="font-heading gradient-text-gold" style={{ fontSize: '24px', marginBottom: '8px' }}>
                ⚙️ Cài Đặt
              </h2>
              <p className="text-muted font-ui" style={{ fontSize: '14px' }}>
                Tùy chỉnh trải nghiệm MysticTarot AI của bạn
              </p>
            </div>

            {/* API Key Section */}
            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '22px' }}>🔑</span>
                <div>
                  <h3 className="font-heading text-violet" style={{ fontSize: '16px' }}>
                    Gemini API Key
                  </h3>
                  <p className="text-dim font-ui" style={{ fontSize: '12px' }}>
                    Để nhận lời giải AI đầy đủ và sâu sắc hơn
                  </p>
                </div>
              </div>

              <div className="divider-violet" />

              <p className="font-ui text-muted" style={{ fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
                🌟 Nhận Gemini API Key miễn phí tại{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-violet-glow)', textDecoration: 'underline' }}
                >
                  Google AI Studio
                </a>
                {' '}. API Key sẽ được lưu trên thiết bị của bạn, không gửi đến server của chúng tôi.
              </p>

              {savedApiKey && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.25)',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: '#4ade80',
                  }}
                >
                  ✅ API Key đã được cấu hình: {savedApiKey.substring(0, 8)}...
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  id="input-api-key"
                  className="input-mystic"
                  type="password"
                  placeholder="AIza... (nhập Gemini API Key của bạn)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  id="btn-save-api-key"
                  className="btn-primary"
                  onClick={handleSaveApiKey}
                  disabled={!apiKey.trim()}
                  style={{ opacity: !apiKey.trim() ? 0.5 : 1 }}
                >
                  Lưu
                </button>
              </div>

              {saveKeyFeedback && (
                <p style={{ marginTop: '10px', fontSize: '13px', color: '#4ade80', fontFamily: 'var(--font-ui)' }}>
                  {saveKeyFeedback}
                </p>
              )}

              {savedApiKey && (
                <button
                  id="btn-clear-api-key"
                  onClick={() => {
                    localStorage.removeItem('gemini-api-key')
                    setSavedApiKey('')
                    setApiKey('')
                  }}
                  style={{
                    marginTop: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-dim)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    textDecoration: 'underline',
                  }}
                >
                  Xóa API Key
                </button>
              )}
            </div>

            {/* About Section */}
            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '22px' }}>🔮</span>
                <h3 className="font-heading text-violet" style={{ fontSize: '16px' }}>
                  Về MysticTarot AI
                </h3>
              </div>
              <div className="divider-violet" />
              <p
                className="font-body text-muted"
                style={{ fontSize: '15px', lineHeight: 1.8 }}
              >
                MysticTarot AI là ứng dụng xem bói Tarot trực tuyến kết hợp trí tuệ nhân tạo Gemini để cung cấp những lời giải quẻ sâu sắc, cá nhân hóa và truyền cảm hứng.
              </p>
              <p
                className="font-body text-muted"
                style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '12px' }}
              >
                Ứng dụng không thay thế cho các chuyên gia tâm lý hoặc y tế. Hãy xem những lời giải như nguồn cảm hứng và sự phản chiếu nội tâm.
              </p>
              <div className="divider-gold" />
              <p
                className="font-body gradient-text-gold"
                style={{ fontSize: '15px', fontStyle: 'italic', textAlign: 'center' }}
              >
                &ldquo;Tarot không tiên đoán số phận - nó soi sáng những khả năng&rdquo;
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '20px 16px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          className="font-ui text-dim"
          style={{ fontSize: '12px' }}
        >
          ✦ MysticTarot AI · Xem Bói Tarot Online · Powered by Google Gemini ✦
        </p>
      </footer>
    </div>
  )
}
