'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RootLayoutProps } from '@/types/type';

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/auth');

  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Monity - Aplikacja Budżetowa</title>
        <meta name="description" content="Monity - aplikacja do zarządzania budżetem osobistym" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {isAuthPage ? (
          <div className="flex min-h-screen flex-col">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="container mx-auto px-4 py-4">
                <Link href="/" className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6 text-purple-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span className="font-bold text-xl">Monity</span>
                </Link>
              </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Monity - Wszystkie prawa zastrzeżone
              </div>
            </footer>
          </div>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
};

export default RootLayout;