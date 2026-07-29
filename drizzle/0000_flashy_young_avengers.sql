CREATE TABLE "mazes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"name" text NOT NULL,
	"maze_size" jsonb NOT NULL,
	"maze_data" jsonb NOT NULL,
	"start" jsonb NOT NULL,
	"end" jsonb NOT NULL,
	"resolved_path" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
