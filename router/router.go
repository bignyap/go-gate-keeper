package router

import (
	"net/http"

	"github.com/bignyap/go-gate-keeper/handler"
)

func OrgTypeHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /orgType", apiConfig.CreateOrgTypeHandler)
	mux.HandleFunc("GET /orgType", apiConfig.ListOrgTypeHandler)
	mux.HandleFunc("DELETE /orgType/{Id}", apiConfig.DeleteOrgTypeHandler)

}

func SubTierHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /subTier", apiConfig.CreateSubcriptionTierHandler)
	mux.HandleFunc("GET /subTier", apiConfig.ListSubscriptionTiersHandler)
	mux.HandleFunc("DELETE /subTier/{Id}", apiConfig.DeleteSubscriptionTierHandler)

}

func EndpointHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /endpoint", apiConfig.RegisterEndpointHandler)
	mux.HandleFunc("GET /endpoint", apiConfig.ListEndpointsHandler)
	mux.HandleFunc("DELETE /endpoint/{Id}", apiConfig.DeleteEndpointsByIdHandler)

}

func OrganizationHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /org", apiConfig.CreateOrganizationandler)
	mux.HandleFunc("GET /org", apiConfig.ListOrgTypeHandler)
	mux.HandleFunc("DELETE /org/{Id}", apiConfig.DeleteOrganizationByIdHandler)
	mux.HandleFunc("GET /org/{Id}", apiConfig.GetOrganizationByIdHandler)

}

func TierPricingHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /tierPricing", apiConfig.CreateTierPricingHandler)
	mux.HandleFunc("DELETE /tierPricing/{tier_id}", apiConfig.DeleteTierPricingHandler)
	mux.HandleFunc("DELETE /tierPricing/{id}", apiConfig.DeleteTierPricingHandler)
	mux.HandleFunc("GET /tierPricing/{tier_id}", apiConfig.GetTierPricingByTierIdHandler)

}

func SubscriptionHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /subscription", apiConfig.CreateSubscriptionHandler)
	mux.HandleFunc("DELETE /subscription/{id}", apiConfig.DeleteSubscriptionHandler)
	mux.HandleFunc("DELETE /subscription/{organization_id}", apiConfig.DeleteSubscriptionHandler)
	mux.HandleFunc("GET /subscription/id/{id}", apiConfig.GetSubscriptionHandler)
	mux.HandleFunc("GET /subscription/orgId/{organization_id}", apiConfig.GetSubscriptionByrgIdHandler)
	mux.HandleFunc("GET /subscription", apiConfig.ListSubscriptionHandler)

}

func CustomPricingHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /customPricing", apiConfig.CreateCustomPricingHandler)
	mux.HandleFunc("DELETE /customPricing/subId/{subscription_id}", apiConfig.DeleteCustomPricingHandler)
	mux.HandleFunc("DELETE /customPricing/id/{id}", apiConfig.DeleteCustomPricingHandler)
	mux.HandleFunc("GET /customPricing/{subscription_id}", apiConfig.GetCustomPricingHandler)

}

func ResourceTypeHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /resourceType", apiConfig.CreateResurceTypeHandler)
	mux.HandleFunc("DELETE /resourceType/{id}", apiConfig.DeleteResourceTypeHandler)
	mux.HandleFunc("GET /resourceType", apiConfig.ListResourceTypeHandler)

}

func OrgPermissionHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /orgPermission", apiConfig.CreateOrgPermissionHandler)
	mux.HandleFunc("DELETE /orgPermission/{organization_id}", apiConfig.DeleteOrgPermissionHandler)
	mux.HandleFunc("GET /orgPermission/{organization_id}", apiConfig.GetOrgPermissionHandler)

}

func RegisterHandlers(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("/", handler.RootHandler)
	OrgTypeHandler(mux, apiConfig)
	SubTierHandler(mux, apiConfig)
	EndpointHandler(mux, apiConfig)
	OrganizationHandler(mux, apiConfig)
	TierPricingHandler(mux, apiConfig)
	SubscriptionHandler(mux, apiConfig)
	CustomPricingHandler(mux, apiConfig)
	ResourceTypeHandler(mux, apiConfig)
	OrgPermissionHandler(mux, apiConfig)
}
