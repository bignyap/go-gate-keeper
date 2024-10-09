package converter

import (
	"database/sql"
	"time"
)

func StrTo[T any](str string, converter Converter[T]) (T, error) {
	return ConvertString(str, converter)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//							Str to DataTypes -- Helpful with API form validation

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

func StrToInt(str string) (int, error) {
	return StrTo[int](str, IntConverter{})
}

func StrToFloat(str string) (float64, error) {
	return StrTo[float64](str, FloatConverter{})
}

func StrToBool(str string) (bool, error) {
	return StrTo[bool](str, BoolConverter{})
}

func StrToDate(str string) (time.Time, error) {
	return StrTo[time.Time](str, DateConverter{})
}

func StrToNullInt32(str string) (sql.NullInt32, error) {
	return StrTo[sql.NullInt32](str, NullInt32Converter{})
}

func StrToNullInt64(str string) (sql.NullInt64, error) {
	return StrTo[sql.NullInt64](str, NullInt64Converter{})
}

func StrToNullFloat64(str string) (sql.NullFloat64, error) {
	return StrTo[sql.NullFloat64](str, NullFloat64Converter{})
}

func StrToNullBool(str string) (sql.NullBool, error) {
	return StrTo[sql.NullBool](str, NullBoolConverter{})
}

func StrToNullStr(str string) sql.NullString {
	res, _ := StrTo[sql.NullString](str, NullStringConverter{})
	return res
}

func StrToNullTime(str string) (sql.NullTime, error) {
	return StrTo[sql.NullTime](str, NullTimeConverter{})
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
