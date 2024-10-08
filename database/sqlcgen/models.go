// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package sqlcgen

import (
	"database/sql"
	"time"
)

type ApiEndpoint struct {
	ApiEndpointID       int32
	EndpointName        string
	EndpointDescription sql.NullString
}

type ApiUsage struct {
	UsageID        int32
	CallTimestamp  time.Time
	UnixTimestamp  int32
	NumberOfCalls  int32
	CostPerCall    float64
	TotalCost      float64
	SubscriptionID int32
	BillingID      int32
	ApiEndpointID  int32
}

type BillingHistory struct {
	BillingID        int32
	BillingStartDate time.Time
	BillingEndDate   time.Time
	TotalAmountDue   float64
	TotalCalls       int32
	PaymentStatus    string
	PaymentDate      sql.NullTime
	BillingCreatedAt time.Time
	SubscriptionID   int32
}

type CustomEndpointPricing struct {
	CustomEndpointPricingID int32
	CustomCostPerCall       float64
	CustomRateLimit         int32
	SubscriptionID          int32
	TierBasePricingID       int32
}

type Organization struct {
	OrganizationID           int32
	OrganizationName         string
	OrganizationCreatedAt    time.Time
	OrganizationUpdatedAt    time.Time
	OrganizationRealm        string
	OrganizationCountry      sql.NullString
	OrganizationSupportEmail string
	OrganizationActive       sql.NullBool
	OrganizationReportQ      sql.NullBool
	OrganizationConfig       sql.NullString
	OrganizationTypeID       int32
}

type OrganizationPermission struct {
	OrganizationPermissionID int32
	ResourceTypeID           int32
	PermissionCode           string
	OrganizationID           int32
}

type OrganizationType struct {
	OrganizationTypeID   int32
	OrganizationTypeName string
}

type ResourceType struct {
	ResourceTypeID          int32
	ResourceTypeCode        string
	ResourceTypeName        string
	ResourceTypeDescription sql.NullString
}

type Subscription struct {
	SubscriptionID          int32
	SubscriptionName        string
	SubscriptionType        string
	SubscriptionCreatedDate time.Time
	SubscriptionUpdatedDate time.Time
	SubscriptionStartDate   time.Time
	SubscriptionApiLimit    sql.NullInt32
	SubscriptionExpiryDate  sql.NullTime
	SubscriptionDescription sql.NullString
	SubscriptionStatus      sql.NullBool
	OrganizationID          int32
	SubscriptionTierID      int32
}

type SubscriptionTier struct {
	SubscriptionTierID int32
	TierName           string
	TierDescription    sql.NullString
	TierCreatedAt      time.Time
	TierUpdatedAt      time.Time
}

type TierBasePricing struct {
	TierBasePricingID  int32
	BaseCostPerCall    float64
	BaseRateLimit      sql.NullInt32
	ApiEndpointID      int32
	SubscriptionTierID int32
}
