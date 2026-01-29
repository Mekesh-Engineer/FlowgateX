import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { StoreProvider } from '@/providers/store-provider';
import { AuthProvider } from '@/providers/auth-provider';

// 1. Configure Fonts using next/font (matches your snippet's weights)
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-primary',
  display: 'swap',
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

// 2. Metadata (Replaces <title> and <meta> tags)
export const metadata: Metadata = {
  title: 'FlowGateX - Event Management Platform',
  description: 'FlowGateX - Modern Event Management Platform with Advanced Layout System',
  icons: {
    icon: '/icons/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#eb1616',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Material Icons - Keep as CDN as they are difficult to bundle purely via CSS modules */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
        
        {/* Animate.css */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        
        {/* Toastify CSS (If not using the React component version) */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css" />

        {/* Theme Initialization Script to prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-primary bg-bg-primary text-text-primary antialiased`}>
        <StoreProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </StoreProvider>

        {/* 3. External Scripts 
           Note: In Next.js, prefer installing these via npm (see list below). 
           If you MUST use CDNs, use the Script component.
        */}
        
        {/* SweetAlert2 */}
        <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" strategy="lazyOnload" />
        
        {/* ApexCharts */}
        <Script src="https://cdn.jsdelivr.net/npm/apexcharts" strategy="lazyOnload" />

        {/* Preline UI */}
        <Script src="https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.js" strategy="lazyOnload" />

        {/* Accessibility & Performance Observers */}
        <Script id="app-observers" strategy="afterInteractive">
          {`
            // Route Change Announcer for Screen Readers
            let lastPathname = window.location.pathname;
            const observer = new MutationObserver(() => {
                if (lastPathname !== window.location.pathname) {
                    lastPathname = window.location.pathname;
                    const announcement = document.createElement('div');
                    announcement.setAttribute('role', 'status');
                    announcement.setAttribute('aria-live', 'polite');
                    announcement.className = 'sr-only';
                    announcement.textContent = 'Navigated to ' + document.title;
                    document.body.appendChild(announcement);
                    setTimeout(() => announcement.remove(), 1000);
                }
            });
            const title = document.querySelector('title');
            if(title) observer.observe(title, { childList: true });
          `}
        </Script>
      </body>
    </html>
  );
}