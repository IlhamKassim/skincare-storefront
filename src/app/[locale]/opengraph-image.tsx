import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TAGLINE: Record<string, string> = {
  en: 'Free skin quiz for Malaysia\'s climate',
  ms: 'Kuiz kulit percuma untuk iklim Malaysia',
};

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tagline = TAGLINE[locale] ?? TAGLINE.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #FDF2F8, #F9A8D4)',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#831843',
            letterSpacing: '-0.02em',
          }}
        >
          SkinSync
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#DB2777',
            marginTop: 16,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
