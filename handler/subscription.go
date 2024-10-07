package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils"
)

type CreateSubscriptionParams struct {
	Name               string     `json:"name"`
	Type               string     `json:"type"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
	StartDate          time.Time  `json:"start_date"`
	APILimit           *int       `json:"api_limit"`
	ExpiryDate         *time.Time `json:"expiry_date"`
	Description        *string    `json:"description"`
	Status             *bool      `json:"status"`
	OrganizationID     int        `json:"organization_id"`
	SubscriptionTierID int        `json:"subscription_tier_id"`
}

type CreateSubscriptionOutput struct {
	ID int `json:"id"`
	CreateSubscriptionParams
}

func CreateSubscriptionFormValidation(r *http.Request) (*sqlcgen.CreateSubscriptionParams, error) {
	err := r.ParseForm()
	if err != nil {
		return nil, fmt.Errorf("error parsing form data: %s", err)
	}

	orgId, err := utils.StrToInt(r.FormValue("organization_id"))
	if err != nil {
		return nil, fmt.Errorf("organization_id must be a positive integer value")
	}

	subTierId, err := utils.StrToInt(r.FormValue("subscription_tier_id"))
	if err != nil {
		return nil, fmt.Errorf("subscription_tier_id must be a positive integer value")
	}

	if r.FormValue("name") == "" {
		return nil, fmt.Errorf("name is required")
	}

	if r.FormValue("type") == "" {
		return nil, fmt.Errorf("type is required")
	}

	startDate, err := utils.StrToDate(r.FormValue("start_date"))
	if err != nil {
		startDate = time.Now()
	}

	expiryDate, err := utils.StrToNullTime(r.FormValue("expiry_date"))
	if err != nil {
		return nil, fmt.Errorf("expiry_date must be a date in YYYY-MM-DD format")
	}

	apiLimit, err := utils.StrToNullInt32(r.FormValue("api_limit"))
	if err != nil {
		return nil, fmt.Errorf("api_limit must be a positive integer value")
	}

	description := utils.StrToNullStr(r.FormValue("description"))

	status, _ := utils.StrToBool(r.FormValue("status"))

	input := sqlcgen.CreateSubscriptionParams{
		SubscriptionName:        r.FormValue("name"),
		SubscriptionType:        r.FormValue("type"),
		SubscriptionCreatedDate: time.Now(),
		SubscriptionUpdatedDate: time.Now(),
		SubscriptionStartDate:   startDate,
		SubscriptionApiLimit:    apiLimit,
		SubscriptionExpiryDate:  expiryDate,
		SubscriptionDescription: description,
		SubscriptionStatus:      sql.NullBool{Bool: status, Valid: true},
		OrganizationID:          int32(orgId),
		SubscriptionTierID:      int32(subTierId),
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateSubscriptionHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateSubscriptionFormValidation(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	subscription, err := apiCfg.DB.CreateSubscription(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the subscription: %s", err))
		return
	}

	insertedID, err := subscription.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateSubscriptionOutput{
		ID: int(insertedID),
		CreateSubscriptionParams: CreateSubscriptionParams{
			Name:               input.SubscriptionName,
			Type:               input.SubscriptionType,
			CreatedAt:          input.SubscriptionCreatedDate,
			UpdatedAt:          input.SubscriptionUpdatedDate,
			StartDate:          input.SubscriptionStartDate,
			APILimit:           utils.NullInt32ToInt(&input.SubscriptionApiLimit),
			ExpiryDate:         &input.SubscriptionCreatedDate,
			Description:        &input.SubscriptionDescription.String,
			Status:             utils.NullBoolToBool(&input.SubscriptionStatus),
			OrganizationID:     int(input.OrganizationID),
			SubscriptionTierID: int(input.SubscriptionTierID),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) DeleteSubscriptionHandler(w http.ResponseWriter, r *http.Request) {

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

	err = apiCfg.DB.DeleteOrganizationById(r.Context(), int32(id64))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the organization: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("organization with ID %d deleted successfully", int32(id64)),
	})
}

func (apiCfg *ApiConfig) GetSubscriptionHandler(w http.ResponseWriter, r *http.Request) {

	id, err := utils.StrToInt(r.URL.Query().Get("id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid ID format")
		return
	}

	subscription, err := apiCfg.DB.GetSubscriptionById(r.Context(), int32(id))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the subscription: %s", err))
		return
	}

	output := CreateSubscriptionOutput{
		ID: int(subscription.SubscriptionID),
		CreateSubscriptionParams: CreateSubscriptionParams{
			Name:               subscription.SubscriptionName,
			Type:               subscription.SubscriptionType,
			CreatedAt:          subscription.SubscriptionCreatedDate,
			UpdatedAt:          subscription.SubscriptionUpdatedDate,
			StartDate:          subscription.SubscriptionStartDate,
			APILimit:           utils.NullInt32ToInt(&subscription.SubscriptionApiLimit),
			ExpiryDate:         &subscription.SubscriptionCreatedDate,
			Description:        &subscription.SubscriptionDescription.String,
			Status:             utils.NullBoolToBool(&subscription.SubscriptionStatus),
			OrganizationID:     int(subscription.OrganizationID),
			SubscriptionTierID: int(subscription.SubscriptionTierID),
		},
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) GetSubscriptionByrgIdHandler(w http.ResponseWriter, r *http.Request) {

	orgId, err := utils.StrToInt(r.URL.Query().Get("organization_id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid organization_id format")
		return
	}

	subscriptions, err := apiCfg.DB.GetSubscriptionByOrgId(r.Context(), int32(orgId))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the subscriptions: %s", err))
		return
	}

	var output []CreateSubscriptionOutput

	for _, subscription := range subscriptions {

		output = append(output, CreateSubscriptionOutput{
			ID: int(subscription.SubscriptionID),
			CreateSubscriptionParams: CreateSubscriptionParams{
				Name:               subscription.SubscriptionName,
				Type:               subscription.SubscriptionType,
				CreatedAt:          subscription.SubscriptionCreatedDate,
				UpdatedAt:          subscription.SubscriptionUpdatedDate,
				StartDate:          subscription.SubscriptionStartDate,
				APILimit:           utils.NullInt32ToInt(&subscription.SubscriptionApiLimit),
				ExpiryDate:         &subscription.SubscriptionCreatedDate,
				Description:        &subscription.SubscriptionDescription.String,
				Status:             utils.NullBoolToBool(&subscription.SubscriptionStatus),
				OrganizationID:     int(subscription.OrganizationID),
				SubscriptionTierID: int(subscription.SubscriptionTierID),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) ListSubscriptionHandler(w http.ResponseWriter, r *http.Request) {

	subscriptions, err := apiCfg.DB.ListSubscription(r.Context())
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the subscriptions: %s", err))
		return
	}

	var output []CreateSubscriptionOutput

	for _, subscription := range subscriptions {

		output = append(output, CreateSubscriptionOutput{
			ID: int(subscription.SubscriptionID),
			CreateSubscriptionParams: CreateSubscriptionParams{
				Name:               subscription.SubscriptionName,
				Type:               subscription.SubscriptionType,
				CreatedAt:          subscription.SubscriptionCreatedDate,
				UpdatedAt:          subscription.SubscriptionUpdatedDate,
				StartDate:          subscription.SubscriptionStartDate,
				APILimit:           utils.NullInt32ToInt(&subscription.SubscriptionApiLimit),
				ExpiryDate:         &subscription.SubscriptionCreatedDate,
				Description:        &subscription.SubscriptionDescription.String,
				Status:             utils.NullBoolToBool(&subscription.SubscriptionStatus),
				OrganizationID:     int(subscription.OrganizationID),
				SubscriptionTierID: int(subscription.SubscriptionTierID),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}
