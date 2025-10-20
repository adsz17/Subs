-- Alter the Service content column to store structured JSON data.
-- Existing Markdown entries are wrapped in a default section so they can
-- still be rendered using the new renderer.

ALTER TABLE "Service" ADD COLUMN "content_json" JSONB;

UPDATE "Service"
SET "content_json" = CASE
  WHEN "content" IS NULL THEN NULL
  WHEN length(trim("content")) = 0 THEN NULL
  ELSE jsonb_build_object(
    'version', 1,
    'sections', jsonb_build_array(
      jsonb_build_object(
        'id', concat("id", '-legacy'),
        'title', coalesce("name", 'Contenido'),
        'layout', 'markdown',
        'body', "content"
      )
    )
  )
END;

ALTER TABLE "Service" DROP COLUMN "content";
ALTER TABLE "Service" RENAME COLUMN "content_json" TO "content";
