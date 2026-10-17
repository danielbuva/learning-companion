import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// One optimistic, atomically replaced aggregate per authenticated Site identity.
// Unrelated exercise edits are re-applied to the latest aggregate on contention.
export const learnerRecords = sqliteTable("learner_records", {
  owner: text("owner").primaryKey(),
  revision: integer("revision").notNull().default(0),
  document: text("document").notNull(),
  updated: text("updated").notNull(),
});
