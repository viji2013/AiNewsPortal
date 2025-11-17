# Accessibility Guidelines

## Overview

This application follows WCAG 2.1 Level AA standards to ensure accessibility for all users.

## Implemented Features

### 1. ARIA Labels and Roles

All interactive elements have appropriate ARIA labels:

```tsx
// Buttons
<button aria-label="Bookmark article">
  <BookmarkIcon />
</button>

// Links
<a href="/article/123" aria-label="Read full article: AI Breakthrough">
  Read More
</a>

// Form inputs
<input
  type="text"
  aria-label="Search articles"
  aria-describedby="search-help"
/>
```

### 2. Keyboard Navigation

All functionality is accessible via keyboard:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow Keys**: Navigate lists and menus
- **Home/End**: Jump to first/last item in lists

### 3. Focus Management

- Visible focus indicators on all interactive elements
- Focus trap in modals and dialogs
- Focus restoration when closing modals
- Skip to main content link

### 4. Screen Reader Support

- Semantic HTML structure
- ARIA live regions for dynamic content
- Descriptive alt text for images
- Proper heading hierarchy (h1 → h2 → h3)

### 5. Color Contrast

All text meets WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: Clear visual states

## Component Accessibility

### ArticleCard

```tsx
- Semantic article element
- Descriptive headings
- Alt text for images
- ARIA labels for actions
- Keyboard accessible
```

### Modal/Dialog

```tsx
- role="dialog"
- aria-modal="true"
- aria-labelledby for title
- Focus trap
- Escape key to close
```

### Forms

```tsx
- Associated labels
- Error messages with aria-describedby
- Required field indicators
- Validation feedback
```

## Testing

### Automated Testing

```bash
# Run accessibility tests
npm run test:a11y
```

### Manual Testing

1. **Keyboard Navigation**
   - Navigate entire app using only keyboard
   - Verify all interactive elements are reachable
   - Check focus indicators are visible

2. **Screen Reader Testing**
   - Test with NVDA (Windows)
   - Test with JAWS (Windows)
   - Test with VoiceOver (macOS)

3. **Color Contrast**
   - Use browser DevTools accessibility panel
   - Verify all text meets contrast requirements

4. **Zoom Testing**
   - Test at 200% zoom
   - Verify no content is cut off
   - Check layout remains usable

## Common Patterns

### Skip to Main Content

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Loading States

```tsx
<div role="status" aria-live="polite">
  Loading articles...
</div>
```

### Error Messages

```tsx
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? 'error-message' : undefined}
/>
{hasError && (
  <div id="error-message" role="alert">
    {errorMessage}
  </div>
)}
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
