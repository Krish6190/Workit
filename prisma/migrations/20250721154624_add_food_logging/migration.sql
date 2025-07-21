-- CreateTable
CREATE TABLE "FoodLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "totalCalories" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FoodLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FoodLogItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foodLogId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "serving" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "imageUrl" TEXT,
    "time" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodLogItem_foodLogId_fkey" FOREIGN KEY ("foodLogId") REFERENCES "FoodLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT DEFAULT 'NA',
    "age" TEXT DEFAULT 'NA',
    "height" TEXT DEFAULT 'NA',
    "weight" TEXT DEFAULT 'NA',
    "sex" TEXT DEFAULT 'NA',
    "profileImg" TEXT DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("age", "createdAt", "email", "fullName", "height", "id", "password", "phone", "profileImg", "sex", "username", "weight") SELECT "age", "createdAt", "email", "fullName", "height", "id", "password", "phone", "profileImg", "sex", "username", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FoodLog_userId_date_key" ON "FoodLog"("userId", "date");
