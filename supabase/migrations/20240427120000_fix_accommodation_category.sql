-- Migration: Fix Accommodation category color
-- Sets the color for Accommodation category if missing or incorrect

update public.categories
set color = '#0077ff'
where name = 'Accommodation'; 