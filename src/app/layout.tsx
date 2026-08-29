import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crime Hotspot Detection',
  description: 'Crime Hotspot Detection Application.',
  openGraph: {
    title: 'Crime Hotspot Detection',
    description: 'Crime Hotspot Detection Application.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
