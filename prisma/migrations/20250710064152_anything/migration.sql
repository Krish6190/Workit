-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" TEXT DEFAULT 'NA',
    "height" TEXT DEFAULT 'NA',
    "weight" TEXT DEFAULT 'NA',
    "sex" TEXT DEFAULT 'NA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
