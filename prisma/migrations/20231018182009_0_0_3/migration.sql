/*
  Warnings:

  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "residenceIdenti" TEXT NOT NULL,
    CONSTRAINT "User_residenceIdenti_fkey" FOREIGN KEY ("residenceIdenti") REFERENCES "Residences" ("identifier") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("cedula", "createdAt", "email", "id", "name", "residenceIdenti") SELECT "cedula", "createdAt", "email", "id", "name", "residenceIdenti" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
