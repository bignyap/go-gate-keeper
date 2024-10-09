package converter

import (
	"database/sql"
	"time"
)

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//							Str to DataTypes -- Helpful with API form validation

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

func StrToInt(str string) (int, error) {
	result, err := ConvertString(str, IntConverter{})
	if err != nil {
		return 0, err
	}
	return result.(int), nil
}

func StrToFloat(str string) (float64, error) {
	result, err := ConvertString(str, FloatConverter{})
	if err != nil {
		return 0.0, err
	}
	return result.(float64), nil
}

func StrToBool(str string) (bool, error) {
	result, err := ConvertString(str, BoolConverter{})
	if err != nil {
		return false, err
	}
	return result.(bool), nil
}

func StrToDate(str string) (time.Time, error) {
	result, err := ConvertString(str, DateConverter{})
	if err != nil {
		return time.Time{}, err
	}
	return result.(time.Time), nil
}

func StrToNullInt32(str string) (sql.NullInt32, error) {
	result, err := ConvertString(str, NullInt32Converter{})
	if err != nil {
		return sql.NullInt32{}, err
	}
	return result.(sql.NullInt32), nil
}

func StrToNullInt64(str string) (sql.NullInt64, error) {
	result, err := ConvertString(str, NullInt64Converter{})
	if err != nil {
		return sql.NullInt64{}, err
	}
	return result.(sql.NullInt64), nil
}

func StrToNullFloat64(str string) (sql.NullFloat64, error) {
	result, err := ConvertString(str, NullFloat64Converter{})
	if err != nil {
		return sql.NullFloat64{}, err
	}
	return result.(sql.NullFloat64), nil
}

func StrToNullBool(str string) (sql.NullBool, error) {
	result, err := ConvertString(str, NullBoolConverter{})
	if err != nil {
		return sql.NullBool{}, err
	}
	return result.(sql.NullBool), nil
}

func StrToNullStr(str string) sql.NullString {
	result, _ := ConvertString(str, NullStringConverter{})
	return result.(sql.NullString)
}

func StrToNullTime(str string) (sql.NullTime, error) {
	result, err := ConvertString(str, NullTimeConverter{})
	if err != nil {
		return sql.NullTime{}, err
	}
	return result.(sql.NullTime), nil
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//						sql.Null to Type Specific Converter -- Helpful in SQL to Go Type

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

func NullStrToStr(input *sql.NullString) *string {
	return ConvertNullToPointer(NullStringToPointerConverter{Input: input}).(*string)
}

func NullBoolToBool(input *sql.NullBool) *bool {
	return ConvertNullToPointer(NullBoolToPointerConverter{Input: input}).(*bool)
}

func NullInt32ToInt(input *sql.NullInt32) *int {
	return ConvertNullToPointer(NullInt32ToPointerConverter{Input: input}).(*int)
}

func NullInt64ToInt(input *sql.NullInt64) *int {
	return ConvertNullToPointer(NullInt64ToPointerConverter{Input: input}).(*int)
}
