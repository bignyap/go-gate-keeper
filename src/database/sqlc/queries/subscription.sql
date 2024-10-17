-- name: ListSubscription :many
SELECT * FROM subscription
ORDER BY subscription_name;

-- name: GetSubscriptionById :one
SELECT * FROM subscription
WHERE subscription_id = ?;

-- name: GetSubscriptionByOrgId :many
SELECT * FROM subscription
WHERE organization_id = ?;

-- name: CreateSubscription :execresult 
INSERT INTO subscription (
    subscription_name, subscription_type, subscription_created_date,
    subscription_updated_date, subscription_start_date, subscription_api_limit, 
    subscription_expiry_date, subscription_description, subscription_status, 
    organization_id, subscription_tier_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: CreateSubscriptions :copyfrom
INSERT INTO subscription (
    subscription_name, subscription_type, subscription_created_date,
    subscription_updated_date, subscription_start_date, subscription_api_limit, 
    subscription_expiry_date, subscription_description, subscription_status, 
    organization_id, subscription_tier_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: UpdateSubscription :execresult
UPDATE subscription
SET 
    subscription_name = ?,
    subscription_start_date = ?,
    subscription_api_limit = ?,
    subscription_expiry_date = ?,
    subscription_description = ?,
    subscription_status = ?,
    organization_id = ?,
    subscription_tier_id = ?
WHERE subscription_id = ?;

-- name: DeleteSubscriptionByOrgId :exec
DELETE FROM subscription
WHERE organization_id = ?;

-- name: DeleteSubscriptionById :exec
DELETE FROM subscription
WHERE subscription_id = ?;