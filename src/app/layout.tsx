import type { Metadata } from 'next';
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
        <link rel="icon" type="image/png" href="/assets/img/wedding-logo.png" />
        <link rel="apple-touch-icon" href="/assets/img/wedding-logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
