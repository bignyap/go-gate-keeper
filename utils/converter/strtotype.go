package converter

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

type Converter interface {
	Convert(str string) (interface{}, error)
}

type IntConverter struct{}

func (c IntConverter) Convert(str string) (interface{}, error) {
	if str == "" {
		return 0, fmt.Errorf("empty string cannot be converted to int")
	}
	intValue, err := strconv.Atoi(str)
	if err != nil {
		return 0, fmt.Errorf("not a valid integer: %v", err)
	}
	return intValue, nil
}

type FloatConverter struct{}

func (c FloatConverter) Convert(str string) (interface{}, error) {
	if str == "" {
		return 0.0, fmt.Errorf("empty string cannot be converted to float")
	}
	floatValue, err := strconv.ParseFloat(str, 64)
	if err != nil {
		return 0.0, fmt.Errorf("not a valid float: %v", err)
	}
	return floatValue, nil
}

// BoolConverter implements Converter for bool
type BoolConverter struct{}

func (c BoolConverter) Convert(str string) (interface{}, error) {
	if str == "" {
		return false, fmt.Errorf("empty string cannot be converted to boolean")
	}
	boolVal, err := strconv.ParseBool(str)
	if err != nil {
		return false, fmt.Errorf("not a valid boolean: %v", err)
	}
	return boolVal, nil
}

type DateConverter struct{}

func (c DateConverter) Convert(str string) (interface{}, error) {
	if str == "" {
		return time.Time{}, fmt.Errorf("empty string cannot be converted to date")
	}
	dateValue, err := time.Parse("2006-01-02", str)
	if err != nil {
		return time.Time{}, fmt.Errorf("not a valid date: %v", err)
	}
	return dateValue, nil
}

type NullInt32Converter struct{}

func (c NullInt32Converter) Convert(str string) (interface{}, error) {
	if str == "" {
		return sql.NullInt32{Valid: false}, nil
	}
	intValue, err := strconv.ParseInt(str, 10, 32)
	if err != nil {
		return sql.NullInt32{}, fmt.Errorf("not a valid integer: %v", err)
	}
	return sql.NullInt32{Int32: int32(intValue), Valid: true}, nil
}

type NullInt64Converter struct{}

func (c NullInt64Converter) Convert(str string) (interface{}, error) {
	if str == "" {
		return sql.NullInt64{Valid: false}, nil
	}
	intValue, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return sql.NullInt64{}, fmt.Errorf("not a valid integer: %v", err)
	}
	return sql.NullInt64{Int64: intValue, Valid: true}, nil
}

type NullFloat64Converter struct{}

func (c NullFloat64Converter) Convert(str string) (interface{}, error) {
	if str == "" {
		return sql.NullFloat64{Valid: false}, nil
	}
	floatValue, err := strconv.ParseFloat(str, 64)
	if err != nil {
		return sql.NullFloat64{}, fmt.Errorf("not a valid float: %v", err)
	}
	return sql.NullFloat64{Float64: floatValue, Valid: true}, nil
}

type NullBoolConverter struct{}

func (c NullBoolConverter) Convert(str string) (interface{}, error) {
	if str == "" {
		return sql.NullBool{Valid: false}, nil
	}
	boolVal, err := strconv.ParseBool(str)
	if err != nil {
		return sql.NullBool{}, fmt.Errorf("not a valid boolean: %v", err)
	}
	return sql.NullBool{Bool: boolVal, Valid: true}, nil
}

type NullStringConverter struct{}

func (c NullStringConverter) Convert(str string) (interface{}, error) {
	return sql.NullString{String: str, Valid: str != ""}, nil
}

type NullTimeConverter struct{}

func (c NullTimeConverter) Convert(str string) (interface{}, error) {
	if str == "" {
		return sql.NullTime{Valid: false}, nil
	}
	timeValue, err := time.Parse("2006-01-02", str)
	if err != nil {
		return sql.NullTime{}, fmt.Errorf("not a valid date: %v", err)
	}
	return sql.NullTime{Time: timeValue, Valid: true}, nil
}

func ConvertString(str string, converter Converter) (interface{}, error) {
	return converter.Convert(str)
}
