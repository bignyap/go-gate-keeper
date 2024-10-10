package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
)

type CreateOrgTypeInput struct {
	Name string `json:"name"`
}

type CreateOrgTypeOutput struct {
	ID int `json:"name"`
	CreateOrgTypeInput
}

func CreateOrgTypeFormValidator(r *http.Request) (string, error) {

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return "", err
	}

	strFields := []string{"name"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return "", err
	}

	return strParsed["name"], nil
}

func (apiCfg *ApiConfig) CreateOrgTypeHandler(w http.ResponseWriter, r *http.Request) {

	name, err := CreateOrgTypeFormValidator(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
	}

	orgType, err := apiCfg.DB.CreateOrgType(r.Context(), name)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the organization type: %s", err))
		return
	}

	insertedID, err := orgType.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateOrgTypeOutput{
		ID: int(insertedID),
		CreateOrgTypeInput: CreateOrgTypeInput{
			Name: name,
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) ListOrgTypeHandler(w http.ResponseWriter, r *http.Request) {

	orgTypes, err := apiCfg.DB.ListOrgType(r.Context())
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the organization types: %s", err))
		return
	}

	var output []CreateOrgTypeOutput

	for _, orgType := range orgTypes {
		output = append(output, CreateOrgTypeOutput{
			ID: int(orgType.OrganizationTypeID),
			CreateOrgTypeInput: CreateOrgTypeInput{
				Name: orgType.OrganizationTypeName,
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteOrgTypeHandler(w http.ResponseWriter, r *http.Request) {

	id, err := converter.StrToInt(r.PathValue("id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "ID needs to be a positive integer")
		return
	}

	err = apiCfg.DB.DeleteOrgTypeById(r.Context(), int32(id))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the organization type: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("Organization type with ID %d deleted successfully", int32(id)),
	})
}
