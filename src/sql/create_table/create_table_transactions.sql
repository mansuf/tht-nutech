CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    service_code VARCHAR(50) NOT NULL,
    service_name VARCHAR(100),
    transaction_type VARCHAR(50) NOT NULL,
    total_amount INT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);