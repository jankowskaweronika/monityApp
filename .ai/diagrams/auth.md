# Diagram przepływu autentykacji - MonityApp

sequenceDiagram
autonumber
participant U as Użytkownik
participant F as Frontend
participant R as Redux Store
participant SA as Supabase Auth
participant DB as Supabase DB

    %% Rejestracja
    alt Rejestracja
        U->>F: Wprowadź dane rejestracji
        activate F
        F->>F: Walidacja Zod
        F->>SA: Rejestracja + CSRF token
        activate SA
        SA->>SA: Weryfikuj CSRF
        SA->>SA: Rate limit check
        alt Sukces
            SA->>DB: Utwórz konto
            DB-->>SA: OK
            SA-->>F: User + Session
            F->>R: Zapisz stan auth
            F->>F: Zapisz token
            F-->>U: Dashboard
        else Błąd
            SA-->>F: Błąd rejestracji
            F-->>U: Pokaż błąd
        end
        deactivate SA
        deactivate F
    end

    %% Logowanie
    alt Logowanie
        U->>F: Dane logowania
        activate F
        F->>F: Walidacja Zod
        F->>SA: Login + CSRF token
        activate SA
        SA->>SA: Weryfikuj CSRF
        SA->>SA: Rate limit check
        alt Sukces
            SA->>DB: Pobierz profil
            DB-->>SA: Profil
            SA-->>F: User + Session
            F->>R: Zapisz stan auth
            F->>F: Zapisz token
            F-->>U: Dashboard
        else Błąd
            SA-->>F: Błąd logowania
            F-->>U: Pokaż błąd
        end
        deactivate SA
        deactivate F
    end

    %% Reset hasła
    alt Reset hasła
        U->>F: Żądanie resetu
        activate F
        F->>SA: Reset + CSRF token
        SA->>SA: Rate limit check
        SA-->>U: Email z linkiem
        U->>F: Link reset
        F->>SA: Weryfikuj token
        alt Token OK
            SA-->>F: Token poprawny
            F-->>U: Form nowego hasła
            U->>F: Nowe hasło
            F->>F: Walidacja siły hasła
            F->>SA: Aktualizuj hasło
            SA->>DB: Update hasło
            DB-->>SA: OK
            SA-->>F: Sukces
            F-->>U: Logowanie
        else Token wygasł
            SA-->>F: Błąd token
            F-->>U: Link wygasł
        end
        deactivate F
    end

    %% Odświeżanie sesji
    alt Wygasł token
        F->>SA: Odśwież token
        activate SA
        SA->>SA: Waliduj token
        alt Token OK
            SA-->>F: Nowy token
            F->>R: Update stan
            F->>F: Update token
        else Token błędny
            SA-->>F: Błąd
            F->>R: Wyczyść stan
            F-->>U: Wyloguj
        end
        deactivate SA
    end

    %% Wylogowanie
    alt Wylogowanie
        U->>F: Wyloguj
        activate F
        F->>SA: Zakończ sesję
        SA-->>F: OK
        F->>R: Wyczyść stan
        F->>F: Usuń token
        F-->>U: Strona logowania
        deactivate F
    end
