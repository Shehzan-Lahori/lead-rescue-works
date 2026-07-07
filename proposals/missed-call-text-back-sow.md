# Missed-Call Text-Back Mini Setup

Use this for small marketplace jobs, paid tests, or first-client offers where the buyer wants missed-call text-back without a full CRM rebuild.

## Outcome

When an inbound call is missed, the caller gets a fast text reply, the owner/team gets an alert, and the missed call is logged with a follow-up status.

## Fixed-Scope Offer

Suggested first bid: $95-$149 for a simple paid test.

Suggested follow-on setup: $249-$499 if the buyer wants production hardening, CRM logging, business-hours rules, or stale-call reminders.

Turnaround: 24-48 hours after access, source details, and approved SMS copy are provided.

## Included

- Confirm the missed-call trigger/source.
- Configure one approved text-back message.
- Send one owner/team alert.
- Log missed-call details to one destination.
- Test with one missed-call scenario.
- Deliver short handoff notes.

## Not Included In The Paid Test

- AI receptionist or voice agent.
- Full CRM rebuild.
- Multi-location routing.
- Complex business-hours logic.
- Paid ads, call tracking redesign, or website changes.
- Sending live business SMS before provider compliance and opt-out rules are confirmed.

## Access Needed

- Phone/SMS provider or CRM access.
- The business number to test.
- Destination for the log: Sheet, CRM, Airtable, Slack, or email.
- Approved text message copy.
- Confirmation that the buyer's SMS provider/number is allowed to send the automated reply.

## Acceptance Criteria

The paid test is complete when:

- A missed-call event triggers the workflow.
- The caller receives the approved reply or the test mode proves the reply step.
- Owner/team receives the alert.
- The event is logged with timestamp, phone, source, and status.
- The buyer receives handoff notes explaining how to edit/pause the workflow.

## Starter Reply Copy

```text
Sorry we missed your call. This is [Business Name]. Reply here with what you need help with and the best time to call you back. Reply STOP to opt out.
```

## Follow-On Upsell

After the paid test works, offer:

- business-hours rules
- stale-call reminders
- CRM/pipeline status
- weekly missed-call report
- monthly monitoring and small fixes

## Proof Assets

- `site/missed-call-text-back.html`
- `demo/missed-call-text-back-proof.md`
- `demo/n8n-workflows/missed-call-text-back-template.json`
