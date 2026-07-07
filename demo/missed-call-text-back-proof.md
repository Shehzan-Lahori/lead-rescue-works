# Missed-Call Text-Back Proof

This is a credential-free proof asset for the fixed-scope missed-call paid test. It does not send live SMS.

## Input

`fulfillment/example-missed-call-payload.json`

```json
{
  "caller": "+15551234567",
  "businessName": "Ridge Roofing",
  "source": "OpenPhone missed call",
  "callStatus": "missed",
  "ownerChannel": "office email"
}
```

## Workflow

`demo/n8n-workflows/missed-call-text-back-template.json`

Flow:

1. Webhook receives missed-call event.
2. Code node normalizes caller, source, status, and next action.
3. Workflow prepares the text-back copy and owner alert.
4. Webhook response previews the output.
5. Production install adds approved SMS provider, owner alert, tracker row, and stale-call reminder.

## Output Preview

Text-back:

```text
Sorry we missed your call. This is Ridge Roofing. Reply here with what you need help with and the best time to call you back. Reply STOP to opt out.
```

Owner alert:

```text
Missed call from +15551234567. Text-back prepared. Next action: Reply or call back within 5 minutes.
```

## Guardrail

Live sending requires the buyer's approved SMS provider/number, opt-out handling, and compliance confirmation. Use this as proof of flow, not as a live campaign.
