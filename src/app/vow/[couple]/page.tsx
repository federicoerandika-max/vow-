import type { Metadata } from 'next';
import { getWeddingConfigBySlug } from '@/config/loader';
import WeddingClient from './WeddingClient';

interface PageProps {
  params: { couple: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.couple);
  const config = await getWeddingConfigBySlug(slug);

  if (!config) {
    return { title: 'Wedding not found' };
  }

  const coupleNames = config.couple.names.join(' & ');
  const siteName = config.metadata?.siteName || `${coupleNames} – Wedding Day 💍`;
  const description = `Save the date for ${coupleNames}'s wedding!`;

  // Build the canonical URL — always use the Vercel base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vow-sandy.vercel.app';
  const coupleSlug = config.metadata?.coupleSlug || params.couple;
  const ogUrl = `${baseUrl}/vow/${encodeURIComponent(coupleSlug)}`;

  const ogImage = config.metadata?.ogImage || `${baseUrl}/assets/img/vowlogo.png`;

  return {
    title: siteName,
    description,
    openGraph: {
      title: siteName,
      description,
      url: ogUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${coupleNames} Wedding`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [ogImage],
    },
    icons: {
      icon: '/assets/img/wedding-logo.png',
      apple: '/assets/img/wedding-logo.png',
    },
  };
}

export default function CouplePage({ params }: PageProps) {
  const slug = decodeURIComponent(params.couple);
  return <WeddingClient coupleSlug={slug} />;
}
