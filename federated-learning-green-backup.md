---
title: Federated learning — environmental sustainability
layout: your_tasks
parent: federated_learning
page_id: federated_learning_green
summary: Carbon footprint monitoring and green AI practices for federated learning.
status: draft
has_children: false
related_pages:
  your_tasks:
    - energy_consumption
tags: [sustainability, green_ai, carbon_footprint]
tool: false
---

### Environmental sustainability

#### Carbon footprint monitoring

**Measurement tools:**

* **[CodeCarbon](https://codecarbon.io/)**: Python package for tracking CO₂
emissions {% cite codecarbon %}.

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
  accuracy loss {% cite ecolearn23 %}.

See: [EcoFL framework (arXiv 2023)](https://arxiv.org/pdf/2310.17972).

