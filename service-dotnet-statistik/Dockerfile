# Dockerfile für service-dotnet-statistik

# ---- Build Stage ----
# Verwende das .NET 8 SDK Image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Kopiere csproj und stelle Abhängigkeiten wieder her (nutzt Docker Cache)
COPY *.csproj .
RUN dotnet restore

# Kopiere den Rest des Projekts und baue es
COPY . .
# Publish als Release-Build
RUN dotnet publish -c Release -o /app/published

# ---- Runtime Stage ----
# Verwende das ASP.NET 8 Runtime Image (schlanker als SDK)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Kopiere die veröffentlichte Anwendung aus der Build-Stage
COPY --from=build /app/published .

# Exponiere den Port (Standard ist 8080 für ASP.NET Core in Containern, wenn Kestrel verwendet wird)
# Der Port wird durch die Umgebungsvariable ASPNETCORE_URLS in docker-compose.yml auf 8080 gesetzt
EXPOSE 8080

# Kommando zum Starten der Anwendung
# Der Entrypoint ist das DLL-File der Anwendung
ENTRYPOINT ["dotnet", "service-dotnet-statistik.dll"] 