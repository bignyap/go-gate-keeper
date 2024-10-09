package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
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

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"name", "code"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	nullStrField := []string{"description"}
	nullStrParsed, err := formvalidator.ParseNullStringFromForm(r, nullStrField)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.CreateResourceTypeParams{
		ResourceTypeName:        strParsed["name"],
		ResourceTypeCode:        strParsed["code"],
		ResourceTypeDescription: nullStrParsed["description"],
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
			Description: converter.NullStrToStr(&input.ResourceTypeDescription),
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
				Description: converter.NullStrToStr(&resourceType.ResourceTypeDescription),
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteResourceTypeHandler(w http.ResponseWriter, r *http.Request) {

	id, err := converter.StrToInt(r.URL.Query().Get("id"))
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
