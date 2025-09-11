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
has_children: truedmponline_template: "ELIXIR-CONVERGE-federated-study-preset"
dmponline_template: "ELIXIR-CONVERGE-federated-study-preset"
has_children: true
permalink: /federated-learning/
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
information, or any other privacy‑sensitive datasets where
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

{% include figure.html
   path="assets/img/federated_learning/fl_topology.png"
   caption="Figure 1. Federated learning topology showing a central
   coordinator and distributed clients"
   alt="Diagram of a star‑topology FL system with one aggregator and N client
   nodes" %}

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
who accessed which variant count [9].

A full JSON profile and example crates are available
[15].

### Legal and ethical compliance

* Consult the EDPS TechDispatch on Federated Learning [16] for
  a regulators' view.
* **Data‑protection‑impact assessment (DPIA)** – run a DPIA before production.
  Free templates are provided by the ICO DPIA template [17]
  and CNIL PIA kit [18].

## Advanced topics

* **[Threat modelling & risk assessment]({% link federated-learning-threats.md %})**
  – detailed STRIDE + LINDDUN security analysis for federated learning systems
* **[Operational MLOps & monitoring]({% link federated-learning-ops.md %})**
  – production practices including SLIs, reproducibility, and cost optimisation
* **[Environmental sustainability]({% link federated-learning-green.md %})**
  – carbon footprint monitoring and green AI practices

* **Resource optimisation** – use Flower simulation guides
  [19] with resource flags to test different
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
* **[FATE quick‑start tutorial](https://fate.readthedocs.io/en/develop/_build_temp/examples/pipeline/README.html#quick-start)**
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
  updates [20].
* **["Hello World" Galaxy workflow RO‑Crate](https://about.workflowhub.eu/Workflow-RO-Crate/example/ro-crate-preview.html)**
  – a minimal Galaxy workflow packaged as a RO‑Crate, illustrating how
  provenance can be captured and shared.
* **[OHDSI federated network](https://www.ohdsi.org/)**
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

19. Flower Labs (2025). *How-to run simulations*. https://flower.ai/docs/framework/how-to-run-simulations.html.

20. Mart\'-Bonmat\', Luis, Blanquer, Ignacio, Tsiknakis, Manolis, Tsakou, Gianna, Martinez, Ricard, Capella-Gutierrez, Salvador, Zullino, Sara, Meszaros, Janos, Bron, Esther E, Gelpi, Jose Luis, others (2025). Empowering cancer research in Europe: the EUCAIM cancer imaging infrastructure. *Insights into Imaging*, 16, 47. DOI: [10.1186/s13244-025-01913-x](https://doi.org/10.1186/s13244-025-01913-x)
