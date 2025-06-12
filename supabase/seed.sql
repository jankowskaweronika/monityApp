-- Seed data for categories
INSERT INTO public.categories (name, description, color, is_default) VALUES
    ('Jedzenie', 'Wydatki na jedzenie i napoje', '#ff3500', true),
    ('Transport', 'Wydatki na transport i komunikację', '#33cc66', true),
    ('Mieszkanie', 'Wydatki związane z mieszkaniem', '#0000ff', true),
    ('Rozrywka', 'Wydatki na rozrywkę i hobby', '#e147eb', true),
    ('Zdrowie', 'Wydatki na zdrowie i leki', '#ff1919', true),
    ('Edukacja', 'Wydatki na edukację i rozwój', '#ace1af', true),
    ('Ubrania', 'Wydatki na ubrania i obuwie', '#F3FF33', true),
    ('Inne', 'Inne wydatki', '#808080', true); 