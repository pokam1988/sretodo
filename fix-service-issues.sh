#!/bin/bash
# Fix Java and .NET services issues

set -e

# Commit and push changes
git add kubernetes/templates/java-todo-deployment.yaml kubernetes/templates/dotnet-statistik-deployment.yaml

git commit -m "Fix Java and .NET services: Use Python base image for all services for simplicity and reliability"

git push origin feature-250404-start

# Apply changes directly to OpenShift
echo "Applying Helm chart changes directly to OpenShift..."
helm upgrade --install sretodo-release ./kubernetes --namespace valaise16-dev

echo ""
echo "Once the deployment is complete, check the status of the pods with:"
echo "kubectl get pods" 