# Contributing Guidelines

Thank you for your interest in contributing to the Miguel Ángel de Dios portfolio project! This document provides guidelines and information for contributors to help maintain code quality and ensure a smooth collaboration process.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes, new features, or improvements
- **Documentation**: Improve or add documentation
- **Translations**: Help improve language translations
- **Design**: UI/UX improvements and design suggestions

### Before Contributing

1. **Check existing issues**: Search for existing issues or discussions
2. **Read the documentation**: Familiarize yourself with the project structure
3. **Test locally**: Ensure your environment is properly set up
4. **Follow the code of conduct**: Maintain a respectful and inclusive environment

## 🚀 Getting Started

### Development Setup

1. **Fork the repository**

   Click the "Fork" button on the GitHub repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/mywebsite-2.git
   cd mywebsite-2
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/mddiosc/mywebsite-2.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

6. **Start development server**

   ```bash
   pnpm dev
   ```

### Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-description
   ```

2. **Make your changes**

   - Follow the coding standards
   - Write tests for new features
   - Update documentation as needed

3. **Test your changes**

   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

   - Use the provided PR template
   - Provide clear description of changes
   - Link related issues

## 📋 Code Standards

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types

- **feat**: New feature for the user
- **fix**: Bug fix for the user
- **docs**: Changes to documentation
- **style**: Formatting, missing semicolons, etc. (no code change)
- **refactor**: Refactoring production code
- **test**: Adding missing tests, refactoring tests
- **chore**: Updating build tasks, package manager configs, etc.

#### Examples

```bash
feat(projects): add GitHub API integration
fix(contact): resolve form validation issue
docs(readme): update installation instructions
style(navbar): improve responsive design
refactor(hooks): simplify useProjects implementation
test(components): add ProjectCard test coverage
chore(deps): update React to v19
```

### Code Style Guidelines

#### TypeScript

```typescript
// ✅ Good: Explicit types and interfaces
interface ProjectCardProps {
  project: GitHubProject
  delay: number
  className?: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  delay, 
  className 
}) => {
  // Component implementation
}

// ❌ Avoid: Any types and implicit typing
const ProjectCard = (props: any) => {
  // Implementation
}
```

#### React Components

```typescript
// ✅ Good: Functional component with proper typing
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface ComponentProps {
  title: string
  description?: string
}

const MyComponent: React.FC<ComponentProps> = ({ title, description }) => {
  const { t } = useTranslation()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </motion.div>
  )
}

export default MyComponent
```

#### File Organization

```text
ComponentName/
├── index.tsx              # Main component
├── ComponentName.test.tsx # Tests
├── ComponentName.types.ts # Type definitions
└── hooks/                 # Component-specific hooks
    └── useComponentName.ts
```

#### Import Order

```typescript
// 1. React and React-related imports
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// 2. Third-party library imports
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

// 3. Internal imports
import { Button } from '@/components'
import { useProjects } from '@/hooks'
import { fadeIn } from '@/lib/animations'

// 4. Type imports
import type { GitHubProject } from '@/types'
```

### CSS/Styling Guidelines

```tsx
// ✅ Good: Tailwind utility classes with logical grouping
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
    Action
  </button>
</div>

// ❌ Avoid: Inline styles or inconsistent class naming
<div style={{ display: 'flex', padding: '16px' }} className="some-custom-class">
  Content
</div>
```

## 🧪 Testing Requirements

### Test Coverage

All new features must include appropriate tests:

- **Components**: Render tests, interaction tests, prop tests
- **Hooks**: Logic tests, error handling tests
- **Utilities**: Input/output tests, edge case tests

### Test Examples

```typescript
// Component test
describe('MyComponent', () => {
  it('renders correctly with required props', () => {
    render(<MyComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
  
  it('handles optional props', () => {
    render(<MyComponent title="Title" description="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})

// Hook test
describe('useMyHook', () => {
  it('returns expected values', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.data).toBeDefined()
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test MyComponent.test.tsx
```

## 📝 Documentation Requirements

### Code Documentation

```typescript
/**
 * Fetches and processes GitHub projects data
 * 
 * @param username - GitHub username
 * @param options - Query options for filtering
 * @returns Promise resolving to processed project data
 * 
 * @example
 * ```typescript
 * const projects = await fetchProjects('mddiosc', { 
 *   includePrivate: false 
 * })
 * ```
 */
export const fetchProjects = async (
  username: string, 
  options: FetchOptions = {}
): Promise<GitHubProject[]> => {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * ProjectCard displays information about a GitHub project
 * 
 * Features:
 * - Project name and description
 * - Language and technology tags
 * - Star and fork counts
 * - Live demo link (if available)
 * - Responsive design with hover effects
 * 
 * @param project - GitHub project data
 * @param delay - Animation delay in seconds
 * @param className - Additional CSS classes
 */
interface ProjectCardProps {
  /** GitHub project data from API */
  project: GitHubProject
  /** Animation delay for staggered loading */
  delay: number
  /** Additional CSS classes */
  className?: string
}
```

## 🔍 Pull Request Process

### PR Checklist

Before submitting a pull request, ensure:

- [ ] **Code quality**: Passes all linting and type checks
- [ ] **Tests**: All tests pass and new code is covered
- [ ] **Documentation**: Updated relevant documentation
- [ ] **Translations**: Added/updated translations if needed
- [ ] **Performance**: No significant performance regressions
- [ ] **Accessibility**: Maintains accessibility standards
- [ ] **Responsive**: Works on all device sizes

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
```

### Review Process

1. **Automated checks**: CI/CD pipeline runs automatically
2. **Code review**: Maintainers review the code
3. **Feedback**: Address any review comments
4. **Approval**: PR is approved by maintainers
5. **Merge**: Changes are merged into main branch

## 🚨 Reporting Issues

### Bug Reports

Use the bug report template and include:

- **Environment**: OS, browser, Node.js version
- **Steps to reproduce**: Clear reproduction steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Additional context**: Any other relevant information

### Feature Requests

Use the feature request template and include:

- **Problem description**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives**: Other solutions considered
- **Additional context**: Examples, mockups, etc.

## 🌐 Translation Contributions

### Adding Translations

1. **Check existing translations**: Review current language files
2. **Follow structure**: Maintain consistent key structure
3. **Cultural adaptation**: Consider cultural context
4. **Test thoroughly**: Verify translations in UI

### Translation Guidelines

```json
{
  "pages": {
    "home": {
      "title": "Welcome to My Portfolio",
      "subtitle": "Front-End Developer specializing in React"
    }
  }
}
```

## 📞 Communication

### Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code review and collaboration
- **Email**: [contact@migueldedios.dev](mailto:contact@migueldedios.dev) for private matters

### Response Times

- **Issues**: Typically within 48 hours
- **Pull Requests**: Review within 1 week
- **Questions**: Response within 24-48 hours

## 🏆 Recognition

Contributors will be recognized in:

- **CONTRIBUTORS.md**: List of all contributors
- **Release notes**: Major contributions highlighted
- **Social media**: Acknowledgment of significant contributions

## 📚 Resources

### Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Tools

- [VS Code](https://code.visualstudio.com/) with recommended extensions
- [Git](https://git-scm.com/) for version control
- [pnpm](https://pnpm.io/) for package management

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to the Miguel Ángel de Dios portfolio project! Your contributions help make this project better for everyone.
