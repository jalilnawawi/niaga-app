ALTER TABLE "users" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX "sessions_userId_index" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "users_tenantId_index" ON "users" USING btree ("tenantId");