# Specyfikacja techniczna modułu autentykacji - MonityApp

## 1. Architektura interfejsu użytkownika

### 1.1 Struktura routingu i layoutu

src/
layouts/
AuthLayout.tsx // Layout dla stron autoryzacyjnych
DefaultLayout.tsx // Layout dla zalogowanych użytkowników
pages/
auth/
LoginPage.tsx // Strona logowania
RegisterPage.tsx // Strona rejestracji
ResetPasswordPage.tsx // Strona resetowania hasła
ConfirmResetPage.tsx // Strona potwierdzenia resetowania

```

### 1.2 Komponenty interfejsu użytkownika

src/
  components/
    auth/
      LoginForm.tsx            // Formularz logowania
      RegisterForm.tsx         // Formularz rejestracji
      ResetPasswordForm.tsx    // Formularz resetowania hasła
      SocialAuthButtons.tsx    // Przyciski logowania przez Google/Facebook
    ui/
      AuthCard.tsx            // Kontener dla formularzy auth
```

### 1.3 Formularze i walidacja

#### 1.3.1 Formularz rejestracji

- Pola:
  - Imię i nazwisko (wymagane, min. 2 znaki)
  - Email (wymagane, format email)
  - Hasło (wymagane, min. 8 znaków, duża litera, cyfra)
  - Potwierdzenie hasła (musi być zgodne z hasłem)
- Walidacja w czasie rzeczywistym
- Przyciski social login
- Link do logowania

#### 1.3.2 Formularz logowania

- Pola:
  - Email (wymagane, format email)
  - Hasło (wymagane)
- Link do resetowania hasła
- Przyciski social login
- Link do rejestracji

#### 1.3.3 Formularz resetowania hasła

- Pola:
  - Email (wymagane, format email) - strona początkowa
  - Nowe hasło (wymagane, min. 8 znaków) - strona potwierdzenia
  - Potwierdzenie hasła - strona potwierdzenia

### 1.4 Obsługa błędów UI

- Komunikaty błędów walidacji inline pod polami
- Toast notifications dla błędów API
- Wskaźniki ładowania dla przycisków submit
- Blokada wielokrotnego wysyłania formularza

## 2. Logika backendowa

### 2.1 Integracja z Supabase Auth

src/
api/
services/
auth.service.ts // Serwis autentykacji
hooks/
useAuth.ts // Hook React dla operacji auth

```

### 2.2 Operacje autentykacji

#### 2.2.1 Rejestracja
interface RegisterCommand {
  email: string;
  password: string;
  fullName: string;
}

interface RegisterResponse {
  user: User;
  session: Session;
}
```

#### 2.2.2 Logowanie

```typescript
interface LoginCommand {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  user: User;
  session: Session;
}
```

#### 2.2.3 Resetowanie hasła

```typescript
interface ResetPasswordCommand {
  email: string;
}

interface ConfirmResetCommand {
  token: string;
  password: string;
}
```

### 2.3 Walidacja danych

- Wykorzystanie biblioteki Zod do walidacji
- Spójne komunikaty błędów
- Sanityzacja danych wejściowych

### 2.4 Obsługa błędów API

- Mapowanie błędów Supabase na komunikaty UI
- Rozszerzenie istniejącej klasy SupabaseError
- Obsługa timeoutów i błędów sieci

## 3. System autentykacji

### 3.1 Konfiguracja Supabase Auth

// Konfiguracja providerów
const authConfig = {
providers: ['google', 'facebook'],
redirectTo: `${window.location.origin}/auth/callback`,
emailRedirectTo: `${window.location.origin}/auth/verify`,
}

```

### 3.2 Zarządzanie sesją
- Automatyczne odświeżanie tokenów
- Persystencja sesji w localStorage
- Obsługa wygaśnięcia sesji

### 3.3 Zabezpieczenia
- CSRF tokens dla formularzy
- Rate limiting dla prób logowania
- Walidacja siły hasła
- Captcha dla formularzy

### 3.4 Przepływy autentykacji

#### 3.4.1 Email/Hasło
1. Walidacja formularza
2. Wysłanie żądania do Supabase Auth
3. Obsługa odpowiedzi/błędów
4. Przekierowanie do aplikacji

#### 3.4.2 Social Auth
1. Przekierowanie do providera
2. Obsługa callback URL
3. Walidacja tokena
4. Utworzenie/aktualizacja profilu

#### 3.4.3 Reset hasła
1. Żądanie resetu (email)
2. Wysłanie maila z linkiem
3. Walidacja tokena
4. Zmiana hasła

## 4. Integracja z istniejącą aplikacją

### 4.1 Kontekst autentykacji
- Rozszerzenie SupabaseProvider o context auth
- Dostęp do stanu użytkownika w komponentach
- Zabezpieczenie routów prywatnych

### 4.2 Nawigacja
- Przekierowania po akcjach auth
- Obsługa protected routes
- Zachowanie URL powrotu

### 4.3 Persystencja stanu
- Integracja z Redux/state management
- Synchronizacja stanu auth
- Czyszczenie danych po wylogowaniu
```
