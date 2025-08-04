---
title: Federated learning
type: your_tasks
page_id: federated_learning
summary: Federated learning enables privacy‑preserving machine learning by
  training models across multiple sites without sharing raw data.
description: |
  This page explains the principles of federated learning, security
  layers and governance frameworks, highlights key FL frameworks and tools, and
  provides training materials and real‑world examples for implementing
  federated learning in practice.
contributors:
  - name: "Jorge Miguel Silva"
    orcid: "0000-0002-6331-6091"
    affiliation: "IEETA, Universidade de Aveiro"
  - name: "Ana Teresa Freitas"
    orcid: "0000-0002-2997-5990"
    affiliation: "INESC‑ID, Instituto Superior Técnico"

editors:
  - name: "RDMKit editorial team"
tags:
  - analysis
  - data_security
  - gdpr
  - privacy
  - provenance
  - reproducibility
  - sustainability
keywords:
  - distributed training
  - federated learning
  - governance
  - passport visa
  - privacy preserving
  - secure aggregation
license: CC-BY-4.0
page_created_on: 2025-08-01
last_updated_on: 2025-08-10
aliases: ["federated_learning", "federated-learning"]
icon: ti-cloud
status: in_review
has_children: true
dmponline_template: "ELIXIR-CONVERGE-federated-study-preset"
training:
  - name: Federated Learning for Health Data Tutorial
    description: Hands-on tutorial for FL in health data contexts
    registry: TeSS
    url: https://tess.elixir-europe.org/materials/federated-learning-health
  - name: Privacy-Preserving Machine Learning Workshop
    description: Workshop on privacy techniques including FL
    registry: TeSS  
    url: https://tess.elixir-europe.org/materials/privacy-preserving-ml
  - name: ELIXIR-CONVERGE Federated Analysis Training
    description: Comprehensive training on federated data analysis
    registry: TeSS
    url: https://tess.elixir-europe.org/events/elixir-converge-federated
resources:
  - name: ELIXIR Federated Human Data Community
    description: Community resources for federated analysis of sensitive data
    url: https://elixir-europe.org/communities/human-data
  - name: RO-Crate
    description: Lightweight approach to packaging research data with metadata
    url: https://www.researchobject.org/ro-crate/
related_pages:
  your_tasks:
    - bias_and_equity
    - data_harmonisation
    - data_protection_impact_assessment
    - data_provenance
    - data_security
    - data_sensitivity
    - energy_consumption
    - legal_compliance
    - mlops
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
{% cite hard2018federated %}; in health‑care case‑studies cohort sizes
typically range from five to ≈ three hundred sites, depending
on governance constraints. However, open challenges such as communication
cost and fairness remain active research topics {% cite li2022federated %}.

## Why is this important?

Traditional centralised training often conflicts with privacy legislation
because it requires data to leave its origin.  FL overcomes this
constraint by bringing computation to the data and exchanging only
summary statistics.  As a result, researchers can pool statistical power
across sites while complying with the EU General Data Protection Regulation
(GDPR) and ethical frameworks such as the
[Five Safes](https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/).

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

Beyond FedAvg, vertical federations can use **SplitNN** {% cite splitnn18 %} or
**PyVertical** {% cite pyvertical20 %} to train deep models where each party holds
disjoint features, and statistical alternatives such as **FedSVD**
{% cite hartebrodt2024fedsvd %} offers a federated singular‑value‑decomposition
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
  {% cite runcrate_cli %}, a command‑line utility for manipulating Workflow Run
  RO‑Crate packages, can be used to package metadata and ensure provenance.

The **OMOP Common Data Model (CDM)** {% cite omop_jhu24 %} is widely adopted for
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
{% cite ohdsi2024 %}.

For phenotypic data exchange, **GA4GH Phenopackets**
provide structured JSON representation:
`{"subject": {"id": "patient1"},
"phenotypicFeatures": []}`. Refer to the
[GA4GH Phenopackets specification](https://www.ga4gh.org/product/phenopackets/)
for complete schema definitions and validation rules.

To let external analysts **discover** which federated shards exist, expose a read‑only
endpoint using **Beacon v2** (yes/no genomic presence queries)
{% cite beacon_v2 %}
or the **GA4GH Search/Data‑Connect** API for richer tabular filters
{% cite ga4gh_search %}.

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
for mutual OIDC authorisation {% cite ga4gh_passports %}.

Aggregated model updates should be computed using secure aggregation
protocols, such as
SecAgg or SecAgg+, where each client encrypts its updates and the
server only decrypts the sum.  Differential privacy and
noise addition further reduce the risk of re‑identification, and a
threat model should guide the choice of protections.

> **Research note**  LightSecAgg reduces bandwidth and copes with client
> drop‑outs, enabling asynchronous FL; LightSecAgg now has a reference
> implementation {% cite lightsecagg_repo %}, but it is not yet merged into
> Flower core and still requires manual integration.

The original LightSecAgg design {% cite so2022lightsecagg %} details bandwidth
savings compared to traditional secure aggregation protocols.

{% include figure.html
   path="assets/img/your_tasks/federated_learning/fl_topology.png"
   caption="Figure 1. Federated learning topology showing a central
   coordinator and distributed clients"
   alt="Diagram of a star‑topology FL system with one aggregator and N client
   nodes" %}

## Solution

### Governance using the Five Safes

The UK Data Service description of the Five Safes
{% cite ukdataservice2023 %} provides a structured approach to ethical and
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
who accessed which variant count {% cite beacon_v2 %}.

A full JSON profile and example crates are available
{% cite rocrate_fivesafes2023 %}.

### Legal and ethical compliance

* Consult the EDPS TechDispatch on Federated Learning {% cite edps2025 %} for
  a regulators' view.
* **Data‑protection‑impact assessment (DPIA)** – run a DPIA before production.
  Free templates are provided by the ICO DPIA template {% cite ico2024dpia %}
  and CNIL PIA kit {% cite cnil2024pia %}.

## Advanced topics

* **[Threat modelling & risk assessment]({% link federated-learning-threats.md %})**
  – detailed STRIDE + LINDDUN security analysis for federated learning systems
* **[Operational MLOps & monitoring]({% link federated-learning-ops.md %})**
  – production practices including SLIs, reproducibility, and cost optimisation
* **[Environmental sustainability]({% link federated-learning-green.md %})**
  – carbon footprint monitoring and green AI practices

* **Resource optimisation** – use Flower simulation guides
  {% cite flower_sim_guide %} with resource flags to test different
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
  updates {% cite eucaim24 %}.
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

[Machine Learning](https://rdmkit.elixir-europe.org/machine_learning)

## Bibliography

<ol class="bibliography"></ol>
