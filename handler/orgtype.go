package handler

import (
	"fmt"
	"net/http"
	"strconv"
)

type CreateOrgTypeInput struct {
	Name string `json:"name"`
}

type CreateOrgTypeOutput struct {
	ID int `json:"name"`
	CreateOrgTypeInput
}

func (apiCfg *ApiConfig) CreateOrgTypeHandler(w http.ResponseWriter, r *http.Request) {

	err := r.ParseForm()
	if err != nil {
		respondWithError(w, 400,
			fmt.Sprintf("Error parsing form data: %s", err),
		)
		return
	}

	input := CreateOrgTypeInput{
		Name: r.FormValue("name"),
	}

	if input.Name == "" {
		respondWithError(w, 400, "Name is required")
		return
	}

	orgType, err := apiCfg.DB.CreateOrgType(
		r.Context(),
		input.Name,
	)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("couldn't create the organization type: %s", err))
		return
	}

	insertedID, err := orgType.LastInsertId()
	if err != nil {
		respondWithError(w, 500, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateOrgTypeOutput{
		ID:                 int(insertedID),
		CreateOrgTypeInput: input,
	}

	respondWithJSON(w, 201, output)
}

func (apiCfg *ApiConfig) ListOrgTypeHandler(w http.ResponseWriter, r *http.Request) {

	orgTypes, err := apiCfg.DB.ListOrgType(r.Context())
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("couldn't retrieve the organization types: %s", err))
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

	respondWithJSON(w, 201, output)
}

func (apiCfg *ApiConfig) DeleteOrgTypeHandler(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		respondWithError(w, 400, "ID is required")
		return
	}

	id64, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		respondWithError(w, 400, "Invalid ID format")
		return
	}

	err = apiCfg.DB.DeleteOrgTypeById(r.Context(), int32(id64))
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("couldn't delete the organization type: %s", err))
		return
	}

	respondWithJSON(w, 200, map[string]string{
		"message": fmt.Sprintf("Organization type with ID %d deleted successfully", int32(id64)),
	})
}
