-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "fromName" TEXT NOT NULL DEFAULT '',
    "fromEmail" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "recipients" INTEGER NOT NULL DEFAULT 0,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL DEFAULT 'general',
    "senderName" TEXT,
    "senderDepartment" TEXT,
    "topic" TEXT,
    "targetAudience" TEXT,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Campaign" ("bounced", "clicked", "createdAt", "fromEmail", "fromName", "id", "lastSyncedAt", "opened", "recipients", "sentAt", "status", "subject", "title", "unsubscribed") SELECT "bounced", "clicked", "createdAt", coalesce("fromEmail", '') AS "fromEmail", coalesce("fromName", '') AS "fromName", "id", "lastSyncedAt", "opened", "recipients", "sentAt", "status", "subject", "title", "unsubscribed" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
