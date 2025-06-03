package main

import (
    "context"
    "encoding/json"
    "flag"
    "net/http"
    "os"

    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    "k8s.io/apimachinery/pkg/runtime"
    clientgoscheme "k8s.io/client-go/kubernetes/scheme"
    utilruntime "k8s.io/apimachinery/pkg/util/runtime"
    ctrl "sigs.k8s.io/controller-runtime"
    "sigs.k8s.io/controller-runtime/pkg/client"
    "sigs.k8s.io/controller-runtime/pkg/log/zap"

    hpcv1 "github.com/DolevAlgam/apps-by-agents/k8s-hpc-operator/operator/api/v1"
    "github.com/DolevAlgam/apps-by-agents/k8s-hpc-operator/operator/controllers"
)

var (
    scheme = runtime.NewScheme()
    setupLog = ctrl.Log.WithName("setup")
)

func init() {
    utilruntime.Must(clientgoscheme.AddToScheme(scheme))
    utilruntime.Must(hpcv1.AddToScheme(scheme))
}

func main() {
    var metricsAddr string
    var enableLeaderElection bool
    flag.StringVar(&metricsAddr, "metrics-addr", ":8080", "The address the metric endpoint binds to.")
    flag.BoolVar(&enableLeaderElection, "enable-leader-election", false,
        "Enable leader election for controller manager. Enabling this will ensure there is only one active controller manager.")
    flag.Parse()

    ctrl.SetLogger(zap.New(zap.UseDevMode(true)))

    mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
        Scheme:             scheme,
        MetricsBindAddress: metricsAddr,
        Port:               9443,
        LeaderElection:     enableLeaderElection,
        LeaderElectionID:   "hpc.dolev.com",
    })
    if err != nil {
        setupLog.Error(err, "unable to start manager")
        os.Exit(1)
    }

    if err = controllers.HPCJobReconciler{
        Client: mgr.GetClient(),
        Scheme: mgr.GetScheme(),
    }.SetupWithManager(mgr); err != nil {
        setupLog.Error(err, "unable to create controller", "controller", "HPCJob")
        os.Exit(1)
    }

    // Start REST server for job submissions and status
    go serveREST(mgr)

    setupLog.Info("starting manager")
    if err := mgr.Start(ctrl.SetupSignalHandler()); err != nil {
        setupLog.Error(err, "problem running manager")
        os.Exit(1)
    }
}

func serveREST(mgr ctrl.Manager) {
    ctx := context.Background()
    k8sClient := mgr.GetClient()

	    http.HandleFunc("/jobs", func(w http.ResponseWriter, r *http.Request) {
	        if r.Method != http.MethodPost {
	            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	            return
	        }
	        var spec hpcv1.HPCJobSpec
	        if err := json.NewDecoder(r.Body).Decode(&spec); err != nil {
	            http.Error(w, err.Error(), http.StatusBadRequest)
	            return
	        }
	        job := &hpcv1.HPCJob{
	            ObjectMeta: metav1.ObjectMeta{GenerateName: spec.JobName + "-"},
	            Spec:       spec,
	        }
        if err := k8sClient.Create(ctx, job); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(job)
    })

    http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
        var list hpcv1.HPCJobList
        if err := k8sClient.List(ctx, &list); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(list)
    })

    setupLog.Info("starting REST API", "addr", ":8081")
    if err := http.ListenAndServe(":8081", nil); err != nil {
        setupLog.Error(err, "HTTP server failed")
    }
}