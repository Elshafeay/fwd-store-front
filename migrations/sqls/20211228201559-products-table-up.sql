CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "price" FLOAT NOT NULL,
  "category_id" INTEGER,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);