import { mkdir, readFile, writeFile } from "node:fs/promises";

const defaultCatalogPath = "demo/swiss-quote-agent/catalog-sample.json";
const defaultRequestPath = "demo/swiss-quote-agent/sample-request.txt";
const defaultOutDir = "demo/output/swiss-quote-agent";

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9/.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function quantityForAlias(normalizedRequest, normalizedAlias) {
  const escaped = normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const before = new RegExp(`(?:^|\\s)(\\d{1,2})\\s+(?:x\\s+)?${escaped}(?:\\s|$)`);
  const after = new RegExp(`(?:^|\\s)${escaped}\\s+(?:x\\s+)?(\\d{1,2})(?:\\s|$)`);
  const beforeMatch = normalizedRequest.match(before);
  const afterMatch = normalizedRequest.match(after);
  return Number(beforeMatch?.[1] || afterMatch?.[1] || 1);
}

function findLaborHours(normalizedRequest) {
  const match = normalizedRequest.match(/(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:h|heure|heures|hour|hours)/);
  return match ? Number(match[1].replace(",", ".")) : 1;
}

function findMissingItems(normalizedRequest, matchedAliases) {
  const knownMatched = new Set(matchedAliases);
  const missingRules = [
    ["cartouche thermostatique", ["cartouche thermostatique", "thermostatique"]],
    ["produit non reference: intervention generale", ["depannage", "intervention urgente"]],
  ];

  return missingRules
    .filter(([, aliases]) => aliases.some((alias) => normalizedRequest.includes(alias) && !knownMatched.has(alias)))
    .map(([label]) => label);
}

function generateQuote(request, catalog) {
  const normalizedRequest = normalize(request);
  const matchedAliases = [];
  const lines = [];

  for (const item of catalog.items || []) {
    const alias = [item.reference, item.name, ...(item.aliases || [])]
      .map(normalize)
      .filter(Boolean)
      .find((candidate) => normalizedRequest.includes(candidate));

    if (!alias) continue;
    matchedAliases.push(alias);
    const quantity = quantityForAlias(normalizedRequest, alias);
    const materialSubtotal = roundMoney(quantity * item.unitPriceChf);
    const withMargin = roundMoney(materialSubtotal * (1 + catalog.marginRate));
    lines.push({
      supplier: item.supplier,
      reference: item.reference,
      name: item.name,
      matchedAlias: alias,
      quantity,
      unitPriceChf: item.unitPriceChf,
      materialSubtotalChf: materialSubtotal,
      priceWithMarginChf: withMargin,
    });
  }

  const materialSubtotalChf = roundMoney(lines.reduce((sum, line) => sum + line.materialSubtotalChf, 0));
  const materialWithMarginChf = roundMoney(lines.reduce((sum, line) => sum + line.priceWithMarginChf, 0));
  const laborHours = findLaborHours(normalizedRequest);
  const laborChf = roundMoney(laborHours * catalog.laborRateChf);
  const travelChf = roundMoney(catalog.travelFeeChf);
  const preVatChf = roundMoney(materialWithMarginChf + laborChf + travelChf);
  const vatChf = roundMoney(preVatChf * catalog.vatRate);
  const totalChf = roundMoney(preVatChf + vatChf);
  const missingItems = findMissingItems(normalizedRequest, matchedAliases);

  return {
    request,
    prototypeRule: "Fail closed: only exact reference/name/alias matches become quote lines. Unmatched products are flagged, not priced.",
    catalogNote: catalog.supplierNote,
    assumptions: {
      materialMarginRate: catalog.marginRate,
      laborRateChf: catalog.laborRateChf,
      laborHours,
      travelFeeChf: catalog.travelFeeChf,
      vatRate: catalog.vatRate,
    },
    matchedCatalogLines: lines,
    missingItems,
    totals: {
      materialSubtotalChf,
      materialWithMarginChf,
      laborChf,
      travelChf,
      preVatChf,
      vatChf,
      totalChf,
    },
    n8nWorkflowShape: [
      "Webhook/Form Trigger",
      "Normalize French request",
      "Catalog lookup by exact reference/name/approved aliases",
      "IF all products matched -> quote calculation",
      "IF missing products -> human review queue",
      "HTML/PDF quote generation",
      "Email or CRM handoff with audit log",
    ],
  };
}

function renderMarkdown(quote) {
  const lineRows = quote.matchedCatalogLines
    .map(
      (line) =>
        `| ${line.supplier} | ${line.reference} | ${line.name} | ${line.quantity} | ${line.unitPriceChf.toFixed(2)} | ${line.priceWithMarginChf.toFixed(2)} |`,
    )
    .join("\n");

  return [
    "# Swiss Plumbing/HVAC Quote Agent Prototype",
    "",
    "This is a credential-free proof for an n8n AI quoting agent. It uses a tiny sample catalog and intentionally fails closed when a requested product is not in the catalog.",
    "",
    "## Input",
    "",
    quote.request,
    "",
    "## Matched Catalog Lines",
    "",
    "| Supplier | Reference | Product | Qty | Unit CHF | With 15% Margin CHF |",
    "|---|---|---|---:|---:|---:|",
    lineRows || "| - | - | No exact matches | - | - | - |",
    "",
    "## Missing / Human Review",
    "",
    quote.missingItems.length ? quote.missingItems.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    "## Totals",
    "",
    `- Materials before margin: CHF ${quote.totals.materialSubtotalChf.toFixed(2)}`,
    `- Materials with 15% margin: CHF ${quote.totals.materialWithMarginChf.toFixed(2)}`,
    `- Labor: ${quote.assumptions.laborHours} h x CHF ${quote.assumptions.laborRateChf}/h = CHF ${quote.totals.laborChf.toFixed(2)}`,
    `- Travel: CHF ${quote.totals.travelChf.toFixed(2)}`,
    `- VAT 8.1%: CHF ${quote.totals.vatChf.toFixed(2)}`,
    `- Total: CHF ${quote.totals.totalChf.toFixed(2)}`,
    "",
    "## n8n Workflow Shape",
    "",
    quote.n8nWorkflowShape.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    "",
    "## Safety Rule",
    "",
    quote.prototypeRule,
    "",
  ].join("\n");
}

function renderHtml(quote) {
  const rows = quote.matchedCatalogLines
    .map(
      (line) =>
        `<tr><td>${line.supplier}</td><td>${line.reference}</td><td>${line.name}</td><td>${line.quantity}</td><td>CHF ${line.unitPriceChf.toFixed(2)}</td><td>CHF ${line.priceWithMarginChf.toFixed(2)}</td></tr>`,
    )
    .join("");

  return [
    "<!doctype html>",
    '<meta charset="utf-8">',
    "<title>Swiss Quote Prototype Output</title>",
    '<style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.5;color:#17221d}table{border-collapse:collapse;width:100%;margin:20px 0}td,th{border:1px solid #cfc4b3;padding:8px;text-align:left}th{background:#efe4d0}.total{font-size:1.3rem;font-weight:700}</style>',
    "<h1>Swiss Quote Prototype Output</h1>",
    `<p>${quote.request}</p>`,
    "<table><thead><tr><th>Supplier</th><th>Reference</th><th>Product</th><th>Qty</th><th>Unit</th><th>With margin</th></tr></thead><tbody>",
    rows || '<tr><td colspan="6">No exact matches.</td></tr>',
    "</tbody></table>",
    "<h2>Human Review</h2>",
    quote.missingItems.length ? `<ul>${quote.missingItems.map((item) => `<li>${item}</li>`).join("")}</ul>` : "<p>None</p>",
    `<p class="total">Total: CHF ${quote.totals.totalChf.toFixed(2)}</p>`,
    `<p>${quote.prototypeRule}</p>`,
  ].join("\n");
}

async function loadJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function runSelfTest() {
  const catalog = await loadJson(defaultCatalogPath);
  const request = await readFile(defaultRequestPath, "utf8");
  const quote = generateQuote(request, catalog);
  const refs = quote.matchedCatalogLines.map((line) => line.reference);

  if (!refs.includes("GM-GROHE-23875000")) throw new Error("missing Grohe catalog match");
  if (!refs.includes("ST-SIPHON-114-CH")) throw new Error("missing siphon catalog match");
  if (!quote.missingItems.includes("cartouche thermostatique")) throw new Error("missing fail-closed review item");
  if (quote.matchedCatalogLines.some((line) => /cartouche/i.test(line.name))) throw new Error("hallucinated missing catalog line");
  if (quote.totals.totalChf <= 0) throw new Error("invalid total");

  console.log("swiss quote prototype self-test passed");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    await runSelfTest();
    return;
  }

  const catalogPath = args[0] || defaultCatalogPath;
  const requestPath = args[1] || defaultRequestPath;
  const outDir = args[2] || defaultOutDir;
  const catalog = await loadJson(catalogPath);
  const request = await readFile(requestPath, "utf8");
  const quote = generateQuote(request, catalog);

  await mkdir(outDir, { recursive: true });
  await writeFile(`${outDir}/quote-output.json`, `${JSON.stringify(quote, null, 2)}\n`);
  await writeFile(`${outDir}/quote-output.md`, renderMarkdown(quote));
  await writeFile(`${outDir}/quote-output.html`, renderHtml(quote));
  console.log(`Wrote Swiss quote prototype outputs to ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export { generateQuote, renderMarkdown, renderHtml };
