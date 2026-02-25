CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id SERIAL,
  skill_type VARCHAR(255),
  experience_level VARCHAR(80),
  hourly_rate VARCHAR(10),
  spark_token VARCHAR(10),
  description TEXT NOT NULL,
  approval_status ENUM('draft', 'rejected', 'published') NOT NULL DEFAULT 'draft',
  thumbnail01 VARCHAR(255),
  thumbnail02 VARCHAR(255),
  thumbnail03 VARCHAR(255),
  thumbnail04 VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
