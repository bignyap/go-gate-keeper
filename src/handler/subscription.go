package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
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

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"name", "type"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	intFields := []string{"organization_id", "subscription_tier_id"}
	intParsed, err := formvalidator.ParseIntFromForm(r, intFields)
	if err != nil {
		return nil, err
	}

	nullStrField := []string{"description"}
	nullStrParsed, err := formvalidator.ParseNullStringFromForm(r, nullStrField)
	if err != nil {
		return nil, err
	}

	nullBoolFields := []string{"status"}
	nullBoolPared, err := formvalidator.ParseNullBoolFromForm(r, nullBoolFields)
	if err != nil {
		return nil, err
	}

	dateField := []string{"expiry_date"}
	dateParsed, err := formvalidator.ParseNullTimeFromForm(r, dateField)
	if err != nil {
		return nil, err
	}

	nullInt32Field := []string{"api_limit"}
	nullInt32Parsed, err := formvalidator.ParseNullInt32FromForm(r, nullInt32Field)
	if err != nil {
		return nil, err
	}

	startDate, err := converter.StrToDate(r.FormValue("start_date"))
	if err != nil {
		startDate = time.Now()
	}

	input := sqlcgen.CreateSubscriptionParams{
		SubscriptionName:        strParsed["name"],
		SubscriptionType:        strParsed["type"],
		SubscriptionCreatedDate: time.Now(),
		SubscriptionUpdatedDate: time.Now(),
		SubscriptionStartDate:   startDate,
		SubscriptionApiLimit:    nullInt32Parsed["api_limit"],
		SubscriptionExpiryDate:  dateParsed["expiry_date"],
		SubscriptionDescription: nullStrParsed["description"],
		SubscriptionStatus:      nullBoolPared["status"],
		OrganizationID:          int32(intParsed["organization_id"]),
		SubscriptionTierID:      int32(intParsed["subscription_tier_id"]),
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
			APILimit:           converter.NullInt32ToInt(&input.SubscriptionApiLimit),
			ExpiryDate:         &input.SubscriptionCreatedDate,
			Description:        &input.SubscriptionDescription.String,
			Status:             converter.NullBoolToBool(&input.SubscriptionStatus),
			OrganizationID:     int(input.OrganizationID),
			SubscriptionTierID: int(input.SubscriptionTierID),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) DeleteSubscriptionHandler(w http.ResponseWriter, r *http.Request) {

	idStr := r.PathValue("id")
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

	id, err := converter.StrToInt(r.PathValue("id"))
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
			APILimit:           converter.NullInt32ToInt(&subscription.SubscriptionApiLimit),
			ExpiryDate:         &subscription.SubscriptionCreatedDate,
			Description:        &subscription.SubscriptionDescription.String,
			Status:             converter.NullBoolToBool(&subscription.SubscriptionStatus),
			OrganizationID:     int(subscription.OrganizationID),
			SubscriptionTierID: int(subscription.SubscriptionTierID),
		},
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) GetSubscriptionByrgIdHandler(w http.ResponseWriter, r *http.Request) {

	orgId, err := converter.StrToInt(r.PathValue("organization_id"))
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
				APILimit:           converter.NullInt32ToInt(&subscription.SubscriptionApiLimit),
				ExpiryDate:         &subscription.SubscriptionCreatedDate,
				Description:        &subscription.SubscriptionDescription.String,
				Status:             converter.NullBoolToBool(&subscription.SubscriptionStatus),
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
				APILimit:           converter.NullInt32ToInt(&subscription.SubscriptionApiLimit),
				ExpiryDate:         &subscription.SubscriptionCreatedDate,
				Description:        &subscription.SubscriptionDescription.String,
				Status:             converter.NullBoolToBool(&subscription.SubscriptionStatus),
				OrganizationID:     int(subscription.OrganizationID),
				SubscriptionTierID: int(subscription.SubscriptionTierID),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}
