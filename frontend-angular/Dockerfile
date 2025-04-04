# Dockerfile für frontend-angular

# ---- Build Stage ----
# Verwende ein Node.js Image (LTS Version passend zu Angular 18, z.B. Node 20)
FROM node:20-alpine AS build

WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm ci

# Kopiere den Rest des Angular-Codes
COPY . .

# Baue die Angular-Anwendung für die Produktion
# Der Output landet standardmäßig in /app/dist/frontend-angular/browser
RUN npm run build -- --configuration production

# ---- Runtime Stage ----
# Verwende ein Nginx Image
FROM nginx:stable-alpine

# Entferne die Standard Nginx Konfiguration
RUN rm /etc/nginx/conf.d/default.conf

# Kopiere eine eigene Nginx Konfigurationsdatei (muss noch erstellt werden)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiere die gebauten Angular-Dateien aus der Build-Stage in das Nginx HTML-Verzeichnis
# Der Pfad /app/dist/frontend-angular/browser muss ggf. an den Output von 'ng build' angepasst werden (siehe angular.json)
COPY --from=build /app/dist/frontend-angular/browser /usr/share/nginx/html

# Exponiere Port 80 (Standard Nginx Port)
EXPOSE 80

# Standard Nginx Kommando wird ausgeführt (startet Nginx im Vordergrund)
# CMD ["nginx", "-g", "daemon off;"]
