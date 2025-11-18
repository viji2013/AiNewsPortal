# Implementation Plan

- [x] 1. Create deduplication utility function



  - Create new file `lib/utils/deduplication.ts`
  - Implement `deduplicateArticles` function that filters articles by unique image_url
  - Use Set data structure for O(1) lookup performance
  - Handle null/undefined image_url values by treating them as unique
  - Export function with proper TypeScript typing



  - _Requirements: 1.1, 1.4_

- [ ] 2. Update ArticleCard component with Reuters editorial design
  - Remove rounded corners and card background (use border-b separator instead)
  - Keep image aspect ratio at 16:9 with standard height (h-48 or h-56)
  - Set headline font size to text-lg on mobile and text-xl on desktop
  - Update color palette to neutral tones (slate-900, slate-700, slate-500)
  - Simplify category badge with dark background and uppercase text
  - Ensure single image rendering with fallback logic
  - Add hover scale effect to image (scale-105)



  - Update spacing to match Reuters style (space-y-3)
  - Implement line-clamp-2 on summary text with text-sm size
  - Update action bar layout with "Read more" link and icon buttons
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 3. Update ArticleFeed component with deduplication
  - Import and use deduplicateArticles utility function



  - Apply deduplication to initialArticles before setting state
  - Update container max-width to 900px (Reuters style)
  - Maintain single column on mobile (grid-cols-1)
  - Maintain 2-column grid on desktop (md:grid-cols-2)
  - Update grid gap to gap-8 for proper spacing
  - Ensure unique keys for mapped ArticleCard components
  - _Requirements: 1.1, 1.2, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.4_




- [ ] 4. Update ArticleCardSkeleton component structure
  - Keep image skeleton aspect ratio at 16:9 with standard height (h-48 or h-56)
  - Remove rounded corners to match new card design
  - Update headline skeleton to 2 lines with text-lg/text-xl height
  - Ensure summary skeleton shows 2 lines with text-sm height


  - Match spacing with updated ArticleCard (space-y-3)
  - Update gradient colors to match neutral palette
  - Maintain pulse animation for loading feedback
  - _Requirements: 5.2, 5.3, 8.5_

- [ ] 5. Implement smooth transitions and hover effects
  - Add transition-transform duration-500 to card images


  - Add group-hover:scale-105 effect to images
  - Add transition-colors to headlines and action buttons
  - Implement hover:bg-slate-100 on action buttons
  - Add hover:text-slate-700 to headlines
  - Ensure all transitions are smooth and performant
  - _Requirements: 5.1, 5.5_

- [x] 6. Optimize image loading and performance



  - Verify Next.js Image component is using lazy loading (priority={false})
  - Set appropriate sizes attribute for responsive images
  - Set image quality to 85 for balance between size and quality
  - Implement onError handler with fallback image
  - Use object-cover for proper image cropping
  - Add fixed aspect ratio container to prevent layout shift
  - _Requirements: 5.3, 6.3, 6.4, 6.5_

- [ ] 7. Update typography and readability
  - Set headline font-size to text-lg (mobile) and text-xl (desktop)
  - Set headline font-weight to font-bold (700)
  - Apply leading-tight to headlines for compact multi-line display
  - Set summary to text-sm with leading-relaxed
  - Apply line-clamp-2 to summary text
  - Set meta information to text-xs with text-slate-500
  - Ensure proper font-weight hierarchy (category: semibold, meta: medium)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 8. Ensure responsive layout structure
  - Set container max-width to 900px (max-w-4xl)
  - Apply horizontal padding: px-4 on mobile, px-6 on desktop
  - Maintain single column grid on mobile (grid-cols-1)
  - Apply 2-column grid on desktop (md:grid-cols-2)
  - Set grid gap to gap-6 on mobile, gap-8 on desktop
  - Center container with mx-auto
  - Test layout at all breakpoints (mobile, tablet, desktop)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 9. Add accessibility improvements
  - [ ]* 9.1 Verify semantic HTML structure
    - Ensure ArticleCard uses <article> element
    - Use <h2> for headlines
    - Use <time> element for published dates
    - Use <button> for interactive elements
    - Add descriptive alt text to images
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 9.2 Add ARIA labels and keyboard navigation
    - Add aria-label to bookmark button (dynamic based on state)
    - Add aria-label to share button
    - Ensure all interactive elements are keyboard accessible
    - Verify logical tab order
    - Add visible focus indicators
    - _Requirements: 5.1, 5.5_

- [ ]* 10. Test and validate implementation
  - [ ]* 10.1 Test deduplication logic
    - Create test articles with duplicate image URLs
    - Verify deduplication function removes duplicates
    - Test with null/undefined image URLs
    - Verify Set-based tracking works correctly
    - _Requirements: 1.1, 1.4_
  
  - [ ]* 10.2 Test responsive layout
    - Verify single column on mobile (< 768px)
    - Verify 2-column grid on desktop (≥ 768px)
    - Test at various screen sizes
    - Verify container max-width constraint
    - Check spacing and gaps at all breakpoints
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 10.3 Test image handling
    - Verify fallback image displays when image_url is null
    - Test onError handler with broken image URLs
    - Verify lazy loading works correctly
    - Check image aspect ratio (16:9) with standard height at all sizes
    - Verify no layout shift during image load
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 10.4 Test visual design and interactions
    - Verify Reuters-style color palette applied
    - Test hover effects on images and buttons
    - Verify smooth transitions
    - Check typography hierarchy and readability
    - Test dark mode appearance
    - Verify line-clamp on summary text
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.5, 7.1, 7.2, 7.3, 7.4, 7.5_
