package utils

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

func StrToInt(str string) (int, error) {
	if str == "" {
		return 0, fmt.Errorf("empty string cannot be converted to int")
	}

	intValue, err := strconv.Atoi(str)
	if err != nil {
		return 0, fmt.Errorf("not a valid integer: %v", err)
	}

	return intValue, nil
}

func StrToFloat(str string) (float64, error) {
	if str == "" {
		return 0, fmt.Errorf("empty string cannot be converted to float")
	}

	floatValue, err := strconv.ParseFloat(str, 64)
	if err != nil {
		return 0, fmt.Errorf("not a valid float: %v", err)
	}

	return floatValue, nil
}

func StrToBool(str string) (bool, error) {
	if str == "" {
		return false, fmt.Errorf("empty string cannot be converted to boolean")
	}

	boolVal, err := strconv.ParseBool(str)
	if err != nil {
		return false, fmt.Errorf("not a valid boolean: %v", err)
	}

	return boolVal, nil
}

func StrToDate(str string) (time.Time, error) {
	if str == "" {
		return time.Time{}, fmt.Errorf("empty string cannot be converted to date")
	}

	dateValue, err := time.Parse("2006-01-02", str)
	if err != nil {
		return time.Time{}, fmt.Errorf("not a valid date: %v", err)
	}

	return dateValue, nil
}

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

func StrToNullTime(str string) (sql.NullTime, error) {
	if str == "" {
		return sql.NullTime{Valid: false}, nil
	}

	timeValue, err := time.Parse("2006-01-02", str)
	if err != nil {
		return sql.NullTime{}, fmt.Errorf("not a valid date: %v", err)
	}

	return sql.NullTime{Time: timeValue, Valid: true}, nil
}

func StrToNullInt(str string, bitSize int) (interface{}, error) {
	if str == "" {
		if bitSize == 32 {
			return sql.NullInt32{Valid: false}, nil
		}
		return sql.NullInt64{Valid: false}, nil
	}

	intValue, err := strconv.ParseInt(str, 10, bitSize)
	if err != nil {
		return nil, fmt.Errorf("not a valid integer: %v", err)
	}

	if bitSize == 32 {
		return sql.NullInt32{Int32: int32(intValue), Valid: true}, nil
	}
	return sql.NullInt64{Int64: intValue, Valid: true}, nil
}

func StrToNullInt32(str string) (sql.NullInt32, error) {
	result, err := StrToNullInt(str, 32)
	if err != nil {
		return sql.NullInt32{}, err
	}
	return result.(sql.NullInt32), nil
}

func StrToNullInt64(str string) (sql.NullInt64, error) {
	result, err := StrToNullInt(str, 32)
	if err != nil {
		return sql.NullInt64{}, err
	}
	return result.(sql.NullInt64), nil
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

func NullInt32ToInt(input *sql.NullInt32) *int {
	if !(input.Valid) {
		return nil
	}
	intValue := int(input.Int32)
	return &intValue
}

func NullInt64ToInt(input *sql.NullInt64) *int {
	if !(input.Valid) {
		return nil
	}
	intValue := int(input.Int64)
	return &intValue
}
