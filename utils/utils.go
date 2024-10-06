package utils

import (
	"database/sql"
	"fmt"
	"strconv"
)

func StrToNullBool(str string) (sql.NullBool, error) {
	if str == "" {
		return sql.NullBool{Valid: false}, nil
	}
	activeBool, err := strconv.ParseBool(str)
	if err != nil {
		return sql.NullBool{}, fmt.Errorf("not a valid boolean: %v", err)
	}
	return sql.NullBool{Bool: activeBool, Valid: true}, nil
}

func StrToNullInt64(str string) (sql.NullInt64, error) {
	if str == "" {
		return sql.NullInt64{Valid: false}, nil
	}

	intValue, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return sql.NullInt64{}, fmt.Errorf("not a valid integer: %v", err)
	}

	return sql.NullInt64{Int64: intValue, Valid: true}, nil
}

func StrToNullStr(str string) sql.NullString {
	return sql.NullString{
		String: str,
		Valid:  str != "",
	}
}

func NullStrToStr(input *sql.NullString) *string {
	if !(input.Valid) {
		return nil
	}
	return &input.String
}

func NullBoolToBool(input *sql.NullBool) *bool {
	if !(input.Valid) {
		return nil
	}
	return &input.Bool
}
