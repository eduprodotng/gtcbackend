CREATE TABLE disputes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id UUID NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'open', -- open, in-review, resolved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
