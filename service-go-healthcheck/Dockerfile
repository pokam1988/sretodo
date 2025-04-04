# Dockerfile für service-go-healthcheck

# ---- Build Stage ----
# Verwende das offizielle Go 1.23 Image als Builder
FROM golang:1.23-alpine AS builder

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere go.mod und go.sum und lade Abhängigkeiten herunter
COPY go.mod go.sum ./
RUN go mod download

# Kopiere den Rest des Quellcodes
COPY . .

# Baue die Go-Anwendung
# -ldflags="-w -s" reduziert die Größe des Binarys
# CGO_ENABLED=0 deaktiviert Cgo für statisches Linken
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /go/bin/healthchecker .

# ---- Runtime Stage ----
# Verwende ein minimales Alpine Image
FROM alpine:latest

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere nur das kompilierte Binary aus der Build-Stage
COPY --from=builder /go/bin/healthchecker .

# Füge ggf. notwendige CA-Zertifikate hinzu (wichtig für HTTPS-Checks)
# RUN apk --no-cache add ca-certificates

# Exponiere den Port (aus main.go und docker-compose.yml)
EXPOSE 8003

# Kommando zum Starten des Health Checkers
ENTRYPOINT ["./healthchecker"] 