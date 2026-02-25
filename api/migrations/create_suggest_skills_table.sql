CREATE TABLE suggest_skills (
  id SERIAL PRIMARY KEY,
  user_id SERIAL,
  name TEXT NOT NULL,
  approval_status ENUM('pending', 'rejected', 'accepted') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
