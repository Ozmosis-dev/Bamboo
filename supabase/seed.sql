-- Seed: locations + the real menu, transcribed from the 5/7 menu PDFs
-- (BambooMenu5-7-{Sushi,Food,Cocktails,SakeBeer}.pdf at the repo root).
-- All items are shared across both locations (location_slugs null); use the
-- admin's Locations selector / per-location pricing for any divergence.

insert into locations (slug, name, domain, address_line1, city, state, zip, phone, hours, social, map_url) values
(
  'birmingham',
  'Bamboo on 2nd',
  'bambooon2nd.com',
  '2212 2nd Ave N',
  'Birmingham', 'AL', '35203',
  '(205) 555-0142',
  '[
    {"days": "Mon–Thu", "open": "11:00", "close": "21:00"},
    {"days": "Fri–Sat", "open": "11:00", "close": "22:00"},
    {"days": "Sun", "open": "closed", "close": "closed"}
  ]'::jsonb,
  '{"instagram": "https://instagram.com/bambooon2nd", "facebook": "https://facebook.com/bambooon2nd"}'::jsonb,
  'https://maps.google.com/?q=2212+2nd+Ave+N+Birmingham+AL+35203'
),
(
  'chattanooga',
  'Bamboo on Market',
  'bambooonmain.com',
  '423 Market St',
  'Chattanooga', 'TN', '37402',
  '(423) 555-0177',
  '[
    {"days": "Mon–Thu", "open": "17:00", "close": "21:30"},
    {"days": "Fri–Sat", "open": "17:00", "close": "22:30"},
    {"days": "Sun", "open": "closed", "close": "closed"}
  ]'::jsonb,
  '{"instagram": "https://instagram.com/bambooonmain", "facebook": "https://facebook.com/bambooonmain"}'::jsonb,
  'https://maps.google.com/?q=423+Market+St+Chattanooga+TN+37402'
);

insert into menu_categories (name, slug, sort) values
('Sashimi', 'sashimi', 1),
('Nigiri', 'nigiri', 2),
('Rolls', 'rolls', 3),
('Share', 'share', 4),
('Skewers', 'skewers', 5),
('Salads', 'salads', 6),
('Noodle Bowls', 'noodle-bowls', 7),
('Cocktails', 'cocktails', 8),
('Asian Wine', 'asian-wine', 9),
('Bubbles & Rosé', 'bubbles-rose', 10),
('White Wine', 'white-wine', 11),
('Red Wine', 'red-wine', 12),
('Sake', 'sake', 13),
('On Tap', 'on-tap', 14),
('Bottles & Cans', 'bottles-cans', 15),
('Zero Proof', 'zero-proof', 16);

-- Sashimi (incl. The Flight feature)
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('The Flight', 'Tuna, hamachi, and salmon wrapped around pickled shallots, with red peppers, cilantro, and house yuzu sauce on a slice of fresh cucumber', 18.00, null, 1),
  ('Red Snapper', null, 9.00, '3 pc', 2),
  ('Salmon', null, 9.00, '3 pc', 3),
  ('Tuna', null, 10.00, '3 pc', 4),
  ('Hamachi', null, 10.00, '3 pc', 5),
  ('Toro', null, 19.00, '3 pc', 6),
  ('Unagi', null, 9.00, '3 pc', 7),
  ('Madai', null, 9.00, '3 pc', 8)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'sashimi';

-- Nigiri
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, null, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Red Snapper', 6.00, '2 pc', 1),
  ('Salmon', 6.00, '2 pc', 2),
  ('Tuna', 8.00, '2 pc', 3),
  ('Hamachi', 8.00, '2 pc', 4),
  ('Toro', 16.00, '2 pc', 5),
  ('Unagi', 9.00, '3 pc', 6),
  ('Madai', 8.00, '2 pc', 7)
) as v(name, price, price_note, sort)
where menu_categories.slug = 'nigiri';

-- Rolls
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, null, v.dietary_tags::text[], v.sort
from menu_categories, (values
  ('Crunchy Cali', 'Crab, avocado, cucumber, tempura', 9.00, '{}', 1),
  ('Crunchy Shrimp', 'Shrimp tempura, cucumber, masago, avocado, eel sauce', 11.00, '{}', 2),
  ('Samurai', 'Tuna, cucumber, avocado, jalapeño, topped with spicy tuna, scallions, spicy ponzu', 15.00, '{spicy}', 3),
  ('Kaiju', 'Spicy tuna, cucumber, tempura, topped with smoked eel, avocado, eel sauce', 14.00, '{spicy}', 4),
  ('Fire', 'Spicy tuna, avocado, cucumber, topped with red snapper, tuna, avocado, aioli, sriracha', 15.00, '{spicy}', 5),
  ('Salmon Cream Crunch', 'Smoked salmon, cream cheese, tempura, eel sauce', 13.00, '{}', 6),
  ('Rainbow', 'Crab, avocado, cucumber, topped with salmon, tuna, red snapper', 14.00, '{}', 7),
  ('Cyclone', 'Spicy tuna, salmon, kani, avocado, cream cheese, battered, fried, topped with aioli, eel sauce, jalapeño peppers, sriracha', 16.00, '{spicy}', 8),
  ('Blazer', 'Crab, avocado, cucumber, topped with avocado, aioli', 12.00, '{}', 9),
  ('Magic City', 'Cream cheese, tempura, topped with spicy tuna, avocado, sriracha, serrano peppers, eel sauce', 15.00, '{spicy}', 10),
  ('Godzilla', 'Shrimp tempura, spicy tuna, cucumber, topped with tuna, eel sauce, spicy Godzilla aioli', 15.00, '{spicy}', 11),
  ('Red Mountain', 'Shrimp tempura, cucumber, avocado, cream cheese, topped with smoked eel, sriracha, eel sauce', 14.00, '{}', 12),
  ('Vulcan', 'Spicy tuna, spicy crab, cucumber, tempura, topped with hamachi, serrano peppers, scallions, aioli', 16.00, '{spicy}', 13),
  ('Hamachi', 'Hamachi, cucumber, avocado, scallion, topped with tuna, salmon', 16.00, '{}', 14),
  ('Spicy Tuna', 'Spicy tuna, avocado, cucumber, aioli', 11.00, '{spicy}', 15),
  ('Yasai', 'Vegan — cucumber, avocado, carrot, asparagus, topped with avocado, eel sauce', 12.00, '{vegan,vegetarian}', 16),
  ('Wham B''HAM', 'Shrimp tempura, avocado, cucumber, topped with seared salmon, wasabi aioli, eel sauce', 15.00, '{}', 17),
  ('Kankitsu', 'Salmon, cucumber, avocado, topped with salmon and tuna ceviche, thinly sliced lemon, ponzu', 15.00, '{}', 18),
  ('New Moon', 'Salmon, tuna, avocado, cucumber, topped with seared hamachi, serrano peppers, spicy ponzu', 16.00, '{spicy}', 19),
  ('Geisha', 'Spicy tuna, shrimp tempura, cucumber, avocado, cream cheese, soy paper, topped with spicy crab, aioli, eel sauce, tempura', 16.00, '{spicy}', 20),
  ('Nakatomi', 'Fried soft-shell crab, cucumber, carrots, jalapeño, topped with spicy tuna, eel sauce', 15.00, '{spicy}', 21)
) as v(name, description, price, dietary_tags, sort)
where menu_categories.slug = 'rolls';

-- Share
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Momos', 'Steamed Nepalese dumplings, cilantro — ground turkey with tomato vinaigrette, or spicy ground pork with ponzu', 10.00, null, 1),
  ('Tempura Fried Green Beans', 'Togarashi sauce', 8.00, null, 2),
  ('Calamari', 'Flash fried squid, ginger, garlic, honey sriracha', 14.00, null, 3),
  ('Seared Tuna Ponzu', 'Carrot, serrano', 15.00, null, 4),
  ('Slow Roasted Baby Back Ribs', 'Spiced rub, hoisin glaze, sushi rice, sesame coleslaw', 16.00, null, 5),
  ('Miso Soup', 'Scallion · add tofu $1', 5.00, null, 6),
  ('Lumpia', 'Filipino egg roll, house sweet sauce — turkey (carrot, celery, water chestnut) or veggie (cabbage, cauliflower, cilantro, onion, green pepper, carrot, scallion)', 8.00, null, 7),
  ('Tuna Tataki', 'Wasabi aioli, sriracha', 15.00, null, 8),
  ('Grilled Edamame', 'Sherpa pink Himalaya salt', 6.00, null, 9),
  ('PBR', 'Grilled pork, flash fried brussels, sushi rice, eel sauce, sesame seeds', 15.00, null, 10),
  ('Poke Bowl — Salmon', 'Cucumbers, scallion, napa cabbage, carrot, avocado, radish, sesame seeds, sushi rice, spicy ponzu', 15.00, null, 11),
  ('Poke Bowl — Tuna', 'Cucumbers, scallion, napa cabbage, carrot, avocado, radish, sesame seeds, sushi rice, spicy ponzu', 17.00, null, 12)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'share';

-- Skewers
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, null, '{}'::text[], v.sort
from menu_categories, (values
  ('Lemongrass Chicken', 'Honey sriracha sauce', 9.00, 1),
  ('Korean BBQ Chicken', 'Scallion', 9.00, 2),
  ('Marinated Beef', 'Thai chimichurri', 10.00, 3),
  ('Garlic Shrimp', 'Korean BBQ sauce, scallion', 11.00, 4),
  ('Grilled Salmon', 'Eel sauce', 10.00, 5),
  ('Pork Belly Adobo', 'Honey sriracha sauce', 10.00, 6)
) as v(name, description, price, sort)
where menu_categories.slug = 'skewers';

-- Salads
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, null, '{}'::text[], v.sort
from menu_categories, (values
  ('Thai Entrée', 'Spicy peanut dressing', 8.00, 1),
  ('Caesar Entrée', 'Spicy caesar dressing', 8.00, 2),
  ('Maguro', 'Tuna, cucumber, mint, avocado, cilantro, scallion, peanuts, spicy sesame ginger vinaigrette', 17.00, 3),
  ('Asian Salmon', 'Seared salmon, romaine, cucumber, white onion, dressing of palm sugar, fresh lime, chili', 13.00, 4),
  ('Seaweed Salad', 'Fresh seaweed, sesame oil, chili flakes, cucumber, carrot, finely diced mushrooms', 6.00, 5)
) as v(name, description, price, sort)
where menu_categories.slug = 'salads';

-- Noodle Bowls
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, v.dietary_tags::text[], v.sort
from menu_categories, (values
  ('Ramen', 'Seasoned pork broth, wheat noodle, carrot, cilantro, scallion, bean sprouts, shiitake & tree ear mushrooms, soft boiled egg', 13.00, null, '{}', 1),
  ('Spicy Miso', 'Wheat noodle, spinach, scallion, cilantro', 12.00, null, '{spicy}', 2),
  ('Thukpa', 'Tibetan style noodle soup — house made chicken broth, rice noodle, carrot, spinach, scallion, cilantro', 12.00, null, '{}', 3),
  ('Vegetarian Thukpa', 'Veggie broth, rice noodle, tofu, carrot, cilantro, scallion, bean sprouts, asparagus, shiitake & tree ear mushroom', 13.00, null, '{vegetarian}', 4),
  ('Maa Bowl', 'Chicken, shrimp momos, mushrooms, baby bok choy, and wheat noodles in a chicken broth infused with ginger, soy, sesame and wild berry peppers, topped with fried wontons', 18.00, null, '{}', 5),
  ('Add to Any Salad or Bowl', 'Chicken $6 · beef $6 · shrimp $7 · pork $6 · tofu $3 · pork belly $6', null, null, '{}', 6)
) as v(name, description, price, price_note, dietary_tags, sort)
where menu_categories.slug = 'noodle-bowls';

-- Cocktails
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, null, '{}'::text[], v.sort
from menu_categories, (values
  ('The Imperial', 'Suntory Toki, citrus-ginger simple, orange bitters', 15.00, 1),
  ('Bamboo Standard', 'Tito''s, mint syrup, cucumber, lime', 12.00, 2),
  ('Gin/Gin', 'Bombay Dry, Canton ginger, soda, fresh lemon', 11.00, 3),
  ('Japanese Hornet', 'Hornitos Reposado, Canton ginger, honey syrup, lemon', 12.00, 4),
  ('Monster Zero', 'Campesino Silver X, Campesino Aged, Kraken, ginger beer, orange juice', 14.00, 5),
  ('Nutty Ninja', 'Skrewball, half & half, Hershey''s chocolate syrup', 13.00, 6),
  ('Ruby Fresca', 'Deep Eddy Ruby Red, Fresca, fresh lime', 11.00, 7),
  ('Touch of Grey', 'Bombay Sapphire, Earl Grey simple, fresh lemon', 13.00, 8)
) as v(name, description, price, sort)
where menu_categories.slug = 'cocktails';

-- Asian Wine
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, 'Master Gao Apple/Plum', 'Nanjing, China', 20.00, null, '{}'::text[], 1
from menu_categories where slug = 'asian-wine';

-- Bubbles & Rosé (price = glass where poured; note carries bottle price)
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Prosecco Cinzano NV', 'Veneto, IT', 9.00, 'glass / $36 bottle', 1),
  ('Sparkling Maschio Rosé NV', 'Veneto, IT', 10.00, 'glass / $40 bottle', 2),
  ('Champagne Jean Francois Merieau "Bulles" NV', 'Loire Valley, FR', 50.00, 'bottle', 3),
  ('Rosé Sacha Lichine "The Pale"', 'Provence, FR', 11.00, 'glass / $44 bottle', 4),
  ('Rosé Recital Gavoty', 'Côtes de Provence, FR', 14.00, 'glass / $56 bottle', 5)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'bubbles-rose';

-- White Wine
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Pinot Grigio Barone Fini', 'Veneto, IT', 8.00, 'glass / $32 bottle', 1),
  ('Picpoul de Pinet Vignerous des Florensac', 'Languedoc, FR', 34.00, 'bottle', 2),
  ('Riesling S. A. Prum Essence', 'Mosel, GR', 36.00, 'bottle', 3),
  ('Gruner Veltliner Berger', 'Austria', 11.00, 'glass / $44 bottle', 4),
  ('Sauvignon Blanc Southern Right', 'Walker Bay, ZA', 40.00, 'bottle', 5),
  ('Sauvignon Blanc Ferrari-Carano "Fume Blanc"', 'Sonoma County, CA', 11.00, 'glass / $44 bottle', 6),
  ('Sauvignon Blanc Franck Millet Sancerre', 'Loire Valley, FR', 16.00, 'glass / $64 bottle', 7),
  ('Chardonnay Chalk Hill', 'Russian River, CA', 12.00, 'glass / $48 bottle', 8),
  ('Chardonnay Sonoma Cutrer "Russian River Ranches"', 'Sonoma, CA', 48.00, 'bottle', 9),
  ('Chardonnay Jean Marc Brocard Chablis', 'France', 15.00, 'glass / $60 bottle', 10)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'white-wine';

-- Red Wine
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Malbec Trapiche Broquel', 'Mendoza, AR', 9.00, 'glass / $36 bottle', 1),
  ('Gamay Jean Francois Merieau "Le Bois Jacou"', 'Touraine, FR', 44.00, 'bottle', 2),
  ('Rhône Chateaumar', 'Côtes-du-Rhône, FR', 12.00, 'glass / $48 bottle', 3),
  ('Pinot Noir Laurel Cellars', 'Monterey, CA', 12.00, 'glass / $48 bottle', 4),
  ('Pinot Noir Inscription "King Estate"', 'Oregon', 45.00, 'bottle', 5),
  ('Pinot Noir Jean Fournier Rouge', 'Burgundy, FR', 60.00, 'bottle', 6),
  ('Pinot Noir The Four Graces', 'Willamette Valley, OR', 16.00, 'glass / $64 bottle', 7),
  ('Cabernet Sauvignon B-Side', 'North Coast, CA', 12.00, 'glass / $48 bottle', 8),
  ('Cabernet Sauvignon Serial Wines', 'Paso Robles, CA', 14.00, 'glass / $56 bottle', 9),
  ('Cabernet Sauvignon Katherine Goldschmidt "Stonemason" AV', 'California', 60.00, 'bottle', 10),
  ('Cabernet Sauvignon Honig', 'Napa Valley, CA', 80.00, 'bottle', 11)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'red-wine';

-- Sake
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Sake Flight', null, null, 'MP', 1),
  ('Gekkeikan', 'Hot or cold', 9.00, 'carafe', 2),
  ('Tyku Black', null, 36.00, '720 ml', 3),
  ('Sho Chiku Bai "Silky Mild" Nigori', null, 13.00, '300 ml', 4),
  ('Kuromatsu-Hakushika "Snow Beauty" Nigori', null, 20.00, '300 ml', 5),
  ('Proper Sake Co. "The Diplomat" Nigori', null, 21.00, '237 ml', 6),
  ('Tozai "Snow Maiden" Junmai Nigori', null, 15.00, '180 ml', 7),
  ('Yuka Tora Nigori', null, 13.00, '200 ml', 8),
  ('Yuki White Peach Nigori', null, 22.00, '375 ml', 9),
  ('Rihaku "Dreamy Clouds" Tokubetsu Junmai Nigori', null, 24.00, '300 ml', 10),
  ('Proper Sake Co. "The Diplomat" Junmai', null, 21.00, '237 ml', 11),
  ('Tozai "Well of Wisdom" Ginjo', null, 30.00, '300 ml', 12),
  ('Kimbo Junmai', null, 11.00, '189 ml', 13),
  ('Tozai "Living Jewel" Junmai', null, 30.00, '300 ml', 14),
  ('Bushido "Way of the Warrior" Ginjo Genshu', null, 14.00, '180 ml', 15),
  ('Konteki "Tears of Dawn" Daiginjo', null, 38.00, '300 ml', 16),
  ('Fukucho "Moon on the Water" Junmai Ginjo', null, 32.00, '300 ml', 17),
  ('Kanbara "Bride of the Fox" Junmai Ginjo', null, 32.00, '300 ml', 18),
  ('Hakushika Junmai Ginjo', null, 18.00, '300 ml', 19),
  ('Konteki "Pearls of Simplicity" Junmai Daiginjo', null, 37.00, '300 ml', 20),
  ('Hakushika Junmai Daiginjo', null, 30.00, '300 ml', 21),
  ('Ozeki Peach Sparkling "Hana-Fuga"', null, 18.00, '300 ml', 22),
  ('Shirakabe Gura "Mio" Sparkling', null, 20.00, '300 ml', 23)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'sake';

-- On Tap
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, null, '{}'::text[], v.sort
from menu_categories, (values
  ('Feature Taps', 'Inquire about our rotating feature taps', null, 1),
  ('Sapporo Tokyo', 'Japan', 6.00, 2),
  ('Cahaba Brewing American Blonde Ale', 'Birmingham, AL', 8.00, 3),
  ('Good People IPA', 'Birmingham, AL', 7.00, 4),
  ('OEC Brewing Oolong Kolsch', 'Oxford, CT', 7.00, 5)
) as v(name, description, price, sort)
where menu_categories.slug = 'on-tap';

-- Bottles & Cans
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Kirin Ichiban', 'Japan', 5.00, '12 oz bottle', 1),
  ('Sapporo', 'Japan', 9.00, '22 oz can', 2),
  ('Master Gao Puffed Rice Pale Ale', 'China', 6.00, '12 oz can', 3),
  ('Master Gao Najing Black', 'China', 6.00, '12 oz can', 4),
  ('Michelob Ultra', 'USA', 5.00, '12 oz bottle', 5),
  ('Miller Lite', 'USA', 5.00, '12 oz bottle', 6),
  ('Modelo Especial', 'Mexico', 6.00, '12 oz can', 7),
  ('Woodchuck Amber Hard Cider', 'USA', 5.00, null, 8)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'bottles-cans';

-- Zero Proof
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, sort)
select id, v.name, v.description, v.price, v.price_note, '{}'::text[], v.sort
from menu_categories, (values
  ('Loose Leaf Tea', 'Inquire about tonight''s selections', null, null, 1),
  ('Ginger Beer', null, 5.00, '12 oz can', 2),
  ('Aqua Panna Still Water', null, 5.00, '16.9 oz bottle', 3),
  ('San Pellegrino Sparkling', null, 5.00, '16.9 oz bottle', 4),
  ('Beter Kombucha', 'Inquire about tonight''s selections', 10.00, null, 5),
  ('San Pellegrino Aranciata Rossa', null, 7.00, '330 ml can', 6)
) as v(name, description, price, price_note, sort)
where menu_categories.slug = 'zero-proof';
