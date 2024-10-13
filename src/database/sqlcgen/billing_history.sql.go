// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: billing_history.sql

package sqlcgen

import (
	"context"
	"database/sql"
	"time"
)

const createBillingHistory = `-- name: CreateBillingHistory :execresult
INSERT INTO billing_history (
    billing_start_date, billing_end_date, total_amount_due,
    total_calls, payment_status, payment_date, 
    billing_created_at, subscription_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`

type CreateBillingHistoryParams struct {
	BillingStartDate time.Time
	BillingEndDate   time.Time
	TotalAmountDue   float64
	TotalCalls       int32
	PaymentStatus    string
	PaymentDate      sql.NullTime
	BillingCreatedAt time.Time
	SubscriptionID   int32
}

func (q *Queries) CreateBillingHistory(ctx context.Context, arg CreateBillingHistoryParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, createBillingHistory,
		arg.BillingStartDate,
		arg.BillingEndDate,
		arg.TotalAmountDue,
		arg.TotalCalls,
		arg.PaymentStatus,
		arg.PaymentDate,
		arg.BillingCreatedAt,
		arg.SubscriptionID,
	)
}

const getBillingHistoryById = `-- name: GetBillingHistoryById :many
SELECT billing_id, billing_start_date, billing_end_date, total_amount_due, total_calls, payment_status, payment_date, billing_created_at, subscription_id FROM billing_history
WHERE billing_id = ?
`

func (q *Queries) GetBillingHistoryById(ctx context.Context, billingID int32) ([]BillingHistory, error) {
	rows, err := q.db.QueryContext(ctx, getBillingHistoryById, billingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []BillingHistory
	for rows.Next() {
		var i BillingHistory
		if err := rows.Scan(
			&i.BillingID,
			&i.BillingStartDate,
			&i.BillingEndDate,
			&i.TotalAmountDue,
			&i.TotalCalls,
			&i.PaymentStatus,
			&i.PaymentDate,
			&i.BillingCreatedAt,
			&i.SubscriptionID,
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

const getBillingHistoryByOrgId = `-- name: GetBillingHistoryByOrgId :many
SELECT billing_id, billing_start_date, billing_end_date, total_amount_due, total_calls, payment_status, payment_date, billing_created_at, subscription_id FROM billing_history
WHERE subscription_id IN (
    SELECT subscription_id FROM subscription
    WHERE organization_id = ?
)
`

func (q *Queries) GetBillingHistoryByOrgId(ctx context.Context, organizationID int32) ([]BillingHistory, error) {
	rows, err := q.db.QueryContext(ctx, getBillingHistoryByOrgId, organizationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []BillingHistory
	for rows.Next() {
		var i BillingHistory
		if err := rows.Scan(
			&i.BillingID,
			&i.BillingStartDate,
			&i.BillingEndDate,
			&i.TotalAmountDue,
			&i.TotalCalls,
			&i.PaymentStatus,
			&i.PaymentDate,
			&i.BillingCreatedAt,
			&i.SubscriptionID,
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

const getBillingHistoryBySubId = `-- name: GetBillingHistoryBySubId :many
SELECT billing_id, billing_start_date, billing_end_date, total_amount_due, total_calls, payment_status, payment_date, billing_created_at, subscription_id FROM billing_history
WHERE subscription_id = ?
`

func (q *Queries) GetBillingHistoryBySubId(ctx context.Context, subscriptionID int32) ([]BillingHistory, error) {
	rows, err := q.db.QueryContext(ctx, getBillingHistoryBySubId, subscriptionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []BillingHistory
	for rows.Next() {
		var i BillingHistory
		if err := rows.Scan(
			&i.BillingID,
			&i.BillingStartDate,
			&i.BillingEndDate,
			&i.TotalAmountDue,
			&i.TotalCalls,
			&i.PaymentStatus,
			&i.PaymentDate,
			&i.BillingCreatedAt,
			&i.SubscriptionID,
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
