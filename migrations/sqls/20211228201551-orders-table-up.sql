CREATE TYPE order_status AS ENUM ('Pending', 'Completed', 'Canceled');

CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL,
  "status" order_status,
  "sub_total" FLOAT,
  "user_id" INTEGER REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);