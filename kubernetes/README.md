# SRE Todo Kubernetes Helm Chart

This Helm chart deploys the SRE Todo application with OpenTelemetry observability in a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Getting Started

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-organization/sretodo.git # Replace with your repo URL
   cd sretodo/kubernetes
   ```

2. **(If using private registry like GHCR) Create Image Pull Secret**
   Ensure you have created a secret in your target namespace that allows pulling images from your private container registry (e.g., `ghcr.io`). The default secret name expected by the chart is `ghcr-secret` (configurable via `global.image.pullSecret` in `values.yaml`).
   ```bash
   # Example for GHCR
   kubectl create secret docker-registry ghcr-secret \
     --namespace=<your-namespace> \
     --docker-server=ghcr.io \
     --docker-username=<your-github-username> \
     --docker-password=<your-github-pat> \
     --docker-email=<your-email>
   ```
   You might also need to link this secret to the default service account if your pods use it:
   ```bash
   kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name":"ghcr-secret"}]}' -n <your-namespace>
   ```

3. **Customize `values.yaml` (Important!)**
   - Review `kubernetes/values.yaml`.
   - **Crucially, update the `tag` field under each application service (`frontend`, `javaTodo`, `dotnetStatistik`, `pythonPomodoro`) to point to a valid, existing image tag in your registry.** Using `latest` might fail if the tag doesn't exist or due to caching.
   - Adjust other values like replicas, resources, or enabled components as needed.

4. **Install the Helm chart**
   Deploy the chart using Helm, specifying your target namespace:
   ```bash
   helm upgrade --install sretodo-release . -n <your-namespace>
   ```
   *(Using `upgrade --install` is generally safer than just `install`)*

To provide overrides without editing `values.yaml`:

```bash
helm upgrade --install sretodo-release . -n <your-namespace> --set frontend.replicas=2 --set javaTodo.tag=specific-tag-123
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

### Global Settings (`global` block in `values.yaml`)
- `global.image.tag`: Default image tag (though service-specific tags are now preferred).
- `global.image.pullPolicy`: Default pull policy (e.g., `Always`, `IfNotPresent`).
- `global.image.pullSecret`: Name of the Kubernetes secret used for pulling private images.
- `global.repositoryPrefix`: The base URL of your container registry (e.g., `ghcr.io/my-org`).

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

- `imageName`: The specific name of the image (suffix after the global prefix).
- `tag`: **(Important)** The specific image tag to deploy for this service. Must exist in the registry.
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

- **ImagePullBackOff / ErrImagePull / manifest unknown:**
  - Verify the `tag` specified in `values.yaml` for the failing service exists in your registry (`ghcr.io/...`).
  - Check if the `imagePullSecrets` (`ghcr-secret` by default) exists in the namespace.
  - Ensure the secret contains valid credentials (correct username, PAT with `read:packages` scope) for `ghcr.io`.
  - Confirm the secret is linked to the `default` service account (`kubectl get sa default -o yaml`).
- **Gateway Timeout (504):**
  - Check if the target Pod (e.g., frontend, java-todo) is running (`kubectl get pods`).
  - Verify the target Service is correctly configured (ports match, selector matches pod labels) (`kubectl get svc <service-name> -o yaml`).
  - Examine the Nginx Gateway logs (`kubectl logs <nginx-gateway-pod>`).
  - Examine the target pod logs (`kubectl logs <target-pod>`).

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

- Grafana Dashboards anpassen/erstellen, da sie derzeit "No Data" anzeigen.
- Ressourcenlimits/-requests basierend auf dem tatsächlichen Verbrauch in OpenShift optimieren.
- Health Checks (Liveness/Readiness Probes) für alle Komponenten überprüfen und ggf. verbessern. 