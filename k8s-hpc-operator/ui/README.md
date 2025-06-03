# ui

Static single-page application for HPC job submission and cluster monitoring using React and Material UI.

## Getting Started

Open `index.html` in your browser. Ensure the operator REST API endpoints are available at the following paths (or adjust as needed in the script):

- **POST** `/api/jobs`
- **GET** `/api/jobs`
- **GET** `/api/nodes`
- **GET** `/api/pods`

The application provides:

- Job submission form (jobName, image, command, CPU, Memory)
- Job status table
- Admin mode toggle to view cluster nodes and pods resource usage