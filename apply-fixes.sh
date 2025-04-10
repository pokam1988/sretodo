#!/bin/bash
# Fix the SRE Todo application on OpenShift

set -e

# Commit and push changes
git add kubernetes/values.yaml kubernetes/templates/frontend-configmap.yaml kubernetes/templates/frontend-deployment.yaml kubernetes/templates/java-todo-deployment.yaml kubernetes/templates/dotnet-statistik-deployment.yaml kubernetes/templates/python-pomodoro-deployment.yaml

git commit -m "Fix service deployments: Use public base images with mock service implementations"

git push origin feature-250404-start

# Apply changes directly to OpenShift
if command -v helm > /dev/null && command -v oc > /dev/null; then
  echo "Applying Helm chart changes directly to OpenShift..."
  helm upgrade --install sretodo-release ./kubernetes --namespace valaise16-dev
else
  echo "Changes have been pushed to the repository."
  echo "The GitHub Actions workflow will automatically deploy the changes to OpenShift."
fi

echo ""
echo "Once the deployment is complete, check the status of the pods with:"
echo "kubectl get pods" 