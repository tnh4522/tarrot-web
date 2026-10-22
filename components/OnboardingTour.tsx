'use client'

import React, { useState, useEffect, useCallback } from 'react'

export interface TourStep {
  targetId?: string
  title: string
  content: string
  icon?: string
}

const TOUR_STEPS: TourStep[] = [
  {
    icon: '🔮',
    title: 'Chào mừng bạn đến với MysticTarot AI',
    content: 'Đây là không gian khám phá tâm linh & nhận thông điệp vũ trụ từ 78 lá bài Tarot kết hợp trí tuệ nhân tạo. Hãy cùng lướt qua vài thao tác đơn giản để bắt đầu quẻ bài của bạn!',
  },
  {
    targetId: 'input-user-name',
    icon: '👤',
    title: 'Bước 1: Kết nối năng lượng',
    content: 'Nhập tên của bạn để vũ trụ và AI gửi gắm thông điệp được cá nhân hóa sâu sắc và gần gũi nhất.',
  },
  {
    targetId: 'input-question',
    icon: '🌙',
    title: 'Bước 2: Đặt câu hỏi hoặc ước nguyện',
    content: 'Viết ra điều bạn băn khoăn về tình duyên, sự nghiệp, cuộc sống... Bạn cũng có thể để trống để đón nhận thông điệp ngẫu nhiên từ vũ trụ.',
  },
  {
    targetId: 'btn-tone-empathetic',
    icon: '✨',
    title: 'Bước 3: Phong cách Thầy Bói',
    content: 'Chọn phong cách luận giải của Reader: Thấu Cảm (ấm áp, chữa lành), Trực Diện (thẳng thắn, thực tế) hoặc Huyền Bí (triết lý, thơ mộng).',
  },
  {
    targetId: 'btn-spread-daily',
    icon: '🃏',
    title: 'Bước 4: Chọn kiểu trải bài',
    content: 'Chọn trải bài: Thông điệp ngày mới (1 lá), Quá khứ - Hiện tại - Tương lai (3 lá), Tình cảm, Sự nghiệp hoặc Trải bài Tổng quan chuyên sâu (5 lá).',
  },
  {
    targetId: 'nav-tab-encyclopedia',
    icon: '📖',
    title: 'Bách Khoa 78 Lá Bài',
    content: 'Tra cứu nhanh hình ảnh, biểu tượng, ý nghĩa xuôi/ngược và lời khuyên chi tiết của trọn bộ 78 lá bài Tarot bất kỳ lúc nào trên thanh menu.',
  },
  {
    targetId: 'nav-tab-settings',
    icon: '⚙️',
    title: 'Cấu hình Gemini API (Tùy chọn)',
    content: 'Trang web đã có sẵn chế độ giải quẻ bài tự động. Bạn cũng có thể nhập Gemini API Key của mình trong Cài Đặt để AI trò chuyện tự do và phản hồi tức thì.',
  },
  {
    icon: '🌟',
    title: 'Bạn đã sẵn sàng!',
    content: 'Hãy giữ tâm trí tĩnh lặng, tập trung vào năng lượng của bạn và bắt đầu khai mở những thông điệp vũ trụ!',
  },
]

interface OnboardingTourProps {
  activeTab: string
  onSwitchTab?: (tab: 'reading' | 'encyclopedia' | 'history' | 'settings') => void
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingTour({
  isOpen,
  onClose,
}: OnboardingTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const currentStep = TOUR_STEPS[currentStepIndex]

  // Update target spotlight position
  const updateSpotlight = useCallback(() => {
    if (!isOpen || !currentStep?.targetId) {
      setTargetRect(null)
      return
    }

    const targetEl = document.getElementById(currentStep.targetId)
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect()
      // Scroll into view if outside viewport
      const isVisible =
        rect.top >= 80 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 80

      if (!isVisible) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // Re-read rect after slight moment or use viewport-relative coordinates
      const freshRect = targetEl.getBoundingClientRect()
      setTargetRect({
        top: freshRect.top,
        left: freshRect.left,
        width: freshRect.width,
        height: freshRect.height,
      })
    } else {
      setTargetRect(null)
    }
  }, [isOpen, currentStep])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updateSpotlight, 150)
      const handleScroll = () => {
        if (!currentStep?.targetId) return
        const targetEl = document.getElementById(currentStep.targetId)
        if (targetEl) {
          const freshRect = targetEl.getBoundingClientRect()
          setTargetRect({
            top: freshRect.top,
            left: freshRect.left,
            width: freshRect.width,
            height: freshRect.height,
          })
        }
      }

      window.addEventListener('resize', handleScroll)
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', handleScroll)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isOpen, currentStepIndex, updateSpotlight, currentStep])

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mystic-tarot-tour-completed', 'true')
    }
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      {/* SVG Mask: darkened background everywhere EXCEPT the spotlight hole */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White reveals the dark backdrop */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cuts out the spotlight hole */}
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 6}
                width={targetRect.width + 16}
                height={targetRect.height + 12}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* The semi-transparent dark backdrop overlay with cut-out hole */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(5, 3, 15, 0.7)"
          mask="url(#tour-spotlight-mask)"
          style={{ pointerEvents: 'auto' }}
          onClick={handleComplete}
        />
      </svg>

      {/* Golden Glowing Border around the target element */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 12,
            borderRadius: '12px',
            border: '2px solid rgba(240, 192, 64, 0.9)',
            boxShadow: '0 0 20px 4px rgba(212, 160, 23, 0.5), inset 0 0 10px rgba(167, 139, 250, 0.3)',
            pointerEvents: 'none',
            zIndex: 10001,
            transition: 'all 0.25s ease-out',
          }}
        />
      )}

      {/* Floating Dialog Modal */}
      <div
        style={{
          position: 'fixed',
          zIndex: 10002,
          maxWidth: '440px',
          width: 'calc(100vw - 32px)',
          ...calculateDialogPosition(targetRect),
          transition: 'top 0.3s ease, left 0.3s ease',
        }}
        className="glass-card animate-fade-in-up"
      >
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, rgba(26, 20, 53, 0.98), rgba(13, 9, 32, 0.99))',
            border: '1px solid rgba(212, 160, 23, 0.5)',
            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(139, 92, 246, 0.3)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '24px',
                  filter: 'drop-shadow(0 0 8px rgba(240, 192, 64, 0.6))',
                }}
              >
                {currentStep.icon || '✨'}
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-gold-light)',
                  fontSize: '16px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {currentStep.title}
              </div>
            </div>

            <button
              onClick={handleComplete}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px',
                lineHeight: 1,
              }}
              title="Đóng hướng dẫn"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--color-text)',
              marginBottom: '20px',
            }}
          >
            {currentStep.content}
          </p>

          {/* Footer Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(139, 92, 246, 0.2)',
              paddingTop: '16px',
            }}
          >
            {/* Step Counter Dots */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: idx === currentStepIndex ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background:
                      idx === currentStepIndex
                        ? 'var(--color-gold-light)'
                        : 'rgba(255, 255, 255, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="btn-mystic"
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Trước
                </button>
              )}

              <button
                onClick={handleNext}
                className="btn-mystic"
                style={{
                  padding: '8px 18px',
                  fontSize: '12px',
                  background: 'linear-gradient(135deg, var(--color-violet), #4c1d95)',
                  borderColor: 'rgba(212, 160, 23, 0.6)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {currentStepIndex === TOUR_STEPS.length - 1 ? 'Khám phá ngay ✨' : 'Tiếp theo →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateDialogPosition(
  rect: { top: number; left: number; width: number; height: number } | null
): React.CSSProperties {
  if (!rect || typeof window === 'undefined') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const dialogWidth = Math.min(440, viewportWidth - 32)
  const dialogEstHeight = 230

  // Calculate centered horizontal placement relative to target
  let left = Math.max(
    16,
    Math.min(viewportWidth - dialogWidth - 16, rect.left + rect.width / 2 - dialogWidth / 2)
  )

  let top = 0

  // Determine whether to place dialog below or above target
  const spaceBelow = viewportHeight - (rect.top + rect.height)
  const spaceAbove = rect.top

  if (spaceBelow >= dialogEstHeight + 20) {
    // Place below
    top = rect.top + rect.height + 16
  } else if (spaceAbove >= dialogEstHeight + 20) {
    // Place above
    top = rect.top - dialogEstHeight - 16
  } else {
    // Place vertically centered
    top = Math.max(16, (viewportHeight - dialogEstHeight) / 2)
  }

  return {
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
  }
}
