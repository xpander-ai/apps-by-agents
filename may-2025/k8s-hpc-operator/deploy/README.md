# deploy

Kubernetes manifests to deploy the operator and UI.

## Usage

```bash
kubectl apply -f deploy/namespace.yaml
kubectl apply -f deploy/crd.yaml
kubectl apply -f deploy/operator.yaml
kubectl apply -f deploy/ui-deployment.yaml
```