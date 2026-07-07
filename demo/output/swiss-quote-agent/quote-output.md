# Swiss Plumbing/HVAC Quote Agent Prototype

This is a credential-free proof for an n8n AI quoting agent. It uses a tiny sample catalog and intentionally fails closed when a requested product is not in the catalog.

## Input

Client a Lausanne: remplacement d'un robinet lavabo Grohe Eurosmart avec siphon lavabo, flexible inox 3/8 et cartouche thermostatique. Prevoir 2 heures de main d'oeuvre.


## Matched Catalog Lines

| Supplier | Reference | Product | Qty | Unit CHF | With 15% Margin CHF |
|---|---|---|---:|---:|---:|
| Getaz Miauton | GM-GROHE-23875000 | Mitigeur lavabo Grohe Eurosmart S | 1 | 118.40 | 136.16 |
| Sanitas Troesch | ST-SIPHON-114-CH | Siphon lavabo chrome 1 1/4 | 1 | 34.90 | 40.14 |
| Nussbaum | NB-FLEX-38-50 | Flexible inox 3/8 50 cm | 1 | 22.60 | 25.99 |

## Missing / Human Review

- cartouche thermostatique

## Totals

- Materials before margin: CHF 175.90
- Materials with 15% margin: CHF 202.29
- Labor: 2 h x CHF 95/h = CHF 190.00
- Travel: CHF 45.00
- VAT 8.1%: CHF 35.42
- Total: CHF 472.71

## n8n Workflow Shape

1. Webhook/Form Trigger
2. Normalize French request
3. Catalog lookup by exact reference/name/approved aliases
4. IF all products matched -> quote calculation
5. IF missing products -> human review queue
6. HTML/PDF quote generation
7. Email or CRM handoff with audit log

## Safety Rule

Fail closed: only exact reference/name/alias matches become quote lines. Unmatched products are flagged, not priced.
