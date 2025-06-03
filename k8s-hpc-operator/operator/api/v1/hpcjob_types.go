package v1

import (
    corev1 "k8s.io/api/core/v1"
    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// HPCJobSpec defines the desired state of HPCJob
type HPCJobSpec struct {
    // JobName is the name of the underlying Kubernetes Job
    JobName string `json:"jobName"`
    // Image is the container image to run
    Image string `json:"image"`
    // Command is the command to run in the container
    Command []string `json:"command,omitempty"`
    // Resources are the resource requirements for the container
    Resources corev1.ResourceRequirements `json:"resources,omitempty"`
}

// HPCJobStatus defines the observed state of HPCJob
type HPCJobStatus struct {
    // JobStatus is the status phase of the Kubernetes Job
    JobStatus corev1.PodPhase `json:"jobStatus,omitempty"`
}

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status
// HPCJob is the Schema for the hpcjobs API
type HPCJob struct {
    metav1.TypeMeta   `json:",inline"`
    metav1.ObjectMeta `json:"metadata,omitempty"`

    Spec   HPCJobSpec   `json:"spec,omitempty"`
    Status HPCJobStatus `json:"status,omitempty"`
}

//+kubebuilder:object:root=true
// HPCJobList contains a list of HPCJob
type HPCJobList struct {
    metav1.TypeMeta `json:",inline"`
    metav1.ListMeta `json:"metadata,omitempty"`
    Items           []HPCJob `json:"items"`
}