---
title: "Accesibilidad en React: Más allá de los básicos"
description: "Una guía avanzada sobre accesibilidad en React: patrones ARIA complejos, gestión de foco, live regions, testing automatizado y cómo construir componentes verdaderamente inclusivos."
date: "2025-06-15"
tags: ["accessibility", "a11y", "react", "aria", "wcag", "inclusive-design"]
author: "Miguel Ángel de Dios"
slug: "accessibility-react-beyond-basics"
featured: true
---

La accesibilidad no es un checkbox al final del proyecto: es una **responsabilidad fundamental** de todo developer. Después de años construyendo aplicaciones React, he aprendido que la verdadera accesibilidad va mucho más allá de añadir `alt` a las imágenes o usar elementos semánticos.

## El costo real de ignorar la accesibilidad

### No es solo "lo correcto"

Antes de entrar en código, contexto importante:

- **15%** de la población mundial tiene alguna discapacidad
- **1 de cada 4** adultos en Estados Unidos tiene una discapacidad
- Las demandas por accesibilidad web aumentaron **400%** desde 2017
- **SEO y accesibilidad** comparten muchas buenas prácticas

```tsx
// ❌ Componente típico "funcional" pero inaccesible
function ProductCard({ product, onAddToCart }) {
  return (
    <div onClick={() => onAddToCart(product)}>
      <img src={product.image} />
      <div>{product.name}</div>
      <div>{product.price}</div>
      <div>Añadir</div>
    </div>
  );
}

// ✅ Mismo componente, accesible
function ProductCard({ product, onAddToCart }) {
  return (
    <article 
      className="product-card"
      aria-labelledby={`product-${product.id}-name`}
    >
      <img 
        src={product.image} 
        alt={product.imageAlt || `Imagen de ${product.name}`}
      />
      <h3 id={`product-${product.id}-name`}>{product.name}</h3>
      <p aria-label={`Precio: ${product.price} euros`}>
        {formatPrice(product.price)}
      </p>
      <button 
        onClick={() => onAddToCart(product)}
        aria-label={`Añadir ${product.name} al carrito`}
      >
        Añadir al carrito
      </button>
    </article>
  );
}
```

## Focus Management: El aspecto más ignorado

### El problema con SPAs

En aplicaciones tradicionales, el navegador gestiona el foco automáticamente. En SPAs con React, **nosotros somos responsables**:

```tsx
// hooks/useFocusManagement.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useRouteAnnouncer() {
  const location = useLocation();
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Anunciar cambio de página a lectores de pantalla
    const pageTitle = document.title;
    
    if (announcerRef.current) {
      announcerRef.current.textContent = `Navegado a ${pageTitle}`;
    }

    // Mover foco al inicio del contenido principal
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname]);

  return announcerRef;
}

// Componente para anuncios de navegación
export function RouteAnnouncer() {
  const announcerRef = useRouteAnnouncer();

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
```

### Skip Links: Navegación rápida

```tsx
// components/SkipLinks.tsx
export function SkipLinks() {
  return (
    <nav aria-label="Saltar a sección" className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById('main-content');
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Saltar al contenido principal
      </a>
      <a 
        href="#main-nav" 
        className="skip-link"
      >
        Saltar a navegación
      </a>
    </nav>
  );
}

// CSS necesario
const skipLinkStyles = `
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  left: -9999px;
  padding: 1rem;
  background: #000;
  color: #fff;
  text-decoration: none;
}

.skip-link:focus {
  left: 0;
}
`;
```

### Focus Trap para Modales

```tsx
// hooks/useFocusTrap.ts
import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Guardar elemento activo actual
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Mover foco al primer elemento focusable
    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      // Shift + Tab en primer elemento -> ir al último
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab en último elemento -> ir al primero
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restaurar foco al cerrar
      previousActiveElement.current?.focus();
    };
  }, [isActive, getFocusableElements]);

  return containerRef;
}
```

### Modal accesible completo

```tsx
// components/AccessibleModal.tsx
import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const focusTrapRef = useFocusTrap(isOpen);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Dialog */}
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id={titleId} className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div id={descriptionId} className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
```

## Live Regions: Comunicación dinámica

### Tipos de live regions

```tsx
// components/LiveRegions.tsx
import { createContext, useContext, useState, useCallback } from 'react';

type Politeness = 'polite' | 'assertive';

interface Announcement {
  message: string;
  politeness: Politeness;
}

const LiveRegionContext = createContext<{
  announce: (message: string, politeness?: Politeness) => void;
} | null>(null);

export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, politeness: Politeness = 'polite') => {
    if (politeness === 'assertive') {
      setAssertiveMessage('');
      // Pequeño delay para que el screen reader detecte el cambio
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 100);
    }
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      
      {/* Live region polite - para actualizaciones no urgentes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>

      {/* Live region assertive - para actualizaciones urgentes */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveRegionContext.Provider>
  );
}

export function useAnnounce() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    throw new Error('useAnnounce must be used within LiveRegionProvider');
  }
  return context.announce;
}
```

### Uso práctico en formularios

```tsx
// components/ContactForm.tsx
import { useAnnounce } from './LiveRegions';
import { useActionState } from 'react';

function ContactForm() {
  const announce = useAnnounce();

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      try {
        await submitForm(formData);
        // Anuncio de éxito
        announce('Mensaje enviado correctamente', 'polite');
        return { success: true, error: null };
      } catch (error) {
        // Anuncio de error urgente
        announce(
          `Error al enviar el mensaje: ${error.message}`, 
          'assertive'
        );
        return { success: false, error: error.message };
      }
    },
    { success: false, error: null }
  );

  return (
    <form action={formAction}>
      {/* campos del formulario */}
      
      <button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <LoadingSpinner aria-hidden="true" />
            <span className="sr-only">Enviando mensaje...</span>
            <span aria-hidden="true">Enviando...</span>
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  );
}
```

### Notificaciones toast accesibles

```tsx
// components/Toast.tsx
import { useEffect } from 'react';
import { useAnnounce } from './LiveRegions';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const announce = useAnnounce();

  useEffect(() => {
    // Anunciar el toast a screen readers
    const politeness = type === 'error' ? 'assertive' : 'polite';
    const prefix = {
      success: 'Éxito:',
      error: 'Error:',
      warning: 'Advertencia:',
      info: 'Información:'
    }[type];
    
    announce(`${prefix} ${message}`, politeness);

    // Auto-cerrar después de duration
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, type, duration, onClose, announce]);

  return (
    <div 
      role="status"
      className={`toast toast-${type}`}
    >
      <span className="sr-only">
        {type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : 'Notificación'}:
      </span>
      {message}
      <button 
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <XIcon aria-hidden="true" />
      </button>
    </div>
  );
}
```

## Patrones ARIA Complejos

### Tabs accesibles

```tsx
// components/AccessibleTabs.tsx
import { useState, useRef, useId } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function AccessibleTabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tablistRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const tabCount = tabs.length;
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabCount;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabCount - 1;
        break;
      default:
        return;
    }

    const newTab = tabs[newIndex];
    setActiveTab(newTab.id);
    
    // Mover foco al nuevo tab
    const tabButtons = tablistRef.current?.querySelectorAll('[role="tab"]');
    (tabButtons?.[newIndex] as HTMLElement)?.focus();
  };

  return (
    <div className="tabs">
      {/* Tab list */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Pestañas de contenido"
        className="flex border-b"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-2 border-b-2 ${
                isActive 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            tabIndex={0}
            hidden={!isActive}
            className="p-4"
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
```

### Accordion accesible

```tsx
// components/AccessibleAccordion.tsx
import { useState, useId } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function AccessibleAccordion({ items, allowMultiple = false }: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const baseId = useId();

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const itemCount = items.length;
    let targetIndex = index;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (index + 1) % itemCount;
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (index - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = itemCount - 1;
        break;
      default:
        return;
    }

    // Mover foco al botón del item target
    const buttons = document.querySelectorAll(`[data-accordion="${baseId}"]`);
    (buttons[targetIndex] as HTMLElement)?.focus();
  };

  return (
    <div className="accordion divide-y border rounded-lg">
      {items.map((item, index) => {
        const isExpanded = expandedItems.has(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className="accordion-item">
            <h3>
              <button
                id={headerId}
                data-accordion={baseId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50"
              >
                <span className="font-medium">{item.title}</span>
                <ChevronIcon 
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isExpanded}
              className="p-4 pt-0"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Combobox con autocompletado

```tsx
// components/AccessibleCombobox.tsx
import { useState, useRef, useId, useCallback } from 'react';

interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
}

export function AccessibleCombobox({
  options,
  value,
  onChange,
  placeholder = 'Buscar...',
  label
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  
  const inputId = useId();
  const listboxId = useId();
  const labelId = useId();

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectOption = useCallback((option: Option) => {
    onChange(option.value);
    setInputValue(option.label);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex(prev => 
            Math.min(prev + 1, filteredOptions.length - 1)
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          selectOption(filteredOptions[activeIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const activeDescendantId = activeIndex >= 0 
    ? `${listboxId}-option-${activeIndex}` 
    : undefined;

  return (
    <div className="relative">
      <label 
        id={labelId}
        htmlFor={inputId}
        className="block text-sm font-medium mb-1"
      >
        {label}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border rounded-lg"
        />
        
        {isOpen && filteredOptions.length > 0 && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-3 py-2 cursor-pointer ${
                  index === activeIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
        
        {isOpen && filteredOptions.length === 0 && (
          <div 
            role="status"
            className="absolute z-10 w-full mt-1 p-3 bg-white border rounded-lg shadow-lg"
          >
            No se encontraron resultados
          </div>
        )}
      </div>
    </div>
  );
}
```

## Testing de Accesibilidad

### Configuración con jest-axe

```typescript
// test/setup.ts
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
```

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from './Button';

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Button onClick={() => {}}>Click me</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const { container } = render(
      <Button disabled onClick={() => {}}>
        Disabled button
      </Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with icon', async () => {
    const { container } = render(
      <Button 
        onClick={() => {}}
        aria-label="Add item"
      >
        <PlusIcon aria-hidden="true" />
      </Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Testing de interacciones de teclado

```typescript
// components/Modal.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibleModal } from './AccessibleModal';

describe('Modal Accessibility', () => {
  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    
    render(
      <AccessibleModal isOpen onClose={() => {}} title="Test Modal">
        <button>First button</button>
        <button>Second button</button>
      </AccessibleModal>
    );

    const firstButton = screen.getByText('First button');
    const secondButton = screen.getByText('Second button');
    const closeButton = screen.getByLabelText('Cerrar modal');

    // Focus should start on first focusable element
    expect(closeButton).toHaveFocus();

    // Tab through elements
    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(secondButton).toHaveFocus();

    // Should cycle back to close button
    await user.tab();
    expect(closeButton).toHaveFocus();

    // Shift+Tab should go backwards
    await user.tab({ shift: true });
    expect(secondButton).toHaveFocus();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccessibleModal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </AccessibleModal>
    );

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA attributes', () => {
    render(
      <AccessibleModal isOpen onClose={() => {}} title="My Dialog">
        <p>Description content</p>
      </AccessibleModal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    
    const title = screen.getByText('My Dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
  });
});
```

### ESLint para accesibilidad

```javascript
// eslint.config.js
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    plugins: {
      'jsx-a11y': eslintPluginJsxA11y
    },
    rules: {
      // Errores críticos
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      
      // Warnings importantes
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      
      // Buenas prácticas
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn'
    }
  }
];
```

## Utilidades CSS para accesibilidad

```css
/* styles/accessibility.css */

/* Clase para ocultar visualmente pero mantener accesible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Hacer visible cuando tiene foco (para skip links) */
.sr-only-focusable:focus,
.sr-only-focusable:focus-within {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Respetar preferencias de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  :root {
    --border-color: CanvasText;
    --focus-ring-color: Highlight;
  }
  
  button, a {
    border: 2px solid var(--border-color);
  }
}

/* Focus visible mejorado */
:focus-visible {
  outline: 3px solid var(--focus-ring-color, #2563eb);
  outline-offset: 2px;
}

/* Quitar outline solo para mouse/touch, mantener para teclado */
:focus:not(:focus-visible) {
  outline: none;
}
```

## Conclusión: Accesibilidad como cultura

La accesibilidad no es una feature que se añade al final: es una forma de pensar el desarrollo desde el inicio. Los puntos clave:

1. **Focus management** es crítico en SPAs - no lo delegues al navegador
2. **Live regions** comunican cambios dinámicos a tecnologías asistivas
3. **Patrones ARIA** tienen especificaciones claras - síguelas al pie de la letra
4. **Testing automatizado** captura solo ~30% de problemas - complementa con testing manual
5. **Preferencias del usuario** deben respetarse (movimiento, contraste, etc.)

Mi regla personal: **si no puedo usar mi aplicación solo con teclado, está incompleta**. Te animo a probar tus propias aplicaciones con un lector de pantalla - la perspectiva que ganas es invaluable.

¿Has auditado la accesibilidad de tus proyectos recientemente? ¿Qué herramientas usas? Me encantaría conocer tu enfoque.
