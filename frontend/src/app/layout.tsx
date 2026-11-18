import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.demilew.com'),
  title: 'Demilew Terefe | AI Developer & Machine Learning Engineer',
  description:
    'Portfolio and research of Demilew Terefe — AI Developer and Machine Learning Engineer specializing in Python, FastAPI, PyTorch, AI Security, and modern backend systems.',
  alternates: {
    canonical: 'https://www.demilew.com',
  },
  openGraph: {
    title: 'Demilew Terefe | AI Developer & Machine Learning Engineer',
    description:
      'Portfolio and research of Demilew Terefe — AI Developer and Machine Learning Engineer.',
    url: 'https://www.demilew.com',
    siteName: 'Demilew Terefe Portfolio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-150 bg-[var(--bg-base)] text-[var(--text-primary)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
