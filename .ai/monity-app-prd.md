# Dokument wymagań produktu (PRD) - MonityApp

## 1. Przegląd produktu

### 1.1 Cel produktu

MonityApp to mobilna i responzyjna aplikacja do zarządzania wydatkami, która umożliwia użytkownikom łatwe śledzenie, kategoryzację i analizę swoich finansów.

### 1.2 Kluczowe funkcje

- Uwierzytelnianie użytkowników
- Dodawanie, edycja i usuwanie wydatków
- Zarządzanie kategoriami wydatków
- Wizualizacja danych finansowych
- Responsywny interfejs użytkownika

### 1.3 Technologie

- Frontend: React
- Stan aplikacji: Redux
- Backend i hosting: Supabase
- Wizualizacja danych: Recharts
- Testy: React Testing Library
- CI/CD: GitHub Actions

## 2. Problem użytkownika

### 2.1 Zidentyfikowany problem

Użytkownicy często mają trudności w:

- Systematycznym śledzeniu własnych wydatków
- Kategoryzacji i analizie swoich nawyków finansowych
- Wizualnej interpretacji własnych wydatków

### 2.2 Rozwiązanie

MonityApp oferuje:

- Prosty, intuicyjny interfejs do zarządzania wydatkami
- Elastyczny system kategoryzacji
- Czytelną wizualizację danych finansowych
- Możliwość dodawania własnych kategorii

## 3. Wymagania funkcjonalne

### 3.1 Uwierzytelnianie

- Rejestracja za pomocą adresu email
- Resetowanie hasła przez email

### 3.2 Zarządzanie wydatkami

- Dodawanie nowych wydatków
- Edycja istniejących wydatków
- Usuwanie wydatków
- Domyślne kategorie:
  - Dom
  - Praca
  - Dzieci
  - Zwierzęta
  - Rachunki
  - Hobby

### 3.3 Kategorie wydatków

- Możliwość dodawania własnych kategorii
- Każda kategoria zawiera:
  - Nazwę kategorii
  - Opis kategorii
  - Unikalny kolor

### 3.4 Wizualizacja danych

- Wykres kołowy z:
  - Pastelową paletą kolorów
  - Ograniczoną liczbą kolorów do wyboru
  - Interaktywnością (klikanie w kategorie)
- Wyświetlanie sumy wydatków w środku wykresu

## 4. Granice produktu

### 4.1 Co jest w zakresie MVP

- Pełne uwierzytelnianie użytkowników
- Podstawowe zarządzanie wydatkami
- Wizualizacja danych finansowych
- Responsywny interfejs
- Testy jednostkowe i E2E

### 4.2 Co nie jest w zakresie MVP

- Eksport danych do PDF/Excel
- Zaawansowana analiza wydatków
- Powiadomienia i alerty
- Tryb ciemny/jasny

## 5. Historyjki użytkowników

### Uwierzytelnianie

#### US-001: Rejestracja użytkownika

- Jako nowy użytkownik
- Chcę się zarejestrować w aplikacji
- Aby móc korzystać z funkcji śledzenia wydatków

Kryteria akceptacji:

- Użytkownik może zarejestrować się przez email
- Wymagane są: imię, nazwisko, email

#### US-002: Logowanie użytkownika

- Jako zarejestrowany użytkownik
- Chcę się zalogować
- Aby uzyskać dostęp do moich danych

Kryteria akceptacji:

- Użytkownik może zalogować się przez email
- Resetowanie hasła jest możliwe przez email

### Zarządzanie wydatkami

#### US-003: Dodawanie wydatku

- Jako zalogowany użytkownik
- Chcę dodać nowy wydatek
- Aby śledzić moje wydatki

Kryteria akceptacji:

- Można dodać wydatek z kategorią
- Można dodać własną kategorię
- Wydatek zawiera datę, kwotę, kategorię i opcjonalny opis

#### US-004: Edycja wydatku

- Jako zalogowany użytkownik
- Chcę edytować istniejący wydatek
- Aby poprawić pomyłki lub zaktualizować informacje

Kryteria akceptacji:

- Można edytować datę wydatku
- Można edytować kwotę
- Można zmienić kategorię
- Można edytować opis

#### US-005: Usuwanie wydatku

- Jako zalogowany użytkownik
- Chcę usunąć wydatek
- Aby usunąć niepotrzebne lub błędne wpisy

Kryteria akceptacji:

- Można usunąć pojedynczy wydatek
- Usunięcie wymaga potwierdzenia

### Wizualizacja danych

#### US-006: Wyświetlanie wydatków na wykresie

- Jako zalogowany użytkownik
- Chcę zobaczyć moje wydatki na wykresie kołowym
- Aby lepiej zrozumieć swoje nawyki finansowe

Kryteria akceptacji:

- Wykres pokazuje wydatki w podziale na kategorie
- Można wybrać okres (dzień, tydzień, miesiąc, rok)
- Kliknięcie kategorii pokazuje szczegóły

#### US-007: Zarządzanie kategoriami

- Jako zalogowany użytkownik
- Chcę tworzyć własne kategorie
- Aby lepiej kategoryzować moje wydatki

Kryteria akceptacji:

- Można dodać nową kategorię podczas dodawania wydatku
- Kategoria zawiera nazwę, opis i kolor
- Można wybrać kolor z dostępnej palety

## 6. Metryki sukcesu

### 6.1 Metryki produktowe

- Liczba zarejestrowanych użytkowników
- Częstotliwość dodawania wydatków
- Liczba używanych kategorii
- Czas spędzony w aplikacji

### 6.2 Metryki techniczne

- Pokrycie testami (min. 80%)
- Czas ładowania strony (maks. 2 sekundy)
- Brak krytycznych błędów w testach E2E

### 6.3 Metryki użytkownika

- Pozytywne opinie użytkowników
- Niski współczynnik rezygnacji
- Powtarzające się użycie aplikacji
