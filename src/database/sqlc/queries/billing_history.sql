-- name: GetBillingHistoryByOrgId :many
SELECT * FROM billing_history
WHERE subscription_id IN (
    SELECT subscription_id FROM subscription
    WHERE organization_id = ?
);

-- name: GetBillingHistoryBySubId :many
SELECT * FROM billing_history
WHERE subscription_id = ?;

-- name: GetBillingHistoryById :many
SELECT * FROM billing_history
WHERE billing_id = ?;

-- name: CreateBillingHistory :execresult 
INSERT INTO billing_history (
    billing_start_date, billing_end_date, total_amount_due,
    total_calls, payment_status, payment_date, 
    billing_created_at, subscription_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- name: CreateBillingHistories :copyfrom
INSERT INTO billing_history (
    billing_start_date, billing_end_date, total_amount_due,
    total_calls, payment_status, payment_date, 
    billing_created_at, subscription_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?);