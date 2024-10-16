// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: organization.sql

package sqlcgen

import (
	"context"
	"database/sql"
)

const createOrganization = `-- name: CreateOrganization :execresult
INSERT INTO organization (
    organization_name, organization_created_at, organization_updated_at, 
    organization_realm, organization_country, organization_support_email,
    organization_active, organization_report_q, organization_config,
    organization_type_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

type CreateOrganizationParams struct {
	OrganizationName         string
	OrganizationCreatedAt    int32
	OrganizationUpdatedAt    int32
	OrganizationRealm        string
	OrganizationCountry      sql.NullString
	OrganizationSupportEmail string
	OrganizationActive       sql.NullBool
	OrganizationReportQ      sql.NullBool
	OrganizationConfig       sql.NullString
	OrganizationTypeID       int32
}

func (q *Queries) CreateOrganization(ctx context.Context, arg CreateOrganizationParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, createOrganization,
		arg.OrganizationName,
		arg.OrganizationCreatedAt,
		arg.OrganizationUpdatedAt,
		arg.OrganizationRealm,
		arg.OrganizationCountry,
		arg.OrganizationSupportEmail,
		arg.OrganizationActive,
		arg.OrganizationReportQ,
		arg.OrganizationConfig,
		arg.OrganizationTypeID,
	)
}

const createOrganizations = `-- name: CreateOrganizations :copyfrom
INSERT INTO organization (
    organization_name, organization_created_at, organization_updated_at, 
    organization_realm, organization_country, organization_support_email,
    organization_active, organization_report_q, organization_config,
    organization_type_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

type CreateOrganizationsParams struct {
	OrganizationName         string
	OrganizationCreatedAt    int32
	OrganizationUpdatedAt    int32
	OrganizationRealm        string
	OrganizationCountry      sql.NullString
	OrganizationSupportEmail string
	OrganizationActive       sql.NullBool
	OrganizationReportQ      sql.NullBool
	OrganizationConfig       sql.NullString
	OrganizationTypeID       int32
}

const deleteOrganizationById = `-- name: DeleteOrganizationById :exec
DELETE FROM organization
WHERE organization_id = ?
`

func (q *Queries) DeleteOrganizationById(ctx context.Context, organizationID int32) error {
	_, err := q.db.ExecContext(ctx, deleteOrganizationById, organizationID)
	return err
}

const getOrganization = `-- name: GetOrganization :one
SELECT organization_id, organization_name, organization_created_at, organization_updated_at, organization_realm, organization_country, organization_support_email, organization_active, organization_report_q, organization_config, organization_type_id FROM organization
WHERE organization_id = ?
`

func (q *Queries) GetOrganization(ctx context.Context, organizationID int32) (Organization, error) {
	row := q.db.QueryRowContext(ctx, getOrganization, organizationID)
	var i Organization
	err := row.Scan(
		&i.OrganizationID,
		&i.OrganizationName,
		&i.OrganizationCreatedAt,
		&i.OrganizationUpdatedAt,
		&i.OrganizationRealm,
		&i.OrganizationCountry,
		&i.OrganizationSupportEmail,
		&i.OrganizationActive,
		&i.OrganizationReportQ,
		&i.OrganizationConfig,
		&i.OrganizationTypeID,
	)
	return i, err
}

const listOrganization = `-- name: ListOrganization :many
SELECT organization_id, organization_name, organization_created_at, organization_updated_at, organization_realm, organization_country, organization_support_email, organization_active, organization_report_q, organization_config, organization_type_id FROM organization
ORDER BY organization_name
`

func (q *Queries) ListOrganization(ctx context.Context) ([]Organization, error) {
	rows, err := q.db.QueryContext(ctx, listOrganization)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Organization{}
	for rows.Next() {
		var i Organization
		if err := rows.Scan(
			&i.OrganizationID,
			&i.OrganizationName,
			&i.OrganizationCreatedAt,
			&i.OrganizationUpdatedAt,
			&i.OrganizationRealm,
			&i.OrganizationCountry,
			&i.OrganizationSupportEmail,
			&i.OrganizationActive,
			&i.OrganizationReportQ,
			&i.OrganizationConfig,
			&i.OrganizationTypeID,
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

const updateOrganization = `-- name: UpdateOrganization :execresult
UPDATE organization
SET 
    organization_name = ?,
    organization_updated_at = ?,
    organization_realm = ?,
    organization_country = ?,
    organization_support_email = ?,
    organization_active = ?,
    organization_report_q = ?,
    organization_config = ?,
    organization_type_id = ?
WHERE organization_id = ?
`

type UpdateOrganizationParams struct {
	OrganizationName         string
	OrganizationUpdatedAt    int32
	OrganizationRealm        string
	OrganizationCountry      sql.NullString
	OrganizationSupportEmail string
	OrganizationActive       sql.NullBool
	OrganizationReportQ      sql.NullBool
	OrganizationConfig       sql.NullString
	OrganizationTypeID       int32
	OrganizationID           int32
}

func (q *Queries) UpdateOrganization(ctx context.Context, arg UpdateOrganizationParams) (sql.Result, error) {
	return q.db.ExecContext(ctx, updateOrganization,
		arg.OrganizationName,
		arg.OrganizationUpdatedAt,
		arg.OrganizationRealm,
		arg.OrganizationCountry,
		arg.OrganizationSupportEmail,
		arg.OrganizationActive,
		arg.OrganizationReportQ,
		arg.OrganizationConfig,
		arg.OrganizationTypeID,
		arg.OrganizationID,
	)
}
