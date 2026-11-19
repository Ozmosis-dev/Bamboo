-- The expanded food gallery beneath the homepage banner: a second
-- many-rows key ('food_gallery') alongside the banner's 'gallery'.

-- A slot still holds exactly one image; both galleries hold many.
drop index if exists site_images_slot_idx;
create unique index site_images_slot_idx on site_images (key)
  where key not in ('gallery', 'food_gallery');

-- Seed the expanded gallery with the enhanced dish photos shipped in
-- /public/photos (the banner's ten live under key 'gallery' already).
insert into site_images (key, url, alt, sort) values
  ('food_gallery', '/photos/tuna-tataki.webp', 'Seared tuna tataki with jalapeño and sesame', 1),
  ('food_gallery', '/photos/sushi-spread.webp', 'Sushi spread of specialty and crispy rolls', 2),
  ('food_gallery', '/photos/pork-ramen.webp', 'Chashu ramen with marinated egg', 3),
  ('food_gallery', '/photos/crunch-roll.webp', 'Crunchy California rolls with spicy mayo', 4),
  ('food_gallery', '/photos/green-beans.webp', 'Tempura green beans', 5),
  ('food_gallery', '/photos/chili-dumplings.webp', 'Steamed dumplings in chili sauce', 6),
  ('food_gallery', '/photos/calamari.webp', 'Crispy calamari with lemon', 7),
  ('food_gallery', '/photos/spring-rolls.webp', 'Spring rolls with sweet chili sauce', 8),
  ('food_gallery', '/photos/wonton-noodle-bowl.webp', 'Noodle bowl with mushrooms and crispy wonton strips', 9),
  ('food_gallery', '/photos/dumplings.webp', 'Dumplings in ponzu with cilantro', 10),
  ('food_gallery', '/photos/beef-bowl.webp', 'Sesame-glazed beef bowl with shaved carrot', 11),
  ('food_gallery', '/photos/pork-belly-skewers.webp', 'Pork belly skewers with sweet chili sauce', 12),
  ('food_gallery', '/photos/rolls-drizzle.webp', 'Specialty rolls with spicy mayo drizzle', 13),
  ('food_gallery', '/photos/salmon-skewers.webp', 'Glazed salmon skewers with shaved carrot', 14),
  ('food_gallery', '/photos/chicken-wonton-soup.webp', 'Chicken and wonton soup with crispy strips', 15),
  ('food_gallery', '/photos/roll-board.webp', 'Full board of specialty rolls', 16),
  ('food_gallery', '/photos/shrimp-skewers.webp', 'Grilled shrimp skewers with scallion', 17);
