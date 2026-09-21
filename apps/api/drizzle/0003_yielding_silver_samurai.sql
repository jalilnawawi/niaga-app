CREATE TYPE "public"."order_status" AS ENUM('paid', 'void');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'qris');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"orderId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"qty" integer NOT NULL,
	CONSTRAINT "order_items_price_nonnegative" CHECK ("order_items"."price" >= 0),
	CONSTRAINT "order_items_qty_positive" CHECK ("order_items"."qty" > 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"businessDate" date DEFAULT (now() at time zone 'Asia/Jakarta')::date NOT NULL,
	"number" integer NOT NULL,
	"cashierId" uuid NOT NULL,
	"total" bigint NOT NULL,
	"paid" bigint NOT NULL,
	"paymentMethod" "payment_method" NOT NULL,
	"status" "order_status" DEFAULT 'paid' NOT NULL,
	"voidReason" text,
	"voidedById" uuid,
	"voidedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_tenantId_businessDate_number_unique" UNIQUE("tenantId","businessDate","number"),
	CONSTRAINT "orders_id_tenantId_unique" UNIQUE("id","tenantId"),
	CONSTRAINT "orders_total_nonnegative" CHECK ("orders"."total" >= 0),
	CONSTRAINT "orders_paid_covers_total" CHECK ("orders"."paid" >= "orders"."total"),
	CONSTRAINT "orders_qris_exact" CHECK ("orders"."paymentMethod" <> 'qris' or "orders"."paid" = "orders"."total"),
	CONSTRAINT "orders_void_fields" CHECK (("orders"."status" = 'void') = ("orders"."voidReason" is not null and "orders"."voidedById" is not null and "orders"."voidedAt" is not null))
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_tenantId_orders_id_tenantId_fk" FOREIGN KEY ("orderId","tenantId") REFERENCES "public"."orders"("id","tenantId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashierId_users_id_fk" FOREIGN KEY ("cashierId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_voidedById_users_id_fk" FOREIGN KEY ("voidedById") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_items_tenantId_orderId_index" ON "order_items" USING btree ("tenantId","orderId");