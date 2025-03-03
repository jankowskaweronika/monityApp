import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-3xl font-bold">Witaj w aplikacji Monity!</h1>
      <p className="text-xl">Prosty sposób na zarządzanie Twoim budżetem</p>

      <div className="mt-4 p-6 bg-blue-100 rounded-lg">
        <p>Ta strona działa poprawnie! 🎉</p>
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Przejdź do panelu
        </Link>
      </div>
    </div>
  );
}