package router

import (
	"fmt"
	"net/http"
)

func RootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome !!")
}

func AdminHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Admin !!")
}

func RegisterHandlers(mux *http.ServeMux) {

	mux.HandleFunc("/", RootHandler)
	mux.HandleFunc("GET /api/admin", AdminHandler)
}
