package initialize

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/bignyap/go-gate-keeper/database"
	"github.com/bignyap/go-gate-keeper/router"
	"github.com/joho/godotenv"
)

func GetEnvVals() error {
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("error loading .env file: %v", err)
	}
	return nil
}

func LoadDBConn() (*sql.DB, error) {
	dbConfig := database.DBConfig{
		Driver:   os.Getenv("Driver"),
		Host:     os.Getenv("Host"),
		Port:     os.Getenv("Port"),
		User:     os.Getenv("User"),
		Password: os.Getenv("Password"),
		DBName:   os.Getenv("DBName"),
	}

	poolProperties := database.DefaultDBPoolProperties()

	conn, err := database.DBConn(dbConfig, poolProperties)
	if err != nil {
		return nil, fmt.Errorf("error while connecting to database %v", err)
	}

	return conn, nil
}

func InitializeWebServer() error {

	mux := http.NewServeMux()

	router.RegisterHandlers(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	address := ":" + port

	err := http.ListenAndServe(address, mux)
	if err != nil {
		return fmt.Errorf("error starting web server: %v", err)
	}
	return nil
}

func InitializeApp() {

	if err := GetEnvVals(); err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}

	conn, err := LoadDBConn()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer conn.Close()

	fmt.Printf("Here is my %v", conn)

	if err := InitializeWebServer(); err != nil {
		log.Fatalf("Failed to start web server: %v", err)
	}
}
