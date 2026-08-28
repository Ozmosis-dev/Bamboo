-- Placeholder seed data. Exercises every resolution path:
-- location-exclusive items (Chattanooga Roll, Magic City Roll) and a
-- Birmingham price override on the Sashimi Platter.

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
  'Bamboo on Main',
  'bambooonmain.com',
  '1400 Main St',
  'Chattanooga', 'TN', '37408',
  '(423) 555-0177',
  '[
    {"days": "Mon–Thu", "open": "11:00", "close": "21:00"},
    {"days": "Fri–Sat", "open": "11:00", "close": "22:00"},
    {"days": "Sun", "open": "closed", "close": "closed"}
  ]'::jsonb,
  '{"instagram": "https://instagram.com/bambooonmain", "facebook": "https://facebook.com/bambooonmain"}'::jsonb,
  'https://maps.google.com/?q=1400+Main+St+Chattanooga+TN+37408'
);

insert into menu_categories (name, slug, sort) values
('Sushi', 'sushi', 1),
('Hot Food', 'hot-food', 2),
('Cocktails & Wine', 'cocktails-wine', 3),
('Sake & Beer', 'sake-beer', 4);

-- Sushi
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, location_slugs, sort)
select id, v.name, v.description, v.price, v.price_note, v.dietary_tags::text[], v.location_slugs::text[], v.sort
from menu_categories, (values
  ('Salmon Nigiri', 'Fresh Atlantic salmon over seasoned rice', 6.50, '2 pc', '{gluten-free}', null, 1),
  ('Tuna Roll', 'Bluefin tuna, sushi rice, nori', 9.00, '6 pc', '{gluten-free}', null, 2),
  ('Spicy Yellowtail Roll', 'Yellowtail, scallion, chili oil', 10.50, '6 pc', '{spicy}', null, 3),
  ('Vegetable Roll', 'Avocado, cucumber, carrot, pickled radish', 8.00, '6 pc', '{vegan,vegetarian,gluten-free}', null, 4),
  ('Sashimi Platter', 'Chef''s selection of the day''s best fish', 24.00, 'chef''s choice', '{gluten-free}', null, 5),
  ('Omakase', 'Market-price chef''s tasting', null, 'MP', '{}', null, 6),
  ('Magic City Roll', 'Fried snapper, comeback sauce, house pickles — a Birmingham original', 13.00, '8 pc', '{spicy}', '{birmingham}', 7),
  ('Chattanooga Roll', 'Smoked trout, benton''s bacon crumble, scallion', 13.00, '8 pc', '{}', '{chattanooga}', 8)
) as v(name, description, price, price_note, dietary_tags, location_slugs, sort)
where menu_categories.slug = 'sushi';

-- Hot Food
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, location_slugs, sort)
select id, v.name, v.description, v.price, v.price_note, v.dietary_tags::text[], null, v.sort
from menu_categories, (values
  ('Chicken Karaage', 'Twice-fried chicken thigh, yuzu mayo', 11.00, null, '{}', 1),
  ('Miso Ramen', 'Pork broth, chashu, soft egg, scallion', 15.00, null, '{}', 2),
  ('Vegetable Yaki Udon', 'Stir-fried udon, seasonal vegetables, sweet soy', 13.00, null, '{vegetarian}', 3),
  ('Spicy Mapo Tofu', 'Silken tofu, chili bean paste, rice', 12.00, null, '{vegan,vegetarian,spicy}', 4),
  ('Gyoza', 'Pan-seared pork dumplings', 8.50, '5 pc', '{}', 5)
) as v(name, description, price, price_note, dietary_tags, sort)
where menu_categories.slug = 'hot-food';

-- Cocktails & Wine
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, location_slugs, sort)
select id, v.name, v.description, v.price, null, '{}', null, v.sort
from menu_categories, (values
  ('Yuzu Gimlet', 'Gin, yuzu, lime cordial', 13.00, 1),
  ('Toki Highball', 'Suntory Toki, soda, lemon peel', 12.00, 2),
  ('Plum Wine Spritz', 'Umeshu, sparkling wine, shiso', 11.00, 3),
  ('House Red', 'Rotating selection by the glass', 10.00, 4),
  ('House White', 'Rotating selection by the glass', 10.00, 5)
) as v(name, description, price, sort)
where menu_categories.slug = 'cocktails-wine';

-- Sake & Beer
insert into menu_items (category_id, name, description, price, price_note, dietary_tags, location_slugs, sort)
select id, v.name, v.description, v.price, v.price_note, '{}', null, v.sort
from menu_categories, (values
  ('Junmai Daiginjo', 'Elegant, floral, served chilled', 18.00, '300ml'),
  ('House Junmai', 'Clean and dry, served warm or cold', 9.00, 'glass'),
  ('Sapporo Premium', 'Crisp Japanese lager', 6.00, 'bottle'),
  ('Hitachino Nest White Ale', 'Wheat ale, coriander, orange peel', 9.00, 'bottle')
) as v(name, description, price, price_note)
where menu_categories.slug = 'sake-beer';

update menu_items set sort = s.rn
from (select id, row_number() over (partition by category_id order by sort, name) as rn from menu_items) s
where menu_items.id = s.id and menu_items.sort = 0;

-- Price override: Sashimi Platter costs more in Birmingham.
insert into menu_item_overrides (item_id, location_slug, price)
select id, 'birmingham', 26.00 from menu_items where name = 'Sashimi Platter';
