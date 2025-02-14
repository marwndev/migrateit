CREATE TABLE "app"."users" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(100) NOT NULL,
      "email" VARCHAR(300) UNIQUE NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP
)
