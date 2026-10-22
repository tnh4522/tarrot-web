import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #130f2a 0%, #05030f 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(212, 160, 23, 0.7)',
        }}
      >
        <span
          style={{
            fontSize: '20px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🔮
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
