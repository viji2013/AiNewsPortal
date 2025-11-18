# Requirements Document

## Introduction

This document defines the requirements for redesigning the AI News App UI to match the professional layout and visual style of the Reuters "Artificial Intelligence" news section. The redesign aims to create a clean, editorial, premium news layout with large hero images, well-structured cards, and strict prevention of duplicate images while maintaining a "shorts style" vertical experience.

## Glossary

- **Reuters Style**: Professional editorial news layout characterized by large images, clean typography, and minimalistic design
- **Shorts Style**: Vertical scrolling feed with full-width cards, similar to InShorts app
- **Hero Image**: Large, prominent image at the top of each article card
- **Deduplication**: Process of filtering articles to ensure no duplicate images appear in the feed
- **Skeleton Loader**: Placeholder UI shown while content is loading
- **Editorial Grid**: Multi-column layout used on desktop for news articles
- **Meta Info**: Secondary information like source, date, and category displayed in muted text

## Requirements

### Requirement 1: Image Deduplication

**User Story:** As a user, I want to see unique images for each article in my feed, so that I have a clean browsing experience without visual repetition.

#### Acceptance Criteria

1. THE ArticleFeed Component SHALL filter articles based on image_url before rendering to prevent duplicate images
2. THE ArticleFeed Component SHALL guarantee only one image per article is displayed
3. THE ArticleFeed Component SHALL use a fallback placeholder image when an article has no image_url
4. THE ArticleFeed Component SHALL maintain article uniqueness by tracking seen image URLs in the deduplication logic
5. THE ArticleCard Component SHALL display exactly one image per card with no duplicate image elements

### Requirement 2: Reuters-Inspired Visual Design

**User Story:** As a user, I want the app to have a professional, editorial appearance similar to Reuters, so that I trust the content and enjoy a premium reading experience.

#### Acceptance Criteria

1. THE ArticleCard Component SHALL use bold headlines with font-weight of 600 or higher and standard readable size
2. THE UI SHALL implement clean typography using a combination of serif and sans-serif fonts
3. THE UI SHALL use a neutral color palette consisting primarily of black, gray, and white tones
4. THE ArticleCard Component SHALL maintain consistent spacing between elements using Tailwind spacing utilities
5. THE UI SHALL present a minimalistic, clutter-free layout with ample whitespace

### Requirement 3: Compact Card Layout

**User Story:** As a user, I want articles displayed in a clean card format with standard-sized images, so that I can quickly scan and read news efficiently.

#### Acceptance Criteria

1. THE ArticleCard Component SHALL display a standard-sized image (200-250px height) with aspect ratio of 16:9
2. THE ArticleCard Component SHALL position the headline directly under the image with bold, readable typography
3. THE ArticleCard Component SHALL display a 2-3 line summary text below the headline with line-clamp CSS
4. THE ArticleCard Component SHALL show meta information including source and date in small muted text
5. THE ArticleFeed Component SHALL render cards in a scroll-friendly vertical feed optimized for mobile devices

### Requirement 4: Responsive Layout Structure

**User Story:** As a user, I want the layout to adapt to my screen size, so that I have an optimal reading experience on both mobile and desktop devices.

#### Acceptance Criteria

1. THE ArticleFeed Component SHALL display a single vertical stream on mobile devices (below 768px width)
2. THE ArticleFeed Component SHALL display a 2-column editorial grid on desktop devices (768px and above)
3. THE ArticleFeed Component SHALL use a container width between 700px and 900px to match Reuters layout
4. THE ArticleFeed Component SHALL maintain the shorts-style vertical experience on mobile while adapting to grid on desktop
5. THE UI SHALL use responsive Tailwind classes to handle breakpoint transitions

### Requirement 5: User Experience Enhancements

**User Story:** As a user, I want smooth interactions and fast loading feedback, so that the app feels polished and responsive.

#### Acceptance Criteria

1. THE ArticleCard Component SHALL implement smooth card transitions using CSS transitions or animations
2. THE ArticleCardSkeleton Component SHALL display skeleton loaders for both image and text during loading states
3. THE ArticleCard Component SHALL use fixed-height image containers to prevent layout shift during image loading
4. THE ArticleFeed Component SHALL strictly prevent duplicated cards through deduplication logic
5. THE ArticleCard Component SHALL implement hover effects that provide visual feedback on desktop devices

### Requirement 6: Image Handling and Display

**User Story:** As a system, I want consistent image handling logic, so that each article displays exactly one optimized image.

#### Acceptance Criteria

1. THE ArticleCard Component SHALL select and display only one final image URL per article
2. THE ArticleCard Component SHALL use the article's image_url field as the primary image source
3. THE ArticleCard Component SHALL implement a fallback to a default placeholder image when image_url is null or empty
4. THE ArticleCard Component SHALL use object-cover CSS to ensure images fill their containers without distortion
5. THE ArticleCard Component SHALL implement lazy loading for images to improve performance

### Requirement 7: Typography and Readability

**User Story:** As a user, I want clear, readable text with proper hierarchy, so that I can easily scan headlines and read article summaries.

#### Acceptance Criteria

1. THE ArticleCard Component SHALL use font size of at least 20px (text-xl) for headlines on mobile
2. THE ArticleCard Component SHALL use font size of at least 24px (text-2xl) for headlines on desktop
3. THE ArticleCard Component SHALL limit summary text to 2-3 lines using line-clamp-2 or line-clamp-3
4. THE ArticleCard Component SHALL use muted text color (text-gray-600) for meta information
5. THE UI SHALL maintain a clear visual hierarchy with headline, summary, and meta info clearly distinguished

### Requirement 8: Component Architecture

**User Story:** As a developer, I want clean, maintainable component code, so that the UI is easy to update and extend.

#### Acceptance Criteria

1. THE ArticleCard Component SHALL be completely rewritten to remove old card styles
2. THE ArticleFeed Component SHALL implement a deduplication function that filters articles before rendering
3. THE Components SHALL use TailwindCSS utility classes for all styling
4. THE ArticleCard Component SHALL accept article data as props with proper TypeScript typing
5. THE ArticleCardSkeleton Component SHALL match the visual structure of the actual ArticleCard for consistent loading states
