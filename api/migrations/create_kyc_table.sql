CREATE TABLE kyc (
  id SERIAL PRIMARY KEY,
  user_id SERIAL,
  kyc_method ENUM('identification', 'utility-bill') NOT NULL,
  kyc_id_type ENUM('residence-permit','driving-license','international-passport','utility-bill') NOT NULL,
  document_url VARCHAR(255) NOT NULL,
  approval_status ENUM('pending', 'rejected', 'approved') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
