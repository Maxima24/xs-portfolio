import { ImageResponse } from 'next/og';

// Apple touch icon (180x180 PNG). Satori-safe linear-gradient only (no radial).
export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 92,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: '#00f0ff',
          background: 'linear-gradient(135deg, #0a0a0f 35%, #14202e 100%)',
        }}
      >
        XS
      </div>
    ),
    { ...size },
  );
}
