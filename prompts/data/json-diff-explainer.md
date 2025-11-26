# JSON Diff Explainer — Two Files to Human Summary

Context
- You are a data engineer and technical writer. Given two JSON files (original vs. updated), detect structural and value differences and produce a concise, human-readable explanation.
- Focus on clarity, grouping related changes, and surfacing impact. Support nested objects, arrays, and type changes.

Input (provide when running the prompt)
- Original JSON: full content or a path/identifier.
- Updated JSON: full content or a path/identifier.
- Optional: keys to ignore, max depth for examples, whether to include unchanged context.

Instructions
- Parse both JSON documents and compute a diff (additions, removals, value changes, type changes).
- Normalize ordering for objects; for arrays, compare by index unless a stable key is given (if key provided, match by that key).
- Summarize changes with:
  - Diff summary (one to three bullets)
  - Changed fields (path, old value → new value, type changes highlighted)
  - Added fields (path, example value)
  - Removed fields (path, prior value)
- Use dotted JSON paths (e.g., `user.address.city`) and array indices (`items[2].id`).
- Keep explanations concise, avoid repeating unchanged data, and flag breaking changes (type or shape shifts).
- If no differences, state explicitly: "No differences detected."

Expected output format (exact)
- Return a Markdown document containing:
  1) A short header naming the comparison.
  2) A `---` separator line.
  3) Sections: `Diff summary`, `Changed fields`, `Added fields`, `Removed fields`, each as bullet lists; use `None` when empty.
  4) Optional `Notes` for assumptions or ignored keys.

Ready-to-use prompt (for the LLM)
- Using the Input above, compute the JSON differences and produce the Markdown document per the Expected output format. Do NOT add extra commentary beyond the specified sections.

Real example — Original vs. Updated
- Original JSON:
```json
{
  "orderId": "A123",
  "status": "processing",
  "customer": {
    "id": 42,
    "email": "alice@example.com"
  },
  "items": [
    { "sku": "SKU-1", "qty": 1, "price": 19.99 }
  ],
  "shipping": {
    "method": "standard",
    "cost": 5
  }
}
```
- Updated JSON:
```json
{
  "orderId": "A123",
  "status": "shipped",
  "customer": {
    "id": 42,
    "email": "alice@example.com",
    "vip": true
  },
  "items": [
    { "sku": "SKU-1", "qty": 2, "price": 19.99 },
    { "sku": "SKU-2", "qty": 1, "price": 9.5 }
  ],
  "shipping": {
    "method": "express",
    "cost": 15,
    "etaDays": 2
  },
  "tracking": {
    "carrier": "DHL",
    "code": "TRACK-999"
  }
}
```

- Expected output:
  - Diff summary:
    - Order moved from processing to shipped; shipping upgraded to express with ETA and tracking added.
    - Items updated: qty increased for SKU-1; new SKU-2 added.
  - Changed fields:
    - `status`: "processing" → "shipped"
    - `items[0].qty`: 1 → 2
    - `shipping.method`: "standard" → "express"
    - `shipping.cost`: 5 → 15
  - Added fields:
    - `customer.vip`: true
    - `items[1]`: { "sku": "SKU-2", "qty": 1, "price": 9.5 }
    - `shipping.etaDays`: 2
    - `tracking`: { "carrier": "DHL", "code": "TRACK-999" }
  - Removed fields:
    - None
