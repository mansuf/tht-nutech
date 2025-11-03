SELECT 
    u.balance,
    s.service_code,
    s.service_name,
    s.service_tariff
FROM 
    Users u, Services s
WHERE 
    u.user_id = $1 AND s.service_code = $2
FOR UPDATE OF u;