FROM nginx:stable-alpine

# Kopiere unsere benutzerdefinierte Konfigurationsdatei
# Sie überschreibt die Standard-Konfig im conf.d-Verzeichnis
COPY default.conf /etc/nginx/conf.d/default.conf

# Kein RUN rm nötig, da COPY eine vorhandene Datei überschreibt.
# Port wird bereits durch das Basis-Image exponiert.
# Standard-CMD des Basis-Images wird verwendet.
