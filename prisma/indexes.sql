-- prisma/indexes.sql  ← DROP IN
-- Fast array membership queries on features
CREATE INDEX IF NOT EXISTS idx_listingspec_equipment_gin   ON "ListingSpec" USING GIN ("equipment");
CREATE INDEX IF NOT EXISTS idx_listingspec_parkingaid_gin  ON "ListingSpec" USING GIN ("parkingAid");
CREATE INDEX IF NOT EXISTS idx_listingspec_airbags_gin     ON "ListingSpec" USING GIN ("airbags");

-- Optional: faster ILIKE on title/make/model via trigram (needs pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_listing_title_trgm ON "Listing" USING GIN ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_listing_make_trgm  ON "Listing" USING GIN ("make"  gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_listing_model_trgm ON "Listing" USING GIN ("model" gin_trgm_ops);
