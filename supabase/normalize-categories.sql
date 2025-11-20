-- Normalize category values to match filter expectations
-- This ensures category filtering works correctly

-- Update variations to standard lowercase values
UPDATE news_articles SET category = 'llms' WHERE category IN ('LLMs', 'llms');
UPDATE news_articles SET category = 'cv' WHERE category = 'Computer Vision';
UPDATE news_articles SET category = 'agi' WHERE category = 'agi';
UPDATE news_articles SET category = 'agents' WHERE category IN ('AI Agents', 'agents');
UPDATE news_articles SET category = 'ml' WHERE category = 'ml';

-- Verify the update
SELECT category, COUNT(*) as count
FROM news_articles
GROUP BY category
ORDER BY count DESC;
