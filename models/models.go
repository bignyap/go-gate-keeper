package models

import "time"

// OrganizationType represents the organization_type table
type OrganizationType struct {
	OrganizationTypeID   int    `json:"organization_type_id"`
	OrganizationTypeName string `json:"organization_type_name"`
}

// SubscriptionTier represents the subscription_tier table
type SubscriptionTier struct {
	SubscriptionTierID int       `json:"subscription_tier_id"`
	TierName           string    `json:"tier_name"`
	TierDescription    string    `json:"tier_description"`
	TierCreatedAt      time.Time `json:"tier_created_at"`
	TierUpdatedAt      time.Time `json:"tier_updated_at"`
}

// Organization represents the organization table
type Organization struct {
	OrganizationID           int       `json:"organization_id"`
	OrganizationName         string    `json:"organization_name"`
	OrganizationCreatedAt    time.Time `json:"organization_created_at"`
	OrganizationUpdatedAt    time.Time `json:"organization_updated_at"`
	OrganizationRealm        string    `json:"organization_realm"`
	OrganizationCountry      string    `json:"organization_country"`
	OrganizationSupportEmail string    `json:"organization_support_email"`
	OrganizationActive       bool      `json:"organization_active"`
	OrganizationReportQ      bool      `json:"organization_report_q"`
	OrganizationConfig       string    `json:"organization_config"`
	OrganizationTypeID       int       `json:"organization_type_id"`
}

// APIKey represents the api_key table
type APIKey struct {
	APIKeyID       int       `json:"api_key_id"`
	APIKey         string    `json:"api_key"`
	APIKeyStatus   bool      `json:"api_key_status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	OrganizationID int       `json:"organization_id"`
}

// Subscription represents the subscription table
type Subscription struct {
	SubscriptionID          int       `json:"subscription_id"`
	SubscriptionName        string    `json:"subscription_name"`
	SubscriptionType        string    `json:"subscription_type"`
	SubscriptionCreatedDate time.Time `json:"subscription_created_date"`
	SubscriptionUpdatedDate time.Time `json:"subscription_updated_date"`
	SubscriptionStartDate   time.Time `json:"subscription_start_date"`
	SubscriptionApiLimit    int       `json:"subscription_api_limit"`
	SubscriptionExpiryDate  time.Time `json:"subscription_expiry_date"`
	SubscriptionApiRate     string    `json:"subscription_api_rate"`
	SubscriptionDescription string    `json:"subscription_description"`
	SubscriptionStatus      bool      `json:"subscription_status"`
	OrganizationID          int       `json:"organization_id"`
	SubscriptionTierID      int       `json:"subscription_tier_id"`
}

// APIEndpoint represents the api_endpoint table
type APIEndpoint struct {
	APIEndpointID       int    `json:"api_endpoint_id"`
	EndpointName        string `json:"endpoint_name"`
	EndpointDescription string `json:"endpoint_description"`
}

// TierBasePricing represents the tier_base_pricing table
type TierBasePricing struct {
	TierBasePricingID  int     `json:"tier_base_pricing_id"`
	BaseCostPerCall    float64 `json:"base_cost_per_call"`
	BaseRateLimit      int     `json:"base_rate_limit"`
	APIEndpointID      int     `json:"api_endpoint_id"`
	SubscriptionTierID int     `json:"subscription_tier_id"`
}

// SubscriptionEndpointPricing represents the subscription_endpoint_pricing table
type SubscriptionEndpointPricing struct {
	CustomCostPerCall float64 `json:"custom_cost_per_call"`
	CustomRateLimit   int     `json:"custom_rate_limit"`
	SubscriptionID    int     `json:"subscription_id"`
	TierBasePricingID int     `json:"tier_base_pricing_id"`
}

// OrganizationPermission represents the organization_permission table
type OrganizationPermission struct {
	ResourceCode   string `json:"resource_code"`
	PermissionCode string `json:"permission_code"`
	OrganizationID int    `json:"organization_id"`
}

// BillingHistory represents the billing_history table
type BillingHistory struct {
	BillingID        int       `json:"billing_id"`
	BillingStartDate time.Time `json:"billing_start_date"`
	BillingEndDate   time.Time `json:"billing_end_date"`
	TotalAmountDue   float64   `json:"total_amount_due"`
	TotalCalls       int       `json:"total_calls"`
	PaymentStatus    string    `json:"payment_status"`
	PaymentDate      time.Time `json:"payment_date"`
	BillingCreatedAt time.Time `json:"billing_created_at"`
	SubscriptionID   int       `json:"subscription_id"`
}

// APIUsage represents the api_usage table
type APIUsage struct {
	UsageID        int       `json:"usage_id"`
	CallTimestamp  time.Time `json:"call_timestamp"`
	UnixTimestamp  int       `json:"unix_timestamp"`
	NumberOfCalls  int       `json:"number_of_calls"`
	CostPerCall    float64   `json:"cost_per_call"`
	TotalCost      float64   `json:"total_cost"`
	SubscriptionID int       `json:"subscription_id"`
	BillingID      int       `json:"billing_id"`
	APIEndpointID  int       `json:"api_endpoint_id"`
}
