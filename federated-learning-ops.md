---
title: Federated learning — operational practices
layout: your_tasks
parent: federated_learning
page_id: federated_learning_ops
summary: MLOps, monitoring, reproducibility and operational best practices for federated learning systems.
status: draft
has_children: false
related_pages:
  your_tasks:
    - mlops
tags: [mlops, monitoring, reproducibility]
tool: false
---

### Monitoring and MLOps

Good operational practices are vital for reliable federated systems.
Maintain audit logs at both the coordinator and client sides to record
training events, authentication attempts and errors.

Use **drift detection** to monitor whether local distributions diverge from
global assumptions; integrate this into CI to run unit tests and simulated
federated runs. When possible, visualise round-level metrics (loss/accuracy)
without revealing per-site performance (aggregate only). For production,
implement **data-/concept-drift** alarms with tools such as Evidently and scrape
system/application metrics via **Prometheus** exporters.

### Operational service-level indicators (SLIs)

Reliable FL deployments track **three core SLIs** — coordinator availability,
client-participation rate, and per-round latency — because each has a proven
impact on convergence and user experience:

| SLI | Why it matters | How to measure |
|-----|----------------|---------------|
| **Coordinator availability** | A single coordinator outage halts every training round; Google’s SRE handbook recommends continuous success-probes to detect silent failures [1]. | Expose periodic HTTP/gRPC health probes and alert on SLO burn rate rather than single failures. |
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

Use the **Data Stewardship Wizard (DSW)**, the ELIXIR-CONVERGE–supported DMP wizard
to create a machine-actionable DMP for federated studies. Select an ELIXIR/CONVERGE
knowledge model, answer the guided questions, and export the plan (JSON/PDF) for
inclusion in your project records and RO-Crate. DSW complements funder templates
and can be used alongside institutional tools such as DMPonline.

Specific questions to cover include:

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

Access the wizard at: Data Stewardship Wizard [DSW](https://ds-wizard.org/),
or use your institution’s DMPonline service — https://dmponline.dcc.ac.uk/.
See also the RDMKit guidance on DMPs [18].

### FAIR, metadata and provenance

* Capture dataset‑level metadata with **RO‑Crate 1.2** or
  Five‑Safes RO‑Crate.
* Document trained models with **Model Cards** to record intended use,
  limitations and demographic performance.

Example YAML snippet:

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

The Workflow-Run RO-Crate (Process Run Crate) profile [?]
formalises provenance for executions.
metadata capture for computational workflows. A minimal `ro-crate-metadata.json`
for a federated training run is:

```json
{
  "@context": [
    "https://w3id.org/ro/crate/1.1/context",
    "https://w3id.org/ro/terms/workflow-run/context"
  ],
  "@graph": [
    {
      "@id": "ro-crate-metadata.json",
      "@type": "CreativeWork",
      "conformsTo": { "@id": "https://w3id.org/ro/crate/1.1" },
      "about": { "@id": "./" }
    },
    {
      "@id": "./",
      "@type": "Dataset",
      "name": "Federated training run",
      "conformsTo": { "@id": "https://w3id.org/ro/wfrun/process/0.5" },
      "hasPart": [
        { "@id": "model.pkl" },
        { "@id": "metrics.json" }
      ],
      "mentions": { "@id": "#Training_1" }
    },
    {
      "@id": "https://flower.ai/",
      "@type": "SoftwareApplication",
      "name": "Flower"
    },
    {
      "@id": "#Training_1",
      "@type": "CreateAction",
      "name": "Federated training",
      "instrument": { "@id": "https://flower.ai/" },
      "result": { "@id": "model.pkl" }
    },
    { "@id": "model.pkl", "@type": "File" },
    { "@id": "metrics.json", "@type": "File" }
  ]
}
```

If your run was orchestrated by a workflow engine (e.g., CWL/Galaxy), use the
Workflow-Run Crate profile (change the conformsTo URI accordingly)
[?].
Full implementations for secure TRE contexts are available in the Five Safes
RO-Crate record (Zenodo) [19].

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

For a comprehensive survey on certified removal [23].

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

## Bibliography

1. Beyer, Betsy, Jones, Chris, Petoff, Jennifer, Murphy, Niall Richard (2016). *Site reliability engineering: how Google runs production systems*. O'Reilly Media, Inc.. Available at: [https://sre.google/sre-book/](https://sre.google/sre-book/)

2. Bonawitz, Keith, Eichner, Hubert, Grieskamp, Wolfgang, Huba, Dzmitry, Ingerman, Alex, Ivanov, Vladimir, Kiddon, Chloé, Konečný, Jakub, Mazzocchi, Stefano, McMahan, Brendan, Van Overveldt, Timon, Petrou, David, Ramage, Daniel, Roselander, Jason (2019). Towards Federated Learning at Scale: System Design. In *Proceedings of Machine Learning and Systems*, pp. 374-388. Available at: [https://proceedings.mlsys.org/paper/2019/file/bd686fd640be98efaae0091fa301e613-Paper.pdf](https://proceedings.mlsys.org/paper/2019/file/bd686fd640be98efaae0091fa301e613-Paper.pdf)

3. Lai, Fan, Dai, Yinwei, Zhu, Xiangfeng, Madhyastha, Harsha V., Chowdhury, Mosharaf (2021). FedScale: Benchmarking Model and System Performance of Federated Learning. In *Proceedings of the First Workshop on Systems Challenges in Reliable and Secure Federated Learning*, pp. 1–3. Association for Computing Machinery. DOI: [10.1145/3477114.3488760](https://doi.org/10.1145/3477114.3488760)

4. Flower Labs (2023). *Monitoring Simulation in Flower*. https://flower.ai/blog/2023-02-06-monitoring-simulation-in-flower.

5. NVIDIA (2024). *System Monitoring — NVFLARE User Guide*. https://nvflare.readthedocs.io/en/2.6/user_guide/monitoring.html.

6. Beyer, Betsy, Murphy, Niall Richard, Rensin, David K, Kawahara, Kent, Thorne, Stephen (2018). *The site reliability workbook: practical ways to implement SRE*. O'Reilly Media, Inc.. Available at: [https://sre.google/workbook/alerting-on-slos/](https://sre.google/workbook/alerting-on-slos/)

7. Beutel, Daniel J., Topal, Taner, Mathur, Akhil, Qiu, Xinchi, Fernandez-Marques, Javier, Gao, Yan, Sani, Lorenzo, Li, Kwing Hei, Parcollet, Titouan, de Gusm\~ao, Pedro P. B., Lane, Nicholas D. (2022). Flower: A Friendly Federated Learning Research Framework. *arXiv preprint arXiv:2007.14390*. Available at: [https://arxiv.org/abs/2007.14390](https://arxiv.org/abs/2007.14390)

8. Flower Labs (2025). *Secure Aggregation Protocols*. https://flower.ai/docs/framework/contributor-ref-secure-aggregation-protocols.html.

9. Flower Labs (2025). *Secure aggregation with Flower (the SecAgg+ protocol)*. https://flower.ai/docs/examples/flower-secure-aggregation.html.

10. Federated AI Technology Enabler (2024). *FATE documentation*. https://fate.readthedocs.io/en/develop/.

11. NVIDIA Corporation (2025). *NVIDIA FLARE: Federated Learning Application Runtime Environment*. https://github.com/NVIDIA/NVFlare.

12. Owkin, Linux Foundation AI (2025). *Substra: open-source federated learning software*. https://github.com/substra.

13. Jahns, Kevin (2024). *Yjs: Shared data types for building collaborative software*. https://github.com/yjs/yjs.

14. Flower Labs (2025). *Flower Community Slack Server*. https://friendly-flower.slack.com/.

15. FATE Project (2025). *FATE User Mailing List*. https://lists.lfaidata.foundation/g/Fate-FedAI.

16. Federated AI Technology Enabler (FATE) (2025). *FATE-Community GitHub organisation*. https://github.com/FederatedAI/FATE-Community.

17. ELIXIR Europe (2025). *ELIXIR Federated Human Data Community*. https://elixir-europe.org/communities/human-data.

18. ELIXIR Europe (2025). *Data Management Plan (RDMKit task page)*. https://rdmkit.elixir-europe.org/data_management_plan.

19. Soiland-Reyes, Stian, Wheater, Stuart (2023). *Five Safes RO-Crate profile*. https://trefx.uk/5s-crate/0.4/. DOI: [10.5281/zenodo.10376350](https://doi.org/10.5281/zenodo.10376350)

20. Walsh, Christopher J., Ross, Kenneth N., Mills, James G., et al. (2021). DOME: recommendations for supervised machine learning validation in biology. *Nature Methods*, 18, 1122--1127. DOI: [10.1038/s41592-021-01205-4](https://doi.org/10.1038/s41592-021-01205-4)

21. Iterative, Inc. (2025). *Data Version Control User Guide (v3.1)*. Available at: [https://dvc.org/doc/user-guide](https://dvc.org/doc/user-guide)

22. Metz, Cade (2023). *Now That Machines Can Learn, Can They Unlearn?*. https://www.wired.com/story/machines-can-learn-can-they-unlearn/.

23. Bonawitz, Keith, Eichner, Hubert, Grieskamp, Wolfgang, Huba, Dzmitry, Ingerman, Alex, Ivanov, Vladimir, Kiddon, Chloé, Konecný, Jakub, Mazzocchi, Stefano, McMahan, Brendan, Van Overveldt, Timon, Petrou, David, Ramage, Daniel, Roselander, Jason (2019). Towards Federated Learning at Scale: System Design. In *Proceedings of Machine Learning and Systems*, pp. 374--388. DOI: [10.1109/SP40001.2021.00019](https://doi.org/10.1109/SP40001.2021.00019)

