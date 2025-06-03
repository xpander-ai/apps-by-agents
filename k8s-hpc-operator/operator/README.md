# operator

Go-based Kubernetes operator for managing HPC jobs via a custom `HPCJob` CRD.

## Getting Started

1. Install Kubebuilder or Operator SDK.
2. Initialize the project and generate APIs (already provided in this scaffold):

   ```bash
   kubebuilder init --domain hpc.dolev.com --repo github.com/DolevAlgam/apps-by-agents/k8s-hpc-operator/operator
   kubebuilder create api --group hpc --version v1 --kind HPCJob
   ```

3. Build and run the operator:

   ```bash
   make install run
   ```

## REST API
The operator provides a REST API on port 8081 for job submissions and monitoring:

- `POST /jobs`: submit a new HPCJob by sending a JSON payload matching the `HPCJobSpec`.
- `GET /status`: retrieve the list and status of all `HPCJob` resources.