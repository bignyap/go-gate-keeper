package handler

import "github.com/bignyap/go-gate-keeper/database/sqlcgen"

type ApiConfig struct {
	DB *sqlcgen.Queries
}

const (
	StatusOK                  = 200
	StatusCreated             = 201
	StatusBadRequest          = 400
	StatusInternalServerError = 500
	StatusNoContent           = 204
)
