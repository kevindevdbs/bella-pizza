-- Remove drafts duplicados por mesa, mantendo o mais recente.
WITH ranked_drafts AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "table"
      ORDER BY "updatedAt" DESC, "createdAt" DESC, id DESC
    ) AS row_num
  FROM "orders"
  WHERE "draft" = true
)
DELETE FROM "orders"
WHERE id IN (
  SELECT id
  FROM ranked_drafts
  WHERE row_num > 1
);

-- Garante apenas um draft aberto por mesa sem afetar pedidos finalizados.
CREATE UNIQUE INDEX IF NOT EXISTS "orders_unique_open_draft_per_table_idx"
ON "orders" ("table")
WHERE "draft" = true;
