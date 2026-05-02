# Vulnerable Demo App 🔓

> ⚠️ **WARNING**: This application is intentionally vulnerable for educational purposes. DO NOT deploy to production or use in any real environment.

## Purpose

This repository demonstrates common security vulnerabilities that DevSecOps tools can detect:

- **SAST (Static Application Security Testing)** - CodeQL
- **SCA (Software Composition Analysis)** - Dependency Review, Trivy, Dependabot
- **Secret Scanning** - Gitleaks, GitHub Secret Scanning
- **SBOM (Software Bill of Materials)** - Syft/Anchore

## Vulnerabilities Included

### Code Vulnerabilities (SAST - CodeQL will detect)

| Vulnerability | File | Line(s) |
|--------------|------|---------|
| SQL Injection | `src/index.js` | 18-25, 28-37 |
| SQL Injection | `src/database.js` | 13-22 |
| Cross-Site Scripting (XSS) | `src/index.js` | 40-44, 47-52 |
| Command Injection | `src/index.js` | 55-64, 67-72 |
| Command Injection | `src/utils.js` | 12-20 |
| Path Traversal | `src/index.js` | 75-79, 82-86 |
| Server-Side Template Injection | `src/index.js` | 89-94 |
| Insecure Deserialization | `src/index.js` | 97-101 |
| Open Redirect | `src/index.js` | 104-108 |
| Hardcoded Credentials | `src/index.js` | 111-113 |
| Hardcoded Credentials | `src/database.js` | 5-10 |
| Weak Cryptography (MD5/SHA1) | `src/index.js` | 137-141 |
| Weak Cryptography | `src/auth.js` | 8-10 |
| ReDoS (Regex DoS) | `src/index.js` | 151-156 |
| Unsafe Eval | `src/utils.js` | 28-30 |

### Vulnerable Dependencies (SCA - Dependabot/Trivy will detect)

| Package | Version | Known CVEs |
|---------|---------|------------|
| lodash | 4.17.4 | CVE-2018-16487, CVE-2019-10744, CVE-2020-8203, CVE-2021-23337 |
| axios | 0.21.0 | CVE-2021-3749 |
| minimist | 1.2.0 | CVE-2020-7598, CVE-2021-44906 |
| node-fetch | 2.6.0 | CVE-2020-15168 |
| serialize-javascript | 2.1.0 | CVE-2020-7660 |
| y18n | 4.0.0 | CVE-2020-7774 |
| ini | 1.3.5 | CVE-2020-7788 |
| jquery | 2.2.4 | CVE-2019-11358, CVE-2020-11022, CVE-2020-11023 |
| ejs | 3.1.5 | CVE-2022-29078 |
| handlebars | 4.7.6 | CVE-2021-23369, CVE-2021-23383 |
| marked | 0.3.5 | CVE-2017-17461, CVE-2017-1000427 |
| tar | 4.4.10 | CVE-2021-32803, CVE-2021-32804 |
| bl | 1.2.2 | CVE-2020-8244 |
| sanitize-html | 1.27.0 | CVE-2021-26539 |

### Hardcoded Secrets (Gitleaks will detect)

| Secret Type | File | Description |
|-------------|------|-------------|
| Database Password | `src/database.js` | Hardcoded DB credentials |
| JWT Secret | `src/auth.js` | Hardcoded JWT signing key |
| API Key | `src/index.js` | Fake API key pattern |
| AWS Secret | `src/index.js` | AWS-like secret key |

## GitHub Security Features Enabled

After pushing this repo, check these locations:

1. **Security Tab** → Code scanning alerts (CodeQL results)
2. **Security Tab** → Dependabot alerts (vulnerable dependencies)
3. **Security Tab** → Secret scanning alerts
4. **Insights** → Dependency graph
5. **Actions** → Workflow runs (SBOM generation, Trivy scans)

## Workflows Included

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `codeql.yml` | Static code analysis | Push, PR, Weekly |
| `dependency-review.yml` | Block PRs with vulnerable deps | PR only |
| `trivy.yml` | SCA scanning | Push, PR |
| `sbom.yml` | Generate SBOM files | Push, Release |
| `gitleaks.yml` | Secret detection | Push, PR |
| `dependabot.yml` | Auto-update dependencies | Daily |

## How to Use for Demo

1. Create a new GitHub repository
2. Upload this folder via GitHub UI (drag & drop)
3. Wait 2-3 minutes for workflows to run
4. Navigate to **Security** tab to see alerts
5. Check **Actions** tab for workflow results

## Expected Results

After the first push, you should see:

- **20+ CodeQL alerts** (SQL injection, XSS, command injection, etc.)
- **15+ Dependabot alerts** (vulnerable npm packages)
- **5+ Secret scanning alerts** (hardcoded credentials)
- **SBOM artifacts** in the workflow run

## License

MIT - For educational purposes only.
