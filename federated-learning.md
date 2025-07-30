---
title: Federated Learning
layout: page
permalink: /federated-learning/
description: A comprehensive guide to federated learning principles, security layers, governance frameworks, and best practices for privacy-preserving machine learning. Covers key FL frameworks and tools, FAIR metadata, reproducibility, legal compliance, bias mitigation, and threat modelling for implementing federated learning in practice.
---

## Description

Federated learning (FL) is a paradigm for building statistical models without
centralising sensitive data.  Instead of shipping records to a single
repository, the learning algorithm is dispatched to each participating
site and only aggregated model updates are exchanged.  This
decentralised approach preserves data sovereignty and allows hospitals,
biobanks and other organisations to collaborate on joint models while keeping
raw data local.  FL was first deployed at Google for on‑device keyboard
prediction, where simulations involved ≈ 15 million phones; in health‑care
case‑studies cohort sizes typically range from 5 to ≈ 300 sites, depending
on governance constraints.

## Why is this important?

Traditional centralised training often conflicts with privacy legislation
because it requires data to leave its origin.  FL overcomes this
constraint by bringing computation to the data and exchanging only
summary statistics.  As a result, researchers can pool statistical power
across sites while complying with the EU General Data Protection Regulation
(GDPR) and ethical frameworks such as the
[Five Safes](https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/)
.

The EUCAIM cancer‑imaging infrastructure adopts a hybrid centralised‑federated
architecture to train AI tools on sensitive imaging data; its current public
prototype runs **synchronous FedAvg** while asynchronous variants are still under
evaluation.

## Considerations and best practices

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

Beyond FedAvg, vertical federations can use **SplitNN** or PyVertical to train
deep models where each party holds disjoint features
, and statistical alternatives such as
FedSVD exist for genome‑wide association studies.

<div align="center">
  <img src="/assets/img/federated_learning/fl_topology.png"
       alt="Diagram of a star‑topology FL system with one aggregator and N client nodes"
       style="max-width: 600px; width: 100%; height: auto;">
  <br>
  <em>Figure 1. Federated learning topology showing a central
      coordinator and distributed clients</em>
</div>

### Security stack

Federated learning relies on a layered security stack.  At the network
level, use Transport Layer Security (TLS) or Virtual Private Networks
(VPNs) to encrypt communications between the coordinator and clients.

Authentication and authorisation can be handled via OpenID Connect
(OIDC) and token‑based access control.

Aggregated model updates should be computed using secure aggregation
protocols, such as
SecAgg or SecAgg+, where each client encrypts its updates and the
server only decrypts the sum.  Differential privacy and
noise addition further reduce the risk of re‑identification, and a
threat model should guide the choice of protections.

> **Research note**  LightSecAgg reduces bandwidth and copes with client
> drop‑outs, enabling asynchronous FL, but currently requires custom
> integration (no stable API in Flower/FATE yet).

### Governance using the Five Safes

The [Five Safes framework](https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/)
provides a structured approach to ethical and secure data use.  Its
components can be mapped to
federated workflows:

* **Safe data** – De‑identify and harmonise data so that each site
  satisfies minimum quality and confidentiality standards.
  Use
  common phenotype dictionaries and perform quality control before
  including data in a federated study.
* **Safe projects** – Approve analyses only if they offer public benefit
  and respect data sensitivity.  Ethical approvals and data‑sharing
  agreements should be in place for every federated run.
* **Safe people** – Ensure that participating researchers are authorised
  and trained.  Users should authenticate via OIDC and sign terms that
  outline acceptable use.
* **Safe settings** – Execute computations in secure environments.
  EUCAIM's federated processing platform orchestrates tasks through
  middleware so that data remain within secure nodes.
* **Safe outputs** – Export only aggregated model parameters or summary
  statistics.  Outputs should be screened to ensure that no individual
  contributions can be reconstructed.

A full JSON profile and example crates are published as the **[Five Safes
RO‑Crate record](https://zenodo.org/records/10376350)**.

### Legal & ethical compliance

* **Data‑protection‑impact assessment (DPIA)** – run a DPIA before production.
  Free templates are provided by the UK ICO and CNIL.
  * [ICO DPIA template](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/annex-d-dpia-template/)
  * [CNIL PIA kit](https://www.cnil.fr/en/privacy-impact-assessment-pia)
* Consult the EDPS **TechDispatch #1/2025 – Federated Learning** for regulatory
  guidance specific to FL deployments in the EU.

### Data harmonisation

Differences in data collection protocols can cause site‑to‑site
variability.  Before launching a federated study, establish a
common data model or phenotype dictionary to align variable names and
units.  Perform quality control to detect outliers, missing values and
batch effects, and apply common pre‑processing pipelines (e.g.
  normalisation or imaging correction) across sites.  Tools such as
  [runcrate](https://github.com/ResearchObject/runcrate), a command‑line
  utility for manipulating Workflow Run RO‑Crate packages, can be used to
  package metadata and ensure provenance.

The **OMOP Common Data Model (CDM)** is widely adopted for observational
health data and maps well onto federated SQL back‑ends.

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

## Solutions

### Frameworks and language support

Several open‑source frameworks implement FL, each with different
programming languages, maturity levels and security features:

* **[Flower](https://flower.ai)** – Python (PyTorch/TensorFlow). Secure
  aggregation via `secagg_mod`/`secaggplus_mod` on the client and
  `SecAgg{,+}Workflow` on the server (≥ v1.8); enable by adding those modules
  when launching `ClientApp` and `ServerApp` – no `--enable-preview` flag required.
  _Lightweight alternative_: **LightSecAgg** protocol offers dropout‑resilient
  secure aggregation for asynchronous FL; still research‑grade and not yet
  merged in Flower core.
* **[FATE](https://fate.fedai.org)** – production‑ready, Java/Python,
  homomorphic encryption.
* **[NVIDIA FLARE](https://developer.nvidia.com/flare)** – SDK with
  FedAvg/FedOpt/FedProx.
* **[Substra](https://github.com/substra)** – Python API + web UI for
  clinical FL at scale.
* **[Yjs](https://yjs.dev)** – high‑performance CRDT engine for
  real‑time collaboration; **not** an ML library and provides no privacy
  guarantees out‑of‑the‑box.

When choosing a framework, consider compatibility with your existing code,
support for secure aggregation and the maturity of the community.

## FAIR, metadata & provenance

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

## Reproducibility and versioning

Follow the **DOME‑ML** checklist (Data, Optimisation, Model, Evaluation)
.  
Track large binaries with **DVC** and code with Git
.

* Plan for **machine unlearning** (selective model forgetting) to honour GDPR
  "right to erasure"; research techniques exist but remain experimental.

## Legal and ethical compliance

* Conduct a GDPR Data‑Protection‑Impact‑Assessment (DPIA) using ICO/CNIL
  templates before deployment.  
* Map privacy controls to the EDPS **TechDispatch** guidance on FL
 .  
* Enforce data‑minimisation; retain only aggregated parameters.

## Bias and equity

Use group‑fairness metrics (demographic parity, equal opportunity) to audit both
global and per‑site models.  
Mitigation strategies include re‑weighting, constrained optimisation and
fairness‑aware FedAvg variants.

## Monitoring, drift and MLOps

Implement concept‑ and data‑drift alarms using tools like **Evidently AI** and
**Prometheus exporters** for production monitoring. Maintain comprehensive
audit logs for every training round to ensure compliance and traceability
.

## Threat modelling and risk assessment

Apply **[LINDDUN‑PRO](https://linddun.org/)** to catalogue privacy threats and
map mitigations to privacy‑enhancing technologies; pair with STRIDE for
security aspects.

## Tools and services

The following supporting tools and services complement FL frameworks:

| Tool | Purpose | Security features | License |
| ------ | --------- | ------------------ | --------- |
| [runcrate](https://github.com/ResearchObject/runcrate) | Command‑line toolkit for creating and manipulating Workflow Run RO‑Crate packages, useful for packaging federated training runs and preserving provenance | — | Apache‑2.0 |
| [EUCAIM federated processing API](https://eucaim.gitbook.io/architecture-of-eucaim/4.-detailed-architecture) | RESTful interface that orchestrates federated computation across secure nodes within the EUCAIM platform | Kubernetes isolation, secure nodes | Proprietary |
| [Evidently AI](https://www.evidentlyai.com) | Open‑source ML monitoring framework for drift detection, bias dashboards and model performance tracking in production FL deployments | — | Apache‑2.0 |

## Training materials

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

> **RO‑Crate Example:** A minimal `ro-crate-metadata.json` for a federated
> training run:
>
> ```json
> {
>   "@context": ["https://w3id.org/ro/crate/1.1/context"],
>   "@graph": [
>     { "@id": "ro-crate-metadata.json", "@type": "CreativeWork" },
>     { "@id": "./", "@type": "WorkflowRunCrate", "name": "Federated training run", 
>       "hasPart": [ { "@id": "model.pkl" }, { "@id": "metrics.json" } ] },
>     { "@id": "model.pkl", "@type": "File" },
>     { "@id": "metrics.json", "@type": "File" }
>   ]
> }
> ```
>
> Full implementation available in the **[Five Safes RO‑Crate record](https://zenodo.org/records/10376350)**.

## Real‑world examples

* **[Flower MNIST with differential privacy + secure aggregation](https://flower.ai/docs/examples/fl-dp-sa.html)**
  – step‑by‑step notebook showing central DP combined with Flower SecAgg+
  on the MNIST dataset.
* **[EUCAIM federated GWAS showcase](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850660/)**
  – describes how EUCAIM's cancer‑imaging platform orchestrates a
  cross‑site GWAS on imaging‑derived features while keeping primary data
  inside hospital nodes (see "Federated analytics" section).
* **["Hello World" Galaxy workflow RO‑Crate](https://about.workflowhub.eu/Workflow-RO-Crate/example/ro-crate-preview.html)**
  – a minimal Galaxy workflow packaged as a RO‑Crate, illustrating how
  provenance can be captured and shared.

## References

* Beutel, D. et al. [Flower: A Friendly Federated Learning Research
  Framework](https://arxiv.org/abs/2007.14390). arXiv (2022).
* Flower Labs. [Secure aggregation with Flower (the SecAgg+
  protocol)](https://flower.ai/docs/examples/flower-secure-aggregation.html)
  (2025).
* Federated AI Technology Enabler.
  [FATE documentation](https://fate.readthedocs.io/en/develop/) (2024).
* NVIDIA Corporation. [NVIDIA FLARE: Federated Learning Application Runtime
  Environment](https://github.com/NVIDIA/NVFlare) (2025).
* Owkin and Linux Foundation AI. [Substra: open‑source federated learning
  software](https://github.com/substra) (2025).
* Jahns, K. [Yjs: Shared data types for building collaborative
  software](https://yjs.dev/) (2024).
* Camps, J. et al. [Empowering cancer research in Europe: the EUCAIM
  infrastructure](https://pmc.ncbi.nlm.nih.gov/articles/PMC11850660/).
  NPJ Digital Medicine (2024).
* UK Data Service. [What is the Five Safes
  framework?](https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/)
  (2023).
* Soiland-Reyes, S. et al. [Workflow Run RO-Crate: Process Run Crate
  profile](https://www.researchobject.org/workflow-run-crate/profiles/process_run_crate/)
  (2023).
* Soiland-Reyes, S. [Five Safes RO-Crate
  profile](https://zenodo.org/records/10376350) (2023).
* Li, T. et al. [Federated Learning: Challenges, Methods, and Future
  Directions](https://arxiv.org/abs/2205.06117). arXiv (2022).
* European Data Protection Supervisor. [TechDispatch #1/2025 - Federated
  Learning](https://www.edps.europa.eu/data-protection/our-work/publications/techdispatch/2025-06-10-techdispatch-12025-federated-learning_en)
  (2025).
* Flower Labs. [Secure Aggregation
  Protocols](https://flower.ai/docs/framework/contributor-ref-secure-aggregation-protocols.html)
  (2025).
* So, J. et al. [LightSecAgg: a Lightweight and Versatile Design for Secure
  Aggregation in Federated Learning](https://arxiv.org/abs/2109.14236).
  arXiv (2021).
* UK Information Commissioner's Office. [DPIA
  template](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/annex-d-dpia-template/)
  (2024).
* Commission Nationale de l'Informatique et des Libertés. [Privacy Impact
  Assessment (PIA)](https://www.cnil.fr/en/privacy-impact-assessment-pia)
  (2024).
* Axios. [AI companies are training their algorithms to "forget" your
  data](https://www.axios.com/2024/01/12/ai-forget-unlearn-data-privacy)
  (2024).
* Global Alliance for Genomics and Health. [GA4GH
  Phenopackets](https://www.ga4gh.org/product/phenopackets/) (2024).
* Observational Health Data Sciences and Informatics. [Data
  Standardization](https://www.ohdsi.org/data-standardization/) (2024).
* LINDDUN. [LINDDUN Privacy Engineering](https://linddun.org/) (2024). 