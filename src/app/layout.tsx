import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Wedding Day 💍',
  description: 'Save the date, here we are!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Montserrat:wght@300;500&display=swap"
          rel="stylesheet"
        />
        <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/assets/img/wedding-logo.png" />
        <link rel="apple-touch-icon" href="/assets/img/wedding-logo.png" />
      </head>
      <body>
        {children}
        <Script src="https://unpkg.com/aos@2.3.4/dist/aos.js" strategy="afterInteractive" />
        <Script id="aos-init" strategy="afterInteractive">
          {`
            if (typeof AOS !== 'undefined') {
              AOS.init({
                duration: 900,
                once: true,
                easing: 'ease-out-cubic'
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
