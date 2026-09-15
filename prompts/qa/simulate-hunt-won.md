# Simulate Hunt Won

Context
- You are a QA engineer preparing lottery ticket fixtures in MongoDB staging.
- Goal: mutate an existing Hunt ticket so it looks like the Hunt was won, not cancelled.

Purpose
- Put a Hunt ticket into the won state so you can test flows that depend on that lifecycle.

Dependencies
- MCP: `lotto_dev_db`
- Database: `ll-chr-uk-stg`
- Collection: `tickets`
- Without this MCP connected, the prompt cannot run.

When to use
- Only for a won Hunt.
- Do not use this for a user cancel. Do not add `cancelReceiptAt` or `cancelledBy` (those belong to a cancellation, not a win).

Input (provide this when running the prompt)
- Ticket `_id` (required).
- Optional: `drawingId`. If omitted, read it from the ticket field `lifespan.firstDrawing` before updating.

Instructions
- Using MCP `lotto_dev_db`, find the document in `ll-chr-uk-stg.tickets` with the given `_id`.
- Apply only these updates:
  - `state` -> `"CLOSED"`
  - `lifespan.stopHunting` -> `true`
  - `lifespan.finishedDrawings` -> `["<drawingId>"]`
  - `lifespan.insuredDrawings` -> `["<drawingId>"]`
  - `participations.data[].state` -> `"FINISHED"`
  - `modified` -> current datetime
- Do not add `cancelReceiptAt` or `cancelledBy`.
- Do not change unrelated fields.

Expected output format (exact)
- Confirm the ticket `_id` and `drawingId` used.
- List the fields that were updated and their new values.
- If the ticket was not found, say so and stop. Do not invent a document.

Ready-to-use prompt (for the LLM)
- Using MCP `lotto_dev_db`, find in collection `tickets` of database `ll-chr-uk-stg` the ticket with `_id: <ID>` and update it to simulate a won Hunt:
  - `state` -> `"CLOSED"`
  - `lifespan.stopHunting` -> `true`
  - `lifespan.finishedDrawings` -> `["<drawingId>"]`
  - `lifespan.insuredDrawings` -> `["<drawingId>"]`
  - `participations.data[].state` -> `"FINISHED"`
  - `modified` -> current datetime
- Do not add `cancelReceiptAt` or `cancelledBy`; those fields belong to a cancellation, not a won Hunt.
- If `<drawingId>` is not provided, read it from `lifespan.firstDrawing` on the ticket before updating.
