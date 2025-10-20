-- Ensure the Service.content column uses JSONB while preserving any existing
-- markdown entries by wrapping them in the structured JSON format expected by
-- the application.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Service'
      AND column_name = 'content'
      AND data_type <> 'jsonb'
  ) THEN
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
  END IF;
END
$$ LANGUAGE plpgsql;
