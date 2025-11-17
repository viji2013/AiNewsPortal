# Error Handling Guide

## Overview

This application implements comprehensive error handling with graceful degradation and user-friendly error messages.

## Error Boundaries

### Component-Level Error Boundary

```tsx
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

function MyComponent() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

### Page-Level Error Handling

Next.js automatically provides error boundaries:
- `error.tsx` - Handles errors in route segments
- `global-error.tsx` - Handles errors in root layout
- `not-found.tsx` - Handles 404 errors

## Error Pages

### 404 Not Found
- Custom styled 404 page
- Links to home and feed
- SEO-friendly metadata

### 500 Server Error
- Graceful error display
- Try again functionality
- Error details in development

### Global Errors
- Catches errors in root layout
- Provides recovery options
- Minimal styling (no dependencies)

## Error Logging

### Using ErrorLogger

```tsx
import { ErrorLogger } from '@/lib/utils/error-logger'

try {
  // Your code
} catch (error) {
  ErrorLogger.logError(error as Error, {
    userId: user?.id,
    action: 'fetch_articles',
  })
}
```

### API Errors

```tsx
ErrorLogger.logAPIError('/api/articles', 500, error, {
  userId: user?.id,
})
```

### Authentication Errors

```tsx
ErrorLogger.logAuthError(error, {
  attemptedAction: 'login',
})
```

## Custom Error Classes

```tsx
import { APIError, AuthError, ValidationError } from '@/lib/utils/error-logger'

// API Error
throw new APIError('Failed to fetch', 500, '/api/articles')

// Auth Error
throw new AuthError('Invalid credentials')

// Validation Error
throw new ValidationError('Invalid input', {
  email: 'Invalid email format',
  password: 'Password too short',
})
```

## User-Friendly Messages

```tsx
import { ErrorLogger } from '@/lib/utils/error-logger'

const userMessage = ErrorLogger.getUserMessage(error)
showToast({ message: userMessage, type: 'error' })
```

## Error Monitoring Integration

### Sentry (Recommended)

```bash
npm install @sentry/nextjs
```

```tsx
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### Custom Monitoring Endpoint

```tsx
// app/api/monitoring/errors/route.ts
export async function POST(request: Request) {
  const errorData = await request.json()
  
  // Store in database or forward to monitoring service
  await logToDatabase(errorData)
  
  return Response.json({ success: true })
}
```

## Best Practices

### 1. Always Catch Errors

```tsx
// ❌ Bad
async function fetchData() {
  const response = await fetch('/api/data')
  return response.json()
}

// ✅ Good
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new APIError('Fetch failed', response.status, '/api/data')
    }
    return response.json()
  } catch (error) {
    ErrorLogger.logAPIError('/api/data', 0, error as Error)
    throw error
  }
}
```

### 2. Provide Context

```tsx
ErrorLogger.logError(error, {
  userId: user?.id,
  action: 'bookmark_article',
  articleId: article.id,
  timestamp: new Date().toISOString(),
})
```

### 3. User-Friendly Messages

```tsx
// ❌ Bad
showToast({ message: error.message, type: 'error' })

// ✅ Good
const userMessage = ErrorLogger.getUserMessage(error)
showToast({ message: userMessage, type: 'error' })
```

### 4. Graceful Degradation

```tsx
function ArticleFeed() {
  const [articles, setArticles] = useState([])
  const [error, setError] = useState(null)

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">
          Unable to load articles
        </p>
        <Button onClick={retry}>Try Again</Button>
      </div>
    )
  }

  return <ArticleList articles={articles} />
}
```

## Testing Error Handling

### Trigger Errors in Development

```tsx
// Add to component for testing
if (process.env.NODE_ENV === 'development') {
  throw new Error('Test error')
}
```

### Test Error Boundaries

```tsx
import { render } from '@testing-library/react'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

test('catches errors', () => {
  const ThrowError = () => {
    throw new Error('Test')
  }

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

## Monitoring Checklist

- [ ] Error boundaries implemented
- [ ] Custom error pages created
- [ ] Error logging configured
- [ ] User-friendly messages
- [ ] Monitoring service integrated
- [ ] Error recovery options provided
- [ ] Development error details shown
- [ ] Production errors sanitized
- [ ] Error context captured
- [ ] Performance impact minimized
