# Architektura UI dla MonityApp

## 1. Przegląd struktury UI

MonityApp została zaprojektowana jako jednostronicowa aplikacja (SPA) z podejściem mobile-first, wykorzystująca bottom navigation jako główny system nawigacyjny. Aplikacja składa się z czterech głównych sekcji dostępnych przez dolną nawigację oraz systemu modali/overlay dla operacji dodawania i edycji danych. Struktura jest zoptymalizowana pod responsywność i intuicyjną nawigację na urządzeniach dotykowych.

## 2. Lista widoków

### 2.1 Authentication Views

#### Login View

- **Ścieżka**: `/login`
- **Główny cel**: Uwierzytelnienie istniejących użytkowników
- **Kluczowe informacje**: Formularz logowania, opcje społecznościowe, link do rejestracji
- **Kluczowe komponenty**:
  - EmailPasswordForm
  - SocialAuthButtons (Google, Facebook)
  - ForgotPasswordLink
  - RegisterRedirect
- **UX/Accessibility/Security**: Focus trap w formularzu, walidacja w czasie rzeczywistym, secure token handling, ARIA labels dla screen readers

#### Register View

- **Ścieżka**: `/register`
- **Główny cel**: Rejestracja nowych użytkowników
- **Kluczowe informacje**: Formularz rejestracji z wymaganymi polami
- **Kluczowe komponenty**:
  - RegistrationForm (imię, nazwisko, email, hasło)
  - SocialAuthButtons
  - LoginRedirect
- **UX/Accessibility/Security**: Progressive enhancement, password strength indicator, input validation, secure form submission

#### Password Reset View

- **Ścieżka**: `/reset-password`
- **Główny cel**: Resetowanie hasła użytkownika
- **Kluczowe informacje**: Formularz z adresem email
- **Kluczowe komponenty**:
  - EmailForm
  - SuccessMessage
  - BackToLoginLink
- **UX/Accessibility/Security**: Clear instructions, feedback messages, rate limiting protection

### 2.2 Main Application Views

#### Dashboard View

- **Ścieżka**: `/`
- **Główny cel**: Główny hub aplikacji z przeglądem finansów
- **Kluczowe informacje**: Wykres kołowy wydatków, lista ostatnich 5 transakcji, podsumowanie obecnego okresu
- **Kluczowe komponenty**:
  - InteractivePieChart (85% width mobile, max 350px desktop)
  - RecentExpensesList
  - PeriodSummary
  - FAB (dodawanie wydatku)
- **UX/Accessibility/Security**: Touch-friendly chart interactions, ARIA labels dla wykresu, visual hierarchy z consistent spacing

#### Expenses List View

- **Ścieżka**: `/expenses`
- **Główny cel**: Pełna lista i zarządzanie wydatkami
- **Kluczowe informacje**: Wszystkie wydatki użytkownika z możliwością wyszukiwania i filtrowania
- **Kluczowe komponenty**:
  - SearchBar (debounced input 300ms)
  - FilterOptions
  - VirtualizedExpenseList
  - ExpenseCard (categoria, kwota, data)
  - SwipeActions (edit/delete)
- **UX/Accessibility/Security**: Virtual scrolling dla wydajności, keyboard navigation, pull-to-refresh, proper focus management

#### Analytics View

- **Ścieżka**: `/analytics`
- **Główny cel**: Zaawansowana analiza i wizualizacja wydatków
- **Kluczowe informacje**: Wykresy, trendy, podsumowania miesięczne, top kategorie
- **Kluczowe komponenty**:
  - DateRangePicker (custom range)
  - AnalyticsChart
  - MonthlySummaryCard
  - TopCategoriesCard
  - TrendsVisualization
- **UX/Accessibility/Security**: Responsive grid layout (1 col mobile, 2 col tablet+), chart accessibility with data tables fallback

#### Profile View

- **Ścieżka**: `/profile`
- **Główny cel**: Zarządzanie profilem użytkownika i ustawieniami aplikacji
- **Kluczowe informacje**: Dane użytkownika, ustawienia, opcje eksportu
- **Kluczowe komponenty**:
  - UserInfoCard
  - SettingsSection
  - ExportOptions
  - LogoutButton
  - DeleteAccountOption
- **UX/Accessibility/Security**: Clear section separation, confirmation dialogs for destructive actions, secure logout process

### 2.3 Modal/Overlay Views

#### Add Expense Modal

- **Główny cel**: Dodawanie nowego wydatku
- **Kluczowe informacje**: Formularz z polami: kwota, kategoria, data, opis
- **Kluczowe komponenty**:
  - AmountInput (focus po otwarciu)
  - CategorySelector
  - DatePicker (domyślnie dzisiaj)
  - DescriptionTextarea
  - AddNewCategoryButton
- **UX/Accessibility/Security**: Focus trap, ESC to close, form validation, optimistic updates

#### Add Category Modal

- **Główny cel**: Dodawanie nowej kategorii wydatków
- **Kluczowe informacje**: Nazwa, opis, kolor kategorii
- **Kluczowe komponenty**:
  - CategoryNameInput (max 100 znaków)
  - DescriptionTextarea (max 500 znaków)
  - ColorPicker (10 predefiniowanych kolorów)
  - SaveButton
- **UX/Accessibility/Security**: Nested modal pattern, auto-close po zapisaniu, return to expense form z preselected kategorią

#### Edit Expense Modal

- **Główny cel**: Edycja istniejącego wydatku
- **Kluczowe informacje**: Prefilled formularz z aktualnymi danymi
- **Kluczowe komponenty**: Identyczne jak Add Expense Modal + DeleteButton
- **UX/Accessibility/Security**: Pre-populated fields, confirmation dla destructive actions

### 2.4 Utility Views

#### Loading States

- **Główny cel**: Informowanie użytkownika o ładowaniu danych
- **Kluczowe komponenty**:
  - SkeletonLoader (dokładny kształt komponentów)
  - CircularSpinner
  - ProgressIndicator
- **UX/Accessibility/Security**: ARIA live regions, respect prefers-reduced-motion

#### Error States

- **Główny cel**: Graceful handling błędów
- **Kluczowe komponenty**:
  - ErrorBoundary
  - NetworkErrorMessage
  - RetryButton
  - FallbackUI
- **UX/Accessibility/Security**: Clear error messages, recovery options, proper error logging

#### Empty States

- **Główny cel**: Handling pustych danych
- **Kluczowe komponenty**:
  - EmptyStateIllustration
  - DescriptiveMessage
  - CTAButton
- **UX/Accessibility/Security**: Helpful illustrations, clear call-to-action, accessible descriptions

## 3. Mapa podróży użytkownika

### 3.1 Pierwszy visit (niezalogowany użytkownik)

1. **Wejście do aplikacji** → Redirect na `/login`
2. **Wybór opcji logowania** → Email/hasło lub social auth
3. **Jeśli nowy użytkownik** → Przejście do `/register`
4. **Po rejestracji/logowaniu** → Redirect na Dashboard `/`

### 3.2 Główny flow (zalogowany użytkownik)

1. **Dashboard** - Przegląd finansów

   - Interakcja z wykresem kołowym (hover/click → kwota w środku)
   - Przegląd ostatnich 5 wydatków
   - Klik FAB (+) → Add Expense Modal

2. **Dodawanie wydatku**

   - Wypełnienie formularza (kwota → kategoria → data → opis)
   - Opcjonalnie: "Dodaj nową kategorię" → Add Category Modal
   - Zapisanie → Powrót do Dashboard z aktualizacją

3. **Zarządzanie wydatkami**

   - Przejście do `/expenses` przez bottom navigation
   - Wyszukiwanie/filtrowanie wydatków
   - Swipe actions → Edit/Delete
   - Pull-to-refresh dla aktualizacji

4. **Analiza danych**
   - Przejście do `/analytics`
   - Wybór zakresu dat
   - Interakcja z wykresami i podsumowaniami

### 3.3 Nawigacja między widokami

- **Bottom Navigation** - główny sposób przemieszczania się
- **FAB (+)** - dostępny na wszystkich ekranach dla szybkiego dodawania
- **Modals** - overlay pattern bez zmiany ścieżki URL
- **Back gestures** - naturalne zachowanie mobile

## 4. Układ i struktura nawigacji

### 4.1 Bottom Navigation (główna)

- **Dashboard** - Home icon, domyślny widok
- **Wydatki** - List icon, zarządzanie wydatkami
- **Analytics** - Chart icon, analiza danych
- **Profil** - User icon, ustawienia użytkownika

### 4.2 Floating Action Button (FAB)

- **Pozycja**: Prawy dolny róg, zawsze widoczny
- **Akcja**: Otwiera Add Expense Modal
- **Style**: Primary color, shadow, touch-friendly (56dp minimum)

### 4.3 Modal Navigation

- **Add Expense** → **Add Category** (nested modal)
- **Edit operations** → **Confirmation dialogs**
- **Focus management** - trap i return focus

### 4.4 Responsive Breakpoints

- **Mobile**: < 640px (primary target)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px (max-width constraint dla mobile-like experience)

## 5. Kluczowe komponenty

### 5.1 Navigation Components

- **BottomNavigation** - Główna nawigacja z active states
- **FAB** - Floating Action Button z consistent styling
- **BreadcrumbTrail** - Dla deep navigation (jeśli potrzebne)

### 5.2 Data Display Components

- **InteractivePieChart** - Recharts z hover/click interactions
- **ExpenseCard** - Card layout z color-coded borders
- **CategoryBadge** - Konsistentne wyświetlanie kategorii
- **AmountDisplay** - Formatowanie "1,000.00 PLN"

### 5.3 Form Components

- **FormField** - Wrapper z validation states
- **AmountInput** - Numeric input z currency formatting
- **CategorySelector** - Dropdown z search functionality
- **DatePicker** - Mobile-friendly date selection
- **ColorPicker** - Grid 10 predefiniowanych kolorów

### 5.4 Feedback Components

- **ToastNotification** - Position: top-center mobile, top-right desktop
- **LoadingSkeleton** - Mimics exact component shapes
- **EmptyState** - Illustrations + helpful messaging
- **ErrorBoundary** - Graceful error handling

### 5.5 Layout Components

- **PageContainer** - Consistent padding i max-width
- **CardLayout** - Reusable card pattern
- **GridSystem** - Responsive grid z Tailwind
- **ModalOverlay** - Focus trap i backdrop

### 5.6 Utility Components

- **SearchBar** - Debounced input z clear functionality
- **FilterChips** - Multi-select filtering
- **VirtualList** - Performance dla długich list
- **PullToRefresh** - Native-like refresh pattern
