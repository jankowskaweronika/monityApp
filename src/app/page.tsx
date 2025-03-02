export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Monity</h1>
      <p className="text-xl mb-8">Aplikacja do zarządzania budżetem</p>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Przejdź do dashboardu
      </a>
    </div>
  );
}