# Tech Stack - MonityApp

MonityApp to mobilna i responzyjna aplikacja do zarządzania wydatkami, która umożliwia użytkownikom łatwe śledzenie, kategoryzację i analizę swoich finansów.

## 🎨 Frontend

| Technologia      | Wersja  | Opis                                       |
| ---------------- | ------- | ------------------------------------------ |
| **TypeScript**   | ~5.7.2  | Główny język programowania                 |
| **React**        | ^19.0.0 | Framework do budowy interfejsu użytkownika |
| **Redux**        | TBD     | Zarządzanie stanem aplikacji               |
| **React Router** | TBD     | Routing i nawigacja                        |
| **Tailwind CSS** | TBD     | Framework CSS do stylowania                |
| **Recharts**     | TBD     | Biblioteka do tworzenia wykresów           |

## 🏗️ Backend & Infrastruktura

| Technologia                 | Opis                                 |
| --------------------------- | ------------------------------------ |
| **Supabase Authentication** | System uwierzytelniania użytkowników |
| **Supabase PostgreSQL**     | Relacyjna baza danych                |
| **Supabase Hosting**        | Hosting aplikacji                    |
| **Supabase API/REST**       | API do komunikacji z bazą danych     |

## 🛠️ Narzędzia deweloperskie

| Technologia  | Wersja  | Opis                               |
| ------------ | ------- | ---------------------------------- |
| **Vite**     | ^6.3.1  | Bundler i narzędzie do buildowania |
| **ESLint**   | ^9.22.0 | Linter do analizy kodu             |
| **Prettier** | TBD     | Formatowanie kodu                  |

## 🧪 Testowanie

| Technologia               | Opis                         |
| ------------------------- | ---------------------------- |
| **Jest**                  | Testy jednostkowe            |
| **React Testing Library** | Testowanie komponentów React |
| **Cypress**               | Testy end-to-end             |

## 🚀 CI/CD

| Technologia        | Opis                         |
| ------------------ | ---------------------------- |
| **GitHub Actions** | Automatyzacja procesów CI/CD |

## 📦 Obecne zależności

### Dependencies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

### DevDependencies

```json
{
  "@eslint/js": "^9.22.0",
  "@types/react": "^19.0.10",
  "@types/react-dom": "^19.0.4",
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.22.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.19",
  "globals": "^16.0.0",
  "typescript": "~5.7.2",
  "typescript-eslint": "^8.26.1",
  "vite": "^6.3.1"
}
```

## 🏛️ Architektura bazy danych (Supabase)

### Tabele

- **users** - Dane użytkowników
- **expenses** - Przechowywanie wydatków
- **categories** - Kategorie wydatków
- **user_categories** - Niestandardowe kategorie użytkownika

### Funkcje bezpieczeństwa

- **Row Level Security (RLS)** - Zabezpieczenie dostępu do danych
- **Polityki bezpieczeństwa** - Ograniczenie dostępu do własnych danych
- **Indeksy** - Optymalizacja wydajności zapytań

## 🎯 Kluczowe funkcje

- ✅ **Uwierzytelnianie użytkowników** (Email)
- ✅ **CRUD operacje** na wydatkach
- ✅ **Zarządzanie kategoriami** wydatków
- ✅ **Wizualizacja danych** finansowych
- ✅ **Responsywny interfejs** użytkownika
- ✅ **Testy jednostkowe i E2E**

## 📱 Wymagania

- **Node.js** (wersja kompatybilna z React 19)
- **npm** lub **yarn**
- **Konto Supabase** (dla backendu)
- **Nowoczesna przeglądarka** z obsługą ES6+

## 🔗 Przydatne linki

- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)

---

_Ostatnia aktualizacja: 29 maja 2025_
