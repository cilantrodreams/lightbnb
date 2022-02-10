INSERT INTO users (name, email, password)
VALUES ('Alice Apple', 'aaple@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bob Bell', 'bigbob@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Carol Chrysler', 'carolc@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, 
  title, 
  description, 
  thumbnail_photo_url, 
  cover_photo_url, 
  cost_per_night, 
  parking_spaces, 
  number_of_bathrooms, 
  number_of_bedrooms, 
  country, street, 
  city, province, 
  post_code, 
  active
)
VALUES (
  1, 
  'The orchard', 
  'description', 
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
  83745,
  6,
  3,
  4,
  'Canada',
  '536 Fake Highway',
  'Vancouver',
  'British Columbia',
  'V1V 1V1',
  true
),
(
  2, 
  'Big House', 
  'description', 
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
  34454,
  5,
  5,
  4,
  'Canada',
  '465 Fake Street',
  'Hope',
  'British Columbia',
  'V2V 2V2',
  true
),
(
  3, 
  'Chill Zone', 
  'description', 
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
  45675,
  4,
  2,
  2,
  'Canada',
  '342 Notreal Avenue',
  'Calgary',
  'Alberta',
  'A1A 1A1',
  false
);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 2),
('2019-01-04', '2019-02-01', 2, 3),
('2021-10-01', '2021-10-14', 3, 2);