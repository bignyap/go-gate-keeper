package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils"
)

type CreateResourceTypeParams struct {
	Name        string  `json:"name"`
	Code        string  `json:"code"`
	Description *string `json:"description"`
}

type CreateResourceTypeOutput struct {
	ID int `json:"id"`
	CreateResourceTypeParams
}

func CreateResourceTypeFormValidator(r *http.Request) (*sqlcgen.CreateResourceTypeParams, error) {

	err := r.ParseForm()
	if err != nil {
		return nil, fmt.Errorf("error parsing form data: %s", err)
	}

	name := r.FormValue("name")
	if name == "" {
		return nil, fmt.Errorf("name is required")
	}

	code := r.FormValue("code")
	if code == "" {
		return nil, fmt.Errorf("code is required")
	}

	description := utils.StrToNullStr(r.FormValue("description"))

	input := sqlcgen.CreateResourceTypeParams{
		ResourceTypeName:        name,
		ResourceTypeCode:        code,
		ResourceTypeDescription: description,
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateResurceTypeHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateResourceTypeFormValidator(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
	}

	resoureType, err := apiCfg.DB.CreateResourceType(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the resource type: %s", err))
		return
	}

	insertedID, err := resoureType.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateResourceTypeOutput{
		ID: int(insertedID),
		CreateResourceTypeParams: CreateResourceTypeParams{
			Name:        input.ResourceTypeName,
			Code:        input.ResourceTypeCode,
			Description: utils.NullStrToStr(&input.ResourceTypeDescription),
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) ListResourceTypeHandler(w http.ResponseWriter, r *http.Request) {

	resourceTypes, err := apiCfg.DB.ListResourceType(r.Context())
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the resource types: %s", err))
		return
	}

	var output []CreateResourceTypeOutput

	for _, resourceType := range resourceTypes {
		output = append(output, CreateResourceTypeOutput{
			ID: int(resourceType.ResourceTypeID),
			CreateResourceTypeParams: CreateResourceTypeParams{
				Name:        resourceType.ResourceTypeName,
				Code:        resourceType.ResourceTypeCode,
				Description: utils.NullStrToStr(&resourceType.ResourceTypeDescription),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteResourceTypeHandler(w http.ResponseWriter, r *http.Request) {

	id, err := utils.StrToInt(r.URL.Query().Get("id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "ID is required")
		return
	}

	err = apiCfg.DB.DeleteResourceTypeById(r.Context(), int32(id))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the resource type: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("resource type with ID %d deleted successfully", int32(id)),
	})
}
