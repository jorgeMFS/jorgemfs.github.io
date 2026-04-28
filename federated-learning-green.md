---
title: Federated learning — environmental sustainability
layout: docs
parent: federated_learning
page_id: federated_learning_green
summary: Carbon footprint monitoring and green AI practices for federated learning.
contributors:
  - name: "Jorge Miguel Silva"
    orcid: "0000-0002-6331-6091"
    affiliation: "IEETA, Universidade de Aveiro"
license: CC-BY-4.0
last_updated_on: 2025-08-10
status: draft
has_children: false
related_pages:
  your_tasks:
    - energy_consumption
tags: [sustainability, green_ai, carbon_footprint]
permalink: /federated-learning/green/
---

### Environmental sustainability

#### Carbon footprint monitoring

**Measurement tools:**

* **[CodeCarbon](https://codecarbon.io/)**: Python package for tracking CO₂
emissions [\[1\]](#ref-1).

  ```python
  from codecarbon import EmissionsTracker
  tracker = EmissionsTracker()
  tracker.start()
  # Run FL training
  emissions = tracker.stop()
  ```
  
* **[ML CO2 Impact](https://mlco2.github.io/impact/)**: Online calculator for ML
  carbon footprint.
* **[Green Algorithms](http://www.green-algorithms.org/)**: Computational
  footprint calculator.

**Optimisation strategies:**

* Schedule training during low-carbon energy periods.
* Use model compression techniques (pruning, quantization).
* Implement early stopping based on carbon budget.
* Prefer edge devices over cloud GPUs when possible.
* Adaptive client‑selection (EcoLearn) cuts CO₂ by up to ten × without
  accuracy loss [\[2\]](#ref-2).

See: [EcoFL framework (arXiv 2023)](https://arxiv.org/pdf/2310.17972).

## Bibliography

1. <span id="ref-1"></span>Courty, Benoit, Schmidt, Victor, Luccioni, Sasha, et al. (2024). *mlco2/codecarbon: v2.4.1*. DOI: [10.5281/zenodo.11171501](https://doi.org/10.5281/zenodo.11171501)

2. <span id="ref-2"></span>Mehboob, Talha, Bashir, Noman, Iglesias, Jesus Omana, Zink, Michael, Irwin, David (2023). CEFL: Carbon-efficient federated learning. *arXiv preprint arXiv:2310.17972*. Available at: [https://arxiv.org/abs/2310.17972](https://arxiv.org/abs/2310.17972)

