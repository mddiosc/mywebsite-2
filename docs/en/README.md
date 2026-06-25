# Documentation - Miguel Ángel de Dios Portfolio

Welcome to the complete documentation for Miguel Ángel de Dios's personal portfolio website. This documentation provides comprehensive information about the architecture, development process, and maintenance of this modern React-based portfolio.

## 📚 Table of Contents

- [🏗️ Architecture Overview](./ARCHITECTURE.md)
- [🛠️ Development Guide](./DEVELOPMENT.md)
- [🎨 UI Components Documentation](./COMPONENTS.md)
- [🌐 Internationalization Guide](./I18N.md)
- [🧪 Testing Documentation](./TESTING.md)
- [� reCAPTCHA Setup Guide](./RECAPTCHA_SETUP.md)

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

- **React 19.2** - Modern UI library with latest features
- **TypeScript 5.9** - Type safety and enhanced developer experience
- **Vite 8.0** - Fast build tool and development server
- **Tailwind CSS 4.2** - Utility-first CSS framework

#### Key Libraries

- **Framer Motion 12.38** - Animation library for smooth transitions
- **React Router 7.17** - Client-side routing
- **React Hook Form 7.72** - Form management with validation
- **TanStack Query 5.95** - Server state management
- **React i18next 15.7** - Internationalization framework
- **Zod 4.3** - Schema validation

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
│   ├── components/        # Reusable UI components (Footer, Layout, Navbar, LanguageSwitcher, ...)
│   ├── pages/            # Page components
│   │   ├── Home/         # Home page components
│   │   ├── About/        # About page components
│   │   ├── Projects/     # Projects page components
│   │   ├── Contact/      # Contact page components
│   │   ├── Blog/         # Blog page components
│   │   └── NotFound.tsx  # 404 page
│   ├── content/          # Blog markdown content
│   ├── context/          # React context providers
│   ├── data/             # Static data sources
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization configuration
│   ├── lib/              # Utility libraries
│   │   ├── animations.ts    # Animation configurations
│   │   ├── queryClient.ts   # React Query configuration
│   │   ├── security.ts      # Security helpers
│   │   ├── seo.ts           # SEO utilities
│   │   └── clientObservability.ts # Client-side observability
│   ├── locales/          # Translation files
│   │   ├── en/           # English translations
│   │   └── es/           # Spanish translations
│   ├── router/           # Routing configuration
│   ├── styles/           # Global styles
│   ├── utils/            # General utilities
│   ├── constants/        # Application constants
│   ├── types/            # Shared TypeScript type definitions
│   └── types.ts          # Global TypeScript types
├── .github/              # GitHub workflows and templates
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

### Blog Page (`/blog`)

- Markdown-driven blog posts
- Post listing and individual post views
- Multilingual content support

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
- **[reCAPTCHA Setup](./RECAPTCHA_SETUP.md)** - Anti-spam protection configuration

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.
