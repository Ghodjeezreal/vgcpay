/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add slug column as nullable first
ALTER TABLE "events" ADD COLUMN "slug" VARCHAR(255);

-- Step 2: Generate slugs for existing events
UPDATE "events" 
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^\w\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '--+', '-', 'g'
  )
)
WHERE "slug" IS NULL;

-- Step 3: Add timestamp to make slugs unique if needed
UPDATE "events" e1
SET "slug" = e1."slug" || '-' || EXTRACT(EPOCH FROM e1."created_at")::TEXT
WHERE EXISTS (
  SELECT 1 FROM "events" e2 
  WHERE e2."slug" = e1."slug" 
  AND e2."id" < e1."id"
);

-- Step 4: Make slug NOT NULL
ALTER TABLE "events" ALTER COLUMN "slug" SET NOT NULL;

-- Step 5: Create unique index
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
