INSERT INTO Banners (
    banner_name, 
    banner_image, 
    description
) VALUES (
    $1, $2, $3
) ON CONFLICT (banner_name) DO NOTHING;