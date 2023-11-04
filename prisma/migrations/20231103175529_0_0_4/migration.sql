/*
  Warnings:

  - You are about to drop the column `cedula` on the `Controls` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Controls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "salt" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Controls_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Controls" ("createdAt", "email", "hash", "id", "name", "roleId", "salt") SELECT "createdAt", "email", "hash", "id", "name", "roleId", "salt" FROM "Controls";
DROP TABLE "Controls";
ALTER TABLE "new_Controls" RENAME TO "Controls";
CREATE UNIQUE INDEX "Controls_email_key" ON "Controls"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
