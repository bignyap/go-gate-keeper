package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
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

func (apiCfg *ApiConfig) CreateSubcriptionTierHandler(w http.ResponseWriter, r *http.Request) {

	err := r.ParseForm()
	if err != nil {
		respondWithError(w, StatusBadRequest,
			fmt.Sprintf("Error parsing form data: %s", err),
		)
		return
	}

	input := sqlcgen.CreateSubscriptionTierParams{
		TierName: r.FormValue("name"),
		TierDescription: sql.NullString{
			String: r.FormValue("description"),
			Valid:  r.FormValue("description") != "",
		},
		TierCreatedAt: time.Now(),
		TierUpdatedAt: time.Now(),
	}

	if input.TierName == "" {
		respondWithError(w, StatusBadRequest, "Name is required")
		return
	}

	subTier, err := apiCfg.DB.CreateSubscriptionTier(r.Context(), input)
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

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		respondWithError(w, StatusBadRequest, "ID is required")
		return
	}

	id64, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid ID format")
		return
	}

	err = apiCfg.DB.DeleteSubscriptionTierById(r.Context(), int32(id64))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the subscription tier: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("Subscription tier with ID %d deleted successfully", int32(id64)),
	})
}
