package controllers

import (
    "context"

    batchv1 "k8s.io/api/batch/v1"
    corev1 "k8s.io/api/core/v1"
    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    "k8s.io/apimachinery/pkg/runtime"
    ctrl "sigs.k8s.io/controller-runtime"
    "sigs.k8s.io/controller-runtime/pkg/client"
    "sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
    "sigs.k8s.io/controller-runtime/pkg/log"

    hpcv1 "github.com/DolevAlgam/apps-by-agents/k8s-hpc-operator/operator/api/v1"
)

// HPCJobReconciler reconciles a HPCJob object
type HPCJobReconciler struct {
    client.Client
    Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=hpc.dolev.com,resources=hpcjobs,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=hpc.dolev.com,resources=hpcjobs/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=batch,resources=jobs,verbs=get;list;watch;create;update;patch;delete

// Reconcile implements the reconciliation loop for HPCJob
func (r *HPCJobReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    logger := log.FromContext(ctx)
    var hpcJob hpcv1.HPCJob
    if err := r.Get(ctx, req.NamespacedName, &hpcJob); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }

    job := &batchv1.Job{
        ObjectMeta: metav1.ObjectMeta{
            Name:      hpcJob.Spec.JobName,
            Namespace: hpcJob.Namespace,
        },
        Spec: batchv1.JobSpec{
            Template: corev1.PodTemplateSpec{
                Spec: corev1.PodSpec{
                    RestartPolicy: corev1.RestartPolicyNever,
                    Containers: []corev1.Container{
                        {
                            Name:      hpcJob.Spec.JobName,
                            Image:     hpcJob.Spec.Image,
                            Command:   hpcJob.Spec.Command,
                            Resources: hpcJob.Spec.Resources,
                        },
                    },
                },
            },
        },
    }

    if err := controllerutil.SetControllerReference(&hpcJob, job, r.Scheme); err != nil {
        return ctrl.Result{}, err
    }

    existing := &batchv1.Job{}
    err := r.Get(ctx, client.ObjectKey{Name: job.Name, Namespace: job.Namespace}, existing)
    if err != nil && client.IgnoreNotFound(err) != nil {
        return ctrl.Result{}, err
    }
    if err != nil && client.IgnoreNotFound(err) == nil {
        logger.Info("Creating Job", "job", job.Name)
        if err := r.Create(ctx, job); err != nil {
            return ctrl.Result{}, err
        }
    }

    // Update status based on Job status
    if existing.Status.Active > 0 {
        hpcJob.Status.JobStatus = corev1.PodRunning
    } else if existing.Status.Succeeded > 0 {
        hpcJob.Status.JobStatus = corev1.PodSucceeded
    } else if existing.Status.Failed > 0 {
        hpcJob.Status.JobStatus = corev1.PodFailed
    }
    if err := r.Status().Update(ctx, &hpcJob); err != nil {
        return ctrl.Result{}, err
    }

    return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *HPCJobReconciler) SetupWithManager(mgr ctrl.Manager) error {
    return ctrl.NewControllerManagedBy(mgr).
        For(&hpcv1.HPCJob{}).
        Owns(&batchv1.Job{}).
        Complete(r)
}