-- Database Performance Optimization Indexes
-- Run these commands on your Neon PostgreSQL database for better performance

-- Index for state filtering (most common filter)
CREATE INDEX IF NOT EXISTS idx_contractors_state ON contractors(state);

-- Index for license number lookups (exact matches)
CREATE INDEX IF NOT EXISTS idx_contractors_license_no ON contractors(license_no);

-- Index for business name searches (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_contractors_business_name_gin ON contractors USING gin(to_tsvector('english', business_name));

-- Index for city searches (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_contractors_city_lower ON contractors(lower(city));

-- Index for primary classification searches
CREATE INDEX IF NOT EXISTS idx_contractors_primary_classification ON contractors(primary_classification);

-- Index for trade searches
CREATE INDEX IF NOT EXISTS idx_contractors_trade ON contractors(trade);

-- Index for status filtering (active contractors)
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(primary_status);

-- Composite index for common search patterns (state + status)
CREATE INDEX IF NOT EXISTS idx_contractors_state_status ON contractors(state, primary_status);

-- Composite index for city searches with state
CREATE INDEX IF NOT EXISTS idx_contractors_state_city ON contractors(state, lower(city));

-- Composite index for classification searches with state
CREATE INDEX IF NOT EXISTS idx_contractors_state_classification ON contractors(state, primary_classification);

-- Index for full-text search on raw_classifications
CREATE INDEX IF NOT EXISTS idx_contractors_raw_classifications_gin ON contractors USING gin(to_tsvector('english', raw_classifications));

-- Index for expiration date (useful for license renewal queries)
CREATE INDEX IF NOT EXISTS idx_contractors_expiration_date ON contractors(expiration_date);

-- Analyze tables to update statistics after index creation
ANALYZE contractors;

-- Show index usage statistics (run after site has been live)
-- SELECT schemaname, tablename, attname, n_distinct, correlation 
-- FROM pg_stats 
-- WHERE tablename = 'contractors' 
-- ORDER BY n_distinct DESC;