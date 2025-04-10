#!/bin/bash
# Fix image paths and service ports

set -e

# Commit and push changes
git add kubernetes/values.yaml kubernetes/templates/nginx-gateway.yaml kubernetes/templates/python-pomodoro-deployment.yaml
git commit -m "Fix image repository paths and service port configuration"
git push origin feature-250404-start

# Trigger the GitHub Actions workflow to deploy the changes
echo "Changes have been pushed to the repository."
echo "The GitHub Actions workflow will automatically deploy the changes to OpenShift."
echo ""
echo "You can also manually deploy using the following command if you have OpenShift CLI and Helm configured:"
echo "helm upgrade --install sretodo-release ./kubernetes --namespace \$OPENSHIFT_NAMESPACE" 