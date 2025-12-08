---
title: "Advanced TypeScript for React Developers: Patterns That Will Transform Your Code"
description: "Master advanced TypeScript patterns specifically for React: generic components, discriminated unions, template literal types, and more."
date: "2025-07-01"
tags: ["typescript", "react", "advanced", "patterns", "types", "generics"]
author: "Marco Di Dionisio"
slug: "advanced-typescript-react-developers"
featured: true
---

TypeScript and React make an excellent combination, but many developers only scratch the surface of what TypeScript can offer. Today I want to share the advanced patterns that have taken my code quality to another level.

## The Problem With "any"

We've all been there: a complex type that we don't know how to resolve and we end up using `any`. But each `any` is a time bomb in our code.

```typescript
// ❌ The problem
const processData = (data: any) => {
  return data.map((item: any) => item.value); // What if data isn't an array?
};

// ✅ The solution
const processData = <T extends { value: unknown }>(data: T[]): T['value'][] => {
  return data.map((item) => item.value);
};
```

## Generic Components: Beyond Props

Generic components allow us to create reusable components that maintain type safety.

### Select Component

```typescript
interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string | number;
  placeholder?: string;
}

function Select<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = 'Select an option'
}: SelectProps<T>) {
  return (
    <select
      value={value ? String(getValue(value)) : ''}
      onChange={(e) => {
        const selected = options.find(
          (opt) => String(getValue(opt)) === e.target.value
        );
        if (selected) onChange(selected);
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// Usage with complete type safety
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Mary', email: 'mary@example.com' }
];

<Select
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  getLabel={(user) => user.name} // TypeScript knows it's User
  getValue={(user) => user.id}
/>;
```

### Data Table

```typescript
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    
    const key = column.key as keyof T;
    const value = item[key];
    
    return value as React.ReactNode;
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="empty">{emptyMessage}</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            onClick={() => onRowClick?.(item)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((col) => (
              <td key={`${item.id}-${String(col.key)}`}>
                {getCellValue(item, col)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Fully typed usage
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const columns: Column<Product>[] = [
  { key: 'name', header: 'Product', sortable: true },
  { key: 'price', header: 'Price', render: (p) => `$${p.price.toFixed(2)}` },
  { 
    key: 'stock', 
    header: 'Availability',
    render: (p) => p.stock > 0 ? '✅ Available' : '❌ Out of Stock'
  }
];
```

## Discriminated Unions: Type-Safe State Patterns

Discriminated unions are perfect for modeling complex states with clear transitions.

### Request State

```typescript
type RequestState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

function useRequest<T, E = Error>() {
  const [state, setState] = useState<RequestState<T, E>>({ status: 'idle' });

  const execute = async (promise: Promise<T>) => {
    setState({ status: 'loading' });
    
    try {
      const data = await promise;
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', error: error as E });
    }
  };

  return { state, execute };
}

// Usage with type exhaustiveness
function RequestHandler<T>({ state }: { state: RequestState<T> }) {
  switch (state.status) {
    case 'idle':
      return <p>Click to start</p>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataDisplay data={state.data} />; // TypeScript knows data exists
    case 'error':
      return <Error message={state.error.message} />; // TypeScript knows error exists
  }
}
```

### Forms With Different Modes

```typescript
type FormMode =
  | { mode: 'create' }
  | { mode: 'edit'; entityId: string; initialData: FormData }
  | { mode: 'view'; entityId: string; data: FormData };

interface FormProps {
  modeConfig: FormMode;
  onSubmit?: (data: FormData) => Promise<void>;
}

function EntityForm({ modeConfig, onSubmit }: FormProps) {
  const isReadOnly = modeConfig.mode === 'view';
  
  const defaultValues = modeConfig.mode === 'create' 
    ? {} 
    : modeConfig.mode === 'edit'
    ? modeConfig.initialData
    : modeConfig.data;

  return (
    <form>
      {modeConfig.mode !== 'create' && (
        <input type="hidden" value={modeConfig.entityId} />
      )}
      {/* TypeScript knows exactly which properties are available */}
    </form>
  );
}
```

## Template Literal Types: Typing Dynamic Strings

Template literal types allow us to create precise types for string patterns.

### Type-Safe Event System

```typescript
type EventCategory = 'user' | 'system' | 'analytics';
type EventAction = 'click' | 'view' | 'submit' | 'error';
type EventName = `${EventCategory}:${EventAction}`;

// Valid types: 'user:click' | 'user:view' | 'system:error' ...

interface EventPayloads {
  'user:click': { elementId: string; timestamp: number };
  'user:submit': { formId: string; data: Record<string, unknown> };
  'system:error': { code: string; message: string; stack?: string };
  'analytics:view': { page: string; duration: number };
}

type TrackedEvent = keyof EventPayloads;

function trackEvent<E extends TrackedEvent>(
  event: E,
  payload: EventPayloads[E]
): void {
  console.log(`Tracking ${event}:`, payload);
  // Send to analytics service
}

// TypeScript ensures correct payload for each event
trackEvent('user:click', { elementId: 'btn-1', timestamp: Date.now() }); // ✅
trackEvent('system:error', { code: '500', message: 'Server error' }); // ✅
trackEvent('user:click', { page: 'home' }); // ❌ Error: incorrect payload
```

### CSS Utility Types

```typescript
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
type CSSValue = `${number}${CSSUnit}` | 'auto' | 'inherit';

type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
type SpacingDirection = 't' | 'r' | 'b' | 'l' | 'x' | 'y' | '';
type SpacingClass = `m${SpacingDirection}-${SpacingScale}` | `p${SpacingDirection}-${SpacingScale}`;

// Valid: 'mt-4' | 'px-2' | 'm-0' | 'py-8' ...

interface StyleProps {
  margin?: CSSValue;
  padding?: CSSValue;
  className?: SpacingClass;
}
```

## Type Inference With infer

The `infer` keyword allows us to extract types from complex structures.

### Extracting Prop Types

```typescript
// Extract props type from any component
type PropsOf<C> = C extends React.ComponentType<infer P> ? P : never;

// Usage
type ButtonProps = PropsOf<typeof Button>;
type ModalProps = PropsOf<typeof Modal>;
```

### Extracting Promise Return Types

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Extracting the return type of an async function
type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  UnwrapPromise<ReturnType<T>>;

async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as Promise<{ id: string; name: string }>;
}

type UserData = AsyncReturnType<typeof fetchUser>;
// type UserData = { id: string; name: string }
```

### Extracting Array Elements

```typescript
type ArrayElement<T> = T extends (infer U)[] ? U : never;

const items = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' }
] as const;

type Item = ArrayElement<typeof items>;
// type Item = { readonly id: 1; readonly name: "A" } | { readonly id: 2; readonly name: "B" }
```

## Conditional Types: Type Logic

Conditional types allow us to create types that change based on conditions.

### Type-Safe API Responses

```typescript
interface ApiResponse<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

type SuccessResponse<T> = {
  success: true;
  data: T;
  error?: never;
};

type ErrorResponse<E> = {
  success: false;
  data?: never;
  error: E;
};

type StrictApiResponse<T, E = Error> = SuccessResponse<T> | ErrorResponse<E>;

// Helper function with narrowing
function handleResponse<T>(response: StrictApiResponse<T, string>) {
  if (response.success) {
    // TypeScript knows response.data exists
    return processData(response.data);
  } else {
    // TypeScript knows response.error exists
    throw new Error(response.error);
  }
}
```

### Conditional Props

```typescript
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

type ButtonBaseProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
};

// If it's a link, needs href. Otherwise, needs onClick
type ButtonProps = ButtonBaseProps &
  (
    | { variant: 'link'; href: string; onClick?: never }
    | { variant?: Exclude<ButtonVariant, 'link'>; onClick?: () => void; href?: never }
  );

function Button({ variant = 'solid', children, ...props }: ButtonProps) {
  if (variant === 'link' && 'href' in props) {
    return <a href={props.href}>{children}</a>;
  }
  
  return (
    <button onClick={'onClick' in props ? props.onClick : undefined}>
      {children}
    </button>
  );
}

// Usage
<Button variant="link" href="/about">About</Button>; // ✅
<Button variant="solid" onClick={() => {}}>Click</Button>; // ✅
<Button variant="link" onClick={() => {}}>Error</Button>; // ❌ Type error
```

## Advanced Utility Types

### DeepPartial and DeepRequired

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Useful for forms with optional nested fields
interface UserSettings {
  profile: {
    name: string;
    avatar: {
      url: string;
      alt: string;
    };
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

type PartialSettings = DeepPartial<UserSettings>;
// All fields are now optional at every level
```

### Safe Path Types

```typescript
type PathKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${PathKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

// Get value at path with type safety
type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : never;

function getValue<T, P extends PathKeys<T>>(
  obj: T,
  path: P
): PathValue<T, P> {
  return path.split('.').reduce((acc: unknown, key) => 
    (acc as Record<string, unknown>)?.[key], obj
  ) as PathValue<T, P>;
}

// Usage
interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    darkMode: boolean;
  };
}

const config: Config = {
  api: { baseUrl: 'https://api.example.com', timeout: 5000 },
  features: { darkMode: true }
};

const url = getValue(config, 'api.baseUrl'); // type: string
const timeout = getValue(config, 'api.timeout'); // type: number
```

## Practical Tips

### 1. Use `satisfies` for Validation Without Widening

```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
} satisfies Record<string, string | number>;

// config.apiUrl is of type string (not string | number)
```

### 2. Function Overloading for Better APIs

```typescript
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: 'button'): HTMLButtonElement;
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const input = createElement('input'); // HTMLInputElement
const button = createElement('button'); // HTMLButtonElement
```

### 3. Assertion Functions

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

function processInput(input: unknown) {
  assertIsString(input);
  // TypeScript knows input is string here
  return input.toUpperCase();
}
```

## Conclusion

TypeScript offers incredibly powerful tools for building robust React applications. These patterns may seem complex at first, but once mastered, they completely transform how you write code.

**Key benefits:**

- ✅ Early bug detection at compile time
- ✅ Better documentation through types
- ✅ More confident refactoring
- ✅ Superior IntelliSense and autocompletion

The most important thing is to start gradually. Don't try to implement all these patterns at once. Choose one, master it, and then move on to the next.

Which of these patterns catches your attention the most? I'd love to hear about your experience with TypeScript in React! 🚀
