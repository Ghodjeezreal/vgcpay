-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kyc_approved_at" TIMESTAMP(3),
ADD COLUMN     "kyc_rejected_at" TIMESTAMP(3),
ADD COLUMN     "kyc_rejection_reason" TEXT,
ADD COLUMN     "kyc_status" VARCHAR(20) NOT NULL DEFAULT 'not_submitted',
ADD COLUMN     "kyc_submitted_at" TIMESTAMP(3),
ADD COLUMN     "kyc_type" VARCHAR(20);

-- CreateTable
CREATE TABLE "kyc_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kyc_type" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(255),
    "date_of_birth" DATE,
    "phone_number" VARCHAR(20),
    "address" TEXT,
    "id_type" VARCHAR(50),
    "id_number" VARCHAR(100),
    "id_document_url" TEXT,
    "business_name" VARCHAR(255),
    "business_reg_number" VARCHAR(100),
    "business_address" TEXT,
    "business_type" VARCHAR(100),
    "cac_document_url" TEXT,
    "bank_name" VARCHAR(100) NOT NULL,
    "account_number" VARCHAR(20) NOT NULL,
    "account_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kyc_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kyc_requests_user_id_key" ON "kyc_requests"("user_id");

-- AddForeignKey
ALTER TABLE "kyc_requests" ADD CONSTRAINT "kyc_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
