# GHL -> n8n Lead Workflow Debug Checklist

Use this as a buyer-facing proof artifact for broken GoHighLevel form/webhook/n8n jobs.

## Goal

Find where a lead submission is lost, malformed, duplicated, or not triggering.

## Intake Questions

- Which GHL form or funnel step creates the lead?
- What should the n8n webhook receive?
- Is the failure no trigger, partial payload, wrong fields, duplicate runs, or downstream error?
- When did it last work?
- Are there recent changes to the form, workflow, domain, auth, or field names?

## Test Cases

| Test | Expected Result | Evidence To Capture |
|---|---|---|
| Complete lead submission | n8n workflow triggers once with all fields | GHL submission timestamp, n8n execution ID, payload JSON |
| Missing phone/email | Workflow still logs lead as incomplete | n8n execution ID, tracker row |
| Duplicate submission | Duplicate is detected or safely logged | two execution IDs, duplicate handling note |
| Special characters in message | Payload remains valid and mapped | raw payload, mapped fields |
| Webhook disabled/wrong URL | Failure is visible and documented | GHL action config screenshot/note |

## Debug Path

1. Confirm the GHL form action/webhook target.
2. Confirm n8n webhook method, URL, path, auth, and active/test mode.
3. Send a controlled test submission.
4. Save the raw payload received by n8n.
5. Compare payload fields to expected CRM/tracker fields.
6. Check mapping nodes for renamed, nested, or missing fields.
7. Check error handling and retry behavior.
8. Fix the smallest failing part.
9. Re-run complete, incomplete, and duplicate test cases.

## Deliverable

The audit report should include:

- root cause
- affected fields
- fixed nodes/settings
- before/after test evidence
- remaining risk
- recommended monitoring check

## Acceptance Criteria

- A valid GHL form submission triggers n8n exactly once.
- Required fields arrive with correct names and values.
- Incomplete leads are logged instead of silently disappearing.
- The owner/team alert includes enough detail to follow up.
- A future test lead can be run by the client without help.
