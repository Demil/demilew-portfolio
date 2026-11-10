import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Demilew Terefe | Software Engineer',
  description:
    'Executive portfolio and research dossier of Demilew Terefe — Software Engineer and Applied AI Researcher specializing in Python, FastAPI, PyTorch, AI Security, and distributed backend architectures.',
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
