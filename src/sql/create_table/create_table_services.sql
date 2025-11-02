CREATE TABLE IF NOT EXISTS Services (
    service_id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) NOT NULL UNIQUE,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(255),
    service_tariff INT NOT NULL DEFAULT 0
);