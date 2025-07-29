---
title: Federated Learning
layout: page
permalink: /federated-learning/
description: A comprehensive guide to federated learning principles, frameworks,
  and best practices for privacy-preserving machine learning.
------

## Description

Federated learning (FL) is a paradigm for building statistical models without
centralising sensitive data.  Instead of shipping records to a single
repository, the learning algorithm is dispatched to each participating
site and only aggregated model updates are exchanged.  This
decentralised approach preserves data sovereignty and allows hospitals,
biobanks and other organisations to collaborate on joint models while keeping
raw data local.  FL was designed to support large‑scale experiments on
heterogeneous devices and can scale to millions of clients.

## Why is this important?

Traditional centralised training often conflicts with privacy legislation
because it requires data to leave its origin.  FL overcomes this
constraint by bringing computation to the data and exchanging only
summary statistics.  As a result, researchers can pool statistical power
across sites while complying with the EU General Data Protection Regulation
(GDPR) and ethical frameworks such as the [Five Safes](https://ukdataservice.ac.uk/help/secure-lab/what-is-the-five-safes-framework/).

The EUCAIM cancer imaging infrastructure adopts a hybrid centralised‑federated
architecture to train AI tools on sensitive imaging data; it links
processing services of data holders to a central hub, supports both
synchronous and asynchronous federated learning and emphasises privacy‑
preserving training.  By keeping data within its
original jurisdiction and using secure protocols, FL enables cross‑
institutional collaboration without exposing individual records.

## Considerations and best practices

### Partitioning strategies

Data may be partitioned across organisations in different ways, and the
partitioning influences algorithm choice and security requirements.  In a
horizontal (sample‑wise) scenario, each site holds the same features but
different cohorts; for example, multiple hospitals may collect identical
clinical measurements for different patients.  Vertical (feature‑wise)
partitioning occurs when participating organisations share individuals but
collect different variables, such as genetic data at one site and
clinical data at another.  Understanding how the data are split helps
select appropriate federated algorithms and security mechanisms.

<div align="center">
  <img src="/assets/img/federated_learning/fl_topology.png"
       alt="Federated learning topology"
       style="max-width: 600px; width: 100%; height: auto;">
  <br>
  <em>Figure 1. Federated learning topology showing a central
      coordinator and distributed clients</em>
</div>

### Frameworks and language support

Several open‑source frameworks implement FL, each with different
programming languages, maturity levels and security features:

* **[Flower](https://flower.ai){:.tool}** – a flexible Python framework that
  supports PyTorch and TensorFlow.  Flower emphasises ease of use and
  allows researchers to adapt existing machine‑learning workflows to a
  federated setting.  It is designed for large‑scale experiments and
  heterogeneous devices. Flower provides built‑in secure aggregation
  components via the SecAgg and SecAgg+ protocols.
* **[FATE](https://fate.fedai.org){:.tool}** – a production‑ready platform
  initiated by Webank's AI department.  FATE implements secure
  computation protocols based on homomorphic encryption and multi‑party
  computation and includes federated versions of logistic regression,
  tree‑based models and deep learning.  It supports both Python and Java
  and is well suited to regulated environments.
* **[NVIDIA FLARE](https://developer.nvidia.com/flare){:.tool}** – a
  domain‑agnostic, open‑source and extensible Python SDK that allows
  researchers and data scientists to adapt existing ML/DL workflows to a
  federated paradigm.  It provides built‑in algorithms such as FedAvg,
  FedOpt and FedProx and includes privacy‑preserving techniques to
  protect model updates.
* **[Substra](https://github.com/substra){:.tool}** – an open‑source federated
  learning platform offering a flexible Python interface and a web
  application for deploying FL at scale.  Substra enables training and
  validation on distributed datasets, has been used by hospitals and
  biotech companies, and can simulate federated workflows on a single
  machine for testing.
* **[Yjs](https://yjs.dev){:.tool}** – a JavaScript library implementing
  conflict‑free replicated data types (CRDTs) for collaborative software.
  Yjs exposes shared types that behave like normal data structures but sync
  automatically across peers, even offline.  It does not provide
  machine‑learning algorithms but offers network‑agnostic synchronisation
  that can support peer‑to‑peer data sharing.

When choosing a framework, consider compatibility with your existing code,
support for secure aggregation and the maturity of the community.

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

### Data harmonisation

Differences in data collection protocols can cause site‑to‑site
variability.  Before launching a federated study, establish a
common data model or phenotype dictionary to align variable names and
units.  Perform quality control to detect outliers, missing values and
batch effects, and apply common pre‑processing pipelines (e.g.
  normalisation or imaging correction) across sites.  Tools such as
  [runcrate](https://github.com/ResearchObject/runcrate){:.tool}, a command‑line
  utility for manipulating Workflow Run RO‑Crate packages, can be used to
  package metadata and ensure provenance.

### Monitoring and MLOps

Good operational practices are vital for reliable federated systems.
Maintain audit logs at both the coordinator and client sides to record
training events, authentication attempts and errors.

Use drift detection to monitor whether local distributions diverge from the
global model assumptions.  Continuous integration pipelines should
include unit tests and simulated federated runs.  When possible,
measure and visualise metrics (such as loss and accuracy) across
training rounds without revealing individual site performance.

### Implementation recommendations

* Use **Flower** (≥1.6) with TLS encryption and SecAgg+ for horizontal
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

## Tools and services

The following software and services support federated learning:

* **[Flower](https://flower.ai)** – open‑source Python framework for
  federated learning; integrates with PyTorch and TensorFlow and
  includes secure aggregation modules.
* **[FATE](https://fate.fedai.org)** – industrial‑grade federated AI
  platform providing homomorphic encryption, multi‑party computation and
  a library of algorithms.
* **[NVIDIA FLARE](https://developer.nvidia.com/flare)** –
  domain‑agnostic SDK that adapts existing ML workflows to a federated
  paradigm, with built‑in algorithms and privacy‑preserving features.
* **[Substra](https://github.com/substra)** – open‑source platform
  with a Python interface and web application, enabling training and
  validation on distributed datasets and supporting simulations.
* **[Yjs](https://yjs.dev)** – JavaScript CRDT library for
  collaborative applications that automatically synchronises shared
  data structures and works offline.
* **[runcrate](https://github.com/ResearchObject/runcrate)** –
  command‑line toolkit for creating and manipulating Workflow Run
  RO‑Crate packages, useful for packaging federated training runs and
  preserving provenance.
* **[EUCAIM federated processing API](https://eucaim.gitbook.io/architecture-of-eucaim/4.-detailed-architecture){:.tool}**
  – RESTful interface that orchestrates federated computation across
  secure nodes within the EUCAIM platform.

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

## Related pages

[Data security](#security/)

[Data sensitivity](#sensitivity/)

[Data provenance](#provenance/)

[Data quality](#quality/)

[Trusted research environments]({{ site.baseurl }}/trusted_research_environments/)

[Data protection impact assessment](#protection_impact_assessment/)

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
