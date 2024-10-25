/*
  Warnings:

  - The values [ai] on the enum `MessageOrigin` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageOrigin_new" AS ENUM ('user', 'assistant');
ALTER TABLE "messages" ALTER COLUMN "origin" TYPE "MessageOrigin_new" USING ("origin"::text::"MessageOrigin_new");
ALTER TYPE "MessageOrigin" RENAME TO "MessageOrigin_old";
ALTER TYPE "MessageOrigin_new" RENAME TO "MessageOrigin";
DROP TYPE "MessageOrigin_old";
COMMIT;
