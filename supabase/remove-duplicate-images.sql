-- Remove duplicate articles that have the same image_url
-- Keeps the oldest article for each unique image

-- First, let's see how many duplicates we have
SELECT image_url, COUNT(*) as count
FROM news_articles
WHERE image_url IS NOT NULL
GROUP BY image_url
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Delete duplicates, keeping only the oldest article for each image
DELETE FROM news_articles
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY image_url ORDER BY created_at ASC) as rn
    FROM news_articles
    WHERE image_url IS NOT NULL
  ) t
  WHERE rn > 1
);

-- Verify the cleanup
SELECT COUNT(*) as total_articles FROM news_articles;
SELECT COUNT(DISTINCT image_url) as unique_images FROM news_articles WHERE image_url IS NOT NULL;
