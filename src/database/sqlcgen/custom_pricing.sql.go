// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: custom_pricing.sql

package sqlcgen

import (
	"context"
	"database/sql"
)

const createCustomPricing = `-- name: CreateCustomPricing :execresult
INSERT INTO custom_endpoint_pricing (
    custom_cost_per_call, custom_rate_limit,
    subscription_id, tier_base_pricing_id
) 
VALUES (?, ?, ?, ?)
`

type CreateCustomPricingParams struct {
	CustomCostPerCall float64
	CustomRateLimit   int32
	SubscriptionID    int32
	TierBasePricingID int32
}

func (q *Queries) CreateCustomPricing(ctx context.Context, arg CreateCustomPricingParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, createCustomPricing,
		arg.CustomCostPerCall,
		arg.CustomRateLimit,
		arg.SubscriptionID,
		arg.TierBasePricingID,
	)
}

const createCustomPricings = `-- name: CreateCustomPricings :copyfrom
INSERT INTO custom_endpoint_pricing (
    custom_cost_per_call, custom_rate_limit,
    subscription_id, tier_base_pricing_id
) 
VALUES (?, ?, ?, ?)
`

type CreateCustomPricingsParams struct {
	CustomCostPerCall float64
	CustomRateLimit   int32
	SubscriptionID    int32
	TierBasePricingID int32
}

const deleteCustomPricingById = `-- name: DeleteCustomPricingById :exec
DELETE FROM custom_endpoint_pricing
WHERE custom_endpoint_pricing_id = ?
`

func (q *Queries) DeleteCustomPricingById(ctx context.Context, customEndpointPricingID int32) error {
	_, err := q.db.ExecContext(ctx, deleteCustomPricingById, customEndpointPricingID)
	return err
}

const deleteCustomPricingBySubscriptionId = `-- name: DeleteCustomPricingBySubscriptionId :exec
DELETE FROM custom_endpoint_pricing
WHERE subscription_id = ?
`

func (q *Queries) DeleteCustomPricingBySubscriptionId(ctx context.Context, subscriptionID int32) error {
	_, err := q.db.ExecContext(ctx, deleteCustomPricingBySubscriptionId, subscriptionID)
	return err
}

const getCustomPricing = `-- name: GetCustomPricing :many
SELECT custom_endpoint_pricing_id, custom_cost_per_call, custom_rate_limit, subscription_id, tier_base_pricing_id FROM custom_endpoint_pricing
WHERE subscription_id = ?
LIMIT ? OFFSET ?
`

type GetCustomPricingParams struct {
	SubscriptionID int32
	Limit          int32
	Offset         int32
}

func (q *Queries) GetCustomPricing(ctx context.Context, arg GetCustomPricingParams) ([]CustomEndpointPricing, error) {
	rows, err := q.db.QueryContext(ctx, getCustomPricing, arg.SubscriptionID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []CustomEndpointPricing{}
	for rows.Next() {
		var i CustomEndpointPricing
		if err := rows.Scan(
			&i.CustomEndpointPricingID,
			&i.CustomCostPerCall,
			&i.CustomRateLimit,
			&i.SubscriptionID,
			&i.TierBasePricingID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
