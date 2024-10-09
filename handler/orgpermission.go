package handler

import (
	"fmt"
	"net/http"

	"github.com/bignyap/go-gate-keeper/database/sqlcgen"
	"github.com/bignyap/go-gate-keeper/utils/converter"
	"github.com/bignyap/go-gate-keeper/utils/formvalidator"
)

type CreateOrgPermissionParams struct {
	ResourceTypeID int    `json:"resource_type_id"`
	OrganizationID int    `json:"organization_id"`
	PermissionCode string `json:"permission_code"`
}

type CreateOrgPermissionOutput struct {
	ID int `json:"id"`
	CreateOrgPermissionParams
}

func CreateOrgPermissionFormValidator(r *http.Request) (*sqlcgen.CreateOrgPermissionParams, error) {

	err := formvalidator.ParseFormData(r)
	if err != nil {
		return nil, err
	}

	strFields := []string{"permission_code"}
	strParsed, err := formvalidator.ParseStringFromForm(r, strFields)
	if err != nil {
		return nil, err
	}

	intFields := []string{"resource_type_id", "organization_id"}
	intParsed, err := formvalidator.ParseIntFromForm(r, intFields)
	if err != nil {
		return nil, err
	}

	input := sqlcgen.CreateOrgPermissionParams{
		OrganizationID: int32(intParsed["organization_id"]),
		ResourceTypeID: int32(intParsed["resource_type_id"]),
		PermissionCode: strParsed["permission_code"],
	}

	return &input, nil
}

func (apiCfg *ApiConfig) CreateOrgPermissionHandler(w http.ResponseWriter, r *http.Request) {

	input, err := CreateOrgPermissionFormValidator(r)
	if err != nil {
		respondWithError(w, StatusBadRequest, err.Error())
	}

	orgPermission, err := apiCfg.DB.CreateOrgPermission(r.Context(), *input)
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't create the organization permission: %s", err))
		return
	}

	insertedID, err := orgPermission.LastInsertId()
	if err != nil {
		respondWithError(w, StatusInternalServerError, fmt.Sprintf("couldn't retrieve last insert ID: %s", err))
		return
	}

	output := CreateOrgPermissionOutput{
		ID: int(insertedID),
		CreateOrgPermissionParams: CreateOrgPermissionParams{
			OrganizationID: int(input.OrganizationID),
			ResourceTypeID: int(input.ResourceTypeID),
			PermissionCode: input.PermissionCode,
		},
	}

	respondWithJSON(w, StatusCreated, output)
}

func (apiCfg *ApiConfig) GetOrgPermissionHandler(w http.ResponseWriter, r *http.Request) {

	id, err := converter.StrToInt(r.URL.Query().Get("organization_id"))
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid ID format")
		return
	}

	orgPermissions, err := apiCfg.DB.GetOrgPermission(r.Context(), int32(id))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't retrieve the resource types: %s", err))
		return
	}

	var output []CreateOrgPermissionOutput

	for _, orgPermission := range orgPermissions {
		output = append(output, CreateOrgPermissionOutput{
			ID: int(orgPermission.ResourceTypeID),
			CreateOrgPermissionParams: CreateOrgPermissionParams{
				OrganizationID: int(orgPermission.OrganizationID),
				ResourceTypeID: int(orgPermission.ResourceTypeID),
				PermissionCode: orgPermission.PermissionCode,
			},
		})
	}

	respondWithJSON(w, StatusOK, output)
}

func (apiCfg *ApiConfig) DeleteOrgPermissionHandler(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("organization_id")
	var err error

	if idStr != "" {
		id32, err := converter.StrToInt(idStr)
		if err != nil {
			respondWithError(w, StatusBadRequest, "Invalid organization_id format")
			return
		}

		err = apiCfg.DB.DeleteOrgPermissionByOrgId(r.Context(), int32(id32))
		if err != nil {
			respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the resource permission by organization_id: %s", err))
			return
		}

		respondWithJSON(w, StatusNoContent, map[string]string{
			"message": fmt.Sprintf("resource permission with organization_id %d deleted successfully", int32(id32)),
		})
		return
	}

	idStr = r.URL.Query().Get("id")
	if idStr == "" {
		respondWithError(w, StatusBadRequest, "Missing organization_id or id")
		return
	}

	id32, err := converter.StrToInt(idStr)
	if err != nil {
		respondWithError(w, StatusBadRequest, "Invalid id format")
		return
	}

	err = apiCfg.DB.DeleteResourceTypeById(r.Context(), int32(id32))
	if err != nil {
		respondWithError(w, StatusBadRequest, fmt.Sprintf("couldn't delete the resource permission by id: %s", err))
		return
	}

	respondWithJSON(w, StatusNoContent, map[string]string{
		"message": fmt.Sprintf("resource permission with id %d deleted successfully", int32(id32)),
	})
}
