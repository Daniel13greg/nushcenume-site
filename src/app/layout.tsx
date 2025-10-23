import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WatchlistProvider } from '@/context/watchlist-context';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/context/theme-context';
import { PageTransitionWrapper } from '@/components/animations/page-transition-wrapper';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: {
    default: 'NushCeNume - Stream Movies & TV Shows',
    template: '%s • NushCeNume',
  },
  description: 'Stream your favorite movies and TV shows on NushCeNume. Discover trending content, create watchlists, and enjoy unlimited entertainment.',
  keywords: ['movies', 'tv shows', 'streaming', 'watch online', 'entertainment'],
  authors: [{ name: 'NushCeNume' }],
  creator: 'NushCeNume',
  publisher: 'NushCeNume',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'NushCeNume',
    title: 'NushCeNume - Stream Movies & TV Shows',
    description: 'Stream your favorite movies and TV shows on NushCeNume. Discover trending content, create watchlists, and enjoy unlimited entertainment.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NushCeNume',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NushCeNume - Stream Movies & TV Shows',
    description: 'Stream your favorite movies and TV shows on NushCeNume',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NushCeNume',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#dc2626' },
    { media: '(prefers-color-scheme: light)', color: '#dc2626' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof document !== 'undefined') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider>
            <WatchlistProvider>
              <ErrorBoundary>
                <div className="relative flex min-h-dvh flex-col bg-background">
                  <Header />
                  <main className="flex-1">
                    <PageTransitionWrapper>
                      {children}
                    </PageTransitionWrapper>
                  </main>
                  <Footer />
                </div>
                <Toaster />
                <PWAInstallPrompt />
              </ErrorBoundary>
            </WatchlistProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}