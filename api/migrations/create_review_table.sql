-- CREATE TABLE reviews (
--   id SERIAL PRIMARY KEY,
--   booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
--   reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
--   comment TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  reviewee_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
