package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils"
)

type CreateCustomPricingParams struct {
	CustomCostPerCall float64 `json:"custom_cost_per_call"`
	CustomRateLimit   int     `json:"custom_rate_limit"`
	SubscriptionID    int     `json:"subscription_id"`
	TierBasePricingID int     `json:"tier_base_pricing_id"`
}

type CreateCustomPricingOutput struct {
	ID int `json:"id"`
	CreateCustomPricingParams
}

func CreateCustomPricingFormValidator(r *http.Request) (*sqlcgen.CreateCustomPricingParams, error) {
	err := r.ParseForm()
	if err != nil {
		return nil, fmt.Errorf("error parsing form data: %s", err)
	}

	tierPricingId, err := utils.StrToInt(r.FormValue("tier_base_pricing_id"))
	if err != nil {
		return nil, fmt.Errorf("tier_base_pricing_id must be a positive integer value")
	}

	subId, err := utils.StrToInt(r.FormValue("subscription_id"))
	if err != nil {
		return nil, fmt.Errorf("subscription_id must be a positive integer value")
	}

	customCost, err := utils.StrToFloat(r.FormValue("custom_cost_per_call"))
	if err != nil {
		return nil, fmt.Errorf("custom_cost_per_call must be a positive integer value")
	}

	customRateLimit, err := utils.StrToInt(r.FormValue("custom_rate_limit"))
	if err != nil {
		return nil, fmt.Errorf("custom_rate_limit must be a positive integer value")
	}

	input := sqlcgen.CreateCustomPricingParams{
		CustomCostPerCall: customCost,
		CustomRateLimit:   int32(customRateLimit),
		SubscriptionID:    int32(subId),
		TierBasePricingID: int32(tierPricingId),
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateCustomPricingHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateCustomPricingFormValidator(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	customPrice, err := apiCfg.DB.CreateCustomPricing(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the custom pricing: %s", err))
		return
	}

	insertedID, err := customPrice.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateCustomPricingOutput{
		ID: int(insertedID),
		CreateCustomPricingParams: CreateCustomPricingParams{
			CustomCostPerCall: input.CustomCostPerCall,
			CustomRateLimit:   int(input.CustomRateLimit),
			SubscriptionID:    int(input.SubscriptionID),
			TierBasePricingID: int(input.TierBasePricingID),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) DeleteCustomPricingHandler(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("subscription_id")
	var err error

	if idStr != "" {
		id32, err := utils.StrToInt(idStr)
		if err != nil {
			respondWithError(w, StatusBadRequest, "Invalid subscription_id format")
			return
		}

		err = apiCfg.DB.DeleteCustomPricingBySubscriptionId(r.Context(), int32(id32))
		if err != nil {
			respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the custom pricing by subscription_id: %s", err))
			return
		}

		respondWithJSON(w, StatusNoContent, map[string]string{
			"message": fmt.Sprintf("custom pricing with subscription_id %d deleted successfully", int32(id32)),
		})
		return
	}

	idStr = r.URL.Query().Get("id")
	if idStr == "" {
		respondWithError(w, StatusBadRequest, "Missing subscription_id or id")
		return
	}

	id32, err := utils.StrToInt(idStr)
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid id format")
		return
	}

	err = apiCfg.DB.DeleteCustomPricingById(r.Context(), int32(id32))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the custom pricing by id: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("custom pricing with id %d deleted successfully", int32(id32)),
	})
}

func (apiCfg *ApiConfig) GetCustomPricingHandler(w http.ResponseWriter, r *http.Request) {

	id, err := utils.StrToInt(r.URL.Query().Get("subscription_id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid ID format")
		return
	}

	customPricings, err := apiCfg.DB.GetCustomPricing(r.Context(), int32(id))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the custom pricing list: %s", err))
		return
	}

	var output []CreateCustomPricingOutput

	for _, customPricing := range customPricings {

		output = append(output, CreateCustomPricingOutput{
			ID: int(customPricing.TierBasePricingID),
			CreateCustomPricingParams: CreateCustomPricingParams{
				TierBasePricingID: int(customPricing.TierBasePricingID),
				SubscriptionID:    int(customPricing.SubscriptionID),
				CustomCostPerCall: customPricing.CustomCostPerCall,
				CustomRateLimit:   int(customPricing.CustomRateLimit),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}
