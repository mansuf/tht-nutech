INSERT INTO Users (
    email, 
    first_name, 
    last_name, 
    password_hash, 
    balance,
    profile_image
) VALUES ($1, $2, $3, $4, 0, NULL);