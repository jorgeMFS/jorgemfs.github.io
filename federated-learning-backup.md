---
title: Federated Learning
layout: page
permalink: /federated-learning/
description: A comprehensive guide to federated learning principles, security layers, governance frameworks, and best practices for privacy-preserving machine learning. Covers key FL frameworks and tools, FAIR metadata, reproducibility, legal compliance, bias mitigation, and threat modelling for implementing federated learning in practice.
contributors:
  - name: "Jorge Miguel Silva"
    orcid: "0000-0002-6331-6091"
    affiliation: "IEETA, Universidade de Aveiro"
  - name: "Ana Teresa Freitas"
    orcid: "0000-0002-2997-5990"
    affiliation: "INESC‑ID, Instituto Superior Técnico"
---

## Motivation

### Who should read this page?

This page is intended for **researchers, data scientists, and IT professionals**
who need to analyse sensitive data distributed across multiple institutions
without centralising it. This includes those working with health data, genomic
information, financial records, or any other privacy‑sensitive datasets where
regulatory constraints prevent data sharing.

### Background

Federated learning (FL) is a paradigm for building statistical models without
centralising sensitive data.  Instead of shipping records to a single
repository, the learning algorithm is dispatched to each participating
site and only aggregated model updates are exchanged.  This
decentralised approach preserves data sovereignty and allows hospitals,
biobanks and other organisations to collaborate on joint models while keeping
raw data local.  FL was first deployed at Google for on‑device keyboard
prediction, where simulations involved ≈ 1.5 million phones
[1]; in health‑care case‑studies cohort sizes
typically range from five to ≈ three hundred sites, depending
on governance constraints. However, open challenges such as communication
cost and fairness remain active research topics [2].

## Why is this important?

Traditional centralised training often conflicts with privacy legislation
because it requires data to leave its origin.  FL overcomes this
constraint by bringing computation to the data and exchanging only
summary statistics.  As a result, researchers can pool statistical power
across sites while complying with the EU General Data Protection Regulation
(GDPR) and ethical frameworks such as the
[Five Safes](https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/)
.

## Data

### Partitioning strategies

Data may be partitioned across organisations in different ways, and the
partitioning influences algorithm choice and security requirements.  In a
horizontal (sample‑wise) scenario, each site holds the same features but
different cohorts; for example, multiple hospitals may collect identical
clinical measurements for different patients.  Vertical (feature‑wise)
partitioning occurs when participating organisations share individuals but
collect different variables, such as genetic data at one site and
clinical data at another.  Understanding how the data is split helps
select appropriate federated algorithms and security mechanisms.

#### Horizontal vs. vertical algorithm families

Beyond FedAvg, vertical federations can use **SplitNN** [3] or
**PyVertical** [4] to train deep models where each party holds
disjoint features, and statistical alternatives such as **FedSVD**
[5] offers a federated singular‑value‑decomposition
(SVD) algorithm that has already been applied to genome‑wide association studies
(GWAS) and other high‑dimensional omics analyses.

### Data harmonisation

Differences in data collection protocols can cause site‑to‑site
variability.  Before launching a federated study, establish a
common data model or phenotype dictionary to align variable names and
units.  Perform quality control to detect outliers, missing values and
batch effects, and apply common pre‑processing pipelines (such as
  normalisation or imaging correction) across sites.  Tools such as
  [runcrate](https://github.com/ResearchObject/runcrate){:.tool}
  [6], a command‑line utility for manipulating Workflow Run
  RO‑Crate packages, can be used to package metadata and ensure provenance.

The **OMOP Common Data Model (CDM)** [7] is widely adopted for
observational health data and maps well onto federated SQL back‑ends.

### Interoperability and harmonisation

**OMOP CDM** serves as the default table schema for observational data networks,
enabling standardised queries across federated sites. Implementation follows
a systematic approach: (1) **Extract** source data into staging tables,
(2) **Transform** using OHDSI tools to map local vocabularies to standard
concepts, and (3) **Validate** completeness and quality via data quality
dashboard. See the
[OHDSI collaborative protocol](https://www.ohdsi.org/data-standardization/)
for implementation guidance and general OHDSI CDM resources
[8].

For phenotypic data exchange, **GA4GH Phenopackets**
provide structured JSON representation:
`{"subject": {"id": "patient1"},
"phenotypicFeatures": []}`. Refer to the
[GA4GH Phenopackets specification](https://www.ga4gh.org/product/phenopackets/)
for complete schema definitions and validation rules.

To let external analysts **discover** which federated shards exist, expose a read‑only
endpoint using **Beacon v2** (yes/no genomic presence queries)
[9]
or the **GA4GH Search/Data‑Connect** API for richer tabular filters
[10].

### FAIR principles mapping for federated learning

| FAIR Principle | Implementation in FL | Example |
|----------------|---------------------|---------|
| **Findable** | Assign persistent identifiers (PIDs) to models and datasets | DataCite DOIs for FL model versions |
| **Accessible** | Use standardised protocols for model access | HTTPS APIs with OIDC authentication |
| **Interoperable** | Apply common data models and vocabularies | OMOP CDM for clinical data, GA4GH Phenopackets |
| **Reusable** | Package with rich metadata and clear licenses | RO‑Crate with Model Cards, CC‑BY/Apache‑2.0 |

### Security stack

Federated learning relies on a layered security stack.  At the network
level, use Transport Layer Security (TLS) or Virtual Private Networks
(VPNs) to encrypt communications between the coordinator and clients.

Authentication and authorisation can be handled via OpenID Connect
(OIDC) and token‑based access control. Issue GA4GH Passport 'Visa' tokens
for mutual OIDC authorisation [11].

Aggregated model updates should be computed using secure aggregation
protocols, such as
SecAgg or SecAgg+, where each client encrypts its updates and the
server only decrypts the sum.  Differential privacy and
noise addition further reduce the risk of re‑identification, and a
threat model should guide the choice of protections.

> **Research note**  LightSecAgg reduces bandwidth and copes with client
> drop‑outs, enabling asynchronous FL; LightSecAgg now has a reference
> implementation [12], but it is not yet merged into
> Flower core and still requires manual integration.

The original LightSecAgg design [13] details bandwidth
savings compared to traditional secure aggregation protocols.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/img/federated_learning/fl_topology.png" 
       alt="Diagram of a star‑topology FL system with one aggregator and N client nodes"
       style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 10px; background: white;">
  <p style="font-style: italic; color: #666; margin-top: 10px;">
    Figure 1. Federated learning topology showing a central coordinator and distributed clients
  </p>
</div>

## Solution

### Governance using the Five Safes

The UK Data Service description of the Five Safes
[14] provides a structured approach to ethical and
secure data use. Its components can be mapped to federated workflows:

* **Safe data** – De‑identify and harmonise data so that each site
  satisfies minimum quality and confidentiality standards.
  Use
  common phenotype dictionaries and perform quality control before
  including data in a federated study.
* **Safe projects** – Approve analyses only if they offer public benefit
  and respect data sensitivity.  Ethical approvals and data‑sharing
  agreements should be in place for every federated run.
* **Safe contracts** – Establish data‑sharing agreements with minimum clauses
  covering purpose limitation, data retention periods, and breach notification
  protocols. Consult the EDPS TechDispatch on FL for regulatory context
  and legal framework requirements.
* **Safe people** – Ensure that participating researchers are authorised
  and trained.  Users should authenticate via OIDC and sign terms that
  outline acceptable use.
* **Safe settings** – Execute computations in secure environments.
  EUCAIM's federated processing platform orchestrates tasks through
  middleware so that data remain within secure nodes.
* **Safe outputs** – Export only aggregated model parameters or summary
  statistics.  Outputs should be screened to ensure that no individual
  contributions can be reconstructed.

_Log provenance:_ each Beacon or Search query is captured as a
`DataDownload` entity inside the Five‑Safes RO‑Crate so auditors can trace
who accessed which variant count [9]

A full JSON profile and example crates are available
[15].

### Legal and ethical compliance

* Consult the EDPS TechDispatch on Federated Learning [16] for
  a regulators' view.
* **Data‑protection‑impact assessment (DPIA)** – run a DPIA before production.
  Free templates are provided by the ICO DPIA template [17]
  and CNIL PIA kit [18].

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
audit logs for every training round to ensure compliance and traceability
.

### Operational service-level indicators (SLIs)

Reliable FL deployments track **three core SLIs** — coordinator availability,
client-participation rate, and per-round latency — because each has a proven
impact on convergence and user experience:

| SLI | Why it matters | How to measure |
|-----|----------------|---------------|
| **Coordinator availability** | A single coordinator outage halts every training round; Google’s SRE handbook recommends continuous success-probes to detect silent failures. [19] | Expose an HTTP / gRPC health probe every 30 s and log the ratio _successful / total_ probes as an availability time-series. |
| **Client-participation rate** | Model quality degrades sharply when too few clients report; large-scale studies see ≥ 8 pp accuracy loss at ≈ 10 % participation. [20][21] | Export `fl_clients_participation_ratio = n_active / n_selected` each round. Flower and NVFLARE expose this metric via Prometheus. [22][23] |
| **Per-round latency (p95)** | Latency spikes are early warnings of network congestion or stragglers; the _Site Reliability Workbook_ advises alerting when p95 exceeds the agreed SLO budget. [24] | Track `fl_round_duration_seconds` as a histogram and fire an alert when p95 breaches the budget for three consecutive windows. |

> _Implementation tip_ – Prometheus dashboards shipped with **Flower ≥ 1.8**
> and **NVFLARE 2.x** already publish `server_uptime_seconds`,
> `client_participation_ratio`, and `round_duration_seconds`, so all three SLIs
> can be monitored without additional coding.
> [22][23]

### Frameworks and language support

The open‑source **Flower** framework [25] and several other
frameworks implement FL, each with different programming languages, maturity
levels and security features:

* **[Flower](https://flower.ai){:.tool}** – Python (PyTorch/TensorFlow). Secure
  aggregation via `secagg_mod`/`secaggplus_mod` on the client and
  `SecAgg{,+}Workflow` on the server (≥ v1.8); launch with `flwr run --mods
  secaggplus_mod` (≥ Flower 1.8) [26].
  _Lightweight alternative_: **LightSecAgg** protocol offers dropout‑resilient
  secure aggregation for asynchronous FL; still research‑grade and not yet
  merged in Flower core. See the official secure‑aggregation notebook
  [27] for a minimal working example.
* **[FATE](https://fate.fedai.org){:.tool}** – production‑ready, Java/Python,
  homomorphic encryption [28].
* **[NVIDIA FLARE](https://developer.nvidia.com/flare){:.tool}** – SDK with
  FedAvg/FedOpt/FedProx [29].
* **[Substra](https://github.com/substra){:.tool}** – Python API + web UI for
  clinical FL at scale [30].
* **[Yjs](https://yjs.dev){:.tool}** – high‑performance CRDT engine for
  real‑time collaboration; **not** an ML library and provides no privacy
  guarantees out‑of‑the‑box (secure only if deployed in a TRE with TLS/OIDC)
  [31].
  When Yjs transports are wrapped in TLS/OIDC they can meet the same
  confidentiality baseline, but offer no built‑in aggregation privacy.

#### Community and maintenance

* **Flower Discord** – real‑time Q&A and roadmap discussions
  [32]  
* **FATE mailing list** – announcements and technical support
  [33]  [34]
* **ELIXIR Federated‑Human‑Data Slack** – cross‑node help channel
  [35]

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
  "federated_storage_location": "TRE‑Aveiro node 🇵🇹",
  "model_doi": "10.5281/zenodo.9999999",
  "retention_policy_days": 90,
  "secure_aggregation": true
}
```

Access the wizard at: [ELIXIR-CONVERGE DMP wizard](https://dmponline.elixir-europe.org/)
[36]

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

The Workflow‑Run RO‑Crate profile [37] formalises
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

Follow the DOME‑ML recommendations [38] for reproducible
machine learning validation:

✓ **Data**

* Version control data schemas with semantic versioning
* Document data splits and partitioning strategies  
* Track preprocessing pipelines with [DVC user guide](https://dvc.org/doc/user-guide)
  [39]

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
  [40]
  
For a comprehensive survey on certified removal [41],
see: [Machine unlearning survey (Nature 2024)](https://www.nature.com/articles/s41598-024-51381-4)

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

### Threat modelling and risk assessment

Apply the **LINDDUN** privacy‑engineering framework to elicit privacy threats,
then map the resulting findings to Microsoft’s **STRIDE** model to ensure
security coverage.

#### Practical recipe (LINDDUN GO ＋ STRIDE)

1. **Map data flows** – draw a DFD that captures FL clients, coordinator,
   and artefacts exchanged (model updates, metrics, credentials).  
2. **Identify threats** – walk through each DFD element with the seven LINDDUN
   categories (Linkability, Identifiability, … Unawareness, Non‑compliance)
   and the six STRIDE classes (Spoofing, Tampering, … Elevation‑of‑privilege).  
3. **Assess impact** – score every threat (Low / Medium / High) for likelihood
   and impact.  
4. **Select mitigations** – link each threat to technical or organisational
   controls and record residual risk.

| Threat category | LINDDUN focus | STRIDE focus | Example mitigation in FL |
|-----------------|---------------|--------------|--------------------------|
| **Linking** | Re‑identification via update correlation | — | Add Gaussian DP noise to model updates |
| **Identifying** | Direct identifiers in logs | — | Remove user IDs before logging |
| **Non‑repudiation** | Verifiable update provenance | — | Retain only aggregate logs |
| **Detecting** | Participation inference | — | Add dummy (zero) client updates |
| **Unawareness** | Missing consent | — | Deploy dynamic consent portal |
| **Non‑compliance** | GDPR Article 35 DPIA | — | Embed privacy‑by‑design checkpoints |
| **Spoofing** | — | Identity fraud | Mutual TLS ＋ OIDC |
| **Tampering** | — | Model poisoning | Byzantine‑robust aggregation |
| **Information disclosure** | — | Data leakage | Secure aggregation (e.g. SecAgg+, LightSecAgg) |
| **Denial of service** | — | Resource exhaustion | Rate‑limit slow / malicious clients |
| **Elevation of privilege** | — | Unauthorised API use | RBAC and short‑lived tokens |

See the **LINDDUN tutorial** and the companion **worksheet pack** for
step‑by‑step templates. [42]

Resources:

* [LINDDUN Tutorial PDF](https://linddun.org/downloads/LINDDUN-Tutorial.pdf)
* [Online privacy‑threat](https://linddun.org/threats/)

### Environmental sustainability

#### Carbon footprint monitoring

**Measurement tools:**

* **[CodeCarbon](https://codecarbon.io/)**: Python package for tracking CO₂ emissions

  ```python
  from codecarbon import EmissionsTracker
  tracker = EmissionsTracker()
  tracker.start()
  # Run FL training
  emissions = tracker.stop()
  ```
  
  [43]

* **[ML CO2 Impact](https://mlco2.github.io/impact/)**: Online calculator for ML
  carbon footprint
* **[Green Algorithms](http://www.green-algorithms.org/)**: Computational
  footprint calculator

**Optimisation strategies:**

* Schedule training during low-carbon energy periods
* Use model compression techniques (pruning, quantization)
* Implement early stopping based on carbon budget
* Prefer edge devices over cloud GPUs when possible
* Adaptive client‑selection (EcoLearn) cuts CO₂ by up to ten × without
  accuracy loss [44]

See: [EcoFL framework (arXiv 2023)](https://arxiv.org/pdf/2310.17972)

### Cost optimisation

* **Budget VM/GPU hours** – estimate computational costs across federated sites
  using cloud pricing calculators and monitor actual usage via resource
  monitoring dashboards.
* **Track energy and carbon (kWh and g CO₂‑eq) via CodeCarbon and similar tools**
* **Resource optimisation** – use Flower simulation guides
  [45] with resource flags to test different
  configurations before production deployment.

## Resources

The following supporting tools and services complement FL frameworks:

| Tool | Purpose | Security features | License |
| ------ | --------- | ------------------ | --------- |
| [runcrate](https://github.com/ResearchObject/runcrate) | Command‑line toolkit for creating and manipulating Workflow Run RO‑Crate packages, useful for packaging federated training runs and preserving provenance | — | Apache‑2.0 |
| [EUCAIM federated processing API](https://eucaim.gitbook.io/architecture-of-eucaim/4.-detailed-architecture) | RESTful interface that orchestrates federated computation across secure nodes within the EUCAIM platform | Kubernetes isolation, secure nodes | [Apache‑2.0 (core services)](https://github.com/EUCAIM) |
| [Evidently AI](https://www.evidentlyai.com) | Open‑source ML monitoring framework for drift detection, bias dashboards and model performance tracking in production FL deployments | — | Apache‑2.0 |

## Training

RDMKit automatically displays relevant training materials from ELIXIR TeSS
above. The following resources provide hands-on tutorials for specific FL
frameworks:

* **[Flower quickstart tutorial](https://flower.ai/docs/framework/tutorial-quickstart-pytorch.html)**
  – demonstrates how to define client and server code, launch a
  federation and run training rounds using PyTorch.  It includes
  guidance on simulation and deployment and introduces secure
  aggregation options.
* **[Flower secure aggregation example](https://flower.ai/docs/examples/flower-secure-aggregation.html)**
  – shows how to implement the SecAgg+ protocol for privacy‑preserving
  federated learning.
* **[FATE quick‑start tutorial](https://fate.fedai.org/quick_start/)**
  – guides you through setting up FATE and running a first horizontal
  federated training job.
* **[Workflow Run RO‑Crate: Process Run Crate profile](https://www.researchobject.org/workflow-run-crate/profiles/process_run_crate/)**
  – outlines how to package federated workflow runs using the RO‑Crate
  standard for provenance capture.

### Real‑world examples

* **[Flower MNIST with differential privacy + secure aggregation](https://flower.ai/docs/examples/fl-dp-sa.html)**
  – step‑by‑step notebook showing central DP combined with Flower SecAgg+
  on the MNIST dataset.
* **[EUCAIM federated GWAS showcase](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850660/)**
  – describes how EUCAIM's cancer‑imaging platform orchestrates a
  cross‑site GWAS on imaging‑derived features while keeping primary data
  inside hospital nodes (see "Federated analytics" section). The EUCAIM
  cancer‑imaging infrastructure adopts a hybrid centralised‑federated
  architecture to train AI tools on sensitive imaging data; its current public
  prototype uses synchronous FedAvg; asynchronous and adaptive strategies are
  under internal evaluation. EUCAIM pilot now evaluates FedOpt for sparse
  updates [46].
* **["Hello World" Galaxy workflow RO‑Crate](https://about.workflowhub.eu/Workflow-RO-Crate/example/ro-crate-preview.html)**
  – a minimal Galaxy workflow packaged as a RO‑Crate, illustrating how
  provenance can be captured and shared.
* **[OHDSI federated network](https://www.iqvia.com/solutions/real-world-evidence/ohdsi)**
  – more than 500 million patient records mapped to OMOP CDM across >30
  countries, enabling federated analytics while maintaining data sovereignty.

## Related pages

[Data security](https://rdmkit.elixir-europe.org/data_security)

[Data sensitivity](https://rdmkit.elixir-europe.org/data_sensitivity)

[Data provenance](https://rdmkit.elixir-europe.org/data_provenance)

[Data quality](https://rdmkit.elixir-europe.org/data_quality)

[GDPR compliance](https://rdmkit.elixir-europe.org/gdpr_compliance)

## References

1. (2018). Federated Learning for Mobile Keyboard Prediction. *arXiv preprint arXiv:1811.03604*. Available at: [https://arxiv.org/abs/1811.03604](https://arxiv.org/abs/1811.03604)

2. LINDDUN Project Team (2023). LINDDUN GO – Worksheet Pack (v1.1). *IEEE Signal Processing Magazine*, 37, 50-60. DOI: [10.1109/MSP.2020.2975749](https://doi.org/10.1109/MSP.2020.2975749)

3. Gupta, Otkrist, Raskar, Ramesh (2018). Distributed learning of deep neural network over multiple agents. *Journal of Network and Computer Applications*, 116, 1-8. DOI: [10.1016/j.jnca.2018.05.003](https://doi.org/10.1016/j.jnca.2018.05.003)

4. OpenMined Community (2020). *PyVertical – Vertical Federated Learning in PyTorch*. https://github.com/OpenMined/PyVertical.

5. Hartebrodt, Anne, Röttger, Richard, Blumenthal, David B (2024). Federated singular value decomposition for high-dimensional data. *Data Mining and Knowledge Discovery*, 38, 938--975. DOI: [10.1007/s10618-023-00983-z](https://doi.org/10.1007/s10618-023-00983-z)

6. ResearchObject.org (2023). *runcrate CLI*. https://github.com/ResearchObject/runcrate.

7. Johns Hopkins Medicine (2024). *OMOP on PMAP – Standardising patient information for global research*. https://pm.jh.edu/discover-data-stream/epic-emr-clinical-data/omop-on-pmap/.

8. Observational Health Data Sciences, Informatics (2024). *Standardized Data: The OMOP Common Data Model*. https://www.ohdsi.org/data-standardization/.

9. Global Alliance for Genomics, Health (2024). *Beacon v2 Specification*. https://docs.genomebeacons.org/.

10. Global Alliance for Genomics, Health (2023). *GA4GH Search and Data Connect API Specification*. https://www.ga4gh.org/product/data-connect/.

11. Global Alliance for Genomics, Health (2024). *GA4GH Passports Specification*. https://www.ga4gh.org/product/ga4gh-passports/.

12. So, Jinhyun (2022). *LightSecAgg – Reference implementation*. https://github.com/LightSecAgg/MLSys2022_anonymous.

13. So, Jinhyun, He, Chaoyang, Yang, Chien-Sheng, Li, Songze, Yu, Qian, E Ali, Ramy, Guler, Basak, Avestimehr, Salman (2022). Lightsecagg: a lightweight and versatile design for secure aggregation in federated learning. *Proceedings of Machine Learning and Systems*, 4, 694--720.

14. UK Data Service (2023). *What is the Five Safes framework?*. https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/.

15. Soiland-Reyes, Stian, Wheater, Stuart (2023). *Five Safes RO-Crate profile*. https://trefx.uk/5s-crate/0.4/. DOI: [10.5281/zenodo.10376350](https://doi.org/10.5281/zenodo.10376350)

16. European Data Protection Supervisor (2025). *TechDispatch #1/2025 - Federated Learning*. https://www.edps.europa.eu/data-protection/our-work/publications/techdispatch/2025-06-10-techdispatch-12025-federated-learning_en.

17. UK Information Commissioner's Office (2024). *DPIA template*. https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/annex-d-dpia-template/.

18. (2024). *Privacy Impact Assessment (PIA)*. https://www.cnil.fr/en/privacy-impact-assessment-pia.

19. Beyer, Betsy, Jones, Chris, Petoff, Jennifer, Murphy, Niall Richard (2016). *Site reliability engineering: how Google runs production systems*. O'Reilly Media, Inc.. Available at: [https://sre.google/sre-book/](https://sre.google/sre-book/)

20. Bonawitz, Keith, Eichner, Hubert, Grieskamp, Wolfgang, Huba, Dzmitry, Ingerman, Alex, Ivanov, Vladimir, Kiddon, Chloé, Konečný, Jakub, Mazzocchi, Stefano, McMahan, Brendan, Van Overveldt, Timon, Petrou, David, Ramage, Daniel, Roselander, Jason (2019). Towards Federated Learning at Scale: System Design. In *Proceedings of Machine Learning and Systems*, pp. 374-388. Available at: [https://proceedings.mlsys.org/paper/2019/file/bd686fd640be98efaae0091fa301e613-Paper.pdf](https://proceedings.mlsys.org/paper/2019/file/bd686fd640be98efaae0091fa301e613-Paper.pdf)

21. Lai, Fan, Dai, Yinwei, Zhu, Xiangfeng, Madhyastha, Harsha V., Chowdhury, Mosharaf (2021). FedScale: Benchmarking Model and System Performance of Federated Learning. In *Proceedings of the First Workshop on Systems Challenges in Reliable and Secure Federated Learning*, pp. 1–3. Association for Computing Machinery. DOI: [10.1145/3477114.3488760](https://doi.org/10.1145/3477114.3488760)

22. Flower Labs (2023). *Monitoring Simulation in Flower*. https://flower.ai/blog/2023-02-06-monitoring-simulation-in-flower.

23. NVIDIA (2024). *System Monitoring — NVFLARE User Guide*. https://nvflare.readthedocs.io/en/2.6/user_guide/monitoring.html.

24. Beyer, Betsy, Murphy, Niall Richard, Rensin, David K, Kawahara, Kent, Thorne, Stephen (2018). *The site reliability workbook: practical ways to implement SRE*. O'Reilly Media, Inc.. Available at: [https://sre.google/workbook/alerting-on-slos/](https://sre.google/workbook/alerting-on-slos/)

25. Beutel, Daniel J., Topal, Taner, Mathur, Akhil, Qiu, Xinchi, Fernandez-Marques, Javier, Gao, Yan, Sani, Lorenzo, Li, Kwing Hei, Parcollet, Titouan, de Gusm\~ao, Pedro P. B., Lane, Nicholas D. (2022). Flower: A Friendly Federated Learning Research Framework. *arXiv preprint arXiv:2007.14390*. Available at: [https://arxiv.org/abs/2007.14390](https://arxiv.org/abs/2007.14390)

26. Flower Labs (2025). *Secure Aggregation Protocols*. https://flower.ai/docs/framework/contributor-ref-secure-aggregation-protocols.html.

27. Flower Labs (2025). *Secure aggregation with Flower (the SecAgg+ protocol)*. https://flower.ai/docs/examples/flower-secure-aggregation.html.

28. Federated AI Technology Enabler (2024). *FATE documentation*. https://fate.readthedocs.io/en/develop/.

29. NVIDIA Corporation (2025). *NVIDIA FLARE: Federated Learning Application Runtime Environment*. https://github.com/NVIDIA/NVFlare.

30. Owkin, Linux Foundation AI (2025). *Substra: open-source federated learning software*. https://github.com/substra.

31. Jahns, Kevin (2024). *Yjs: Shared data types for building collaborative software*. https://github.com/yjs/yjs.

32. Flower Labs (2025). *Flower Community Slack Server*. https://friendly-flower.slack.com/.

33. FATE Project (2025). *FATE User Mailing List*. https://lists.lfaidata.foundation/g/Fate-FedAI.

34. Federated AI Technology Enabler (FATE) (2025). *FATE-Community GitHub organisation*. https://github.com/FederatedAI/FATE-Community.

35. ELIXIR Europe (2025). *ELIXIR Federated Human Data Community*. https://elixir-europe.org/communities/human-data.

36. ELIXIR Europe (2025). *Data Management Plan (RDMKit task page)*. https://rdmkit.elixir-europe.org/data_management_plan.

37. ResearchObject.org (2023). Workflow Run RO-Crate: RO-Crate profiles to capture the provenance of workflow runs. ResearchObject.org. Available at: [https://www.researchobject.org/workflow-run-crate/profiles/process_run_crate/](https://www.researchobject.org/workflow-run-crate/profiles/process_run_crate/)

38. Walsh, Christopher J., Ross, Kenneth N., Mills, James G., et al. (2021). DOME: recommendations for supervised machine learning validation in biology. *Nature Methods*, 18, 1122--1127. DOI: [10.1038/s41592-021-01205-4](https://doi.org/10.1038/s41592-021-01205-4)

39. Iterative, Inc. (2025). *Data Version Control User Guide (v3.1)*. Available at: [https://dvc.org/doc/user-guide](https://dvc.org/doc/user-guide)

40. Metz, Cade (2023). *Now That Machines Can Learn, Can They Unlearn?*. https://www.wired.com/story/machines-can-learn-can-they-unlearn/.

41. Bonawitz, Keith, Eichner, Hubert, Grieskamp, Wolfgang, Huba, Dzmitry, Ingerman, Alex, Ivanov, Vladimir, Kiddon, Chloé, Konecný, Jakub, Mazzocchi, Stefano, McMahan, Brendan, Van Overveldt, Timon, Petrou, David, Ramage, Daniel, Roselander, Jason (2019). Towards Federated Learning at Scale: System Design. In *Proceedings of Machine Learning and Systems*, pp. 374--388. DOI: [10.1109/SP40001.2021.00019](https://doi.org/10.1109/SP40001.2021.00019)

42. Wuyts, Kim, Scandariato, Riccardo, Joosen, Wouter (2014). LINDDUN: A privacy threat modeling methodology. CW Reports, KU Leuven. Available at: [https://linddun.org/](https://linddun.org/)

43. Benoit Courty and
                  Victor Schmidt and
                  Sasha Luccioni and
                  Goyal-Kamal and
                  MarionCoutarel and
                  Boris Feld and
                  Jérémy Lecourt and
                  LiamConnell and
                  Amine Saboni and
                  Inimaz and
                  supatomic and
                  Mathilde Léval and
                  Luis Blanche and
                  Alexis Cruveiller and
                  ouminasara and
                  Franklin Zhao and
                  Aditya Joshi and
                  Alexis Bogroff and
                  Hugues de Lavoreille and
                  Niko Laskaris and
                  Edoardo Abati and
                  Douglas Blank and
                  Ziyao Wang and
                  Armin Catovic and
                  Marc Alencon and
                  Michał Stęchły and
                  Christian Bauer and
                  Lucas Otávio N. de Araújo and
                  JPW and
                  MinervaBooks *mlco2/codecarbon: v2.4.1*. DOI: [10.5281/zenodo.11171501](https://doi.org/10.5281/zenodo.11171501)

44. Mehboob, Talha, Bashir, Noman, Iglesias, Jesus Omana, Zink, Michael, Irwin, David (2023). CEFL: Carbon-efficient federated learning. *arXiv preprint arXiv:2310.17972*. Available at: [https://arxiv.org/abs/2310.17972](https://arxiv.org/abs/2310.17972)

45. Flower Labs (2025). *How-to run simulations*. https://flower.ai/docs/framework/how-to-run-simulations.html.

46. Martí-Bonmatí, Luis, Blanquer, Ignacio, Tsiknakis, Manolis, Tsakou, Gianna, Martinez, Ricard, Capella-Gutierrez, Salvador, Zullino, Sara, Meszaros, Janos, Bron, Esther E, Gelpi, Jose Luis, others (2025). Empowering cancer research in Europe: the EUCAIM cancer imaging infrastructure. *Insights into Imaging*, 16, 47. DOI: [10.1186/s13244-025-01913-x](https://doi.org/10.1186/s13244-025-01913-x)
