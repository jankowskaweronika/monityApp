-- Seed data for categories
INSERT INTO public.categories (name, description, color, is_default) VALUES
    ('Jedzenie', 'Wydatki na jedzenie i napoje', '#FF5733', true),
    ('Transport', 'Wydatki na transport i komunikację', '#33FF57', true),
    ('Mieszkanie', 'Wydatki związane z mieszkaniem', '#3357FF', true),
    ('Rozrywka', 'Wydatki na rozrywkę i hobby', '#F333FF', true),
    ('Zdrowie', 'Wydatki na zdrowie i leki', '#FF3333', true),
    ('Edukacja', 'Wydatki na edukację i rozwój', '#33FFF3', true),
    ('Ubrania', 'Wydatki na ubrania i obuwie', '#F3FF33', true),
    ('Inne', 'Inne wydatki', '#808080', true); 