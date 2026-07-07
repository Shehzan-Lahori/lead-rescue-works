# Buyer Proof Packet

Use this when a marketplace application asks for examples.

## What This Demonstrates

Lead Rescue Works can structure small lead-response workflows around four outputs:

1. tracker row
2. customer confirmation
3. owner/team alert
4. normalized lead record

## Files

- `site/proof.html`: public-ready proof page for marketplace profiles
- `demo/lead-rescue-simulator.mjs`: runnable local simulator
- `demo/n8n-workflows/lead-rescue-webhook-template.json`: credential-free n8n lead intake template
- `demo/n8n-workflows/ghl-n8n-debug-capture-template.json`: credential-free n8n debug capture template
- `demo/output/lead-tracker.csv`: tracker output
- `demo/output/lead-confirmation.txt`: customer confirmation copy
- `demo/output/owner-alert.txt`: owner/team alert copy
- `demo/output/lead-record.json`: normalized lead record
- `demo/ghl-n8n-debug-checklist.md`: audit checklist for broken GHL/n8n lead workflows
- `demo/output/n8n-duplicate-trigger-diagnostic-report.md`: sample report showing duplicate-trigger/path analysis
- `scripts/analyze-n8n-workflow.mjs`: zero-dependency static analyzer for n8n workflow JSON

## How To Present It

Short message:

```text
I have a small lead workflow demo that shows the structure I use: capture -> normalize -> alert -> track. For debugging jobs, I also use a GHL/n8n checklist and a duplicate-trigger diagnostic report that traces trigger, payload, branching, retries, and failure handling.
```

## What Not To Claim

- Do not claim this is a client case study.
- Do not claim revenue recovered.
- Do not imply a live production deployment.

Correct framing:

```text
This is a demo/proof artifact showing how I structure and test lead workflows.
```
