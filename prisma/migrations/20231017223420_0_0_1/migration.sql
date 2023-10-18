/*
  Warnings:

  - Added the required column `cod` to the `Invitations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invitations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "cellphone" TEXT,
    "board" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "residenceId" INTEGER NOT NULL,
    CONSTRAINT "Invitations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitations_residenceId_fkey" FOREIGN KEY ("residenceId") REFERENCES "Residences" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invitations" ("board", "cedula", "cellphone", "createdAt", "description", "expiresAt", "id", "name", "residenceId", "userId") SELECT "board", "cedula", "cellphone", "createdAt", "description", "expiresAt", "id", "name", "residenceId", "userId" FROM "Invitations";
DROP TABLE "Invitations";
ALTER TABLE "new_Invitations" RENAME TO "Invitations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
