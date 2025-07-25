# Documentation Structure

This folder contains comprehensive bilingual documentation for the Miguel Ángel de Dios portfolio project.

## 📁 Structure

```text
docs/
├── en/              # English documentation
│   ├── README.md           # Project overview and quick start
│   ├── ARCHITECTURE.md     # System architecture and design patterns
│   ├── COMPONENTS.md       # Component library documentation  
│   ├── DEVELOPMENT.md      # Development setup and guidelines
│   ├── I18N.md            # Internationalization implementation
│   ├── TESTING.md         # Testing strategy and guidelines
│   └── RECAPTCHA_SETUP.md # reCAPTCHA configuration guide
└── es/              # Spanish documentation
    ├── README.md           # Descripción del proyecto e inicio rápido
    ├── ARCHITECTURE.md     # Arquitectura del sistema y patrones de diseño
    ├── COMPONENTS.md       # Documentación de la librería de componentes
    ├── DEVELOPMENT.md      # Configuración de desarrollo y guías
    ├── I18N.md            # Implementación de internacionalización
    ├── TESTING.md         # Estrategia y guías de testing
    └── RECAPTCHA_SETUP.md # Guía de configuración de reCAPTCHA
```

## 🌍 Language Support

The documentation is maintained in parallel for both English and Spanish:

- **English** (`/en/`) - Primary documentation language
- **Spanish** (`/es/`) - Complete Spanish translations

Both versions are kept in sync and provide the same level of technical detail.

## 📋 Documentation Standards

All documentation follows these standards:

- **Markdown format** with consistent formatting
- **Code examples** with syntax highlighting
- **Cross-references** between related documents
- **Clear structure** with logical sections
- **Professional tone** suitable for enterprise use

## 🔧 Maintenance

Documentation is linted and validated using:

```bash
# Check documentation formatting
pnpm docs:lint

# Auto-fix documentation formatting
pnpm docs:lint:fix

# Run all quality checks (includes docs)
pnpm quality
```

## 📝 Updating Documentation

When making changes:

1. Update both English and Spanish versions
2. Maintain consistent structure and content
3. Run `pnpm docs:lint:fix` to ensure proper formatting
4. Verify cross-references are working
5. Test that all code examples are current

## 📖 Reading Order

For developers working with this project, we recommend reading the documentation in this order:

1. **README** - Project overview and quick start
2. **DEVELOPMENT** - Setup and development workflow
3. **ARCHITECTURE** - System design and patterns
4. **COMPONENTS** - Component library details
5. **I18N** - Internationalization approach
6. **TESTING** - Testing strategy
7. **RECAPTCHA_SETUP** - Anti-spam protection setup

Each document is self-contained but cross-references related topics for deeper understanding.
