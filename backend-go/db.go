package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

var db *sql.DB

func initDB() error {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "usr_rmr37ijd")
	password := getEnv("DB_PASSWORD", "6k=#BDh5nuV8eWDP")
	dbname := getEnv("DB_NAME", "q-csg-db")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		return err
	}
	return db.Ping()
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
