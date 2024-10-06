// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: endpoints.sql

package sqlcgen

import (
	"context"
	"database/sql"
)

const deleteApiEndpointById = `-- name: DeleteApiEndpointById :exec
DELETE FROM api_endpoint
WHERE api_endpoint_id = ?
`

func (q *Queries) DeleteApiEndpointById(ctx context.Context, apiEndpointID int32) error {
	_, err := q.db.ExecContext(ctx, deleteApiEndpointById, apiEndpointID)
	return err
}

const listApiEndpoint = `-- name: ListApiEndpoint :many
SELECT api_endpoint_id, endpoint_name, endpoint_description FROM api_endpoint
ORDER BY endpoint_name
`

func (q *Queries) ListApiEndpoint(ctx context.Context) ([]ApiEndpoint, error) {
	rows, err := q.db.QueryContext(ctx, listApiEndpoint)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ApiEndpoint
	for rows.Next() {
		var i ApiEndpoint
		if err := rows.Scan(&i.ApiEndpointID, &i.EndpointName, &i.EndpointDescription); err != nil {
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

const registerApiEndpoint = `-- name: RegisterApiEndpoint :execresult
INSERT INTO api_endpoint (endpoint_name, endpoint_description) 
VALUES (?, ?)
`

type RegisterApiEndpointParams struct {
	EndpointName        string
	EndpointDescription sql.NullString
}

func (q *Queries) RegisterApiEndpoint(ctx context.Context, arg RegisterApiEndpointParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, registerApiEndpoint, arg.EndpointName, arg.EndpointDescription)
}
