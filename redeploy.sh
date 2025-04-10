#!/bin/bash
# This script redeploys the SRE Todo app to OpenShift

set -e

# Commit and push changes
git add kubernetes/templates/nginx-gateway.yaml kubernetes/values.yaml
git commit -m "Fix API paths in NGINX gateway and enable backend services"
git push origin feature-250404-start

# Trigger the GitHub Actions workflow to deploy the changes
echo "Changes have been pushed to the repository."
echo "The GitHub Actions workflow will automatically deploy the changes to OpenShift."
echo ""
echo "You can also manually deploy using the following command if you have OpenShift CLI and Helm configured:"
echo "helm upgrade --install sretodo-release ./kubernetes --namespace \$OPENSHIFT_NAMESPACE" 