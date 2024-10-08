-- name: GetOrgPermission :many
SELECT * FROM organization_permission
WHERE organization_id = ?;

-- name: CreateOrgPermission :execresult 
INSERT INTO organization_permission (resource_type_id, permission_code, organization_id) 
VALUES (?, ?, ?);

-- name: DeleteOrgPermissionById :exec
DELETE FROM organization_permission
WHERE organization_permission_id = ?;

-- name: DeleteOrgPermissionByOrgId :exec
DELETE FROM organization_permission
WHERE organization_id = ?;