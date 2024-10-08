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

type CreateOrganizationParams struct {
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Realm        string    `json:"realm"`
	Country      *string   `json:"country"`
	SupportEmail string    `json:"support_email"`
	Active       *bool     `json:"active"`
	ReportQ      *bool     `json:"report_q"`
	Config       *string   `json:"config"`
	TypeID       int       `json:"type_id"`
}

type CreateOrganizationOutput struct {
	ID int `json:"id"`
	CreateOrganizationParams
}

func CreateOrgFormValidation(r *http.Request) (*sqlcgen.CreateOrganizationParams, error) {

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"name", "realm", "support_email", "type_id"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	intFields := []string{"type_id"}
	intParsed, err := formvalidator.ParseIntFromForm(r, intFields)
	if err != nil {
		return nil, err
	}

	nullStrField := []string{"country", "config"}
	nullStrParsed, err := formvalidator.ParseNullStringFromForm(r, nullStrField)
	if err != nil {
		return nil, err
	}

	boolFields := []string{"active", "reportq"}
	boolParsed, err := formvalidator.ParseNullBoolFromForm(r, boolFields)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.CreateOrganizationParams{
		OrganizationName:         strParsed["name"],
		OrganizationCreatedAt:    time.Now(),
		OrganizationUpdatedAt:    time.Now(),
		OrganizationRealm:        strParsed["realm"],
		OrganizationSupportEmail: strParsed["support_email"],
		OrganizationTypeID:       int32(intParsed["type_id"]),
		OrganizationCountry:      nullStrParsed["country"],
		OrganizationConfig:       nullStrParsed["config"],
		OrganizationActive:       boolParsed["active"],
		OrganizationReportQ:      boolParsed["reqportq"],
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateOrganizationandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateOrgFormValidation(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	organization, err := apiCfg.DB.CreateOrganization(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the organization: %s", err))
		return
	}

	insertedID, err := organization.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateOrganizationOutput{
		ID: int(insertedID),
		CreateOrganizationParams: CreateOrganizationParams{
			Name:         input.OrganizationName,
			SupportEmail: input.OrganizationSupportEmail,
			CreatedAt:    input.OrganizationCreatedAt,
			UpdatedAt:    input.OrganizationUpdatedAt,
			Realm:        input.OrganizationRealm,
			Active:       converter.NullBoolToBool(&input.OrganizationActive),
			ReportQ:      converter.NullBoolToBool(&input.OrganizationReportQ),
			TypeID:       int(input.OrganizationTypeID),
			Config:       converter.NullStrToStr(&input.OrganizationConfig),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) ListOrganizationsHandler(w http.ResponseWriter, r *http.Request) {

	organizations, err := apiCfg.DB.ListOrganization(r.Context())
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the organizations: %s", err))
		return
	}

	var output []CreateOrganizationOutput

	for _, organization := range organizations {

		output = append(output, CreateOrganizationOutput{
			ID: int(organization.OrganizationID),
			CreateOrganizationParams: CreateOrganizationParams{
				Name:         organization.OrganizationName,
				SupportEmail: organization.OrganizationSupportEmail,
				CreatedAt:    organization.OrganizationCreatedAt,
				UpdatedAt:    organization.OrganizationUpdatedAt,
				Realm:        organization.OrganizationRealm,
				Active:       converter.NullBoolToBool(&organization.OrganizationActive),
				ReportQ:      converter.NullBoolToBool(&organization.OrganizationReportQ),
				TypeID:       int(organization.OrganizationTypeID),
				Config:       converter.NullStrToStr(&organization.OrganizationConfig),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) GetOrganizationByIdHandler(w http.ResponseWriter, r *http.Request) {

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

	organization, err := apiCfg.DB.GetOrganization(r.Context(), int32(id64))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the organization: %s", err))
		return
	}

	output := CreateOrganizationOutput{
		ID: int(organization.OrganizationID),
		CreateOrganizationParams: CreateOrganizationParams{
			Name:         organization.OrganizationName,
			SupportEmail: organization.OrganizationSupportEmail,
			CreatedAt:    organization.OrganizationCreatedAt,
			UpdatedAt:    organization.OrganizationUpdatedAt,
			Realm:        organization.OrganizationRealm,
			Active:       converter.NullBoolToBool(&organization.OrganizationActive),
			ReportQ:      converter.NullBoolToBool(&organization.OrganizationReportQ),
			TypeID:       int(organization.OrganizationTypeID),
			Config:       converter.NullStrToStr(&organization.OrganizationConfig),
		},
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteOrganizationByIdHandler(w http.ResponseWriter, r *http.Request) {

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
