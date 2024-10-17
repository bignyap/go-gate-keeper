// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: sub_tier.sql

package sqlcgen

import (
	"context"
	"database/sql"
)

const createSubscriptionTier = `-- name: CreateSubscriptionTier :execresult
INSERT INTO subscription_tier (tier_name, tier_description, tier_created_at, tier_updated_at) 
VALUES (?, ?, ?, ?)
`

type CreateSubscriptionTierParams struct {
	TierName        string
	TierDescription sql.NullString
	TierCreatedAt   int32
	TierUpdatedAt   int32
}

func (q *Queries) CreateSubscriptionTier(ctx context.Context, arg CreateSubscriptionTierParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, createSubscriptionTier,
		arg.TierName,
		arg.TierDescription,
		arg.TierCreatedAt,
		arg.TierUpdatedAt,
	)
}

const createSubscriptionTiers = `-- name: CreateSubscriptionTiers :copyfrom
INSERT INTO subscription_tier (tier_name, tier_description, tier_created_at, tier_updated_at) 
VALUES (?, ?, ?, ?)
`

type CreateSubscriptionTiersParams struct {
	TierName        string
	TierDescription sql.NullString
	TierCreatedAt   int32
	TierUpdatedAt   int32
}

const deleteSubscriptionTierById = `-- name: DeleteSubscriptionTierById :exec
DELETE FROM subscription_tier
WHERE subscription_tier_id = ?
`

func (q *Queries) DeleteSubscriptionTierById(ctx context.Context, subscriptionTierID int32) error {
	_, err := q.db.ExecContext(ctx, deleteSubscriptionTierById, subscriptionTierID)
	return err
}

const listSubscriptionTier = `-- name: ListSubscriptionTier :many
SELECT subscription_tier_id, tier_name, tier_description, tier_created_at, tier_updated_at FROM subscription_tier
ORDER BY tier_name
`

func (q *Queries) ListSubscriptionTier(ctx context.Context) ([]SubscriptionTier, error) {
	rows, err := q.db.QueryContext(ctx, listSubscriptionTier)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []SubscriptionTier{}
	for rows.Next() {
		var i SubscriptionTier
		if err := rows.Scan(
			&i.SubscriptionTierID,
			&i.TierName,
			&i.TierDescription,
			&i.TierCreatedAt,
			&i.TierUpdatedAt,
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
