-- name: ListSubscriptionTier :many
SELECT * FROM subscription_tier
ORDER BY tier_name;

-- name: CreateSubscriptionTier :execresult 
INSERT INTO subscription_tier (tier_name, tier_description, tier_created_at, tier_updated_at) 
VALUES (?, ?, ?, ?);

-- name: CreateSubscriptionTiers :copyfrom
INSERT INTO subscription_tier (tier_name, tier_description, tier_created_at, tier_updated_at) 
VALUES (?, ?, ?, ?);

-- name: DeleteSubscriptionTierById :exec
DELETE FROM subscription_tier
WHERE subscription_tier_id = ?;