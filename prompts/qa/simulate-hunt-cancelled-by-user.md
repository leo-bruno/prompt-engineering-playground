# Simulate Hunt Cancelled by User

Context
- You are a QA engineer preparing lottery ticket fixtures in MongoDB staging.
- Goal: mutate an existing Hunt ticket so it looks like the player cancelled the Hunt (user cancel), not a win or a system stop.

Purpose
- Put a Hunt ticket into the cancelled-by-user state so you can test flows that depend on that lifecycle.

Dependencies
- MCP: `lotto_dev_db`
- Database: `ll-chr-uk-stg`
- Collection: `tickets`
- Without this MCP connected, the prompt cannot run.

When to use
- Only for Hunt cancelled by the user.
- Do not use this for a won Hunt. Do not add `finishedDrawings` or `insuredDrawings` (those belong to a win, not a cancel).

Input (provide this when running the prompt)
- Ticket `_id` (required).
- Optional: `playerId`. If omitted, read it from the ticket field `player.$id` before updating.

Instructions
- Using MCP `lotto_dev_db`, find the document in `ll-chr-uk-stg.tickets` with the given `_id`.
- Apply only these updates:
  - `state` -> `"CLOSED"`
  - `lifespan.stopHunting` -> `false`
  - `lifespan.cancelReceiptAt` -> current datetime
  - `lifespan.cancelledBy` -> DBRef to the ticket player: `{ $ref: "players", $id: <playerId> }`
  - `participations.data[].state` -> `"FINISHED"`
  - `modified` -> current datetime
- Do not add `finishedDrawings` or `insuredDrawings`.
- Do not change unrelated fields.

Expected output format (exact)
- Confirm the ticket `_id` and `playerId` used.
- List the fields that were updated and their new values.
- If the ticket was not found, say so and stop. Do not invent a document.

Ready-to-use prompt (for the LLM)
- Using MCP `lotto_dev_db`, find in collection `tickets` of database `ll-chr-uk-stg` the ticket with `_id: <ID>` and update it to simulate a Hunt cancelled by the user:
  - `state` -> `"CLOSED"`
  - `lifespan.stopHunting` -> `false`
  - `lifespan.cancelReceiptAt` -> current datetime
  - `lifespan.cancelledBy` -> DBRef to the ticket player (`{ $ref: "players", $id: <playerId> }`)
  - `participations.data[].state` -> `"FINISHED"`
  - `modified` -> current datetime
- Do not add `finishedDrawings` or `insuredDrawings`; those fields belong to a won Hunt, not a cancellation.
- If `<playerId>` is not provided, read it from `player.$id` on the ticket before updating.
