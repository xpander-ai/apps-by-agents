package v1

import (
    "k8s.io/apimachinery/pkg/runtime/schema"
    "sigs.k8s.io/controller-runtime/pkg/scheme"
)

// GroupVersion is group version used to register these objects
var GroupVersion = schema.GroupVersion{Group: "hpc.dolev.com", Version: "v1"}

// SchemeBuilder is used to add go types to the GroupVersionKind scheme
var SchemeBuilder = &scheme.Builder{GroupVersion: GroupVersion}

// AddToScheme is a helper to add this group's types to the scheme
var AddToScheme = SchemeBuilder.AddToScheme

func init() {
    SchemeBuilder.Register(&HPCJob{}, &HPCJobList{})
}