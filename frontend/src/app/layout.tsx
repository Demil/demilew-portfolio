import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Demilew Terefe | AI Developer & Researcher',
  description:
    'Portfolio and research of Demilew Terefe — AI Developer and Researcher specializing in Python, FastAPI, PyTorch, AI Security, and modern backend systems.',
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
