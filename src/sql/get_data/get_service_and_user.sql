SELECT 
    u.balance,
    s.service_tariff, 
    s.service_name
FROM 
    Users u, Services s
WHERE 
    u.user_id = $1 AND s.service_code = $2
FOR UPDATE OF u;