CREATE TABLE IF NOT EXISTS Banners (
    banner_id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL UNIQUE,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT
);