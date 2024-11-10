package handler

import (
	"net/http"

	"github.com/bignyap/go-gate-keeper/utils/converter"
)

func ExtractPaginationDetail(w http.ResponseWriter, r *http.Request) (int, int) {

	pageNumberStr := r.URL.Query().Get("page_number")
	itemsPerPageStr := r.URL.Query().Get("items_per_page")

	defaultPageNumber := 1
	defaultItemsPerPage := 25

	var pageNumber int
	var itemsPerPage int
	var err error

	if pageNumberStr == "" {
		pageNumber = defaultPageNumber
	} else {
		pageNumber, err = converter.StrToInt(pageNumberStr)
		if err != nil {
			respondWithError(w, StatusBadRequest, "Invalid page_number format")
			return 0, 0
		}
	}

	if itemsPerPageStr == "" {
		itemsPerPage = defaultItemsPerPage
	} else {
		itemsPerPage, err = converter.StrToInt(itemsPerPageStr)
		if err != nil {
			respondWithError(w, StatusBadRequest, "Invalid items_per_page format")
			return 0, 0
		}
	}

	return pageNumber, itemsPerPage
}
