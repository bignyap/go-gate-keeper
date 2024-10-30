-- name: GetApiUsageSummaryByOrgId :many
SELECT * FROM api_usage_summary
WHERE subscription_id IN (
    SELECT subscription_id FROM subscription s
    WHERE s.organization_id = ?
);

-- name: GetApiUsageSummaryBySubId :many
SELECT * FROM api_usage_summary
WHERE subscription_id = ?;

-- name: GetApiUsageSummaryByEndpointId :many
SELECT * FROM api_usage_summary
WHERE api_endpoint_id = ?;

-- name: CreateApiUsageSummary :execresult 
INSERT INTO api_usage_summary (
    usage_start_date, usage_end_date, total_calls,
    total_cost, subscription_id, api_endpoint_id, 
    organization_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?);

-- name: CreateApiUsageSummaries :copyfrom
INSERT INTO api_usage_summary (
    usage_start_date, usage_end_date, total_calls,
    total_cost, subscription_id, api_endpoint_id, 
    organization_id
) 
VALUES (?, ?, ?, ?, ?, ?, ?);