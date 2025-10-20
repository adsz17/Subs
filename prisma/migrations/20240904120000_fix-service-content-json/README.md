# Fix Service content column type

This migration conditionally converts the `Service.content` column to JSONB by
wrapping any existing markdown content in the structured JSON shape expected by
the application. The logic only runs when the column is still stored as text,
so environments that already use JSONB will remain unchanged.
