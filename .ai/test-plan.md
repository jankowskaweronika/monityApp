---
description:
globs:
alwaysApply: false
---

<analiza_projektu>

### 1. Kluczowe komponenty projektu

Na podstawie analizy kodu zidentyfikowano następujące kluczowe komponenty i moduły:

- **Rdzeń Aplikacji (`App.tsx`, `main.tsx`, `router.tsx`):** Inicjalizuje aplikację, dostawców kontekstu (Redux, Supabase) oraz zarządza routingiem. Kluczowym elementem jest routing z ochroną tras (`AuthGuard`, `PublicRoute`) w zależności od stanu uwierzytelnienia. `App.tsx` obsługuje początkowe ładowanie i nasłuchiwanie zmian stanu sesji z Supabase.
- **Zarządzanie Stanem - Autentykacja (`store/authSlice.ts`):** Centralne miejsce logiki stanu uwierzytelnienia. Obsługuje logowanie, wylogowywanie, ustawianie użytkownika, błędy oraz sprawdzanie wygaśnięcia sesji (`checkSession`). Współpracuje bezpośrednio z Supabase.
- **Warstwa Usług API (`api/services/`):**
  - `expense.service.ts`: Logika biznesowa operacji CRUD na wydatkach. Zawiera walidację Zod, filtrowanie, sortowanie i paginację. Wymaga uwierzytelnionego użytkownika.
  - `category.service.ts`: Logika CRUD dla kategorii.
  - `analytics.service.ts`: Bardziej złożona logika do agregacji danych i generowania statystyk (podsumowania, trendy). Obliczenia dat i sumowanie są kluczowe.
- **Obsługa Błędów (`api/utils/supabase.error.ts`):** Niestandardowa klasa do obsługi i mapowania błędów z PostgREST (baza danych Supabase) i Supabase Auth na spójny format, co jest kluczowe dla debugowania i prezentacji błędów użytkownikowi.
- **Komponenty UI - Formularze Autentykacji (`components/auth/`):**
  - `LoginForm.tsx`, `RegisterForm.tsx`, `PasswordResetForm.tsx`: Komponenty z logiką walidacji po stronie klienta, obsługą stanu ładowania i wyświetlaniem błędów. `RegisterForm` zawiera złożoną walidację hasła.
- **Komponenty UI - Dashboard (`components/dashboard/`):**
  - `PeriodSummary.tsx`: Wyświetla zagregowane dane finansowe dla wybranego okresu, wskaźniki trendu i statystyki.
  - `ExpensesChart.tsx`: Komponent wizualizacji danych (wykres kołowy) z wykorzystaniem `react-chartjs-2`.
- **Hook Logiki Biznesowej (`hooks/useDashboardData.ts`):** Kluczowy hook, który orkiestruje pobieranie wszystkich danych potrzebnych dla `DashboardView`. Zarządza stanami ładowania, obsługą błędów, odświeżaniem danych i implementuje optymistyczną aktualizację UI przy dodawaniu wydatku.
- **Integracja z BaaS (`db/supabase.client.ts`, `context/SupabaseProvider.tsx`):** Konfiguracja i inicjalizacja klienta Supabase, który jest jedynym punktem kontaktu z backendem i bazą danych.

### 2. Specyfika stosu technologicznego i jego wpływ na strategię testowania

- **React + TypeScript:** Umożliwia silne typowanie, co ułatwia testowanie i zapobiega wielu błędom. Strategia testowania musi być oparta na komponentach, z wykorzystaniem narzędzi takich jak React Testing Library do testowania zachowania komponentów z perspektywy użytkownika.
- **Vite:** Szybkie środowisko deweloperskie i budujące. Do testów jednostkowych i integracyjnych idealnie pasuje `Vitest`, który jest w pełni kompatybilny i oferuje podobne API do popularnego Jesta.
- **Supabase (BaaS):** To najważniejszy element architektury. Aplikacja nie ma tradycyjnego backendu, cała logika dostępu do danych i autentykacji opiera się na kliencie Supabase.
  - **Implikacje:** Testy integracyjne _muszą_ mockować klienta Supabase, aby izolować testy od sieci i zewnętrznej usługi. Testy E2E _muszą_ być przeprowadzane na dedykowanej instancji Supabase (środowisko testowe/stagingowe) z predefiniowanymi danymi, aby weryfikować poprawność integracji, w tym reguł Row Level Security (RLS).
- **Redux Toolkit (`authSlice`):** Uproszczone zarządzanie stanem.
  - **Implikacje:** Ułatwia testowanie logiki stanu. Reducery są czystymi funkcjami, co czyni je trywialnymi do testowania jednostkowego. Należy również przetestować selektory i asynchroniczne akcje (thunks), jeśli byłyby używane.
- **React Router v6:** Routing po stronie klienta.
  - **Implikacje:** Należy testować nawigację, renderowanie odpowiednich komponentów dla danych ścieżek oraz, co najważniejsze, działanie komponentów chroniących trasy (`AuthGuard`, `PublicRoute`).
- **Zod:** Walidacja schematów.
  - **Implikacje:** Schematy Zod powinny być testowane jednostkowo, aby upewnić się, że poprawnie walidują zarówno prawidłowe, jak i nieprawidłowe dane. Można je również wykorzystać do generowania danych testowych.
- **TailwindCSS + Shadcn/UI:** System utility-first i biblioteka komponentów.
  - **Implikacje:** Testowanie funkcjonalne nie jest wystarczające. Należy wprowadzić testy wizualnej regresji (np. za pomocą Storybook + Chromatic), aby upewnić się, że komponenty renderują się poprawnie i zmiany w stylach nie powodują nieoczekiwanych defektów wizualnych. Trzeba też sprawdzić responsywność i tryb ciemny.

### 3. Priorytety testowe bazujące na strukturze repozytorium

1.  **Ścieżka krytyczna: Autentykacja i Autoryzacja (Priorytet: KRYTYCZNY):** Obejmuje `authSlice`, wszystkie strony w `pages/auth/`, komponenty w `components/auth/`, `router.tsx` (szczególnie `AuthGuard` i `PublicRoute`). Błąd w tym obszarze uniemożliwia korzystanie z aplikacji lub stanowi lukę bezpieczeństwa.
2.  **Główna funkcjonalność: CRUD na wydatkach i analityka (Priorytet: WYSOKI):** Obejmuje `expense.service.ts`, `analytics.service.ts`, hook `useDashboardData.ts` oraz widok `DashboardView.tsx`. To jest serce aplikacji. Należy zapewnić, że dane są poprawnie tworzone, odczytywane, agregowane i prezentowane.
3.  **Integralność danych: Walidacja i obsługa błędów (Priorytet: WYSOKI):** Obejmuje schematy Zod we wszystkich usługach oraz `supabase.error.ts`. Poprawna walidacja i obsługa błędów z backendu są kluczowe dla stabilności i dobrego UX.
4.  **Doświadczenie użytkownika: Komponenty UI i interakcje (Priorytet: ŚREDNI):** Obejmuje wszystkie komponenty UI, w szczególności te interaktywne jak `ExpensesChart`, `PeriodSummary` i formularze. Testy powinny obejmować responsywność, dostępność i spójność wizualną.
5.  **Funkcje pomocnicze: Zarządzanie profilami i kategoriami (Priorytet: NISKI):** Obejmuje `SettingsPage.tsx` i `category.service.ts`. Są to ważne funkcje, ale nie blokują podstawowego przepływu pracy użytkownika.

### 4. Potencjalne obszary ryzyka

- **Zależność od Supabase:** Aplikacja jest ściśle powiązana z Supabase. Każda zmiana w API Supabase, problemy z wydajnością usługi lub nieprawidłowo skonfigurowane polityki RLS mogą całkowicie zablokować działanie aplikacji.
- **Zarządzanie stanem sesji:** Logika w `App.tsx` (nasłuchiwanie `onAuthStateChange`), `authSlice` (timeout sesji) i `SessionChecker.tsx` (okresowe sprawdzanie) jest złożona. Istnieje ryzyko wystąpienia race conditions, np. gdy użytkownik zostanie wylogowany przez timeout, a inna operacja w tle nadal próbuje użyć jego sesji.
- **Poprawność obliczeń analitycznych:** `AnalyticsService` wykonuje obliczenia na podstawie dat (które mogą być wrażliwe na strefy czasowe, `new Date()` jest ryzykowne) i agreguje sumy. Błędy w tej logice mogą prowadzić do wyświetlania użytkownikowi nieprawidłowych danych finansowych, co podważa zaufanie do aplikacji.
- **Optymistyczne aktualizacje UI:** Hook `useDashboardData` implementuje optymistyczną aktualizację przy dodawaniu wydatku. Scenariusz błędu (rollback) jest trudniejszy do przetestowania i może prowadzić do niespójności UI, jeśli nie zostanie zaimplementowany poprawnie.
- **Bezpieczeństwo po stronie klienta:** Klucze API Supabase (`VITE_SUPABASE_KEY`) są z definicji publiczne (anon key). Bezpieczeństwo opiera się w całości na politykach RLS w Supabase. Testy E2E muszą weryfikować, czy użytkownik A nie może w żaden sposób odczytać ani zmodyfikować danych użytkownika B.

</analiza_projektu>

# Plan Testów dla Aplikacji "Monity"

## 1. Wprowadzenie i cele testowania

### 1.1. Wprowadzenie

Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji do śledzenia wydatków "Monity". Aplikacja jest zbudowana w oparciu o nowoczesny stos technologiczny, w tym React, TypeScript i TailwindCSS, z Supabase jako Backend-as-a-Service (BaaS) do obsługi autentykacji i bazy danych. Plan ten ma na celu usystematyzowanie procesu zapewnienia jakości (QA) w całym cyklu życia projektu.

### 1.2. Cele

Główne cele procesu testowania to:

- **Weryfikacja funkcjonalności:** Zapewnienie, że wszystkie funkcje aplikacji działają zgodnie ze specyfikacją.
- **Zapewnienie niezawodności:** Identyfikacja i eliminacja błędów, które mogłyby prowadzić do awarii aplikacji lub utraty danych.
- **Walidacja bezpieczeństwa:** Potwierdzenie, że mechanizmy autentykacji i autoryzacji skutecznie chronią dane użytkowników.
- **Ocena użyteczności i UX:** Sprawdzenie, czy interfejs użytkownika jest intuicyjny, responsywny i spójny wizualnie na różnych urządzeniach i przeglądarkach.
- **Zapewnienie wydajności:** Weryfikacja, czy aplikacja działa płynnie, a czasy ładowania są akceptowalne.

## 2. Zakres testów

### 2.1. Funkcjonalności objęte testami (In-Scope)

- **Moduł autentykacji:** Rejestracja, logowanie, wylogowywanie, resetowanie hasła, obsługa sesji użytkownika.
- **Ochrona tras (Routing):** Dostęp do stron publicznych i chronionych w zależności od statusu zalogowania.
- **Dashboard:** Wyświetlanie podsumowania wydatków, wykresu dystrybucji, listy ostatnich transakcji.
- **Zarządzanie wydatkami:** Dodawanie, edytowanie i usuwanie wydatków (CRUD).
- **Analityka:** Filtrowanie danych według okresów (dzień, tydzień, miesiąc, rok) i poprawność agregacji danych.
- **Ustawienia użytkownika:** Aktualizacja danych profilowych i zmiana hasła.
- **Interfejs użytkownika:** Wszystkie komponenty UI, responsywność, tryb jasny/ciemny.

### 2.2. Elementy wyłączone z testów (Out-of-Scope)

- Infrastruktura i wewnętrzne działanie usługi Supabase.
- Testowanie wewnętrznej implementacji bibliotek firm trzecich (np. `react-router-dom`, `chart.js`).
- Szczegółowe testy wydajnościowe pod dużym obciążeniem (stress tests).

## 3. Typy testów do przeprowadzenia

Proces testowania będzie obejmował kilka poziomów i typów testów:

- **Testy jednostkowe (Unit Tests):**

  - **Cel:** Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (funkcje, komponenty, hooki).
  - **Zakres:** Funkcje pomocnicze (`lib/utils.ts`), reducery i akcje Redux (`store/authSlice.ts`), schematy walidacji Zod, proste komponenty UI (`components/ui/`).
  - **Narzędzia:** Vitest, React Testing Library.

- **Testy integracyjne (Integration Tests):**

  - **Cel:** Sprawdzenie, czy kilka połączonych modułów współpracuje ze sobą poprawnie.
  - **Zakres:** Komponenty-kontenery (`DashboardView.tsx`) z hookami (`useDashboardData.ts`) i stanem Redux; usługi API (`api/services/`) z zamockowanym klientem Supabase; formularze z logiką walidacji.
  - **Narzędzia:** Vitest, React Testing Library, `vi.mock` do mockowania Supabase.

- **Testy End-to-End (E2E):**

  - **Cel:** Symulacja rzeczywistych scenariuszy użycia aplikacji z perspektywy użytkownika w przeglądarce.
  - **Zakres:** Pełne przepływy, np. "rejestracja -> logowanie -> dodanie wydatku -> weryfikacja na dashboardzie -> wylogowanie".
  - **Narzędzia:** Playwright.

- **Testy wizualnej regresji (Visual Regression Tests):**

  - **Cel:** Wykrywanie niezamierzonych zmian w wyglądzie interfejsu użytkownika.
  - **Zakres:** Kluczowe komponenty z `components/ui/`, `DashboardView`, formularze.
  - **Narzędzia:** Storybook z dodatkiem Chromatic.

- **Testy bezpieczeństwa (Security Testing):**
  - **Cel:** Weryfikacja podstawowych mechanizmów bezpieczeństwa.
  - **Zakres:** Ochrona tras, polityki RLS w Supabase (weryfikowane przez testy E2E z dwoma różnymi użytkownikami), zarządzanie sesją.
  - **Narzędzia:** Testy E2E (s), manualna inspekcja.

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1. Autentykacja i Autoryzacja

| ID Scenariusza | Opis                                                                         | Oczekiwany Rezultat                                                                                      | Priorytet |
| :------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :-------- |
| AUTH-01        | Pomyślne logowanie przy użyciu poprawnych danych.                            | Użytkownik zostaje przekierowany na Dashboard (`/`). Stan `isAuthenticated` w Redux to `true`.           | Krytyczny |
| AUTH-02        | Próba logowania z niepoprawnym hasłem.                                       | Wyświetlany jest komunikat o błędzie. Użytkownik pozostaje na stronie logowania.                         | Krytyczny |
| AUTH-03        | Pomyślna rejestracja nowego użytkownika.                                     | Użytkownik zostaje przekierowany na stronę logowania z komunikatem o konieczności weryfikacji e-mail.    | Wysoki    |
| AUTH-04        | Próba rejestracji na istniejący adres e-mail.                                | Wyświetlany jest komunikat o błędzie. Użytkownik pozostaje na stronie rejestracji.                       | Wysoki    |
| AUTH-05        | Walidacja formularza rejestracji (np. hasło niespełniające wymagań).         | Przycisk "Create account" jest nieaktywny. Wyświetlane są komunikaty walidacyjne pod polami.             | Wysoki    |
| AUTH-06        | Pomyślne wylogowanie.                                                        | Użytkownik zostaje przekierowany na stronę logowania (`/auth/login`). Stan `isAuthenticated` to `false`. | Krytyczny |
| AUTH-07        | Dostęp do strony chronionej (`/settings`) przez niezalogowanego użytkownika. | Użytkownik jest automatycznie przekierowywany na stronę logowania.                                       | Krytyczny |
| AUTH-08        | Dostęp do strony publicznej (`/auth/login`) przez zalogowanego użytkownika.  | Użytkownik jest automatycznie przekierowywany na Dashboard (`/`).                                        | Średni    |
| AUTH-09        | Pomyślne zainicjowanie procedury resetowania hasła.                          | Wyświetlany jest ekran potwierdzenia wysłania instrukcji na podany adres e-mail.                         | Wysoki    |

### 4.2. Dashboard i Zarządzanie Wydatkami

| ID Scenariusza | Opis                                                                              | Oczekiwany Rezultat                                                                                                                                                                           | Priorytet |
| :------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- |
| DASH-01        | Poprawne wyświetlanie podsumowania i wykresu dla okresu "This Month".             | Dane (suma, podział na kategorie) są zgodne z danymi testowymi w bazie. Wykres jest widoczny.                                                                                                 | Wysoki    |
| DASH-02        | Zmiana okresu analitycznego na "This Week".                                       | Dane i wykres aktualizują się, aby odzwierciedlić wydatki z bieżącego tygodnia. Zapytanie do API jest wysyłane z nowym parametrem.                                                            | Wysoki    |
| DASH-03        | Pomyślne dodanie nowego wydatku przez formularz w modalu.                         | Modal zostaje zamknięty, wydatek pojawia się na liście "Recent Expenses", a dane na dashboardzie (suma, wykres) są zaktualizowane.                                                            | Krytyczny |
| DASH-04        | Próba dodania wydatku z niepoprawnymi danymi (np. pusta kwota).                   | Przycisk "Add Expense" jest nieaktywny lub formularz nie jest wysyłany; wyświetlane są błędy walidacyjne.                                                                                     | Wysoki    |
| DASH-05        | Test optymistycznej aktualizacji UI i jej wycofania (rollback) w przypadku błędu. | 1. Dodaj wydatek (mock API ma zwrócić sukces) - wydatek pojawia się natychmiast. 2. Dodaj wydatek (mock API ma zwrócić błąd) - wydatek pojawia się, a po chwili znika; wyświetlany jest błąd. | Wysoki    |
| DASH-06        | Wyświetlanie dashboardu przez niezalogowanego użytkownika.                        | Dashboard jest widoczny, ale wszystkie dane finansowe pokazują 0 lub stany "brak danych". Widoczny jest monit o zalogowanie się.                                                              | Średni    |

### 4.3. Ustawienia Użytkownika

| ID Scenariusza | Opis                                                         | Oczekiwany Rezultat                                                                                        | Priorytet |
| :------------- | :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :-------- |
| SET-01         | Pomyślna aktualizacja imienia i nazwiska użytkownika.        | Wyświetlany jest komunikat o sukcesie. Nowe imię jest widoczne (np. w menu nawigacyjnym po odświeżeniu).   | Średni    |
| SET-02         | Pomyślna zmiana hasła.                                       | Wyświetlany jest komunikat o sukcesie. Użytkownik może wylogować się i zalogować przy użyciu nowego hasła. | Wysoki    |
| SET-03         | Próba zmiany hasła z niepasującymi do siebie nowymi hasłami. | Wyświetlany jest komunikat o błędzie. Hasło nie zostaje zmienione.                                         | Wysoki    |

## 5. Środowisko testowe

- **Środowisko lokalne:** Komputery deweloperskie z Node.js, pnpm/npm/yarn oraz przeglądarkami (Chrome, Firefox). Używane do uruchamiania testów jednostkowych i integracyjnych.
- **Środowisko CI/CD:** Skonfigurowane w ramach GitHub Actions (lub podobnego narzędzia). Na każdy `push` i `pull request` do głównych gałęzi (`main`, `develop`) będą uruchamiane:
  1.  Linting i formatowanie kodu.
  2.  Testy jednostkowe i integracyjne.
- **Środowisko Staging/Test:** Dedykowana instancja aplikacji wdrożona na platformie hostingowej (np. Vercel, Netlify), połączona z osobnym projektem Supabase. Baza danych na tym środowisku będzie regularnie zasilana (seeded) zestawem danych testowych. Na tym środowisku będą uruchamiane testy E2E.

## 6. Narzędzia do testowania

| Kategoria             | Narzędzie                        | Zastosowanie                                                                   |
| :-------------------- | :------------------------------- | :----------------------------------------------------------------------------- |
| Framework testowy     | **Vitest**                       | Uruchamianie, mockowanie i asercje w testach jednostkowych i integracyjnych.   |
| Biblioteka testowa UI | **React Testing Library**        | Testowanie komponentów React z perspektywy użytkownika.                        |
| Testy E2E             | **Playwright**                   | Automatyzacja scenariuszy użytkownika w przeglądarce.                          |
| Testy wizualne        | **Storybook + Chromatic**        | Tworzenie izolowanych przypadków dla komponentów i śledzenie zmian wizualnych. |
| Analiza kodu          | **ESLint, Prettier, TypeScript** | Statyczna analiza kodu, utrzymanie standardów i jakości.                       |
| Automatyzacja         | **GitHub Actions**               | Ciągła integracja i automatyczne uruchamianie testów.                          |
| Zarządzanie błędami   | **GitHub Issues**                | Rejestrowanie, śledzenie i zarządzanie zgłoszonymi błędami.                    |

## 7. Harmonogram testów

Testowanie jest procesem ciągłym, zintegrowanym z cyklem rozwoju oprogramowania.

- **Testy jednostkowe i integracyjne:** Pisane przez deweloperów równolegle z implementacją nowych funkcji. Muszą być ukończone przed scaleniem `pull request`.
- **Testy E2E i wizualne:** Uruchamiane automatycznie w CI/CD przed każdym wdrożeniem na środowisko produkcyjne.
- **Testy eksploracyjne:** Przeprowadzane manualnie przez inżyniera QA po wdrożeniu większych zmian na środowisko Staging.

## 8. Kryteria akceptacji testów

### 8.1. Kryteria wejścia (rozpoczęcia testów)

- Funkcjonalność jest zaimplementowana i dostępna na środowisku testowym.
- Testy jednostkowe i integracyjne dla danej funkcjonalności przechodzą pomyślnie.
- Dostępna jest dokumentacja lub opis wymagań dla testowanej funkcji.

### 8.2. Kryteria wyjścia (zakończenia testów)

- Pokrycie kodu testami (code coverage) dla krytycznych modułów (usługi API, `authSlice`) wynosi co najmniej 90%.
- Wszystkie zdefiniowane scenariusze E2E dla ścieżki krytycznej przechodzą pomyślnie (100% pass rate).
- Brak otwartych błędów o priorytecie `Krytyczny` lub `Wysoki`.
- Wszystkie testy w potoku CI/CD przechodzą pomyślnie.

## 9. Role i odpowiedzialności w procesie testowania

- **Deweloperzy:**
  - Odpowiedzialni za pisanie i utrzymanie testów jednostkowych i integracyjnych dla tworzonego przez siebie kodu.
  - Naprawianie błędów zidentyfikowanych podczas wszystkich etapów testowania.
- **Inżynier QA:**
  - Projektowanie i utrzymanie strategii testów.
  - Tworzenie i utrzymanie automatycznych testów E2E.
  - Przeprowadzanie testów manualnych i eksploracyjnych.
  - Zarządzanie procesem raportowania błędów i weryfikacja poprawek.
- **Product Owner / Manager:**
  - Definiowanie kryteriów akceptacji dla nowych funkcjonalności.
  - Ustalanie priorytetów dla zgłoszonych błędów.

## 10. Procedury raportowania błędów

Wszystkie zidentyfikowane błędy będą raportowane w systemie **GitHub Issues**. Każde zgłoszenie powinno zawierać następujące informacje:

- **Tytuł:** Zwięzły i jasny opis problemu.
- **Opis:**
  - **Kroki do odtworzenia (Steps to Reproduce):** Szczegółowa, ponumerowana lista kroków.
  - **Oczekiwany rezultat (Expected Result):** Co powinno się stać.
  - **Rzeczywisty rezultat (Actual Result):** Co się stało.
- **Środowisko:** Wersja przeglądarki, system operacyjny, rozmiar ekranu (jeśli dotyczy).
- **Priorytet/Waga (Severity):**
  - **Krytyczny (Blocker):** Błąd blokujący podstawową funkcjonalność, brak obejścia.
  - **Wysoki (Critical):** Poważny błąd w kluczowej funkcjonalności, istnieje obejście.
  - **Średni (Major):** Błąd w funkcjonalnościach drugorzędnych lub znaczący defekt UI.
  - **Niski (Minor):** Drobny błąd UI, literówka, problem estetyczny.
- **Załączniki:** Zrzuty ekranu, nagrania wideo, logi z konsoli przeglądarki.
