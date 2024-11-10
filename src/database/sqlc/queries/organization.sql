-- name: ListOrganization :many
SELECT * FROM organization
ORDER BY organization_name
LIMIT ? OFFSET ?;

-- name: GetOrganization :one
SELECT * FROM organization
WHERE organization_id = ?;

-- name: CreateOrganization :execresult 
INSERT INTO organization (
    organization_name, organization_created_at, organization_updated_at, 
    organization_realm, organization_country, organization_support_email,
    organization_active, organization_report_q, organization_config,
    organization_type_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: CreateOrganizations :copyfrom
INSERT INTO organization (
    organization_name, organization_created_at, organization_updated_at, 
    organization_realm, organization_country, organization_support_email,
    organization_active, organization_report_q, organization_config,
    organization_type_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: UpdateOrganization :execresult
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
WHERE organization_id = ?;

-- name: DeleteOrganizationById :exec
DELETE FROM organization
WHERE organization_id = ?;