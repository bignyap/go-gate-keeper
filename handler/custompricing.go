package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
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

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	intFields := []string{"tier_base_pricing_id", "subscription_id", "custom_rate_limit"}
	intParsed, err := formvalidator.ParseIntFromForm(r, intFields)
	if err != nil {
		return nil, err
	}

	floatFields := []string{"custom_cost_per_call"}
	floatParsed, err := formvalidator.ParseFloatFromForm(r, floatFields)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.CreateCustomPricingParams{
		CustomCostPerCall: floatParsed["custom_cost_per_call"],
		CustomRateLimit:   int32(intParsed["custom_rate_limit"]),
		SubscriptionID:    int32(intParsed["subscription_id"]),
		TierBasePricingID: int32(intParsed["tier_base_pricing_id"]),
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
		id32, err := converter.StrToInt(idStr)
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

	id32, err := converter.StrToInt(idStr)
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

	id, err := converter.StrToInt(r.URL.Query().Get("subscription_id"))
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
