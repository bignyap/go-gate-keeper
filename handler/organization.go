package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils"
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
	err := r.ParseForm()
	if err != nil {
		return nil, fmt.Errorf("error parsing form data: %s", err)
	}

	typeIDStr := r.FormValue("type_id")
	if typeIDStr == "" {
		return nil, fmt.Errorf("type_id must be a positive integer value")
	}

	typeID64, err := strconv.ParseInt(typeIDStr, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("type_id must be a positive integer value")
	}
	typeID := int32(typeID64)

	if r.FormValue("name") == "" {
		return nil, fmt.Errorf("name is required")
	}

	if r.FormValue("realm") == "" {
		return nil, fmt.Errorf("realm is required")
	}

	if r.FormValue("support_email") == "" {
		return nil, fmt.Errorf("support email is required")
	}

	country := utils.StrToNullStr(r.FormValue("country"))

	active, err := utils.StrToNullBool(r.FormValue("active"))
	if err != nil {
		return nil, fmt.Errorf("active should be a valid boolean")
	}

	reportq, err := utils.StrToNullBool(r.FormValue("reportq"))
	if err != nil {
		return nil, fmt.Errorf("reportq should be a valid boolean")
	}

	config := utils.StrToNullStr(r.FormValue("config"))

	input := sqlcgen.CreateOrganizationParams{
		OrganizationName:         r.FormValue("name"),
		OrganizationCreatedAt:    time.Now(),
		OrganizationUpdatedAt:    time.Now(),
		OrganizationRealm:        r.FormValue("realm"),
		OrganizationSupportEmail: r.FormValue("support_email"), // Corrected field name
		OrganizationTypeID:       typeID,
		OrganizationCountry:      country,
		OrganizationConfig:       config,
		OrganizationActive:       active,
		OrganizationReportQ:      reportq,
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
			Active:       utils.NullBoolToBool(&input.OrganizationActive),
			ReportQ:      utils.NullBoolToBool(&input.OrganizationReportQ),
			TypeID:       int(input.OrganizationTypeID),
			Config:       utils.NullStrToStr(&input.OrganizationConfig),
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
				Active:       utils.NullBoolToBool(&organization.OrganizationActive),
				ReportQ:      utils.NullBoolToBool(&organization.OrganizationReportQ),
				TypeID:       int(organization.OrganizationTypeID),
				Config:       utils.NullStrToStr(&organization.OrganizationConfig),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) GetOrganizationByIdHandler(w http.ResponseWriter, r *http.Request) {

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
			Active:       utils.NullBoolToBool(&organization.OrganizationActive),
			ReportQ:      utils.NullBoolToBool(&organization.OrganizationReportQ),
			TypeID:       int(organization.OrganizationTypeID),
			Config:       utils.NullStrToStr(&organization.OrganizationConfig),
		},
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteOrganizationByIdHandler(w http.ResponseWriter, r *http.Request) {

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
