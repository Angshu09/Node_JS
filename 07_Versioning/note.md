# 📌 Node.js Versioning Guide

## 🔹 What is Versioning in Node.js?
Node.js follows **Semantic Versioning (SemVer)** to label its versions in the format:


Example: **20.5.1**
- **MAJOR** → Breaking changes (old code may stop working).
- **MINOR** → New features (backward compatible).
- **PATCH** → Bug fixes and small improvements (backward compatible).

---

## 🔹 Node.js Release Types

| Type       | Description                                           | Recommended for |
|------------|-------------------------------------------------------|-----------------|
| **LTS**    | Long-Term Support – stable, production-ready, secure  | Most users & production |
| **Current**| Latest features, may include experimental changes     | Developers testing new features |

---

## 🔹 Why Versioning Matters
- Different projects may need different Node.js versions.
- Some npm packages require specific Node versions.
- New versions often fix bugs and security vulnerabilities.

---

## 🔹 Managing Node.js Versions

### **1. Using NVM (Node Version Manager)**
```bash
# Install a specific version
nvm install 20

# Use a specific version
nvm use 20

# List installed versions
nvm list

        ┌─────────── Semantic Versioning ────────────┐
        │     MAJOR   .   MINOR   .   PATCH           │
        │     (20)       (5)         (1)              │
        │                                             │
        │  20 → Breaking changes                      │
        │   5 → New features (backward compatible)    │
        │   1 → Bug fixes / small changes             │
        └─────────────────────────────────────────────┘
