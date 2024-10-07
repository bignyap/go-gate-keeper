package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils"
)

type CreateTierPricingParams struct {
	BaseCostPerCall    float64 `json:"base_cost_per_call"`
	BaseRateLimit      *int    `json:"base_rate_limit"`
	ApiEndpointId      int     `json:"api_endpoint_id"`
	SubscriptionTierID int     `json:"subscription_tier_id"`
}

type CreateTierPricingOutput struct {
	ID int `json:"id"`
	CreateTierPricingParams
}

func CreateTierPricingFormValidator(r *http.Request) (*sqlcgen.CreateTierPricingParams, error) {
	err := r.ParseForm()
	if err != nil {
		return nil, fmt.Errorf("error parsing form data: %s", err)
	}

	subTierId, err := utils.StrToInt(r.FormValue("subscription_tier_id"))
	if err != nil {
		return nil, fmt.Errorf("subscription_tier_id must be a positive integer value")
	}

	apiEPId, err := utils.StrToInt(r.FormValue("api_endpoint_id"))
	if err != nil {
		return nil, fmt.Errorf("api_endpoint_id must be a positive integer value")
	}

	baseRateLimit, err := utils.StrToNullInt32(r.FormValue("base_rate_limit"))
	if err != nil {
		return nil, fmt.Errorf("base_rate_limit must be a positive integer value")
	}

	baseCost, err := utils.StrToFloat(r.FormValue("base_rate_limit"))
	if err != nil {
		return nil, fmt.Errorf("base_rate_limit must be a positive integer value")
	}

	input := sqlcgen.CreateTierPricingParams{
		SubscriptionTierID: int32(subTierId),
		ApiEndpointID:      int32(apiEPId),
		BaseCostPerCall:    baseCost,
		BaseRateLimit:      baseRateLimit,
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateTierPricingHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateTierPricingFormValidator(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	tierPrice, err := apiCfg.DB.CreateTierPricing(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the tier pricing: %s", err))
		return
	}

	insertedID, err := tierPrice.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateTierPricingOutput{
		ID: int(insertedID),
		CreateTierPricingParams: CreateTierPricingParams{
			SubscriptionTierID: int(input.SubscriptionTierID),
			ApiEndpointId:      int(input.ApiEndpointID),
			BaseCostPerCall:    input.BaseCostPerCall,
			BaseRateLimit:      utils.NullInt32ToInt(&input.BaseRateLimit),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) GetTierPricingByTierIdHandler(w http.ResponseWriter, r *http.Request) {

	idStr, err := utils.StrToInt(r.URL.Query().Get("tier_id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid ID format")
		return
	}

	tierPricings, err := apiCfg.DB.GetTierPricingByTierId(r.Context(), int32(idStr))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the tier pricing list: %s", err))
		return
	}

	var output []CreateTierPricingOutput

	for _, tierPricing := range tierPricings {

		output = append(output, CreateTierPricingOutput{
			ID: int(tierPricing.TierBasePricingID),
			CreateTierPricingParams: CreateTierPricingParams{
				SubscriptionTierID: int(tierPricing.SubscriptionTierID),
				ApiEndpointId:      int(tierPricing.ApiEndpointID),
				BaseCostPerCall:    tierPricing.BaseCostPerCall,
				BaseRateLimit:      utils.NullInt32ToInt(&tierPricing.BaseRateLimit),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteTierPricingHandler(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("organization_id")
	var err error

	if idStr != "" {
		id32, err := utils.StrToInt(idStr)
		if err != nil {
			respondWithError(w, StatusBadRequest, "Invalid organization_id format")
			return
		}

		err = apiCfg.DB.DeleteSubscriptionByOrgId(r.Context(), int32(id32))
		if err != nil {
			respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the subscription by organization_id: %s", err))
			return
		}

		respondWithJSON(w, StatusNoContent, map[string]string{
			"message": fmt.Sprintf("subscription with organization_id %d deleted successfully", int32(id32)),
		})
		return
	}

	idStr = r.URL.Query().Get("id")
	if idStr == "" {
		respondWithError(w, StatusBadRequest, "Missing organization_id or id")
		return
	}

	id32, err := utils.StrToInt(idStr)
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid id format")
		return
	}

	err = apiCfg.DB.DeleteSubscriptionById(r.Context(), int32(id32))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the subscription by id: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("subscription with id %d deleted successfully", int32(id32)),
	})
}
