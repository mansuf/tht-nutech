INSERT INTO Transactions (
    invoice_number,
    user_id,
    service_code,
    service_name,
    transaction_type,
    total_amount
) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;