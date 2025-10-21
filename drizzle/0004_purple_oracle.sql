ALTER TABLE "chats" ADD COLUMN "frameId" varchar;--> statement-breakpoint
ALTER TABLE "frames" ADD COLUMN "designCode" text;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_frameId_frames_frameId_fk" FOREIGN KEY ("frameId") REFERENCES "public"."frames"("frameId") ON DELETE no action ON UPDATE no action;