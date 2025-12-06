/*
  Warnings:

  - You are about to drop the column `paystack_subaccount_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "paystack_subaccount_code";
