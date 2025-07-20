# Documentation - Miguel Ángel de Dios Portfolio

Welcome to the complete documentation for Miguel Ángel de Dios's personal portfolio website. This documentation provides comprehensive information about the architecture, development process, and maintenance of this modern React-based portfolio.

## 📚 Table of Contents

- [🏗️ Architecture Overview](./ARCHITECTURE.md)
- [🛠️ Development Guide](./DEVELOPMENT.md)
- [🎨 UI Components Documentation](./COMPONENTS.md)
- [🌐 Internationalization Guide](./I18N.md)
- [🧪 Testing Documentation](./TESTING.md)
- [📋 Contributing Guidelines](./CONTRIBUTING.md)
- [📈 Performance Guide](./PERFORMANCE.md)

## 🌟 Project Overview

This is a modern, multilingual personal portfolio website built with cutting-edge web technologies. The project showcases a Front-End developer's skills, projects, and experience while demonstrating best practices in modern web development.

### Key Features

- **Modern React Architecture**: Built with React 19 and TypeScript for type safety
- **Performance Optimized**: Vite build system for fast development and optimized production builds
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Multilingual Support**: Full internationalization with React i18next
- **GitHub Integration**: Dynamic project showcase from GitHub API
- **Contact Form**: Secure contact form with reCAPTCHA validation
- **SEO Optimized**: Semantic HTML and meta tags for better search visibility
- **Accessibility**: WCAG compliance for inclusive user experience
- **Testing Coverage**: Comprehensive test suite with Vitest and React Testing Library

### Technology Stack

#### Core Technologies

- **React 19.0** - Modern UI library with latest features
- **TypeScript 5.6** - Type safety and enhanced developer experience
- **Vite 6.0** - Fast build tool and development server
- **Tailwind CSS 4.0** - Utility-first CSS framework

#### Key Libraries

- **Framer Motion 12.4** - Animation library for smooth transitions
- **React Router 7.2** - Client-side routing
- **React Hook Form 7.60** - Form management with validation
- **TanStack Query 5.67** - Server state management
- **React i18next 15.4** - Internationalization framework
- **Axios 1.8** - HTTP client for API requests

#### Development Tools

- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **Commitlint** - Conventional commit messages

### Project Structure

```text
mywebsite-2/
├── docs/                    # Documentation
│   ├── en/                 # English documentation
│   └── es/                 # Spanish documentation
├── public/                 # Static assets
│   ├── images/            # Image assets including technology logos
│   ├── logo.svg           # Main logo
│   └── logo_*.svg         # Logo variations
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── Navbar.tsx
│   ├── pages/            # Page components
│   │   ├── Home/         # Home page components
│   │   ├── About/        # About page components
│   │   ├── Projects/     # Projects page components
│   │   ├── Contact/      # Contact page components
│   │   └── NotFound.tsx  # 404 page
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── animations.ts # Animation configurations
│   │   ├── axios.ts      # HTTP client setup
│   │   └── queryClient.ts # React Query configuration
│   ├── locales/          # Translation files
│   │   ├── en/           # English translations
│   │   └── es/           # Spanish translations
│   ├── router/           # Routing configuration
│   ├── styles/           # Global styles
│   ├── constants/        # Application constants
│   └── types.ts          # TypeScript type definitions
├── .github/              # GitHub workflows and templates
├── tests/                # Test utilities and configuration
└── configuration files   # Various config files
```

## 🎯 Page Structure

### Home Page (`/`)

- Hero section with animated introduction
- Feature highlights with animated cards
- Call-to-action buttons leading to other sections
- Smooth scroll animations and transitions

### Projects Page (`/projects`)

- Dynamic GitHub repository showcase
- Project statistics and metrics
- Technology tags and filtering
- Live demo links for deployed projects
- Responsive grid layout with loading states

### About Page (`/about`)

- Personal biography and background
- Skills and technologies showcase
- Professional statistics
- Contact information and social links
- Technology grid with logos and descriptions

### Contact Page (`/contact`)

- Contact form with validation
- reCAPTCHA integration for spam protection
- Success and error state handling
- Social media links

## 🔧 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/mddiosc/mywebsite-2.git
   cd mywebsite-2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Build for production**

   ```bash
   pnpm build
   ```

## 📖 Detailed Documentation

For detailed information about specific aspects of the project, please refer to the individual documentation files:

- **[Architecture](./ARCHITECTURE.md)** - Detailed system architecture and design patterns
- **[Development](./DEVELOPMENT.md)** - Development workflow, coding standards, and best practices
- **[Components](./COMPONENTS.md)** - UI component library and usage guidelines
- **[Internationalization](./I18N.md)** - Multi-language support implementation
- **[Testing](./TESTING.md)** - Testing strategies and coverage guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for detailed information about:

- Code of conduct
- Development workflow
- Pull request process
- Coding standards
- Testing requirements

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

1. Check the documentation in this folder
2. Look at existing [Issues](https://github.com/mddiosc/mywebsite-2/issues)
3. Create a new issue with detailed information
4. Contact the maintainer: [contact@migueldedios.dev](mailto:contact@migueldedios.dev)

---

**Last Updated**: December 2024
**Documentation Version**: 1.0
