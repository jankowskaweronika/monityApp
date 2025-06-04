# Plan implementacji widoku Dashboard

## 1. Przegląd

Dashboard View stanowi główny hub aplikacji MonityApp, dostarczający użytkownikom centralny punkt dostępu do ich danych finansowych. Widok przedstawia interaktywny wykres kołowy wydatków pogrupowanych według kategorii, listę ostatnich 5 transakcji oraz podsumowanie wydatków dla wybranego okresu. Dodatkowo zawiera Floating Action Button (FAB) umożliwiający szybkie dodawanie nowych wydatków.

## 2. Routing widoku

Widok Dashboard jest dostępny pod główną ścieżką aplikacji:

- **Ścieżka**: `/`
- **Komponent**: `DashboardView`
- **Layout**: Główny layout aplikacji z bottom navigation
- **Domyślny widok**: Tak (landing page po zalogowaniu)

## 3. Struktura komponentów

```
DashboardView (główny kontener)
├── PeriodSummary (podsumowanie okresu)
├── InteractivePieChart (wykres kołowy)
├── RecentExpensesList (lista ostatnich wydatków)
│   └── ExpenseCard (×5) (pojedynczy wydatek)
├── FAB (floating action button)
└── AddExpenseModal (modal - conditional render)
    ├── AmountInput (pole kwoty)
    ├── CategorySelector (wybór kategorii)
    ├── DatePicker (wybór daty)
    └── DescriptionTextarea (opis wydatku)
```

## 4. Szczegóły komponentów

### DashboardView

- **Opis komponentu**: Główny kontener widoku zarządzający stanem całego dashboard'u i koordynujący komunikację między child komponentami
- **Główne elementy**: Section container, responsive grid layout, loading states, error boundaries
- **Obsługiwane interakcje**:
  - Pull-to-refresh dla odświeżenia danych
  - Period selection dla zmiany zakresu czasowego
  - Otwarcie/zamknięcie AddExpenseModal
- **Obsługiwana walidacja**:
  - Walidacja obecności danych użytkownika
  - Sprawdzenie dostępności okresów raportowania
- **Typy**: `DashboardData`, `DashboardError`, `LoadingState`
- **Propsy**: Brak (root component)

### InteractivePieChart

- **Opis komponentu**: Interaktywny wykres kołowy wykorzystujący Recharts do wizualizacji wydatków pogrupowanych według kategorii
- **Główne elementy**: PieChart z Recharts, PieChartWithPaddingAngle, Legend, responsive container (85% width mobile, max 350px desktop)
- **Obsługiwane interakcje**:
  - Hover nad segmentami wykresu (tooltip z szczegółami)
  - Click na segment (pokazanie szczegółów kategorii)
  - Touch gestures na urządzeniach mobilnych
- **Obsługiwana walidacja**:
  - Sprawdzenie czy dane są dostępne
  - Walidacja struktur danych dla Recharts
  - Zabezpieczenie przed pustymi kategoriami
- **Typy**: `ChartDataPoint[]`, `CategoryBreakdown[]`, `ChartInteractionHandler`
- **Propsy**: `data: CategoryBreakdown[]`, `totalAmount: number`, `onCategoryClick: (categoryId: string) => void`

### RecentExpensesList

- **Opis komponentu**: Lista wyświetlająca 5 najnowszych wydatków użytkownika z opcjami quick actions
- **Główne elementy**: Scrollable container, ExpenseCard components, empty state, load more link
- **Obsługiwane interakcje**:
  - Scroll horizontal na mobile
  - Quick edit/delete actions
  - Przejście do szczegółów wydatku
  - Link "Zobacz wszystkie" → przekierowanie do /expenses
- **Obsługiwana walidacja**:
  - Sprawdzenie czy lista nie jest pusta
  - Walidacja dat i kwot przed wyświetleniem
- **Typy**: `ExpenseWithCategory[]`, `ExpenseCardProps[]`
- **Propsy**: `expenses: ExpenseWithCategory[]`, `isLoading: boolean`, `onExpenseClick: (expenseId: string) => void`

### PeriodSummary

- **Opis komponentu**: Komponent wyświetlający podsumowanie wydatków dla wybranego okresu z możliwością zmiany zakresu czasowego
- **Główne elementy**: Period selector dropdown, total amount display, comparison with previous period, trend indicators
- **Obsługiwane interakcje**:
  - Dropdown selection dla zmiany okresu
  - Touch-friendly period navigation
  - Rozwijanie dodatkowych statystyk
- **Obsługiwana walidacja**:
  - Walidacja wybranego okresu
  - Sprawdzenie dostępności danych historycznych
  - Walidacja dat granicznych
- **Typy**: `PeriodInfo`, `PeriodSummaryData`, `TrendDirection`
- **Propsy**: `currentPeriod: PeriodInfo`, `totalAmount: number`, `previousAmount?: number`, `onPeriodChange: (period: string) => void`

### FAB (Floating Action Button)

- **Opis komponentu**: Przycisk floating action umożliwiający szybkie dodanie nowego wydatku, zawsze widoczny w prawym dolnym rogu
- **Główne elementy**: Circular button, plus icon, shadow effects, touch-friendly sizing (56dp minimum)
- **Obsługiwane interakcje**:
  - Click/touch → otwarcie AddExpenseModal
  - Hover effects na desktop
  - Active states z haptic feedback
- **Obsługiwana walidacja**:
  - Sprawdzenie czy użytkownik jest zalogowany
  - Dostępność kategorii do wyboru
- **Typy**: `FABProps`, `ModalHandler`
- **Propsy**: `onAddExpense: () => void`, `disabled?: boolean`

### AddExpenseModal

- **Opis komponentu**: Modal overlay do dodawania nowych wydatków z pełnym formularzem i walidacją
- **Główne elementy**: Modal backdrop, form container, validation messages, submit/cancel buttons
- **Obsługiwane interakcje**:
  - Focus trap wewnątrz modalu
  - ESC key to close
  - Form submission z optimistic updates
  - Auto-focus na pole kwoty po otwarciu
- **Obsługiwana walidacja**:
  - amount: wymagane, positive decimal, max 2 miejsca po przecinku
  - category_id: wymagane, musi istnieć w dostępnych kategoriach
  - date: wymagane, nie może być w przyszłości
  - description: opcjonalne, max 500 znaków
- **Typy**: `AddExpenseFormData`, `FormValidationErrors`, `SubmissionState`
- **Propsy**: `isOpen: boolean`, `onClose: () => void`, `onSubmit: (data: CreateExpenseCommand) => Promise<void>`, `categories: Category[]`

## 5. Typy

### DashboardData (ViewModel)

```typescript
interface DashboardData {
  summary: ExpenseSummaryResponse;
  recentExpenses: ExpenseWithCategory[];
  availableCategories: Tables<"categories">[];
  currentPeriod: PeriodInfo;
  isLoading: boolean;
  error?: string;
}
```

### ChartDataPoint (dla Recharts)

```typescript
interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  categoryId: string;
  percentage: number;
}
```

### AddExpenseFormData (Form ViewModel)

```typescript
interface AddExpenseFormData {
  amount: string;
  categoryId: string;
  date: string;
  description: string;
}
```

### FormValidationErrors

```typescript
interface FormValidationErrors {
  amount?: string;
  categoryId?: string;
  date?: string;
  description?: string;
}
```

### PeriodSummaryData

```typescript
interface PeriodSummaryData {
  currentAmount: number;
  previousAmount?: number;
  trendDirection: "up" | "down" | "stable";
  changePercentage?: number;
  expenseCount: number;
}
```

## 6. Zarządzanie stanem

### Custom Hook: useDashboardData

```typescript
interface UseDashboardDataReturn {
  dashboardData: DashboardData;
  selectedPeriod: string;
  isModalOpen: boolean;
  refreshData: () => Promise<void>;
  changePeriod: (period: string) => void;
  openModal: () => void;
  closeModal: () => void;
  addExpense: (data: CreateExpenseCommand) => Promise<void>;
}
```

**Funkcjonalności:**

- Zarządzanie stanem całego dashboard'u
- Optymistic updates dla nowych wydatków
- Cache management dla performance
- Error handling i retry logic

### Stan lokalny komponentów:

- **InteractivePieChart**: `hoveredSegment`, `selectedCategory`
- **AddExpenseModal**: `formData`, `validationErrors`, `isSubmitting`
- **PeriodSummary**: `expandedDetails`

## 7. Integracja API

### Wymagane wywołania API:

#### Ładowanie danych dashboard

```typescript
// GET /analytics/summary?period={selectedPeriod}
const summaryResponse: ExpenseSummaryResponse =
  await analyticsService.getExpenseSummary({
    period: selectedPeriod,
    start_date: customStartDate,
    end_date: customEndDate,
  });
```

#### Pobieranie ostatnich wydatków

```typescript
// GET /expenses?limit=5&sort_by=date&sort_order=desc
const recentExpenses: ListExpensesResponse = await expenseService.listExpenses({
  limit: 5,
  sort_by: "date",
  sort_order: "desc",
});
```

#### Pobieranie kategorii

```typescript
// GET /categories
const categories: ListCategoriesResponse = await categoryService.listCategories(
  {
    include_default: true,
  }
);
```

#### Dodawanie wydatku

```typescript
// POST /expenses
const newExpense: ExpenseWithCategory = await expenseService.createExpense({
  category_id: formData.categoryId,
  amount: parseFloat(formData.amount),
  description: formData.description,
  date: formData.date,
});
```

## 8. Interakcje użytkownika

### Główne flow użytkownika:

1. **Wejście na dashboard**:

   - Automatyczne ładowanie danych
   - Wyświetlenie loading state
   - Render danych po załadowaniu

2. **Interakcja z wykresem**:

   - Hover → tooltip z kwotą i procentem
   - Click na segment → highlight kategorii + szczegółowe info
   - Touch gestures na mobile

3. **Zmiana okresu**:

   - Click na period selector
   - Wybór nowego okresu z dropdown
   - Re-fetch danych + loading state

4. **Dodawanie wydatku**:

   - Click FAB → otwarcie modalu
   - Wypełnienie formularza (kwota → kategoria → data → opis)
   - Submit → optimistic update + API call
   - Success → zamknięcie modalu + refresh danych

5. **Pull-to-refresh**:
   - Gesture na mobile → refresh wszystkich danych
   - Loading indicator + haptic feedback

## 9. Warunki i walidacja

### Warunki API (weryfikowane w AddExpenseModal):

- **amount**:
  - Wymagane pole
  - Wartość > 0
  - Maksymalnie 2 miejsca po przecinku
  - Maksymalna wartość: 999,999.99
- **category_id**:
  - Wymagane pole
  - Musi istnieć w dostępnych kategoriach
  - UUID format validation
- **date**:
  - Wymagane pole
  - Nie może być w przyszłości
  - Format DD-MM-YYYY
- **description**:
  - Opcjonalne
  - Maksymalnie 500 znaków
  - Sanityzacja HTML

### Warunki UI:

- **Dashboard data loading**: Sprawdzenie połączenia z API
- **Chart rendering**: Minimum 1 kategoria z danymi
- **Recent expenses**: Sprawdzenie czy użytkownik ma wydatki
- **Modal opening**: Dostępność co najmniej 1 kategorii

## 10. Obsługa błędów

### Scenariusze błędów i handling:

#### Błędy ładowania danych:

- **Network error**: Retry button + offline indicator
- **Authentication error**: Redirect do login
- **No data**: Empty state z call-to-action

#### Błędy formularza:

- **Validation errors**: Real-time field validation + error messages
- **Submission errors**: Toast notification + form pozostaje otwarty
- **Network timeout**: Retry option + optimistic rollback

#### Błędy wykresu:

- **No categories**: Empty state z informacją + link do dodania wydatku
- **Render errors**: Fallback tabela z danymi

#### Error boundaries:

- **Component crashes**: Graceful fallback UI
- **Uncaught errors**: Error reporting + recovery options

### Error handling strategy:

- Toast notifications dla błędów użytkownika
- Console logging dla błędów developerskich
- Graceful degradation dla non-critical features
- Retry mechanisms z exponential backoff

## 11. Kroki implementacji

1. **Setup podstawowy**:

   - Utworzenie struktury katalogów
   - Konfiguracja routing dla `/`
   - Setup custom hook `useDashboardData`

2. **Implementacja core komponentów**:

   - `DashboardView` (główny kontener)
   - `PeriodSummary` (bez logiki period change)
   - Loading states i error boundaries

3. **Implementacja wykresu**:

   - `InteractivePieChart` z Recharts
   - Data transformation logic
   - Responsive design i touch interactions
   - Tooltip i click handlers

4. **Lista ostatnich wydatków**:

   - `RecentExpensesList` + `ExpenseCard`
   - Empty states
   - Quick actions (view details)

5. **FAB i modal**:

   - `FAB` component z positioning
   - `AddExpenseModal` z form handling
   - Validation logic i error states

6. **Integracja API**:

   - Hook up wszystkich API calls
   - Error handling i loading states
   - Optimistic updates

7. **Polish i optimization**:

   - Performance optimization
   - Accessibility improvements
   - Animation i transitions
   - Testing (unit + integration)

8. **Testing i QA**:
   - Unit tests dla każdego komponentu
   - Integration tests dla głównych flow
   - Mobile testing na różnych urządzeniach
   - Performance testing
