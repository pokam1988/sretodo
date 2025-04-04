// service-go-healthcheck/main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	log.Println("Starting Health Check Service...")

	http.HandleFunc("/health", healthHandler)

	// TODO: Implement logic to periodically check other services

	port := os.Getenv("PORT")
	if port == "" {
		port = "8003" // Default-Port für den Health-Check-Service
	}

	log.Printf("Health Check Service listening on port %s", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "{\"status\": \"UP\"}") // Einfache Status-Antwort
}
