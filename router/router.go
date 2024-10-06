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

func RegisterHandlers(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("/", handler.RootHandler)
	OrgTypeHandler(mux, apiConfig)
	SubTierHandler(mux, apiConfig)
	EndpointHandler(mux, apiConfig)
	OrganizationHandler(mux, apiConfig)
}
