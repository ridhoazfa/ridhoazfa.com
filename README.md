# Ridho Azfa — Custom Enterprise Capsule

Welcome to the enterprise client capsule for **Ridho Azfa** (`ridhoazfa`).

---

## Workspace Structure

- `REQUIREMENTS.md`: Detailed briefing notes, feature acceptance criteria, and SLA.
- `ARCHITECTURE.md`: Technical specification, data model, and schema isolation contracts.
- `CHANGELOG.md`: Progress record and milestone audits.
- `client_config.json`: Master tenant configuration parameters.
- `public/`: Web assets and static bundles served directly via Caddy.
- `src/`: Custom TypeScript application code and API microservice integrations.

---

## Local Development & Preview

1. **Static Preview**:
   Open `public/index.html` in your browser or run a lightweight local static server:
   ```bash
   npx serve public -p 8080
   ```

2. **Pushing to Client Private GitHub Repository**:
   Use Codaxiom's audited push tool to sync this capsule to the client's private GitHub repository:
   ```bash
   node scripts/push-client-to-github.js --slug=ridhoazfa --dry-run
   node scripts/push-client-to-github.js --slug=ridhoazfa --execute --client-github=<username>
   ```

3. **Client Access Lock Protocol**:
   This workspace is governed by the Codaxiom Client Access Lock. When active development is concluded, lock the client from the Control Room to protect the build against unauthorized modifications.
