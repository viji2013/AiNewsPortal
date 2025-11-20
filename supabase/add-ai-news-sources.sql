-- Add AI News RSS Sources
-- Run this in Supabase SQL Editor to add live AI news feeds

-- First, delete any existing sources to avoid duplicates
DELETE FROM sources;

-- Now insert the AI news sources
INSERT INTO sources (name, type, api_url, is_active) VALUES
('OpenAI Blog', 'rss', 'https://openai.com/blog/rss.xml', true),
('Google AI Blog', 'rss', 'https://blog.google/technology/ai/rss/', true),
('DeepMind Blog', 'rss', 'https://deepmind.google/blog/rss.xml', true),
('Anthropic News', 'rss', 'https://www.anthropic.com/news/rss.xml', true),
('Hugging Face Blog', 'rss', 'https://huggingface.co/blog/feed.xml', true),
('AI News - MIT Technology Review', 'rss', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', true),
('The Batch by DeepLearning.AI', 'rss', 'https://www.deeplearning.ai/the-batch/feed/', true);

SELECT 'AI News sources added successfully!' AS status;
SELECT * FROM sources WHERE is_active = true;
