# n8n Duplicate-Trigger Diagnostic Report

Source: `demo/n8n-workflows/duplicate-trigger-risk-sample.json`

Workflow: **Lead Rescue Works - Duplicate Trigger Risk Sample**

## Summary

- Nodes: 6
- Connections: 5
- Trigger-like nodes: 1
- Idempotency/dedupe hints: none found

## Trigger Nodes

- Incoming Webhook (webhook) path=`risk-sample` responseMode=`responseNode`

## Findings

- **HIGH**: Multiple paths to the same node — Send Owner Alert is reachable from Incoming Webhook through 2 paths. Check whether branches converge before an action node.
- **MEDIUM**: Multiple paths to the same node — Respond is reachable from Incoming Webhook through 2 paths. Check whether branches converge before an action node.
- **MEDIUM**: Action node has multiple incoming branches — Send Owner Alert has 2 incoming connections. Confirm it cannot run once per branch for the same event.
- **MEDIUM**: No idempotency or dedupe hint found — No node name or parameter references event IDs, idempotency, dedupe, or duplicate handling.
- **LOW**: Retry setting present — Send Owner Alert has retry behavior. Confirm retries cannot re-send side effects without an idempotency guard.

## Recommended Fix Pattern

1. Reproduce with one known event payload and one expected downstream action.
2. Confirm whether duplicates come from the source event, workflow branching, retries, or loops.
3. Add the smallest n8n-native guard: event ID check, IF/Switch condition, merge control, or static-data/datastore idempotency.
4. Re-run one positive test and one duplicate-prevention test.
5. Export the cleaned workflow JSON and write a concise changelog for changed nodes.
