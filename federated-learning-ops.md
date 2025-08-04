---
title: Federated learning — operational practices
layout: page
---

### Monitoring and MLOps

Good operational practices are vital for reliable federated systems.
Maintain audit logs at both the coordinator and client sides to record
training events, authentication attempts and errors.

Use drift detection to monitor whether local distributions diverge from the
global model assumptions.  Continuous integration pipelines should
include unit tests and simulated federated runs.  When possible,
measure and visualise metrics (such as loss and accuracy) across
training rounds without revealing individual site performance.

Implement concept‑ and data‑drift alarms using tools like **Evidently AI** and
**Prometheus exporters** for production monitoring. Maintain comprehensive
audit logs for every training round to ensure compliance and traceability.


### Operational service-level indicators (SLIs)

Reliable FL deployments track **three core SLIs** — coordinator availability,
client-participation rate, and per-round latency — because each has a proven
impact on convergence and user experience:

| SLI | Why it matters | How to measure |
|-----|----------------|---------------|
| **Coordinator availability** | A single coordinator outage halts every training round; Google’s SRE handbook recommends continuous success-probes to detect silent failures [1]. | Expose an HTTP / gRPC health probe every 30 s and log the ratio _successful / total_ probes as an availability time-series. |
| **Client-participation rate** | Model quality degrades sharply when too few clients report; large-scale studies see ≥ 8 pp accuracy loss at ≈ 10 % participation [2][3]. | Export `fl_clients_participation_ratio = n_active / n_selected` each round. Flower and NVFLARE expose this metric via Prometheus [4][5]. |
| **Per-round latency (p95)** | Latency spikes are early warnings of network congestion or stragglers; the _Site Reliability Workbook_ advises alerting when p95 exceeds the agreed SLO budget [6]. | Track `fl_round_duration_seconds` as a histogram and fire an alert when p95 breaches the budget for three consecutive windows. |

> _Implementation tip_ – Prometheus dashboards shipped with **Flower ≥ 1.8**
> and **NVFLARE 2.x** already publish `server_uptime_seconds`,
> `client_participation_ratio`, and `round_duration_seconds`, so all three SLIs
> can be monitored without additional coding
> [4][5].

### Frameworks and language support

The open‑source **Flower** framework [7] and several other
frameworks implement FL, each with different programming languages, maturity
levels and security features:

* **[Flower](https://flower.ai){:.tool}** – Python (PyTorch/TensorFlow). Secure
  aggregation via `secagg_mod`/`secaggplus_mod` on the client and
  `SecAgg{,+}Workflow` on the server (≥ v1.8); launch with `flwr run --mods
  secaggplus_mod` (≥ Flower 1.8) [8].
  _Lightweight alternative_: **LightSecAgg** protocol offers dropout‑resilient
  secure aggregation for asynchronous FL; still research‑grade and not yet
  merged in Flower core. See the official secure‑aggregation notebook
  [9] for a minimal working example.
* **[FATE](https://github.com/FederatedAI/FATE){:.tool}** – production‑ready, Java/Python,
  homomorphic encryption [10].
* **[NVIDIA FLARE](https://developer.nvidia.com/flare){:.tool}** – SDK with
  FedAvg/FedOpt/FedProx [11].
* **[Substra](https://github.com/substra){:.tool}** – Python API + web UI for
  clinical FL at scale [12].
* **[Yjs](https://yjs.dev){:.tool}** – high‑performance CRDT engine for
  real‑time collaboration; **not** an ML library and provides no privacy
  guarantees out‑of‑the‑box (secure only if deployed in a TRE with TLS/OIDC)
  [13].
  When Yjs transports are wrapped in TLS/OIDC they can meet the same
  confidentiality baseline, but offer no built‑in aggregation privacy.

#### Community and maintenance

* **Flower Slack** – real‑time Q&A and roadmap discussions
  [14].
* **FATE mailing list** – announcements and technical support
  [15]  [16].
* **ELIXIR Federated‑Human‑Data Slack** – cross‑node help channel
  [17].

When choosing a framework, consider compatibility with your existing code,
support for secure aggregation and the maturity of the community.

### Licensing and persistent identifiers

* **Model licensing**: Use SPDX identifiers (e.g., `Apache-2.0`, `CC-BY-4.0`)
  in model metadata to clarify reuse terms.
* **Data citations**: Assign DataCite DOIs to federated datasets and model
  versions for persistent reference.
* **Code repositories**: License FL workflows under permissive licenses
  (MIT, Apache-2.0) to encourage adoption.
* **RO-Crate packaging**: Include `LICENSE` file and SPDX metadata in every
  crate to ensure legal clarity.

### Implementation recommendations

* Use **Flower** (≥1.8) with TLS encryption and SecAgg+ for horizontal
  federated learning experiments.
* For regulated environments, deploy **FATE** with homomorphic encryption
  to train logistic regression or tree‑based models.
* Configure **FLARE** or **Substra** to run simulations and validate
  workflows locally before deploying to production.
* Enforce open standards: package every federated run as a RO‑Crate using
  `runcrate` and publish results via Zenodo.
* Apply **Five Safes** governance — de‑identify data, approve projects,
  train authorised personnel, use secure settings and vet outputs.
* Monitor training with drift detection and audit logging, and apply
  differential privacy when sharing aggregated models.

### Data management planning

Use the **ELIXIR-CONVERGE DMP wizard** for federated studies, which includes
specific questions about:

* Data distribution and access controls
* Federated infrastructure requirements  
* Cross-border data governance
* Model versioning and provenance

Example (excerpt) from the wizard `dmp.json`:

```json
{
  "federated_storage_location": "TRE‑Portuguese Node",
  "model_doi": "10.5281/zenodo.9999999",
  "retention_policy_days": 90,
  "secure_aggregation": true
}
```

Access the wizard at: [ELIXIR-CONVERGE DMP wizard](https://dmponline.elixir-europe.org/)
[18].

### FAIR, metadata and provenance

* Capture dataset‑level metadata with **RO‑Crate 1.3** or
  Five‑Safes RO‑Crate.
* Document trained models with **Model Cards** to record intended use,
  limitations and demographic performance
 . Example YAML snippet:

  ```yaml
  model_details:
    name: "Federated MNIST Classifier"
    version: "1.0"
    training_algorithm: "FedAvg"
    rounds: 100
    participants: 5
  intended_use:
    primary_use: "Handwritten digit classification"
    out_of_scope: "Medical imaging, document analysis"
  performance:
    metric: "accuracy"
    global_model: 0.98
    fairness_assessment: "Evaluated across demographic groups"
  ```

* Register container digests and environment lock files (e.g. `conda‑lock`)
  inside the crate for full environment capture.
* Where phenotypic data is exchanged, encode samples with **GA4GH Phenopackets**
  to ensure semantic interoperability across nodes.

#### RO‑Crate example

The Workflow‑Run RO‑Crate profile [19] formalises
metadata capture for computational workflows. A minimal `ro-crate-metadata.json`
for a federated training run:

```json
{
  "@context": ["https://w3id.org/ro/crate/1.1/context"],
  "@graph": [
    {
      "@id": "ro-crate-metadata.json",
      "@type": "CreativeWork"
    },
    {
      "@id": "./",
      "@type": "WorkflowRunCrate",
      "name": "Federated training run",
      "hasPart": [
        { "@id": "model.pkl" },
        { "@id": "metrics.json" }
      ]
    },
    {
      "@id": "model.pkl",
      "@type": "File"
    },
    {
      "@id": "metrics.json",
      "@type": "File"
    }
  ]
}
```

Full implementation available in the **[Five Safes RO‑Crate record](https://zenodo.org/records/10376350)**.


### Reproducibility checklist

#### DOME-ML framework for FL reproducibility

Follow the DOME‑ML recommendations [20] for reproducible
machine learning validation:

✓ **Data**

* Version control data schemas with semantic versioning
* Document data splits and partitioning strategies  
* Track preprocessing pipelines with [DVC user guide](https://dvc.org/doc/user-guide)
  [21].

✓ **Optimisation**

* Log hyperparameters in Model Cards
* Version FL algorithms and aggregation methods
* Document convergence criteria

✓ **Model**

* Store model checkpoints with DataCite DOIs
* Package models with environment lock files (conda-lock)
* Version model architectures in Git

✓ **Evaluation**

* Document evaluation metrics and protocols
* Version test datasets separately
* Track performance across federation rounds

#### Retention, deletion and machine unlearning

**Immediate actions:**

* Implement data retention policies per node (e.g., ninety-day rolling windows)
* Deploy automated deletion scripts with audit trails
* Document GDPR Art. 17 compliance procedures

**Emerging techniques:**

* **SISA training**: Train on data shards for easier unlearning
* **Differential privacy**: Natural forgetting through noise addition
* **Certified removal**: Mathematical guarantees of data influence removal
  [22]

For a comprehensive survey on certified removal [23],
see: [Machine unlearning survey (Nature 2024)](https://www.nature.com/articles/s41598-024-51381-4).

### Disaster recovery and business continuity

Follow **DOME-ML reproducibility protocols** for systematic checkpoint
management and backup strategies across distributed sites. Document all
recovery procedures and test failover scenarios regularly.

The EDPS commentary emphasizes that data subjects retain erasure rights even
in federated settings, requiring coordinated deletion mechanisms across all
participating nodes.


### Bias mitigation and fairness

Use group‑fairness metrics (demographic parity, equal opportunity) to audit both
global and per‑site models.
Mitigation strategies include re‑weighting, constrained optimisation and
fairness‑aware FedAvg variants. Follow **DOME-ML fairness evaluation**
guidelines for systematic bias assessment across federated model performance.


### Cost optimisation

* **Budget VM/GPU hours** – estimate computational costs across federated sites
  using cloud pricing calculators and monitor actual usage via resource
  monitoring dashboards.
* **Track energy and carbon (kWh and g CO₂‑eq) via CodeCarbon and similar tools**
### Monitoring and MLOps

Good operational practices are vital for reliable federated systems.
Maintain audit logs at both the coordinator and client sides to record
training events, authentication attempts and errors.

Use drift detection to monitor whether local distributions diverge from the
global model assumptions.  Continuous integration pipelines should
include unit tests and simulated federated runs.  When possible,
measure and visualise metrics (such as loss and accuracy) across
training rounds without revealing individual site performance.

Implement concept‑ and data‑drift alarms using tools like **Evidently AI** and
**Prometheus exporters** for production monitoring. Maintain comprehensive
audit logs for every training round to ensure compliance and traceability.

### Operational service-level indicators (SLIs)

Reliable FL deployments track **three core SLIs** — coordinator availability,
client-participation rate, and per-round latency — because each has a proven
impact on convergence and user experience:

| SLI | Why it matters | How to measure |
|-----|----------------|---------------|
| **Coordinator availability** | A single coordinator outage halts every training round; Google’s SRE handbook recommends continuous success-probes to detect silent failures [1]. | Expose an HTTP / gRPC health probe every 30 s and log the ratio _successful / total_ probes as an availability time-series. |
| **Client-participation rate** | Model quality degrades sharply when too few clients report; large-scale studies see ≥ 8 pp accuracy loss at ≈ 10 % participation [2][3]. | Export `fl_clients_participation_ratio = n_active / n_selected` each round. Flower and NVFLARE expose this metric via Prometheus [4][5]. |
| **Per-round latency (p95)** | Latency spikes are early warnings of network congestion or stragglers; the _Site Reliability Workbook_ advises alerting when p95 exceeds the agreed SLO budget [6]. | Track `fl_round_duration_seconds` as a histogram and fire an alert when p95 breaches the budget for three consecutive windows. |

> _Implementation tip_ – Prometheus dashboards shipped with **Flower ≥ 1.8**
> and **NVFLARE 2.x** already publish `server_uptime_seconds`,
> `client_participation_ratio`, and `round_duration_seconds`, so all three SLIs
> can be monitored without additional coding
> [4][5].

### Frameworks and language support

The open‑source **Flower** framework [7] and several other
frameworks implement FL, each with different programming languages, maturity
levels and security features:

* **[Flower](https://flower.ai){:.tool}** – Python (PyTorch/TensorFlow). Secure
  aggregation via `secagg_mod`/`secaggplus_mod` on the client and
  `SecAgg{,+}Workflow` on the server (≥ v1.8); launch with `flwr run --mods
  secaggplus_mod` (≥ Flower 1.8) [8].
  _Lightweight alternative_: **LightSecAgg** protocol offers dropout‑resilient
  secure aggregation for asynchronous FL; still research‑grade and not yet
  merged in Flower core. See the official secure‑aggregation notebook
  [9] for a minimal working example.
* **[FATE](https://github.com/FederatedAI/FATE){:.tool}** – production‑ready, Java/Python,
  homomorphic encryption [10].
* **[NVIDIA FLARE](https://developer.nvidia.com/flare){:.tool}** – SDK with
  FedAvg/FedOpt/FedProx [11].
* **[Substra](https://github.com/substra){:.tool}** – Python API + web UI for
  clinical FL at scale [12].
* **[Yjs](https://yjs.dev){:.tool}** – high‑performance CRDT engine for
  real‑time collaboration; **not** an ML library and provides no privacy
  guarantees out‑of‑the‑box (secure only if deployed in a TRE with TLS/OIDC)
  [13].
  When Yjs transports are wrapped in TLS/OIDC they can meet the same
  confidentiality baseline, but offer no built‑in aggregation privacy.

#### Community and maintenance

* **Flower Slack** – real‑time Q&A and roadmap discussions
  [14].
* **FATE mailing list** – announcements and technical support
  [15]  [16].
* **ELIXIR Federated‑Human‑Data Slack** – cross‑node help channel
  [17].

When choosing a framework, consider compatibility with your existing code,
support for secure aggregation and the maturity of the community.

### Licensing and persistent identifiers

* **Model licensing**: Use SPDX identifiers (e.g., `Apache-2.0`, `CC-BY-4.0`)
  in model metadata to clarify reuse terms.
* **Data citations**: Assign DataCite DOIs to federated datasets and model
  versions for persistent reference.
* **Code repositories**: License FL workflows under permissive licenses
  (MIT, Apache-2.0) to encourage adoption.
* **RO-Crate packaging**: Include `LICENSE` file and SPDX metadata in every
  crate to ensure legal clarity.

### Implementation recommendations

* Use **Flower** (≥1.8) with TLS encryption and SecAgg+ for horizontal
  federated learning experiments.
* For regulated environments, deploy **FATE** with homomorphic encryption
  to train logistic regression or tree‑based models.
* Configure **FLARE** or **Substra** to run simulations and validate
  workflows locally before deploying to production.
* Enforce open standards: package every federated run as a RO‑Crate using
  `runcrate` and publish results via Zenodo.
* Apply **Five Safes** governance — de‑identify data, approve projects,
  train authorised personnel, use secure settings and vet outputs.
* Monitor training with drift detection and audit logging, and apply
  differential privacy when sharing aggregated models.

### Data management planning

Use the **ELIXIR-CONVERGE DMP wizard** for federated studies, which includes
specific questions about:

* Data distribution and access controls
* Federated infrastructure requirements  
* Cross-border data governance
* Model versioning and provenance

Example (excerpt) from the wizard `dmp.json`:

```json
{
  "federated_storage_location": "TRE‑Portuguese Node",
  "model_doi": "10.5281/zenodo.9999999",
  "retention_policy_days": 90,
  "secure_aggregation": true
}
```

Access the wizard at: [ELIXIR-CONVERGE DMP wizard](https://dmponline.elixir-europe.org/)
[18].

### FAIR, metadata and provenance

* Capture dataset‑level metadata with **RO‑Crate 1.3** or
  Five‑Safes RO‑Crate.
* Document trained models with **Model Cards** to record intended use,
  limitations and demographic performance
 . Example YAML snippet:

  ```yaml
  model_details:
    name: "Federated MNIST Classifier"
    version: "1.0"
    training_algorithm: "FedAvg"
    rounds: 100
    participants: 5
  intended_use:
    primary_use: "Handwritten digit classification"
    out_of_scope: "Medical imaging, document analysis"
  performance:
    metric: "accuracy"
    global_model: 0.98
    fairness_assessment: "Evaluated across demographic groups"
  ```

* Register container digests and environment lock files (e.g. `conda‑lock`)
  inside the crate for full environment capture.
* Where phenotypic data is exchanged, encode samples with **GA4GH Phenopackets**
  to ensure semantic interoperability across nodes.

#### RO‑Crate example

The Workflow‑Run RO‑Crate profile [19] formalises
metadata capture for computational workflows. A minimal `ro-crate-metadata.json`
for a federated training run:

```json
{
  "@context": ["https://w3id.org/ro/crate/1.1/context"],
  "@graph": [
    {
      "@id": "ro-crate-metadata.json",
      "@type": "CreativeWork"
    },
    {
      "@id": "./",
      "@type": "WorkflowRunCrate",
      "name": "Federated training run",
      "hasPart": [
        { "@id": "model.pkl" },
        { "@id": "metrics.json" }
      ]
    },
    {
      "@id": "model.pkl",
      "@type": "File"
    },
    {
      "@id": "metrics.json",
      "@type": "File"
    }
  ]
}
```

Full implementation available in the **[Five Safes RO‑Crate record](https://zenodo.org/records/10376350)**.

### Reproducibility checklist

#### DOME-ML framework for FL reproducibility

Follow the DOME‑ML recommendations [20] for reproducible
machine learning validation:

✓ **Data**

* Version control data schemas with semantic versioning
* Document data splits and partitioning strategies  
* Track preprocessing pipelines with [DVC user guide](https://dvc.org/doc/user-guide)
  [21].

✓ **Optimisation**

* Log hyperparameters in Model Cards
* Version FL algorithms and aggregation methods
* Document convergence criteria

✓ **Model**

* Store model checkpoints with DataCite DOIs
* Package models with environment lock files (conda-lock)
* Version model architectures in Git

✓ **Evaluation**

* Document evaluation metrics and protocols
* Version test datasets separately
* Track performance across federation rounds

#### Retention, deletion and machine unlearning

**Immediate actions:**

* Implement data retention policies per node (e.g., ninety-day rolling windows)
* Deploy automated deletion scripts with audit trails
* Document GDPR Art. 17 compliance procedures

**Emerging techniques:**

* **SISA training**: Train on data shards for easier unlearning
* **Differential privacy**: Natural forgetting through noise addition
* **Certified removal**: Mathematical guarantees of data influence removal
  [22]

For a comprehensive survey on certified removal [23],
see: [Machine unlearning survey (Nature 2024)](https://www.nature.com/articles/s41598-024-51381-4).

### Disaster recovery and business continuity

Follow **DOME-ML reproducibility protocols** for systematic checkpoint
management and backup strategies across distributed sites. Document all
recovery procedures and test failover scenarios regularly.

The EDPS commentary emphasizes that data subjects retain erasure rights even
in federated settings, requiring coordinated deletion mechanisms across all
participating nodes.

### Bias mitigation and fairness

Use group‑fairness metrics (demographic parity, equal opportunity) to audit both
global and per‑site models.
Mitigation strategies include re‑weighting, constrained optimisation and
fairness‑aware FedAvg variants. Follow **DOME-ML fairness evaluation**
guidelines for systematic bias assessment across federated model performance.

### Cost optimisation

* **Budget VM/GPU hours** – estimate computational costs across federated sites
  using cloud pricing calculators and monitor actual usage via resource
  monitoring dashboards.
* **Track energy and carbon (kWh and g CO₂‑eq) via CodeCarbon and similar tools**
