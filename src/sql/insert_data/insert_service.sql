INSERT INTO Services (
    service_code, 
    service_name, 
    service_icon, 
    service_tariff
) VALUES (
    $1, $2, $3, $4
) ON CONFLICT (service_code) DO NOTHING;