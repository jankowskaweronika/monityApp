import '../styles/globals.css'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monity - Aplikacja do zarządzania budżetem',
  description: 'Monitoruj swoje wydatki, twórz budżety i osiągaj cele finansowe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        {children}
      </body>
    </html>
  );
}