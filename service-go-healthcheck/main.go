// service-go-healthcheck/main.go
package main

import (
	"context" // OTel Context
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	// OTel Imports
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/codes" // Hinzugefügt für Span Status
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	tracesdk "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0" // Korrekte Semantic Conventions Version
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// --- OTel Global Tracer Provider --- (wird in initTracerProvider gesetzt)
var tracerProvider *tracesdk.TracerProvider

// --- OTel Initialisierungsfunktion ---
func initTracerProvider() (*tracesdk.TracerProvider, error) {
	ctx := context.Background()

	otlpEndpoint := os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	if otlpEndpoint == "" {
		otlpEndpoint = "otel-collector:4317" // Default gRPC endpoint
	}

	// Sicherstellen, dass der Endpoint das Schema (grpc:// oder http://) nicht enthält, da der Exporter es erwartet
	// (oder explizit grpc.WithTransportCredentials(insecure.NewCredentials()) verwenden)
	conn, err := grpc.NewClient(otlpEndpoint, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
	}

	traceExporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(conn))
	if err != nil {
		return nil, fmt.Errorf("failed to create trace exporter: %w", err)
	}

	serviceName := os.Getenv("OTEL_SERVICE_NAME")
	if serviceName == "" {
		serviceName = "service-go-healthcheck"
	}

	res, err := resource.New(ctx,
		resource.WithAttributes(
			// Service name attribute
			semconv.ServiceName(serviceName),
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create resource: %w", err)
	}

	// Batch Span Processor für bessere Performance
	bsp := tracesdk.NewBatchSpanProcessor(traceExporter)

	tp := tracesdk.NewTracerProvider(
		tracesdk.WithSampler(tracesdk.AlwaysSample()), // Sampler (AlwaysSample für Demo)
		tracesdk.WithResource(res),                    // Resource mit Service Name
		tracesdk.WithSpanProcessor(bsp),               // Batch Processor
	)
	otel.SetTracerProvider(tp)
	// Setzt den globalen Propagator für Kontextweitergabe (W3C Trace Context & Baggage)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))

	return tp, nil
}

// Struktur für das Ergebnis der Prüfung
type CheckResult struct {
	Service string `json:"service"`
	Status  string `json:"status"` // "UP" oder "DOWN"
	Error   string `json:"error,omitempty"`
}

// Globale HTTP-Client Instanz für Wiederverwendung
// Wir ersetzen den Standard-Client durch einen OTel-instrumentierten Client
var otelHttpClient = &http.Client{
	Transport: otelhttp.NewTransport(http.DefaultTransport), // Wrap default transport
	Timeout:   5 * time.Second,                              // Timeout für Health Checks
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
	// Holen des globalen Tracers
	tracer := otel.Tracer("healthcheck-routine")
	// Erstellen eines Spans für diesen Check
	ctx, span := tracer.Start(context.Background(), fmt.Sprintf("check_%s", serviceName))
	defer span.End()

	span.SetAttributes(
		semconv.PeerService(serviceName),
		semconv.URLFull(url),
	)

	defer wg.Done() // Signalisiert der WaitGroup, dass diese Go-Routine fertig ist

	if url == "" {
		log.Printf("URL for service %s not configured.", serviceName)
		err := fmt.Errorf("URL not configured for service %s", serviceName)
		span.RecordError(err)                    // Fehler aufzeichnen
		span.SetStatus(codes.Error, err.Error()) // Span Status setzen
		results <- CheckResult{Service: serviceName, Status: "UNKNOWN", Error: "URL not configured"}
		return
	}

	// Verwende den Context mit dem aktiven Span für die Anfrage
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		log.Printf("Error creating request for %s (%s): %v", serviceName, url, err)
		span.RecordError(err)                                 // Fehler aufzeichnen
		span.SetStatus(codes.Error, "Error creating request") // Span Status setzen
		results <- CheckResult{Service: serviceName, Status: "DOWN", Error: fmt.Sprintf("Internal error: %v", err)}
		return
	}
	req.Header.Set("User-Agent", "sretodo-go-healthcheck/1.0")

	// Verwende den OTel-instrumentierten HTTP Client
	resp, err := otelHttpClient.Do(req)
	if err != nil {
		log.Printf("Error checking %s (%s): %v", serviceName, url, err)
		span.RecordError(err)                                        // Fehler aufzeichnen
		span.SetStatus(codes.Error, "Error performing HTTP request") // Span Status setzen
		results <- CheckResult{Service: serviceName, Status: "DOWN", Error: err.Error()}
		return
	}
	defer resp.Body.Close()

	// HTTP Status Code dem Span hinzufügen
	span.SetAttributes(semconv.HTTPResponseStatusCode(resp.StatusCode))

	if resp.StatusCode == http.StatusOK {
		span.SetStatus(codes.Ok, "") // Explizit OK setzen
		results <- CheckResult{Service: serviceName, Status: "UP"}
	} else {
		errMsg := fmt.Sprintf("Unexpected status code: %d", resp.StatusCode)
		log.Printf("Service %s (%s) returned status %d", serviceName, url, resp.StatusCode)
		err := fmt.Errorf(errMsg)
		span.RecordError(err)               // Fehler aufzeichnen
		span.SetStatus(codes.Error, errMsg) // Span Status setzen
		results <- CheckResult{Service: serviceName, Status: "DOWN", Error: errMsg}
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
	log.Println("Initializing OpenTelemetry Tracer Provider...")
	var err error
	tracerProvider, err = initTracerProvider()
	if err != nil {
		log.Fatalf("Failed to initialize OpenTelemetry Tracer Provider: %v", err)
	}
	// Sicherstellen, dass der Provider beim Beenden heruntergefahren wird
	defer func() {
		if err := tracerProvider.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()
	log.Println("OpenTelemetry Tracer Provider initialized.")

	log.Println("Starting Health Check Service...")

	// Instrumentierte Handler erstellen
	healthHandlerInstrumented := otelhttp.NewHandler(http.HandlerFunc(healthHandler), "health")
	aggregateHealthHandlerInstrumented := otelhttp.NewHandler(http.HandlerFunc(aggregateHealthHandler), "health/aggregate")

	http.Handle("/health", healthHandlerInstrumented)
	http.Handle("/health/aggregate", aggregateHealthHandlerInstrumented)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8003"
	}

	log.Printf("Health Check Service listening on port %s", port)
	// Standard http.ListenAndServe ist in Ordnung, da die Handler instrumentiert sind
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
