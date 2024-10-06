package handler

import "github.com/bignyap/go-gate-keeper/database/sqlcgen"

type ApiConfig struct {
	DB *sqlcgen.Queries
}
