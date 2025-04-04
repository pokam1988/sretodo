// service-go-healthcheck/main.go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

// Struktur für das Ergebnis der Prüfung
type CheckResult struct {
	Service string `json:"service"`
	Status  string `json:"status"` // "UP" oder "DOWN"
	Error   string `json:"error,omitempty"`
}

// Globale HTTP-Client Instanz für Wiederverwendung
var httpClient = &http.Client{
	Timeout: 5 * time.Second, // Timeout für Health Checks
}

// Liest die zu prüfenden URLs aus Umgebungsvariablen
func getServicesToCheck() map[string]string {
	return map[string]string{
		"todo":      os.Getenv("CHECK_URL_TODO"),
		"pomodoro":  os.Getenv("CHECK_URL_POMODORO"),
		"statistik": os.Getenv("CHECK_URL_STATISTIK"),
		// Füge hier bei Bedarf weitere Services hinzu
	}
}

// Prüft den Health-Endpunkt einer einzelnen URL
func checkService(serviceName string, url string, wg *sync.WaitGroup, results chan<- CheckResult) {
	defer wg.Done() // Signalisiert der WaitGroup, dass diese Go-Routine fertig ist

	if url == "" {
		log.Printf("URL for service %s not configured.", serviceName)
		results <- CheckResult{Service: serviceName, Status: "UNKNOWN", Error: "URL not configured"}
		return
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Error creating request for %s (%s): %v", serviceName, url, err)
		results <- CheckResult{Service: serviceName, Status: "DOWN", Error: fmt.Sprintf("Internal error: %v", err)}
		return
	}
	req.Header.Set("User-Agent", "sretodo-go-healthcheck/1.0")

	resp, err := httpClient.Do(req)
	if err != nil {
		log.Printf("Error checking %s (%s): %v", serviceName, url, err)
		results <- CheckResult{Service: serviceName, Status: "DOWN", Error: err.Error()}
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		results <- CheckResult{Service: serviceName, Status: "UP"}
	} else {
		log.Printf("Service %s (%s) returned status %d", serviceName, url, resp.StatusCode)
		results <- CheckResult{Service: serviceName, Status: "DOWN", Error: fmt.Sprintf("Unexpected status code: %d", resp.StatusCode)}
	}
}

// Handler für den aggregierten Health Check
func aggregateHealthHandler(w http.ResponseWriter, r *http.Request) {
	services := getServicesToCheck()
	resultsChan := make(chan CheckResult, len(services)) // Gepufferter Channel
	var wg sync.WaitGroup

	log.Println("Performing aggregate health check...")
	startTime := time.Now()

	for name, url := range services {
		if url != "" { // Nur konfigurierte Services prüfen
			wg.Add(1)
			go checkService(name, url, &wg, resultsChan)
		} else {
			// Direktes Ergebnis für nicht konfigurierte Services
			resultsChan <- CheckResult{Service: name, Status: "UNKNOWN", Error: "URL not configured"}
		}
	}

	// Warte auf alle Go-Routinen
	go func() {
		wg.Wait()
		close(resultsChan) // Schließe den Channel, wenn alle Checks fertig sind
	}()

	// Sammle Ergebnisse
	finalResults := make(map[string]CheckResult)
	overallStatus := "UP" // Annahme: Alles ist OK, bis das Gegenteil bewiesen ist
	for result := range resultsChan {
		finalResults[result.Service] = result
		if result.Status != "UP" {
			overallStatus = "DEGRADED" // Wenn mindestens einer nicht UP ist
		}
	}

	duration := time.Since(startTime)
	log.Printf("Aggregate health check finished in %s. Overall status: %s", duration, overallStatus)

	response := map[string]interface{}{
		"overallStatus": overallStatus,
		"durationMs":    duration.Milliseconds(),
		"services":      finalResults,
	}

	w.Header().Set("Content-Type", "application/json")
	if overallStatus != "UP" {
		w.WriteHeader(http.StatusServiceUnavailable) // 503 wenn nicht alles UP ist
	} else {
		w.WriteHeader(http.StatusOK)
	}
	json.NewEncoder(w).Encode(response)
}

// Handler für den eigenen Health Check des Services
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, `{"status": "UP"}`)
}

func main() {
	log.Println("Starting Health Check Service...")

	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/health/aggregate", aggregateHealthHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8003"
	}

	log.Printf("Health Check Service listening on port %s", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
