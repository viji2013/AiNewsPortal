# Accessibility Testing Checklist

## Keyboard Navigation

- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order is logical and follows visual flow
- [ ] Focus indicators are clearly visible
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dropdowns
- [ ] Arrow keys navigate lists and menus
- [ ] No keyboard traps (can always navigate away)

## Screen Reader Testing

### NVDA (Windows)
- [ ] Page structure is announced correctly
- [ ] Headings are in logical order
- [ ] Images have descriptive alt text
- [ ] Form labels are associated correctly
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced
- [ ] Button purposes are clear

### JAWS (Windows)
- [ ] Same tests as NVDA
- [ ] Table navigation works correctly
- [ ] Landmarks are identified

### VoiceOver (macOS)
- [ ] Same tests as NVDA
- [ ] Rotor navigation works
- [ ] Gestures work on mobile

## Visual Testing

### Color Contrast
- [ ] Body text: 4.5:1 minimum
- [ ] Large text (18pt+): 3:1 minimum
- [ ] UI components: 3:1 minimum
- [ ] Focus indicators: 3:1 minimum

### Zoom and Scaling
- [ ] Content readable at 200% zoom
- [ ] No horizontal scrolling at 200% zoom
- [ ] Layout doesn't break at 400% zoom
- [ ] Text spacing can be adjusted

### Color Independence
- [ ] Information not conveyed by color alone
- [ ] Links distinguishable without color
- [ ] Form errors clear without color

## Forms

- [ ] All inputs have associated labels
- [ ] Required fields are indicated
- [ ] Error messages are descriptive
- [ ] Errors linked to fields with aria-describedby
- [ ] Success messages announced
- [ ] Autocomplete attributes used where appropriate

## Images and Media

- [ ] Decorative images have empty alt=""
- [ ] Informative images have descriptive alt text
- [ ] Complex images have long descriptions
- [ ] Icons have aria-label or sr-only text

## Interactive Components

### Buttons
- [ ] Purpose is clear from label
- [ ] State changes announced (pressed, expanded)
- [ ] Disabled state is clear

### Links
- [ ] Link purpose clear from text
- [ ] External links indicated
- [ ] Download links indicate file type/size

### Modals/Dialogs
- [ ] Focus moves to modal on open
- [ ] Focus trapped within modal
- [ ] Escape closes modal
- [ ] Focus returns to trigger on close
- [ ] Background content inert (aria-hidden)

### Dropdowns/Menus
- [ ] Keyboard navigation works
- [ ] Current selection announced
- [ ] Expanded/collapsed state clear

## Content

### Headings
- [ ] Page has h1
- [ ] Heading levels don't skip
- [ ] Headings describe content

### Lists
- [ ] Semantic list markup used
- [ ] List items properly nested

### Tables
- [ ] Headers identified with th
- [ ] Complex tables have scope attributes
- [ ] Caption describes table purpose

## Mobile Accessibility

- [ ] Touch targets at least 44x44px
- [ ] Gestures have alternatives
- [ ] Orientation changes supported
- [ ] Pinch zoom not disabled

## Automated Testing

```bash
# Run with axe-core or similar
npm run test:a11y
```

### Tools to Use
- [ ] axe DevTools browser extension
- [ ] Lighthouse accessibility audit
- [ ] WAVE browser extension
- [ ] Pa11y CI in pipeline

## Manual Testing Priority

1. **Critical Path** (High Priority)
   - [ ] Login/Authentication
   - [ ] Article browsing
   - [ ] Search functionality
   - [ ] Bookmark articles

2. **Important Features** (Medium Priority)
   - [ ] Collections management
   - [ ] Settings/Preferences
   - [ ] Social sharing

3. **Admin Features** (Lower Priority)
   - [ ] Admin dashboard
   - [ ] Content management
   - [ ] Source configuration

## Common Issues to Check

- [ ] Images without alt text
- [ ] Buttons without labels
- [ ] Low contrast text
- [ ] Missing form labels
- [ ] Keyboard traps
- [ ] Missing skip links
- [ ] Improper heading hierarchy
- [ ] Missing ARIA labels
- [ ] Inaccessible modals
- [ ] Auto-playing content

## Documentation

- [ ] Accessibility statement published
- [ ] Known issues documented
- [ ] Contact for accessibility feedback
- [ ] Keyboard shortcuts documented
