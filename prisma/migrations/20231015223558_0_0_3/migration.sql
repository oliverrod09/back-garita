/*
  Warnings:

  - Added the required column `cedula` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cedula` to the `Invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellphone` to the `Invitations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "residenceIdenti" TEXT NOT NULL,
    CONSTRAINT "User_residenceIdenti_fkey" FOREIGN KEY ("residenceIdenti") REFERENCES "Residences" ("identifier") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "residenceIdenti") SELECT "createdAt", "email", "id", "name", "residenceIdenti" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");
CREATE TABLE "new_Invitations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL
);
INSERT INTO "new_Invitations" ("board", "createdAt", "description", "expiresAt", "id", "name", "role") SELECT "board", "createdAt", "description", "expiresAt", "id", "name", "role" FROM "Invitations";
DROP TABLE "Invitations";
ALTER TABLE "new_Invitations" RENAME TO "Invitations";
CREATE UNIQUE INDEX "Invitations_cedula_key" ON "Invitations"("cedula");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
