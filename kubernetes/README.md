# Kubernetes Deployment (Helm)

Dieses Verzeichnis enthält die Helm-Charts für die Bereitstellung der SRE ToDo MVP Demo Anwendung auf Kubernetes.

## Struktur

- `charts/`: Enthält die einzelnen Sub-Charts für jeden Service und die Observability-Komponenten.
    - `sretodo-frontend/`
    - `sretodo-java-todo/`
    - `sretodo-dotnet-statistik/`
    - `sretodo-python-pomodoro/`
    - `sretodo-go-healthcheck/` (Derzeit nicht aktiv genutzt, da Health Checks in K8s anders gelöst werden können)
    - `sretodo-nginx-gateway/`
    - `sretodo-observability/` (Bündelt Collector, Prometheus, Tempo, Loki, Grafana)
    - `sretodo-postgres/`
- `templates/`: Enthält übergreifende Templates (aktuell nicht genutzt).
- `Chart.yaml`: Das Haupt-Chart, das alle Sub-Charts als Abhängigkeiten definiert.
- `values.yaml`: Konfigurationswerte für das Haupt-Chart und die Sub-Charts.

## Voraussetzungen

- Ein laufender Kubernetes-Cluster (z.B. minikube, k3d, Docker Desktop Kubernetes).
- `kubectl` Kommandozeilen-Tool installiert und konfiguriert.
- `helm` Kommandozeilen-Tool installiert.

## Bereitstellung

1.  **Namespace erstellen (optional, aber empfohlen):**
    ```bash
    kubectl create namespace sretodo-demo
    ```

2.  **Secrets erstellen (für PostgreSQL):**
    Erstelle ein Secret für die PostgreSQL-Zugangsdaten. Das `values.yaml` erwartet ein Secret namens `sretodo-postgres-secret` mit den Schlüsseln `POSTGRES_USER` und `POSTGRES_PASSWORD`.
    ```bash
    kubectl create secret generic sretodo-postgres-secret --from-literal=POSTGRES_USER=admin --from-literal=POSTGRES_PASSWORD=secret -n sretodo-demo
    ```
    *(Passe die Werte entsprechend an, falls nötig)*

3.  **Helm-Chart installieren:**
    Navigiere in das `kubernetes` Verzeichnis im Terminal.
    ```bash
    cd kubernetes
    helm install sretodo-release . -n sretodo-demo
    ```
    *(Ersetze `sretodo-release` durch den gewünschten Release-Namen und `sretodo-demo` durch den gewählten Namespace)*

    Dieser Befehl installiert alle Sub-Charts und erstellt die notwendigen Kubernetes-Ressourcen (Deployments, Services, ConfigMaps, Secrets (indirekt), Ingress etc.).

4.  **Zugriff auf die Anwendung:**
    Nachdem alle Pods gestartet sind (überprüfe mit `kubectl get pods -n sretodo-demo`), kannst du auf die Anwendung zugreifen. Die Zugriffsmethode hängt von deiner Kubernetes-Distribution und der Konfiguration des Ingress-Controllers ab.
    -   **Lokales Kubernetes (minikube, Docker Desktop):** Oft ist der Nginx Gateway Service direkt über `http://localhost/` erreichbar. Wenn du `minikube tunnel` oder Port-Forwarding verwendest:
        ```bash
        kubectl port-forward svc/sretodo-nginx-gateway 8080:80 -n sretodo-demo
        ```
        Zugriff dann über `http://localhost:8080/`.
    -   **Andere Cluster:** Finde die externe IP oder den Hostnamen des Ingress-Controllers heraus:
        ```bash
        kubectl get ingress -n sretodo-demo
        ```

5.  **Zugriff auf Grafana:**
    Grafana ist normalerweise über einen separaten Port oder Ingress erreichbar. Finde den Service oder Ingress:
    ```bash
    kubectl get svc -n sretodo-demo | grep grafana
    kubectl get ingress -n sretodo-demo | grep grafana # (Falls ein Ingress konfiguriert ist)
    ```
    Verwende Port-Forwarding, falls nötig:
    ```bash
    kubectl port-forward svc/sretodo-grafana 3000:80 -n sretodo-demo
    ```
    Zugriff dann über `http://localhost:3000/`. Standard-Login ist `admin`/`prom-operator`.

## Konfiguration

Die Konfiguration erfolgt hauptsächlich über die `values.yaml`-Datei im Hauptchart (`kubernetes/values.yaml`) und den entsprechenden `values.yaml`-Dateien in den Sub-Charts (`kubernetes/charts/*/values.yaml`). Hier können z.B. Image-Tags, Replica Counts, Ressourcenlimits und spezifische Service-Einstellungen angepasst werden.

## Deinstallation

```bash
helm uninstall sretodo-release -n sretodo-demo
kubectl delete namespace sretodo-demo # (Optional)
```

## Aktuelle Herausforderungen / TODOs

- Ressourcenlimits/-requests definieren und optimieren.
- Health Checks (Liveness/Readiness Probes) implementieren.
- Grafana Dashboards anpassen/erstellen. 