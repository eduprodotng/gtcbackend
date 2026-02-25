CREATE TABLE account (
  id SERIAL PRIMARY KEY,
  user_id SERIAL,
  spark_token_balance INTEGER,
  cash_balance MONEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
