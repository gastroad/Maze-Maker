ALTER TABLE "mazes" ADD COLUMN "level" integer;--> statement-breakpoint
ALTER TABLE "mazes" ADD COLUMN "stage" integer;--> statement-breakpoint
CREATE UNIQUE INDEX "mazes_level_stage_idx" ON "mazes" USING btree ("level","stage");