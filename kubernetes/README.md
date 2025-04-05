# SRE Todo Kubernetes Helm Chart

This Helm chart deploys the SRE Todo application with OpenTelemetry observability in a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Getting Started

### Installation

1. Clone this repository:
```bash
git clone https://github.com/your-organization/sretodo.git
cd sretodo/kubernetes
```

2. Install the Helm chart:
```bash
helm install sretodo . -f values.yaml
```

To customize the installation, you can either edit the `values.yaml` file or provide overrides on the command line:

```bash
helm install sretodo . -f values.yaml --set frontend.replicas=2
```

### Deployment on OpenShift

The Helm chart has been optimized for OpenShift deployment:

1. All containers are configured to run as non-root users
2. Frontend and NGINX gateway use port 8080 instead of port 80
3. SecurityContext is set to ensure proper permissions

To deploy on OpenShift:

```bash
helm install sretodo . -f values.yaml
```

## Architecture

The SRE Todo application consists of the following components:

- **Frontend**: Angular-based web interface built from CI/CD pipeline
- **Java Todo Service**: Backend service for managing todos
- **PostgreSQL**: Database for storing todos
- **NGINX Gateway**: API gateway for frontend and services
- **Observability Stack**:
  - OpenTelemetry Collector
  - Prometheus
  - Tempo
  - Loki
  - Grafana

## Configuration

### Enabling/Disabling Components

Each component can be enabled or disabled through the `enabled` flag in the `values.yaml` file. For example:

```yaml
frontend:
  enabled: true

javaTodo:
  enabled: true

dotnetStatistik:
  enabled: false

pythonPomodoro:
  enabled: false
```

### Component Configuration

Each component allows configuration of:

- Image repository and tag
- Number of replicas
- Resource limits and requests
- Service type
- Environment variables (where applicable)

See the `values.yaml` file for all available configuration options.

## Security

All components are configured to run as non-root users with the minimum required permissions.

## Observability

The observability stack is enabled by default and includes:

- **OpenTelemetry Collector**: Collects metrics, traces, and logs
- **Prometheus**: Stores and queries metrics
- **Tempo**: Stores and queries traces
- **Loki**: Stores and queries logs
- **Grafana**: Provides dashboards for visualizing all telemetry data

Access the Grafana dashboard at `http://<cluster-ip>:<port>/grafana` (get the service IP with `kubectl get svc`).

## Troubleshooting

If you encounter issues with the deployment:

1. Check the status of the Pods:
```bash
kubectl get pods
```

2. Check the logs of a specific Pod:
```bash
kubectl logs <pod-name>
```

3. If a Pod is not starting, describe it for more details:
```bash
kubectl describe pod <pod-name>
```

## CI/CD mit GitHub Actions

Die Bereitstellung auf einem Kubernetes/OpenShift-Cluster wird automatisch durch einen GitHub Actions Workflow (`.github/workflows/deploy.yaml`) gesteuert. Bei jedem Push auf die Branches `main` oder `dev`:

1.  Werden die Docker-Images für alle Services gebaut.
2.  Werden die Images in die GitHub Container Registry (ghcr.io) gepusht.
3.  Wird das Helm-Chart mit `helm upgrade --install` auf dem Zielcluster (konfiguriert über Secrets `OPENSHIFT_SERVER`, `OPENSHIFT_TOKEN`, `OPENSHIFT_NAMESPACE`) angewendet, wobei die neu gebauten Image-Tags verwendet werden.

Eine manuelle Bereitstellung ist weiterhin möglich (siehe Abschnitt "Bereitstellung"), aber der automatisierte Workflow ist der bevorzugte Weg für Updates.

### Entfernen der Bereitstellung

Zum Entfernen der Anwendung von OpenShift gibt es zwei Möglichkeiten:

1. **Workflow "destroy.yaml" ausführen**:
   - Gehe zu "Actions" > "Destroy SRE ToDo Demo from OpenShift"
   - Klicke auf "Run workflow"
   - Wähle die Umgebung und gib optional den Release-Namen an
   - Klicke auf "Run workflow"

2. **Deploy-Workflow mit "destroy" Option ausführen**:
   - Gehe zu "Actions" > "Deploy SRE ToDo Demo to OpenShift"
   - Klicke auf "Run workflow"
   - Wähle "destroy" als Action
   - Klicke auf "Run workflow"

Beide Methoden entfernen das Helm-Release und bereinigen die zugehörigen Ressourcen im OpenShift-Cluster.

## Deinstallation

```bash
helm uninstall sretodo-release -n sretodo-demo
kubectl delete namespace sretodo-demo # (Optional)
```

## Aktuelle Herausforderungen / TODOs

- Ressourcenlimits/-requests definieren und optimieren.
- Health Checks (Liveness/Readiness Probes) implementieren.
- Grafana Dashboards anpassen/erstellen. 