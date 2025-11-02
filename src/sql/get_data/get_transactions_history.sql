SELECT
    T.transaction_id,
    T.invoice_number,
    T.service_name,
    T.transaction_type,
    T.total_amount,
    T.created_on
FROM
    Transactions AS T
JOIN
    Users AS U ON T.user_id = U.user_id
WHERE
    U.email = $1
ORDER BY
    T.created_on DESC;