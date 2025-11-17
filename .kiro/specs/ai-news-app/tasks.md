# Implementation Plan

- [x] 1. Project setup and configuration



  - Initialize Next.js 14 project with TypeScript and App Router
  - Install and configure Tailwind CSS for styling
  - Set up Supabase client libraries (@supabase/auth-helpers-nextjs, @supabase/supabase-js)
  - Configure environment variables for Supabase and OpenAI
  - Set up ESLint and Prettier for code quality
  - Create base folder structure (app, components, lib, types, hooks)



  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1_

- [ ] 2. Extend database schema for collections
  - Create collections table with user_id foreign key and RLS policies
  - Create collection_articles junction table with RLS policies



  - Add role column to profiles table (enum: 'user', 'admin')
  - Add preferences JSONB column to profiles table for category preferences
  - Create indexes on collections.user_id and collection_articles.collection_id
  - _Requirements: 4.4, 4.5, 6.2, 9.1_






- [ ] 3. Implement Supabase client utilities
  - Create server component Supabase client helper
  - Create client component Supabase client helper
  - Create route handler Supabase client helper
  - Create middleware Supabase client helper


  - Create TypeScript types for database tables using Supabase CLI
  - _Requirements: 11.1, 11.2_

- [x] 4. Build authentication system


  - [ ] 4.1 Create login page with Google, GitHub, and OTP options
    - Build login UI with provider buttons and phone input



    - Implement Google OAuth sign-in function
    - Implement GitHub OAuth sign-in function
    - Implement SMS OTP sign-in with phone number validation
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 4.2 Create auth callback route





    - Handle OAuth callback and exchange code for session
    - Create or update profile record after successful authentication
    - Redirect authenticated users to main feed
    - _Requirements: 1.4, 1.5_
  


  - [ ] 4.3 Implement auth middleware
    - Protect authenticated routes (feed, saved, collections, settings)
    - Protect admin routes with role check
    - Redirect unauthenticated users to login
    - _Requirements: 9.1_


- [ ] 5. Create base UI components
  - Build Button component with variants (primary, secondary, ghost)





  - Build Input component with validation states
  - Build Card component for article display
  - Build Modal/Dialog component for collections and settings
  - Build Loading spinner and skeleton components


  - Build Toast notification component for user feedback
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 6. Implement article feed page


  - [ ] 6.1 Create server component for article fetching
    - Fetch articles from news_articles table with pagination




    - Apply category filter from URL search params
    - Apply search query using full-text search
    - Pass initial articles to client component
    - _Requirements: 2.1, 2.4, 3.5_
  


  - [ ] 6.2 Build ArticleCard client component
    - Display article title, summary, category, source, image, and date
    - Add bookmark button with optimistic UI update
    - Add share button with social media options

    - Implement responsive card layout
    - _Requirements: 2.1, 2.4, 2.5, 5.1_





  
  - [ ] 6.3 Implement infinite scroll or pagination
    - Add "Load More" button or infinite scroll trigger
    - Fetch next page of articles on user action

    - Update URL with pagination state
    - _Requirements: 2.2_

- [ ] 7. Build search and filter functionality
  - [x] 7.1 Create SearchBar client component


    - Build search input with debounced onChange handler
    - Update URL search params on search query change
    - Display search query in input from URL params
    - _Requirements: 3.1, 3.3_


  
  - [x] 7.2 Create CategoryFilter component





    - Display category buttons for all AI domains (LLMs, CV, ML, AGI, Robotics, Agents, NLP)
    - Update URL search params on category selection
    - Highlight active category from URL params
    - _Requirements: 2.3, 3.2, 3.3_
  


  - [ ] 7.3 Create ActiveFilters component
    - Display active search query and category as chips
    - Add clear button for each active filter
    - Update URL when filters are cleared


    - _Requirements: 3.4_

- [x] 8. Implement bookmark system











  - [ ] 8.1 Create toggleBookmark server action
    - Check if article is already bookmarked by user
    - Insert or delete record in saved_articles table
    - Revalidate feed and saved pages



    - _Requirements: 4.2_





  
  - [ ] 8.2 Create saved articles page
    - Fetch user's saved articles with article details
    - Display saved articles in grid layout




    - Add remove bookmark functionality
    - _Requirements: 4.3_
  
  - [x] 8.3 Add bookmark status indicator


    - Query saved_articles to check bookmark status for each article
    - Display filled/outlined bookmark icon based on status
    - _Requirements: 4.1_

- [ ] 9. Build collections feature
  - [x] 9.1 Create collections page

    - Fetch user's collections from database
    - Display collections in grid with article count





    - Add "Create Collection" button
    - _Requirements: 4.4_
  
  - [x] 9.2 Implement create collection modal


    - Build form with name and description inputs
    - Validate inputs with Zod schema
    - Insert new collection via server action
    - _Requirements: 4.4_


  
  - [ ] 9.3 Create collection detail page
    - Fetch collection with associated articles
    - Display articles in collection

    - Add remove article from collection functionality
    - _Requirements: 4.5_
  
  - [ ] 9.4 Add "Add to Collection" functionality
    - Create modal to select collection for article


    - Insert record in collection_articles table
    - Show success toast notification
    - _Requirements: 4.5_



- [ ] 10. Implement social sharing
  - [x] 10.1 Create share card API route



    - Use next/og to generate dynamic OG image
    - Fetch article data by ID
    - Render article title, summary, and branding
    - Return ImageResponse with 1200x630 dimensions





    - _Requirements: 5.3_
  
  - [ ] 10.2 Add Open Graph meta tags
    - Generate metadata for article detail pages


    - Include title, description, and share card image URL
    - Add Twitter card meta tags
    - _Requirements: 5.2_


  
  - [ ] 10.3 Build ShareButton component
    - Display share icon button
    - Show modal with Twitter, LinkedIn, Facebook, and copy link options


    - Generate shareable URL for each platform
    - Implement copy to clipboard functionality





    - _Requirements: 5.1, 5.4, 5.5_

- [ ] 11. Create feed personalization
  - [x] 11.1 Build settings page


    - Create category preference checkboxes for all AI domains
    - Fetch current preferences from profiles table
    - Display selected categories
    - _Requirements: 6.1_


  
  - [ ] 11.2 Implement save preferences server action
    - Update profiles.preferences JSONB column



    - Validate selected categories
    - Revalidate feed page
    - _Requirements: 6.2, 6.4_
  
  - [x] 11.3 Apply preferences to feed



    - Check user preferences in feed page
    - Filter articles by preferred categories if set
    - Show all categories if no preferences set
    - _Requirements: 6.3, 6.5_



- [ ] 12. Build content ingestion system
  - [ ] 12.1 Create ArticleIngestor class
    - Implement fetchArticles method for RSS and API sources
    - Implement checkDuplicate method using URL comparison
    - Implement categorize method to assign AI domain
    - Implement insertArticle method to save to database
    - _Requirements: 7.2, 7.4_
  
  - [ ] 12.2 Integrate OpenAI summarization
    - Create OpenAI client with GPT-4o-mini model
    - Implement summarizeArticle method with 200-word limit
    - Calculate token usage and cost estimate
    - Add error handling with retry logic
    - _Requirements: 8.1, 8.2, 8.4, 8.5_
  
  - [ ] 12.3 Create ingestion API route
    - Verify cron secret for security
    - Fetch active sources from database
    - Run ingestor for each source
    - Log ingestion activity
    - Return success/failure response
    - _Requirements: 7.1, 7.3, 7.5_
  



  - [ ] 12.4 Add AI activity logging
    - Insert record in ai_activity_logs after each summarization
    - Store provider name, tokens used, and cost estimate
    - _Requirements: 8.3_

- [ ] 13. Implement admin panel
  - [ ] 13.1 Create admin dashboard page
    - Display total articles, sources, and AI cost statistics
    - Show recent ingestion activity
    - Add manual ingestion trigger button
    - _Requirements: 9.2, 9.5_
  
  - [ ] 13.2 Build articles management page
    - Display paginated table of all articles
    - Add search and filter functionality
    - Show edit and delete buttons for each article
    - _Requirements: 9.2, 9.3_
  
  - [ ] 13.3 Create article edit modal
    - Build form with title, summary, category, and metadata inputs
    - Validate inputs with Zod schema
    - Update article via server action
    - _Requirements: 9.3_
  
  - [ ] 13.4 Implement article delete functionality
    - Add confirmation dialog before deletion
    - Delete article via server action
    - Revalidate articles page
    - _Requirements: 9.4_
  
  - [ ] 13.5 Create sources management page
    - Display table of all sources
    - Add create, edit, and toggle active functionality
    - Show source type and API URL
    - _Requirements: 7.3_
  
  - [ ] 13.6 Build logs viewer page
    - Display ingestion logs with timestamp and status
    - Show AI activity logs with cost breakdown
    - Add date range filter
    - _Requirements: 9.5, 7.5_

- [ ] 14. Configure Vercel cron job
  - Create vercel.json with cron configuration
  - Set cron schedule to run daily at 6 AM UTC
  - Configure CRON_SECRET environment variable
  - Test cron job execution
  - _Requirements: 15.1, 15.2, 15.5_

- [ ] 15. Implement performance optimizations
  - [ ] 15.1 Optimize images
    - Use Next.js Image component for all article images
    - Configure image domains in next.config.js
    - Add blur placeholders for lazy-loaded images
    - _Requirements: 14.2_
  
  - [ ] 15.2 Implement code splitting
    - Use dynamic imports for admin panel components
    - Lazy load modals and heavy components
    - _Requirements: 14.3_
  
  - [ ] 15.3 Add caching strategies
    - Set revalidate time for feed page (5 minutes)
    - Add Cache-Control headers to API routes
    - Implement stale-while-revalidate pattern
    - _Requirements: 14.4_
  
  - [ ] 15.4 Optimize bundle size
    - Analyze bundle with @next/bundle-analyzer
    - Remove unused dependencies
    - Tree-shake large libraries
    - _Requirements: 14.3_

- [ ] 16. Setup CI/CD pipeline
  - [ ] 16.1 Create GitHub repository
    - Initialize Git repository
    - Create .gitignore for Next.js
    - Push code to GitHub
    - _Requirements: 13.1_
  
  - [ ] 16.2 Configure GitHub Actions
    - Create CI workflow for linting and type checking
    - Add test workflow for unit and integration tests
    - Configure workflow to run on push and pull requests
    - _Requirements: 13.2_
  
  - [ ] 16.3 Deploy to Vercel
    - Connect GitHub repository to Vercel
    - Configure environment variables in Vercel dashboard
    - Enable automatic deployments on main branch
    - Configure preview deployments for pull requests
    - _Requirements: 13.3, 13.4, 13.5_

- [ ] 17. Implement accessibility features
  - Add ARIA labels to all interactive elements
  - Implement keyboard navigation for article cards and modals
  - Add focus management for modals and dropdowns
  - Test with screen readers (NVDA, JAWS)
  - Ensure color contrast meets WCAG AA standards
  - _Requirements: 12.5_

- [ ] 18. Add error boundaries and monitoring
  - Create error boundary components for graceful error handling
  - Implement error logging to console in development
  - Add user-friendly error messages
  - Create 404 and 500 error pages
  - _Requirements: 12.4_

- [ ]* 19. Testing and quality assurance
  - [ ]* 19.1 Write unit tests
    - Test utility functions (validation, formatting, calculations)
    - Test Zod schemas
    - Test data transformation functions
    - _Requirements: 10.2_
  
  - [ ]* 19.2 Write integration tests
    - Test API routes with mock Supabase client
    - Test server actions
    - Test authentication flows
    - _Requirements: 11.2_
  
  - [ ]* 19.3 Write E2E tests
    - Test user registration and login flows
    - Test article browsing and search
    - Test bookmark and collection functionality
    - Test admin panel operations
    - _Requirements: 1.1, 2.1, 4.1, 9.2_
  
  - [ ]* 19.4 Performance testing
    - Run Lighthouse audits on key pages
    - Measure Core Web Vitals
    - Test with slow network conditions
    - _Requirements: 14.1_

- [ ] 20. Documentation and final polish
  - Create README with setup instructions
  - Document environment variables
  - Add code comments for complex logic
  - Create user guide for admin panel
  - Add loading states for all async operations
  - Polish UI animations and transitions
  - _Requirements: 12.3_
