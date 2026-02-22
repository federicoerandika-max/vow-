import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vow Control Panel',
  description: 'This is the control panel of the vow app',
  metadataBase: new URL('https://vow-sandy.vercel.app'),
  openGraph: {
    title: 'This is the control panel of the vow app',
    description: 'Manage your wedding website settings',
    images: [
      {
        url: 'https://vow-sandy.vercel.app/assets/img/vowlogo.png',
        width: 512,
        height: 512,
        alt: 'Vow Logo',
      },
    ],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
