<conversation_summary>
<decisions>

Tabela "users" będzie obsługiwana przez Supabase Auth - nie tworzymy osobnej tabeli public.users, ponieważ Supabase automatycznie zarządza użytkownikami przez auth.users.

1. Aplikacja będzie przeznaczona tylko dla użytkowników prywatnych, bez podziału na portfele/walety
2. Zarządzanie wydatkami będzie globalne na poziomie użytkownika
3. Nie będzie implementacji historii zmian wydatków (audit trail)
4. Kategorie wydatków będą globalne dla wszystkich użytkowników
5. Aplikacja będzie obsługiwać tylko walutę PLN
6. Zaimplementowano okresy raportowania na poziomie bazy danych (dzień, tydzień, miesiąc, rok)
7. Nie będzie implementacji mechanizmu cachowania wyników agregacji
8. Nie będzie dodatkowych metadanych dla okresów raportowania
9. Nie będzie mechanizmu walidacji formatów dat
   </decisions>

<matched_recommendations>

1. Podstawowy schemat bazy danych z tabelami: users, categories, expenses
2. Implementacja tabeli reporting_periods z podstawowymi funkcjami
3. Podstawowe indeksy dla optymalizacji zapytań
4. Polityki RLS dla bezpieczeństwa danych
5. Funkcje pomocnicze do obsługi okresów raportowania
   </matched_recommendations>

<database_planning_summary>

### Główne wymagania dotyczące schematu bazy danych

- Baza danych PostgreSQL z Supabase jako backend
- Prosty schemat z trzema głównymi tabelami: users, categories, expenses
- Dodatkowa tabela reporting_periods do zarządzania okresami raportowania
- Wszystkie daty w formacie TIMESTAMP WITH TIME ZONE
- Kwoty w formacie DECIMAL(10,2)
- Waluta PLN jako domyślna i jedyna

### Kluczowe encje i ich relacje

1. users (dziedziczona z Supabase Auth)

   This table is managed by Supabase Auth.

   - id (UUID, PK)
   - email (VARCHAR)
   - full_name (VARCHAR)
   - created_at, updated_at (TIMESTAMP)

2. categories

   - id (UUID, PK)
   - name (VARCHAR)
   - description (TEXT)
   - color (VARCHAR)
   - is_default (BOOLEAN)
   - created_at, updated_at (TIMESTAMP)

3. expenses

   - id (UUID, PK)
   - user_id (UUID, FK -> users.id)
   - category_id (UUID, FK -> categories.id)
   - amount (DECIMAL)
   - description (TEXT)
   - date (DATE)
   - created_at, updated_at (TIMESTAMP)

4. reporting_periods
   - id (VARCHAR, PK)
   - name_pl, name_en (VARCHAR)
   - format_pl, format_en (VARCHAR)
   - interval_value (INTERVAL)
   - display_order (INTEGER)

### Bezpieczeństwo i skalowalność

- Row Level Security (RLS) dla wszystkich tabel
- Indeksy na kluczowych kolumnach wyszukiwania
- Polityki dostępu na poziomie użytkownika
- Automatyczne aktualizowanie pól updated_at
- Ograniczenia NOT NULL dla wymaganych pól
- Foreign key constraints dla zachowania integralności danych

### Funkcje pomocnicze

- get_reporting_periods() - pobieranie okresów raportowania
- format_period_date() - formatowanie dat
- get_period_boundaries() - pobieranie granic okresu
  </database_planning_summary>

<unresolved_issues>

1. Mechanizm archiwizacji wydatków (nie podjęto decyzji)
2. Mechanizm importu/eksportu danych (nie podjęto decyzji)
3. Preferencje użytkownika (nie podjęto decyzji)
   </unresolved_issues>
   </conversation_summary>
