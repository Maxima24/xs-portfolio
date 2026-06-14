import { ImageResponse } from 'next/og';

// PNG favicon (broad compatibility alongside the SVG).
export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

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
          fontSize: 34,
          fontWeight: 700,
          fontFamily: 'monospace',
          letterSpacing: 1,
          color: '#00f0ff',
          background: '#0a0a0f',
          borderRadius: 14,
        }}
      >
        XS
      </div>
    ),
    { ...size },
  );
}
