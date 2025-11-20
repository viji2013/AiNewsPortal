-- Reset and load correct sample articles
-- Run this in Supabase SQL Editor to clear old data and load fresh articles

-- First, delete all existing articles
DELETE FROM news_articles;

-- Reset the ID sequence to start from 1
ALTER SEQUENCE news_articles_id_seq RESTART WITH 1;

-- Now insert the correct sample articles with proper category values
INSERT INTO news_articles (title, summary, category, source, url, image_url, published_at) VALUES
-- LLMs
(
  'GPT-4 Turbo Launches with Enhanced Capabilities',
  'OpenAI announces GPT-4 Turbo, featuring improved performance, longer context windows up to 128K tokens, and reduced pricing. The model demonstrates significant improvements in following instructions and handling complex tasks.',
  'llms',
  'OpenAI Blog',
  'https://openai.com/blog/gpt-4-turbo',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  NOW() - INTERVAL '2 hours'
),
(
  'Google Gemini 1.5 Pro Achieves Breakthrough in Multimodal AI',
  'Google unveils Gemini 1.5 Pro with unprecedented 1 million token context window and native multimodal capabilities. The model can process video, audio, and text simultaneously.',
  'llms',
  'Google AI Blog',
  'https://blog.google/technology/ai/google-gemini',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  NOW() - INTERVAL '5 hours'
),
(
  'Meta Releases Llama 3: Open Source LLM Revolution',
  'Meta AI introduces Llama 3, their most capable open-source large language model yet. Available in 8B and 70B parameter versions.',
  'llms',
  'Meta AI',
  'https://ai.meta.com/blog/llama-3',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
  NOW() - INTERVAL '1 day'
),
(
  'Anthropic Claude 3 Opus Surpasses GPT-4 in Key Benchmarks',
  'Anthropic unveils Claude 3 family with Opus, Sonnet, and Haiku models. Claude 3 Opus demonstrates superior performance on complex reasoning tasks.',
  'llms',
  'Anthropic',
  'https://www.anthropic.com/claude-3',
  'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800',
  NOW() - INTERVAL '6 hours'
),

-- Computer Vision
(
  'DALL-E 3 Integration with ChatGPT Transforms Creative Workflows',
  'OpenAI integrates DALL-E 3 directly into ChatGPT, enabling seamless text-to-image generation within conversations.',
  'cv',
  'OpenAI',
  'https://openai.com/dall-e-3',
  'https://images.unsplash.com/photo-1686191128892-c0557e5e8d5e?w=800',
  NOW() - INTERVAL '8 hours'
),
(
  'Stable Diffusion XL 1.0 Sets New Standard for Image Generation',
  'Stability AI releases SDXL 1.0, featuring improved image quality, better prompt adherence, and enhanced photorealism.',
  'cv',
  'Stability AI',
  'https://stability.ai/news/stable-diffusion-sdxl',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800',
  NOW() - INTERVAL '12 hours'
),
(
  'YOLO v8 Achieves Real-Time Object Detection at 300 FPS',
  'Ultralytics releases YOLO v8 with significant improvements in speed and accuracy. The model achieves real-time object detection on edge devices.',
  'cv',
  'Ultralytics',
  'https://github.com/ultralytics/ultralytics',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
  NOW() - INTERVAL '7 hours'
),

-- Machine Learning
(
  'Reinforcement Learning Breakthrough in Robotics',
  'Researchers apply AlphaGo Zero''s self-learning approach to robotic control, achieving human-level dexterity without human demonstrations.',
  'ml',
  'DeepMind',
  'https://deepmind.google/discover/blog/',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
  NOW() - INTERVAL '15 hours'
),
(
  'Transformer Architecture Celebrates 6 Years of Innovation',
  'The groundbreaking "Attention Is All You Need" paper turns 6, having revolutionized NLP and beyond.',
  'ml',
  'Research',
  'https://arxiv.org/abs/1706.03762',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
  NOW() - INTERVAL '4 hours'
),

-- AI Agents
(
  'AutoGPT: Autonomous AI Agents Gain Traction',
  'AutoGPT framework enables AI agents to autonomously break down and execute complex tasks.',
  'agents',
  'GitHub',
  'https://github.com/Significant-Gravitas/AutoGPT',
  'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800',
  NOW() - INTERVAL '3 hours'
),
(
  'Microsoft Copilot Expands Across Office Suite',
  'Microsoft integrates AI-powered Copilot across Word, Excel, PowerPoint, and Outlook.',
  'agents',
  'Microsoft',
  'https://www.microsoft.com/en-us/microsoft-365/copilot',
  'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
  NOW() - INTERVAL '10 hours'
),

-- NLP
(
  'BERT Successor Achieves 99% Accuracy on Language Understanding',
  'New transformer model surpasses BERT on all major NLP benchmarks while using 50% fewer parameters.',
  'nlp',
  'Research',
  'https://arxiv.org/abs/example',
  'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800',
  NOW() - INTERVAL '9 hours'
),
(
  'Multilingual NLP Models Break Language Barriers',
  'New cross-lingual models achieve native-level performance across 100+ languages simultaneously.',
  'nlp',
  'Google Research',
  'https://research.google/pubs/',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  NOW() - INTERVAL '14 hours'
),

-- AGI
(
  'OpenAI Announces Progress Toward Artificial General Intelligence',
  'OpenAI shares research roadmap and safety measures for developing AGI systems.',
  'agi',
  'OpenAI',
  'https://openai.com/research',
  'https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=800',
  NOW() - INTERVAL '1 day'
),

-- Robotics
(
  'Boston Dynamics Atlas Robot Demonstrates Advanced Parkour',
  'Humanoid robot performs complex acrobatic maneuvers, showcasing breakthrough in robotic agility.',
  'robotics',
  'Boston Dynamics',
  'https://www.bostondynamics.com/',
  'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800',
  NOW() - INTERVAL '18 hours'
);

-- Show results
SELECT 'Articles reset and loaded successfully!' AS status;
SELECT category, COUNT(*) as count FROM news_articles GROUP BY category ORDER BY category;
SELECT 'Total articles: ' || COUNT(*) as total FROM news_articles;
