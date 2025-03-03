import React from 'react';
import '@/styles/globals.css';

export const metadata = {
  title: 'Monity - Aplikacja Budżetowa',
  description: 'Aplikacja do zarządzania budżetem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="p-4 bg-blue-500 text-white">
            <h1 className="text-xl font-bold">Monity</h1>
          </header>

          <main className="flex-grow p-4">
            {children}
          </main>

          <footer className="p-4 bg-gray-100 text-center">
            <p>© 2025 Monity - Aplikacja Budżetowa</p>
          </footer>
        </div>
      </body>
    </html>
  );
}