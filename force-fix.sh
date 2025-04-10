#!/bin/bash
# Forcefully restart the problematic pods

set -e

# Delete problematic pods
echo "Deleting problematic pods..."
kubectl delete pod --selector=app.kubernetes.io/component=java-todo
kubectl delete pod --selector=app.kubernetes.io/component=dotnet-statistik

# Scale down and back up the deployments
echo "Scaling deployments to ensure they use the correct images..."
kubectl scale deployment sretodo-release-java-todo --replicas=0
kubectl scale deployment sretodo-release-dotnet-statistik --replicas=0

sleep 5

kubectl scale deployment sretodo-release-java-todo --replicas=1
kubectl scale deployment sretodo-release-dotnet-statistik --replicas=1

echo "Waiting for pods to restart..."
sleep 10

echo "Current pod status:"
kubectl get pods

echo ""
echo "Access the application using the nginx gateway:"
echo "kubectl port-forward svc/sretodo-release-nginx-gateway 8080:80" 