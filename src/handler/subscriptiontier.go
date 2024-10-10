package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
)

type CreateSubTierParams struct {
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateSubTierOuput struct {
	ID int `json:"id"`
	CreateSubTierParams
}

func CreateSubcriptionTierFormValidation(r *http.Request) (*sqlcgen.CreateSubscriptionTierParams, error) {

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"name", "type"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	nullStrField := []string{"description"}
	nullStrParsed, err := formvalidator.ParseNullStringFromForm(r, nullStrField)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.CreateSubscriptionTierParams{
		TierName:        strParsed["name"],
		TierDescription: nullStrParsed["description"],
		TierCreatedAt:   time.Now(),
		TierUpdatedAt:   time.Now(),
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateSubcriptionTierHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateSubcriptionTierFormValidation(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	subTier, err := apiCfg.DB.CreateSubscriptionTier(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the subscription tier: %s", err))
		return
	}

	insertedID, err := subTier.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	var description *string
	if input.TierDescription.Valid {
		description = &input.TierDescription.String
	}

	output := CreateSubTierOuput{
		ID: int(insertedID),
		CreateSubTierParams: CreateSubTierParams{
			Name:        input.TierName,
			Description: description,
			CreatedAt:   input.TierCreatedAt,
			UpdatedAt:   input.TierUpdatedAt,
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) ListSubscriptionTiersHandler(w http.ResponseWriter, r *http.Request) {

	subTiers, err := apiCfg.DB.ListSubscriptionTier(r.Context())
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the subscripion tiers: %s", err))
		return
	}

	var output []CreateSubTierOuput

	for _, subTier := range subTiers {

		var description *string
		if subTier.TierDescription.Valid {
			description = &subTier.TierDescription.String
		}

		output = append(output, CreateSubTierOuput{
			ID: int(subTier.SubscriptionTierID),
			CreateSubTierParams: CreateSubTierParams{
				Name:        subTier.TierName,
				Description: description,
				CreatedAt:   subTier.TierCreatedAt,
				UpdatedAt:   subTier.TierUpdatedAt,
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteSubscriptionTierHandler(w http.ResponseWriter, r *http.Request) {

	id, err := converter.StrToInt(r.PathValue("id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "ID is required")
		return
	}

	err = apiCfg.DB.DeleteSubscriptionTierById(r.Context(), int32(id))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the subscription tier: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("Subscription tier with ID %d deleted successfully", int32(id)),
	})
}
