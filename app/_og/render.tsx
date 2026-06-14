import { ImageResponse } from 'next/og';

// Shared social-share image renderer for all tracks. Real PNG (scrapers need
// raster). next/og (Satori) does NOT support radial-gradient, so glow is faked
// with layered linear-gradients fading to transparent. Only the role + tagline
// lines change per track; the name/handle/footer are constant.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export function renderOgImage({
  role,
  tagline,
}: {
  role: string;
  tagline: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0a0a0f',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(225deg, rgba(0,240,255,0.30), transparent 55%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(45deg, rgba(255,0,229,0.24), transparent 55%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontFamily: 'monospace',
            color: '#00f0ff',
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          {'// XS'}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 116,
            fontWeight: 700,
            lineHeight: 1.05,
            color: '#e9faff',
            letterSpacing: -2,
          }}
        >
          Faith Popoola
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#e7e7f0', marginTop: 26 }}>
          {role}
        </div>
        <div style={{ display: 'flex', fontSize: 27, color: '#8a8aa3', marginTop: 14 }}>
          {tagline}
        </div>
        <div
          style={{
            width: 1040,
            height: 3,
            marginTop: 48,
            background: 'linear-gradient(90deg, #00f0ff, #ff00e5)',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            fontFamily: 'monospace',
            color: '#aaff00',
            marginTop: 28,
          }}
        >
          github.com/Maxima24
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
