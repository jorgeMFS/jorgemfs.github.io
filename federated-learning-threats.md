---
title: Federated learning — threat modelling
layout: page
---

### Threat modelling and risk assessment

Apply the **LINDDUN** privacy‑engineering framework to elicit privacy threats,
then map the resulting findings to Microsoft’s **STRIDE** model to ensure
security coverage.

#### Practical recipe (LINDDUN GO ＋ STRIDE)

1. **Map data flows** – draw a DFD that captures FL clients, the coordinator,
   and all artefacts exchanged (model updates, metrics, credentials).  
2. **Identify threats** – for **each DFD element** inspect:
   * The **seven LINDDUN privacy categories**: **L**inkability,
     **I**dentifiability, **N**on‑repudiation, **D**etectability,
     **D**isclosure of information, **U**nawareness, **N**on‑compliance; and  
   * The **six STRIDE security categories**: **S**poofing, **T**ampering,
     **R**epudiation, **I**nformation disclosure, **D**enial of Service,
     **E**levation of Privilege.  
3. **Assess impact** – score every threat (Low / Medium / High) for both likelihood
   and impact.  
4. **Select mitigations** – map each threat to technical or organisational
   controls and record the residual risk.

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
step‑by‑step templates [1].

Resources:

* [LINDDUN Tutorial PDF](https://linddun.org/downloads/LINDDUN-Tutorial.pdf)
* [Online privacy‑threat](https://linddun.org/threats/)

