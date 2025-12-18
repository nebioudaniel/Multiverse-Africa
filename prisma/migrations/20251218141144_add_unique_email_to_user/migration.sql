/*
  Warnings:

  - Made the column `email` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "email" SET NOT NULL;
