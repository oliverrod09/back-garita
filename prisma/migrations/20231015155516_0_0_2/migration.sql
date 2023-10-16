/*
  Warnings:

  - Added the required column `address` to the `Residences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Residences` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Residences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Residences" ("createdAt", "id", "identifier") SELECT "createdAt", "id", "identifier" FROM "Residences";
DROP TABLE "Residences";
ALTER TABLE "new_Residences" RENAME TO "Residences";
CREATE UNIQUE INDEX "Residences_identifier_key" ON "Residences"("identifier");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
