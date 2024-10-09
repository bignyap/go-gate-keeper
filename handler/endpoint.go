package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
)

type RegisterEndpointParams struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
}

type RegisterEndpointOutputs struct {
	ID int `json:"id"`
	RegisterEndpointParams
}

func RegisterEndpointFormValidator(r *http.Request) (*sqlcgen.RegisterApiEndpointParams, error) {

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"name"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	nullStrFields := []string{"description"}
	nullStrParsed, err := formvalidator.ParseNullStringFromForm(r, nullStrFields)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.RegisterApiEndpointParams{
		EndpointName:        strParsed["name"],
		EndpointDescription: nullStrParsed["description"],
	}

	return &input, nil
}

func (apiCfg *ApiConfig) RegisterEndpointHandler(w http.ResponseWriter, r *http.Request) {

	input, err := RegisterEndpointFormValidator(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
		return
	}

	apiEndpoint, err := apiCfg.DB.RegisterApiEndpoint(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't register the api endpoint: %s", err))
		return
	}

	insertedID, err := apiEndpoint.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	var description *string
	if input.EndpointDescription.Valid {
		description = &input.EndpointDescription.String
	}

	output := RegisterEndpointOutputs{
		ID: int(insertedID),
		RegisterEndpointParams: RegisterEndpointParams{
			Name:        input.EndpointName,
			Description: description,
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) ListEndpointsHandler(w http.ResponseWriter, r *http.Request) {

	apiEndpoints, err := apiCfg.DB.ListApiEndpoint(r.Context())
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the organization types: %s", err))
		return
	}

	var output []RegisterEndpointOutputs

	for _, apiEndpoint := range apiEndpoints {

		var description *string
		if apiEndpoint.EndpointDescription.Valid {
			description = &apiEndpoint.EndpointDescription.String
		}

		output = append(output, RegisterEndpointOutputs{
			ID: int(apiEndpoint.ApiEndpointID),
			RegisterEndpointParams: RegisterEndpointParams{
				Name:        apiEndpoint.EndpointName,
				Description: description,
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteEndpointsByIdHandler(w http.ResponseWriter, r *http.Request) {

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

	err = apiCfg.DB.DeleteApiEndpointById(r.Context(), int32(id64))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the endpoint: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("Api endpoint with ID %d deleted successfully", int32(id64)),
	})
}
