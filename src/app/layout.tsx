import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Kidsyee - The Smart Screen Time Guardian',
  description: 'Kidsyee helps children build healthy digital habits. Protect vision with AI-powered breaks, foster reflection with the AI Diary Buddy, and gamify wellness with fun eye-health missions.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kidsyee',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#2E8AB8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-[#F8FAFC] select-none touch-pan-y">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
