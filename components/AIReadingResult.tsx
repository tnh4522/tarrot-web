'use client'

import { useState, useRef, useEffect } from 'react'
import { ReadingResponse, DrawnCard, ChatMessage, AITone } from '@/types/tarot'
import TarotCardComponent from './TarotCard'

interface AIReadingResultProps {
  drawnCards: DrawnCard[]
  reading: ReadingResponse | null
  isLoading: boolean
  question: string
  userName: string
  apiKey?: string
  tone: AITone
  onSave?: () => void
  onNewReading?: () => void
}

export default function AIReadingResult({
  drawnCards,
  reading,
  isLoading,
  question,
  userName,
  apiKey,
  tone,
  onSave,
  onNewReading,
}: AIReadingResultProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleAskFollowUp = async () => {
    if (!chatInput.trim() || isChatLoading) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setIsChatLoading(true)

    const newMsg: ChatMessage = { role: 'user', content: userMsg, timestamp: Date.now() }
    setChatMessages((prev) => [...prev, newMsg])

    try {
      const res = await fetch('/api/tarot-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          userName,
          spreadType: 'follow-up',
          drawnCards,
          tone,
          apiKey,
          context: reading,
          chatHistory: chatMessages,
          isFollowUp: true,
        }),
      })
      const data = await res.json()
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.message || 'Xin lỗi, tôi chưa thể trả lời ngay lúc này.',
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, aiMsg])
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, đã xảy ra lỗi. Hãy thử lại sau.',
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 20px',
          gap: '24px',
        }}
        className="animate-fade-in"
      >
        {/* Crystal ball loading animation */}
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(167, 139, 250, 0.5), rgba(13, 9, 32, 0.9))',
              border: '2px solid rgba(167, 139, 250, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 0 30px rgba(109, 40, 217, 0.4), 0 0 60px rgba(109, 40, 217, 0.2)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            🔮
          </div>
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '2px solid rgba(212, 160, 23, 0.3)',
              borderTopColor: 'rgba(212, 160, 23, 0.8)',
              animation: 'spin-slow 1.5s linear infinite',
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p
            className="font-heading gradient-text-mystic"
            style={{ fontSize: '20px', marginBottom: '8px' }}
          >
            Vũ Trụ Đang Thì Thầm...
          </p>
          <p className="text-muted font-ui" style={{ fontSize: '14px' }}>
            AI đang kết nối với năng lượng của những lá bài
          </p>
        </div>
        {/* Show cards face up while loading */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          {drawnCards.map((dc, i) => (
            <TarotCardComponent
              key={i}
              card={dc.card}
              isReversed={dc.isReversed}
              isFlipped={true}
              size="sm"
              position={dc.position.label}
              animationDelay={i * 300}
              showLabel={true}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!reading) return null

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      className="animate-fade-in-up"
    >
      {/* Cards display */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '24px' }}>
        <h3
          className="font-heading gradient-text-gold"
          style={{ fontSize: '18px', textAlign: 'center', marginBottom: '24px', letterSpacing: '0.08em' }}
        >
          ✦ Những Lá Bài Của Bạn ✦
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {drawnCards.map((dc, i) => (
            <TarotCardComponent
              key={i}
              card={dc.card}
              isReversed={dc.isReversed}
              isFlipped={true}
              size={drawnCards.length === 1 ? 'xl' : drawnCards.length <= 3 ? 'lg' : 'md'}
              position={dc.position.label}
              animationDelay={i * 200}
              showLabel={true}
            />
          ))}
        </div>
      </div>

      {/* Overall Message */}
      <div
        className="glass-card"
        style={{
          borderRadius: '16px',
          padding: '28px',
          borderColor: 'rgba(212, 160, 23, 0.25)',
          boxShadow: '0 0 40px rgba(212, 160, 23, 0.05) inset',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🌌</span>
          <h3 className="font-heading gradient-text-mystic" style={{ fontSize: '18px' }}>
            Thông Điệp Tổng Quan
          </h3>
        </div>
        <p
          className="prose-mystic"
          style={{ lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{ __html: reading.overallMessage.replace(/\n/g, '<br/>') }}
        />
      </div>

      {/* Individual card analyses */}
      {reading.cardAnalyses && reading.cardAnalyses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reading.cardAnalyses.map((analysis, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                borderRadius: '16px',
                padding: '24px',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    background: 'rgba(109, 40, 217, 0.2)',
                    border: '1px solid rgba(109, 40, 217, 0.3)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '11px',
                    color: 'var(--color-violet-glow)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {analysis.position}
                </span>
                <h4 className="font-heading text-gold" style={{ fontSize: '16px' }}>
                  {analysis.cardName}
                </h4>
              </div>
              <p
                className="prose-mystic"
                style={{ fontSize: '16px' }}
                dangerouslySetInnerHTML={{ __html: analysis.analysis.replace(/\n/g, '<br/>') }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Advice */}
      <div
        className="glass-card"
        style={{
          borderRadius: '16px',
          padding: '28px',
          background: 'rgba(13, 9, 32, 0.8)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '22px' }}>💫</span>
          <h3 className="font-heading gradient-text-violet" style={{ fontSize: '18px' }}>
            Lời Khuyên Từ Vũ Trụ
          </h3>
        </div>
        <p className="prose-mystic" dangerouslySetInnerHTML={{ __html: reading.advice.replace(/\n/g, '<br/>') }} />

        {reading.affirmation && (
          <>
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
              <p
                className="font-body gradient-text-gold"
                style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: 1.6 }}
              >
                &ldquo;{reading.affirmation}&rdquo;
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          id="btn-toggle-chat"
          className="btn-primary"
          onClick={() => setShowChat(!showChat)}
        >
          <span>💬</span>
          {showChat ? 'Ẩn Hỏi Đáp' : 'Hỏi Thêm Thầy Bói AI'}
        </button>
        {onSave && (
          <button id="btn-save-reading" className="btn-gold" onClick={onSave}>
            <span>📜</span>
            Lưu Quẻ Bài
          </button>
        )}
        {onNewReading && (
          <button id="btn-new-reading" className="btn-ghost" onClick={onNewReading}>
            <span>🔄</span>
            Quẻ Mới
          </button>
        )}
      </div>

      {/* Follow-up Chat */}
      {showChat && (
        <div
          className="glass-card"
          style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🔮</span>
            <div>
              <div className="font-heading text-violet" style={{ fontSize: '15px' }}>
                Thầy Bói AI
              </div>
              <div className="text-dim font-ui" style={{ fontSize: '11px' }}>
                Hỏi thêm về quẻ bài của bạn
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              maxHeight: '360px',
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p className="text-muted font-body" style={{ fontSize: '15px', fontStyle: 'italic' }}>
                  Bạn có câu hỏi nào về quẻ bài không? Hãy hỏi tôi...
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background:
                      msg.role === 'user'
                        ? 'rgba(109, 40, 217, 0.3)'
                        : 'rgba(26, 20, 53, 0.8)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(212, 160, 23, 0.2)'}`,
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'var(--color-text)',
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            ))}
            {isChatLoading && (
              <div style={{ display: 'flex', gap: '6px', padding: '8px 16px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-violet-glow)',
                      animation: `bounce-subtle 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              id="chat-input"
              className="input-mystic"
              placeholder="Hỏi về ý nghĩa lá bài, lời khuyên cụ thể..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAskFollowUp()}
              disabled={isChatLoading}
              style={{ flex: 1 }}
            />
            <button
              id="btn-send-chat"
              className="btn-primary"
              onClick={handleAskFollowUp}
              disabled={isChatLoading || !chatInput.trim()}
              style={{ padding: '12px 20px', opacity: !chatInput.trim() ? 0.5 : 1 }}
            >
              ✦
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
