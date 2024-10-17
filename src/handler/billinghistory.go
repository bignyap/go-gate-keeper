package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
	"github.com/bignyap/go-gate-keeper/utils/misc"
)

type CreateBillingHistoryParams struct {
	StartDate      time.Time  `json:"start_date"`
	EndDate        time.Time  `json:"end_date"`
	ToTalAmountDue float64    `json:"total_amount_due"`
	TotalCalls     int        `json:"total_calls"`
	PaymentStatus  string     `json:"payment_status"`
	PaymentDate    *time.Time `json:"payment_date"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	SubscriptionID int        `json:"subscription_id"`
}

type CreateBillingHistoryOutput struct {
	ID int `json:"id"`
	CreateBillingHistoryParams
}

func CreateBillingHistoryFormValidation(r *http.Request) (*sqlcgen.CreateBillingHistoryParams, error) {

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"payment_status"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	intFields := []string{"total_calls", "subscription_id"}
	intParsed, err := formvalidator.ParseIntFromForm(r, intFields)
	if err != nil {
		return nil, err
	}

	dateFields := []string{"start_date", "end_date"}
	dateParsed, err := formvalidator.ParseUnixTimeFromForm(r, dateFields)
	if err != nil {
		return nil, err
	}

	nullDateFields := []string{"payment_date"}
	nullDateParsed, err := formvalidator.ParseNullUnixTimeFromForm(r, nullDateFields)
	if err != nil {
		return nil, err
	}

	floatFields := []string{"total_amount_due"}
	floatParsed, err := formvalidator.ParseFloatFromForm(r, floatFields)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.CreateBillingHistoryParams{
		BillingStartDate: int32(dateParsed["start_date"]),
		BillingEndDate:   int32(dateParsed["end_date"]),
		BillingCreatedAt: int32(misc.ToUnixTime()),
		TotalAmountDue:   floatParsed["total_amount_due"],
		TotalCalls:       int32(intParsed["total_calls"]),
		PaymentStatus:    strParsed["payment_status"],
		PaymentDate:      nullDateParsed["payment_date"],
		SubscriptionID:   int32(intParsed["subscription_id"]),
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateBillingHistoryHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateBillingHistoryFormValidation(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	organization, err := apiCfg.DB.CreateBillingHistory(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the billing history: %s", err))
		return
	}

	insertedID, err := organization.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateBillingHistoryOutput{
		ID: int(insertedID),
		CreateBillingHistoryParams: CreateBillingHistoryParams{
			StartDate:      misc.FromUnixTime32(input.BillingStartDate),
			EndDate:        misc.FromUnixTime32(input.BillingEndDate),
			CreatedAt:      misc.FromUnixTime32(input.BillingCreatedAt),
			PaymentStatus:  input.PaymentStatus,
			PaymentDate:    converter.NullInt32ToTime(&input.PaymentDate),
			SubscriptionID: int(input.SubscriptionID),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) GetBillingHistoryHandler(w http.ResponseWriter, r *http.Request) {

	id, err := converter.StrToInt(r.PathValue("id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid ID format")
		return
	}

	var billingHistories []sqlcgen.BillingHistory
	billinBy := r.URL.Query().Get("billing_by")

	switch billinBy {
	case "organization_id":
		billingHistories, err = apiCfg.DB.GetBillingHistoryByOrgId(r.Context(), int32(id))
	case "subscription_id":
		billingHistories, err = apiCfg.DB.GetBillingHistoryBySubId(r.Context(), int32(id))
	case "billing_id":
		billingHistories, err = apiCfg.DB.GetBillingHistoryById(r.Context(), int32(id))
	default:
		respondWithError(w, StatusBadRequest, "Invalid billing filter")
		return
	}

	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the billing history: %s", err))
		return
	}

	output := toCreateBillingHistoryOutput(billingHistories)
	respondWithJSON(w, StatusOK, output)
}

func toCreateBillingHistoryOutput(billingHistories []sqlcgen.BillingHistory) []CreateBillingHistoryOutput {

	var output []CreateBillingHistoryOutput

	for _, billingHistory := range billingHistories {

		output = append(output, CreateBillingHistoryOutput{
			ID: int(billingHistory.BillingID),
			CreateBillingHistoryParams: CreateBillingHistoryParams{
				StartDate:      misc.FromUnixTime32(billingHistory.BillingStartDate),
				EndDate:        misc.FromUnixTime32(billingHistory.BillingEndDate),
				CreatedAt:      misc.FromUnixTime32(billingHistory.BillingCreatedAt),
				PaymentStatus:  billingHistory.PaymentStatus,
				PaymentDate:    converter.NullInt32ToTime(&billingHistory.PaymentDate),
				SubscriptionID: int(billingHistory.SubscriptionID),
			},
		})
	}

	return output
}
