# Dockerfile für service-java-todo

# ---- Build Stage ----
# Verwende ein Maven-Image mit JDK 21 zum Bauen des Projekts
FROM maven:3.9.8-eclipse-temurin-21 AS builder

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die pom.xml und lade Abhängigkeiten herunter (nutzt Docker Cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kopiere den Rest des Quellcodes
COPY src ./src

# Baue die Anwendung und erstelle das JAR-File
# -DskipTests: Überspringt die Tests während des Docker-Builds
RUN mvn package -DskipTests

# ---- Runtime Stage ----
# Verwende ein schlankes JRE-Image (Java 21)
FROM eclipse-temurin:21-jre-alpine

# OpenTelemetry Agent Version (muss mit der in pom.xml übereinstimmen!)
ARG OTEL_AGENT_VERSION=2.5.0

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die OpenTelemetry Agent JAR aus dem Maven Repo der Builder-Stage
COPY --from=builder /root/.m2/repository/io/opentelemetry/javaagent/opentelemetry-javaagent/${OTEL_AGENT_VERSION}/opentelemetry-javaagent-${OTEL_AGENT_VERSION}.jar ./opentelemetry-javaagent.jar

# Kopiere das gebaute JAR-File aus der Builder-Stage
# Das JAR befindet sich normalerweise in /app/target/<artifact-id>-<version>.jar
COPY --from=builder /app/target/service-java-todo-*.jar ./app.jar

# Definiere Umgebungsvariablen (optional, können auch in docker-compose.yml gesetzt werden)
# ENV SERVER_PORT=8080

# Exponiere den Port, auf dem die Anwendung läuft (Standard: 8080)
EXPOSE 8080

# Kommando zum Starten der Anwendung MIT dem Agent
# Der Agent wird über die -javaagent JVM-Option aktiviert
ENTRYPOINT ["java", "-javaagent:./opentelemetry-javaagent.jar", "-jar", "./app.jar"] 