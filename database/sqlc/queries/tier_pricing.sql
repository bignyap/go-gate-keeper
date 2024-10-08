-- -- name: ListTierPricing :many
-- SELECT * FROM tier_base_pricing
-- ORDER BY subscription_tier_id;

-- name: GetTierPricingByTierId :many
SELECT * FROM tier_base_pricing
WHERE subscription_tier_id = ?;

-- name: CreateTierPricing :execresult 
INSERT INTO tier_base_pricing (subscription_tier_id, api_endpoint_id, base_cost_per_call, base_rate_limit) 
VALUES (?, ?, ?, ?);

-- name: UpdateTierPricingByTierId :execresult
UPDATE tier_base_pricing
SET 
    base_cost_per_call = ?,
    base_rate_limit = ?,
    api_endpoint_id = ?
WHERE subscription_tier_id = ?;

-- name: UpdateTierPricingById :execresult
UPDATE tier_base_pricing
SET 
    base_cost_per_call = ?,
    base_rate_limit = ?,
    api_endpoint_id = ?
WHERE tier_base_pricing_id = ?;

-- name: DeleteTierPricingByTierId :exec
DELETE FROM tier_base_pricing
WHERE subscription_tier_id = ?;

-- name: DeleteTierPricingById :exec
DELETE FROM tier_base_pricing
WHERE tier_base_pricing_id = ?;