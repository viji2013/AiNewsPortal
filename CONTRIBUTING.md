# Contributing to AI News App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/ai-news-app/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots for UI changes

## Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- OpenAI API key

### Local Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/ai-news-app.git
   cd ai-news-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type
- Use strict mode

### React Components

- Use functional components with hooks
- Prefer server components when possible
- Use client components only when needed
- Keep components small and focused

### Naming Conventions

- **Files**: kebab-case (e.g., `article-card.tsx`)
- **Components**: PascalCase (e.g., `ArticleCard`)
- **Functions**: camelCase (e.g., `fetchArticles`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`)

### Code Organization

```tsx
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

// 2. Types/Interfaces
interface Props {
  title: string
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Functions
  const handleClick = () => {}

  // 6. Render
  return <div>{title}</div>
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add article sharing functionality
fix: resolve bookmark sync issue
docs: update deployment guide
```

## Testing

### Running Tests

```bash
npm run test
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for meaningful test coverage
- Test edge cases

## Documentation

- Update README.md for new features
- Add JSDoc comments for complex functions
- Update relevant guides in docs/
- Include code examples

## Review Process

1. **Automated Checks**
   - Linting must pass
   - Build must succeed
   - Tests must pass

2. **Code Review**
   - At least one approval required
   - Address review comments
   - Keep discussions constructive

3. **Merge**
   - Squash and merge preferred
   - Delete branch after merge

## Questions?

- Open a [Discussion](https://github.com/yourusername/ai-news-app/discussions)
- Join our [Discord](https://discord.gg/ainews) (if applicable)
- Email: dev@ainews.app

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
