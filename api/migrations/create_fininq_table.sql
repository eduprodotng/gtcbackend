CREATE TABLE financial_inquiries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  chat_title VARCHAR(255), -- Optional: name the chat e.g., “Investment Advice”
  chat_id UUID DEFAULT gen_random_uuid(), -- A unique ID for each chat session
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
