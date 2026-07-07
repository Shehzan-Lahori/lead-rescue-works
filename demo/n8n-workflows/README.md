# n8n Workflow Templates

Credential-free templates for marketplace proof and project scoping.

These are not client-ready production workflows. They are starting structures showing how Lead Rescue Works approaches lead intake, debugging, and response tracking.

## Templates

- `lead-rescue-webhook-template.json`: generic webhook lead intake flow.
- `ghl-n8n-debug-capture-template.json`: GHL form webhook debugging capture flow.
- `duplicate-trigger-risk-sample.json`: intentionally flawed duplicate-trigger workflow used by the analyzer/report demo.

## How To Use

1. Import the JSON into n8n.
2. Replace placeholder URLs/credentials.
3. Run in test mode with dummy lead data.
4. Adjust CRM, Sheet, Slack/email, or alert nodes to the client's stack.

## Notes

n8n supports workflow JSON import/export. Webhook workflows can return data using a Respond to Webhook node when the Webhook node is configured to respond through that node.

Duplicate-trigger debugging proof:

```bash
node scripts/analyze-n8n-workflow.mjs demo/n8n-workflows/duplicate-trigger-risk-sample.json --out demo/output/n8n-duplicate-trigger-diagnostic-report.md
```

Sources:

- https://docs.n8n.io/build/manage-workflows/export-and-import
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook
