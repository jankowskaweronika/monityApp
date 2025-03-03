import React from 'react';
import '@/styles/globals.css';

export const metadata = {
  title: 'Monity - Aplikacja Budżetowa',
  description: 'Aplikacja do zarządzania budżetem',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="pl">
      <body>
        <main className="flex-grow p-4">
          {children}
        </main>
      </body>
    </html >
  );
}

export default RootLayout