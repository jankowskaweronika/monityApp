# Diagram struktury UI - MonityApp

```mermaid
graph TD
    %% Main Layout and Pages
    App[App.tsx] --> SP[SupabaseProvider]
    SP --> Layout[MainLayout]

    %% Pages and Views
    Layout --> DV[DashboardView]

    %% Dashboard Components
    DV --> EC[ExpensesChart]
    DV --> PS[PeriodSummary]

    %% Component Details
    subgraph "Dashboard Components"
        EC --> UDH[useDashboardData Hook]
        PS --> UDH
        UDH --> ES[Expense Service]
        UDH --> CS[Category Service]
        UDH --> AS[Analytics Service]
    end

    %% Data Flow
    subgraph "Data Services"
        ES --> SC[Supabase Client]
        CS --> SC
        AS --> SC
        SC --> DB[(Supabase DB)]
    end

    %% UI Components
    subgraph "UI Components"
        EC --> Charts[Chart Components]
        PS --> Stats[Statistics Display]
        Stats --> Filters[Period Filters]
    end

    %% Styling
    classDef page fill:#f9f,stroke:#333,stroke-width:2px
    classDef component fill:#bbf,stroke:#333,stroke-width:1px
    classDef service fill:#dfd,stroke:#333,stroke-width:1px

    class DV page
    class EC,PS component
    class ES,CS,AS service
```

## Opis komponentów

### Główne komponenty

- **App.tsx** - Główny komponent aplikacji
- **SupabaseProvider** - Provider kontekstu Supabase
- **MainLayout** - Główny układ aplikacji

### Widoki

- **DashboardView** - Główny widok dashboardu

### Komponenty dashboardu

- **ExpensesChart** - Wykres wydatków
- **PeriodSummary** - Podsumowanie dla wybranego okresu

### Usługi danych

- **Expense Service** - Zarządzanie wydatkami
- **Category Service** - Zarządzanie kategoriami
- **Analytics Service** - Analityka i statystyki

### Komponenty UI

- **Chart Components** - Komponenty wykresów
- **Statistics Display** - Wyświetlanie statystyk
- **Period Filters** - Filtry okresów
