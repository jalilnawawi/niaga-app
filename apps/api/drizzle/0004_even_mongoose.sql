CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"cashierId" uuid NOT NULL,
	"openingCash" bigint NOT NULL,
	"openedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"closedAt" timestamp with time zone,
	"expectedCash" bigint,
	"countedCash" bigint,
	CONSTRAINT "shifts_id_tenantId_unique" UNIQUE("id","tenantId"),
	CONSTRAINT "shifts_opening_nonnegative" CHECK ("shifts"."openingCash" >= 0),
	CONSTRAINT "shifts_counted_nonnegative" CHECK ("shifts"."countedCash" >= 0),
	CONSTRAINT "shifts_close_fields" CHECK (("shifts"."closedAt" is null) = ("shifts"."expectedCash" is null) and ("shifts"."closedAt" is null) = ("shifts"."countedCash" is null))
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shiftId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_cashierId_users_id_fk" FOREIGN KEY ("cashierId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shifts_one_open_per_cashier" ON "shifts" USING btree ("tenantId","cashierId") WHERE "shifts"."closedAt" is null;--> statement-breakpoint
CREATE INDEX "shifts_tenantId_openedAt_index" ON "shifts" USING btree ("tenantId","openedAt");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shiftId_tenantId_shifts_id_tenantId_fk" FOREIGN KEY ("shiftId","tenantId") REFERENCES "public"."shifts"("id","tenantId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_tenantId_shiftId_index" ON "orders" USING btree ("tenantId","shiftId");