
-- Add more event categories to provide users with additional options
INSERT INTO public.event_categories (name, description) VALUES
('Pool Party', 'Swimming pool parties and water celebrations'),
('Game Night', 'Board game, card game, and video game parties'),
('Karaoke Night', 'Karaoke and singing celebrations'),
('Movie Night', 'Movie screening and cinema-themed parties'),
('Potluck Dinner', 'Community potluck and shared meal events'),
('Wine Tasting', 'Wine tasting and vineyard events'),
('Cooking Class', 'Cooking and culinary learning events'),
('Art Party', 'Art creation and craft parties'),
('Dance Party', 'Dancing and music celebration events'),
('Outdoor Adventure', 'Hiking, camping, and outdoor activity events'),
('Sports Event', 'Sports viewing parties and athletic events'),
('Charity Event', 'Charitable fundraising and community service events'),
('Networking Event', 'Professional networking and business mixers'),
('Book Club', 'Book discussion and literary events'),
('Garden Party', 'Outdoor garden and nature-themed celebrations')
ON CONFLICT (name) DO NOTHING;
