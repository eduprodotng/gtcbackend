CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  skills_id SERIAL,
  booking_user_id SERIAL,
  booked_user_id SERIAL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  booking_location VARCHAR(500),
  booking_date TIMESTAMP,
  file_url VARCHAR(255) NOT NULL,
  status ENUM('pending', 'rejected', 'accepted') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);