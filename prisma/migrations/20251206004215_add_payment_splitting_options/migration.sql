-- AlterTable
ALTER TABLE "events" ADD COLUMN     "fee_bearer" VARCHAR(20) NOT NULL DEFAULT 'organizer',
ADD COLUMN     "platform_fee_percent" DECIMAL(5,2) NOT NULL DEFAULT 8.00;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "paystack_subaccount_code" VARCHAR(50);
