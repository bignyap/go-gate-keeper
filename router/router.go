package router

import (
	"net/http"

	"github.com/bignyap/go-gate-keeper/handler"
)

func OrgTypeHandler(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("POST /orgType", apiConfig.CreateOrgTypeHandler)
	mux.HandleFunc("GET /orgType", apiConfig.ListOrgTypeHandler)
	mux.HandleFunc("DELETE /orgType/{Id}", apiConfig.DeleteOrgTypeHandler)

}

func RegisterHandlers(mux *http.ServeMux, apiConfig *handler.ApiConfig) {

	mux.HandleFunc("/", handler.RootHandler)
	OrgTypeHandler(mux, apiConfig)
}
