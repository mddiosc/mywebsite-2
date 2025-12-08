---
title: "TypeScript avanzado para React developers"
description: "Domina TypeScript en React: componentes genéricos, discriminated unions, template literal types, inferencia de tipos y patrones avanzados que elevarán tu código al siguiente nivel."
date: "2025-07-01"
tags: ["typescript", "react", "types", "generics", "frontend", "advanced"]
author: "Miguel Ángel de Dios"
slug: "advanced-typescript-react-developers"
featured: false
---

TypeScript y React son una combinación poderosa, pero la mayoría de developers apenas rasca la superficie. Después de años trabajando con ambas tecnologías, he recopilado los patrones avanzados que realmente marcan la diferencia entre código "tipado" y código **verdaderamente type-safe**.

## Más allá de los básicos: Por qué importa

### El problema con TypeScript superficial

```tsx
// ❌ TypeScript superficial - técnicamente correcto pero poco útil
interface ButtonProps {
  variant: string;
  size: string;
  onClick: Function;
  children: any;
}

// ✅ TypeScript robusto - el compilador trabaja para ti
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}
```

La diferencia: con el segundo enfoque, el IDE te autocompleta las opciones, y errores como `variant="primari"` se detectan en tiempo de compilación.

## Componentes Genéricos: El superpoder de TypeScript

### Select genérico type-safe

```tsx
// components/Select.tsx
interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  'aria-label': string;
}

export function Select<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  disabled = false,
  'aria-label': ariaLabel
}: SelectProps<T>) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const selectedOption = options.find(
          opt => String(opt.value) === e.target.value
        );
        if (selectedOption) {
          onChange(selectedOption.value);
        }
      }}
      disabled={disabled}
      aria-label={ariaLabel}
      className="px-3 py-2 border rounded-lg"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option 
          key={String(option.value)} 
          value={String(option.value)}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Uso - el tipo se infiere automáticamente
type Status = 'pending' | 'active' | 'completed';

const statusOptions: SelectOption<Status>[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'active', label: 'Activo' },
  { value: 'completed', label: 'Completado' }
];

function StatusFilter() {
  const [status, setStatus] = useState<Status | null>(null);

  return (
    <Select
      options={statusOptions}
      value={status}
      onChange={setStatus} // ✅ TypeScript sabe que setStatus recibe Status
      aria-label="Filtrar por estado"
    />
  );
}
```

### Lista genérica con render props

```tsx
// components/List.tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No hay elementos',
  className
}: ListProps<T>) {
  if (items.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Uso
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function UserList({ users }: { users: User[] }) {
  return (
    <List
      items={users}
      keyExtractor={(user) => user.id}
      renderItem={(user) => (
        <div className="flex justify-between p-2">
          <span>{user.name}</span>
          <span className="text-gray-500">{user.email}</span>
        </div>
      )}
      emptyMessage="No hay usuarios registrados"
    />
  );
}
```

### Table genérica con columnas tipadas

```tsx
// components/Table.tsx
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading
}: TableProps<T>) {
  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = item[column.key as keyof T];
    return value as React.ReactNode;
  };

  if (isLoading) {
    return <TableSkeleton columns={columns.length} />;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              scope="col"
              style={{ width: column.width }}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
          >
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className="px-6 py-4 whitespace-nowrap"
              >
                {getCellValue(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Uso con tipos estrictos
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const productColumns: Column<Product>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { 
    key: 'price', 
    header: 'Precio',
    render: (product) => `€${product.price.toFixed(2)}`
  },
  { 
    key: 'stock', 
    header: 'Stock',
    render: (product) => (
      <span className={product.stock < 10 ? 'text-red-500' : 'text-green-500'}>
        {product.stock}
      </span>
    )
  },
  { key: 'category', header: 'Categoría' }
];

function ProductTable({ products }: { products: Product[] }) {
  return (
    <Table
      data={products}
      columns={productColumns}
      keyExtractor={(p) => p.id}
      onRowClick={(product) => console.log('Selected:', product.name)}
    />
  );
}
```

## Discriminated Unions: Tipos que documentan

### Estado de carga con discriminated unions

```tsx
// types/async.ts
type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// Hook que usa el patrón
function useAsync<T, E = Error>(
  asyncFn: () => Promise<T>
): AsyncState<T, E> & { execute: () => void } {
  const [state, setState] = useState<AsyncState<T, E>>({ status: 'idle' });

  const execute = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await asyncFn();
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', error: error as E });
    }
  }, [asyncFn]);

  return { ...state, execute };
}

// Componente que consume el estado
function UserProfile({ userId }: { userId: string }) {
  const userState = useAsync(() => fetchUser(userId));

  // TypeScript conoce las propiedades disponibles en cada caso
  switch (userState.status) {
    case 'idle':
      return <button onClick={userState.execute}>Cargar perfil</button>;
    
    case 'loading':
      return <LoadingSpinner />;
    
    case 'success':
      // ✅ TypeScript sabe que userState.data existe aquí
      return (
        <div>
          <h1>{userState.data.name}</h1>
          <p>{userState.data.email}</p>
        </div>
      );
    
    case 'error':
      // ✅ TypeScript sabe que userState.error existe aquí
      return (
        <ErrorMessage 
          message={userState.error.message}
          onRetry={userState.execute}
        />
      );
  }
}
```

### Props polimórficas con discriminated unions

```tsx
// components/Button.tsx
type ButtonBaseProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
};

type ButtonAsButton = ButtonBaseProps & {
  as?: 'button';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
};

type ButtonAsLink = ButtonBaseProps & {
  as: 'link';
  href: string;
  target?: '_blank' | '_self';
  rel?: string;
};

type ButtonAsExternalLink = ButtonBaseProps & {
  as: 'external';
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternalLink;

export function Button(props: ButtonProps) {
  const { 
    children, 
    variant = 'primary', 
    size = 'md', 
    disabled, 
    isLoading,
    ...rest 
  } = props;

  const className = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    // variant styles...
    // size styles...
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const content = (
    <>
      {isLoading && <Spinner className="mr-2" />}
      {children}
    </>
  );

  // TypeScript discrimina el tipo basado en 'as'
  if (props.as === 'link') {
    return (
      <Link 
        to={props.href}
        target={props.target}
        className={className}
      >
        {content}
      </Link>
    );
  }

  if (props.as === 'external') {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  // Default: button
  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={disabled || isLoading}
      className={className}
    >
      {content}
    </button>
  );
}

// Uso - TypeScript verifica las props según 'as'
<Button onClick={() => {}}>Click me</Button>
<Button as="link" href="/about">About</Button>
<Button as="external" href="https://github.com">GitHub</Button>

// ❌ Error: 'href' is required when as="link"
<Button as="link">Missing href</Button>

// ❌ Error: 'onClick' doesn't exist when as="link"
<Button as="link" href="/about" onClick={() => {}}>Invalid</Button>
```

## Template Literal Types: Tipos dinámicos

### Sistema de espaciado tipado

```tsx
// types/spacing.ts
type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
type SpacingDirection = 't' | 'r' | 'b' | 'l' | 'x' | 'y' | '';
type SpacingProperty = 'm' | 'p';

// Genera tipos como: 'mt-0' | 'mt-1' | ... | 'px-24' | 'py-24'
type SpacingClass = `${SpacingProperty}${SpacingDirection}-${SpacingScale}`;

// Función helper con tipos estrictos
function spacing(...classes: SpacingClass[]): string {
  return classes.join(' ');
}

// Uso
const className = spacing('mt-4', 'px-6', 'pb-2');
// ✅ Válido

const invalid = spacing('mt-100'); 
// ❌ Error: '100' is not assignable to SpacingScale
```

### Event handlers tipados dinámicamente

```tsx
// types/events.ts
type EventType = 'click' | 'change' | 'submit' | 'focus' | 'blur';
type EventHandlerName<T extends EventType> = `on${Capitalize<T>}`;

// Genera: 'onClick' | 'onChange' | 'onSubmit' | 'onFocus' | 'onBlur'
type AnyEventHandler = EventHandlerName<EventType>;

// Crear objeto de handlers tipado
type EventHandlers<T extends EventType> = {
  [K in EventHandlerName<T>]?: (event: Event) => void;
};

// Uso en componente
interface InputProps extends EventHandlers<'change' | 'focus' | 'blur'> {
  value: string;
  placeholder?: string;
}

function Input({ value, onChange, onFocus, onBlur, placeholder }: InputProps) {
  return (
    <input
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  );
}
```

### API Routes tipadas

```tsx
// types/api.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiEndpoint = 
  | '/users'
  | '/users/:id'
  | '/posts'
  | '/posts/:id'
  | '/posts/:id/comments';

type ApiRoute = `${HttpMethod} ${ApiEndpoint}`;

// Request/Response types basados en la ruta
interface ApiConfig {
  'GET /users': {
    response: User[];
    params: { page?: number; limit?: number };
  };
  'GET /users/:id': {
    response: User;
    params: { id: string };
  };
  'POST /users': {
    response: User;
    body: CreateUserDto;
  };
  'PUT /users/:id': {
    response: User;
    params: { id: string };
    body: UpdateUserDto;
  };
  'DELETE /users/:id': {
    response: void;
    params: { id: string };
  };
}

// Cliente API type-safe
async function apiRequest<T extends keyof ApiConfig>(
  route: T,
  options?: {
    params?: ApiConfig[T] extends { params: infer P } ? P : never;
    body?: ApiConfig[T] extends { body: infer B } ? B : never;
  }
): Promise<ApiConfig[T]['response']> {
  // Implementación...
}

// Uso - totalmente tipado
const users = await apiRequest('GET /users', { 
  params: { page: 1, limit: 10 } 
});
// users es User[]

const user = await apiRequest('GET /users/:id', { 
  params: { id: '123' } 
});
// user es User

await apiRequest('POST /users', { 
  body: { name: 'John', email: 'john@example.com' } 
});
```

## Inferencia Avanzada de Tipos

### Inferir tipos de objetos de configuración

```tsx
// utils/createStore.ts
interface StoreConfig<State, Actions> {
  initialState: State;
  actions: Actions;
}

type ActionCreator<State> = (state: State, ...args: any[]) => Partial<State>;

type InferActions<State, T extends Record<string, ActionCreator<State>>> = {
  [K in keyof T]: T[K] extends (state: State, ...args: infer Args) => any
    ? (...args: Args) => void
    : never;
};

function createStore<
  State,
  Actions extends Record<string, ActionCreator<State>>
>(config: StoreConfig<State, Actions>) {
  let state = config.initialState;
  const listeners = new Set<() => void>();

  const actions = {} as InferActions<State, Actions>;
  
  for (const key in config.actions) {
    (actions as any)[key] = (...args: any[]) => {
      const newState = config.actions[key](state, ...args);
      state = { ...state, ...newState };
      listeners.forEach(listener => listener());
    };
  }

  return {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    actions
  };
}

// Uso - los tipos se infieren automáticamente
const counterStore = createStore({
  initialState: { count: 0, lastUpdated: null as Date | null },
  actions: {
    increment: (state) => ({ count: state.count + 1, lastUpdated: new Date() }),
    decrement: (state) => ({ count: state.count - 1, lastUpdated: new Date() }),
    incrementBy: (state, amount: number) => ({ 
      count: state.count + amount, 
      lastUpdated: new Date() 
    }),
    reset: () => ({ count: 0, lastUpdated: null })
  }
});

// TypeScript conoce todas las acciones y sus parámetros
counterStore.actions.increment(); // ✅
counterStore.actions.incrementBy(5); // ✅
counterStore.actions.incrementBy('5'); // ❌ Error: string no es number
```

### Inferir props de componentes

```tsx
// utils/types.ts
import { ComponentProps, ComponentType, ElementType } from 'react';

// Extraer props de cualquier componente
type PropsOf<C extends ElementType> = ComponentProps<C>;

// Uso
type ButtonProps = PropsOf<'button'>;
type InputProps = PropsOf<'input'>;
type DivProps = PropsOf<'div'>;

// Para componentes custom
type MyComponentProps = PropsOf<typeof MyComponent>;

// Crear componente que extiende props nativas
interface EnhancedInputProps extends PropsOf<'input'> {
  label: string;
  error?: string;
  helperText?: string;
}

function EnhancedInput({ 
  label, 
  error, 
  helperText, 
  ...inputProps 
}: EnhancedInputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} aria-invalid={!!error} />
      {error && <span className="text-red-500">{error}</span>}
      {helperText && <span className="text-gray-500">{helperText}</span>}
    </div>
  );
}
```

### Componente "as" polimórfico avanzado

```tsx
// components/Box.tsx
import { ElementType, ComponentPropsWithoutRef, forwardRef } from 'react';

type BoxOwnProps<E extends ElementType = 'div'> = {
  as?: E;
  children?: React.ReactNode;
};

type BoxProps<E extends ElementType> = BoxOwnProps<E> & 
  Omit<ComponentPropsWithoutRef<E>, keyof BoxOwnProps>;

type BoxComponent = <E extends ElementType = 'div'>(
  props: BoxProps<E>
) => React.ReactElement | null;

export const Box: BoxComponent = forwardRef(
  <E extends ElementType = 'div'>(
    { as, children, ...props }: BoxProps<E>,
    ref: React.Ref<Element>
  ) => {
    const Component = as || 'div';
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

// Uso - TypeScript infiere las props correctas según 'as'
<Box>Default div</Box>
<Box as="section" aria-label="Main content">Section</Box>
<Box as="a" href="/about">Link</Box>
<Box as="button" onClick={() => {}}>Button</Box>

// ❌ Error: 'href' doesn't exist on 'button'
<Box as="button" href="/invalid">Invalid</Box>
```

## Utility Types Personalizados

### DeepPartial y DeepRequired

```tsx
// types/utils.ts
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

// Uso en configuración
interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    headers: {
      authorization?: string;
      contentType: string;
    };
  };
  features: {
    darkMode: boolean;
    analytics: {
      enabled: boolean;
      trackingId: string;
    };
  };
}

// Para configuración parcial (overrides)
type PartialConfig = DeepPartial<AppConfig>;

// Para configuración completa (después de merge con defaults)
type CompleteConfig = DeepRequired<AppConfig>;

function mergeConfig(
  defaults: CompleteConfig, 
  overrides: PartialConfig
): CompleteConfig {
  // Implementación de deep merge...
}
```

### PathKeys para acceso seguro a objetos anidados

```tsx
// types/paths.ts
type PathKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? PathKeys<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

// Obtener tipo de valor en un path
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Función get tipada
function get<T extends object, P extends PathKeys<T>>(
  obj: T,
  path: P
): PathValue<T, P> {
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj);
}

// Uso
interface Settings {
  user: {
    profile: {
      name: string;
      email: string;
    };
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  app: {
    version: string;
  };
}

const settings: Settings = {
  user: {
    profile: { name: 'John', email: 'john@example.com' },
    preferences: { theme: 'dark', notifications: true }
  },
  app: { version: '1.0.0' }
};

const theme = get(settings, 'user.preferences.theme');
// theme es 'light' | 'dark' ✅

const invalid = get(settings, 'user.invalid.path');
// ❌ Error de compilación
```

### Branded Types para IDs seguros

```tsx
// types/branded.ts
declare const brand: unique symbol;

type Brand<T, B> = T & { [brand]: B };

// Crear tipos de ID específicos
type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;
type CommentId = Brand<string, 'CommentId'>;

// Funciones constructoras
const createUserId = (id: string): UserId => id as UserId;
const createPostId = (id: string): PostId => id as PostId;
const createCommentId = (id: string): CommentId => id as CommentId;

// Funciones que requieren IDs específicos
function getUser(id: UserId): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

function getPost(id: PostId): Promise<Post> {
  return fetch(`/api/posts/${id}`).then(r => r.json());
}

// Uso
const userId = createUserId('user-123');
const postId = createPostId('post-456');

await getUser(userId); // ✅
await getPost(postId); // ✅

await getUser(postId); // ❌ Error: PostId no es asignable a UserId
await getPost(userId); // ❌ Error: UserId no es asignable a PostId
```

## Patrones en Hooks Personalizados

### Hook de formulario totalmente tipado

```tsx
// hooks/useForm.ts
type FieldErrors<T> = {
  [K in keyof T]?: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean | string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: T[K], formValues: T) => string | true;
  };
};

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: FieldErrors<T>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: (field: keyof T, error: string) => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    () => Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const rules = validationRules[field];
      if (!rules) return undefined;

      if (rules.required) {
        const isEmpty = value === '' || value === null || value === undefined;
        if (isEmpty) {
          return typeof rules.required === 'string' 
            ? rules.required 
            : 'Este campo es requerido';
        }
      }

      if (rules.minLength && typeof value === 'string') {
        if (value.length < rules.minLength.value) {
          return rules.minLength.message;
        }
      }

      if (rules.maxLength && typeof value === 'string') {
        if (value.length > rules.maxLength.value) {
          return rules.maxLength.message;
        }
      }

      if (rules.pattern && typeof value === 'string') {
        if (!rules.pattern.value.test(value)) {
          return rules.pattern.message;
        }
      }

      if (rules.validate) {
        const result = rules.validate(value, values);
        if (result !== true) {
          return result;
        }
      }

      return undefined;
    },
    [validationRules, values]
  );

  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, values[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [values, validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: FieldErrors<T> = {};
    let isValid = true;

    for (const field in values) {
      const error = validateField(field as keyof T, values[field]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      )
    );

    return isValid;
  }, [values, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      )
    );
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue: handleChange,
    setFieldError: (field, error) => setErrors(prev => ({ ...prev, [field]: error }))
  };
}

// Uso
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

function LoginPage() {
  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationRules: {
      email: {
        required: 'El email es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Email inválido'
        }
      },
      password: {
        required: 'La contraseña es requerida',
        minLength: {
          value: 8,
          message: 'Mínimo 8 caracteres'
        }
      }
    },
    onSubmit: async (values) => {
      await login(values.email, values.password, values.rememberMe);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        type="email"
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        onBlur={() => form.handleBlur('email')}
      />
      {form.errors.email && <span>{form.errors.email}</span>}
      
      {/* ... más campos */}
    </form>
  );
}
```

## Conclusión: TypeScript como documentación viva

TypeScript avanzado no se trata de mostrar lo inteligente que eres con los tipos - se trata de:

1. **Prevenir errores** en tiempo de compilación, no en producción
2. **Documentar intenciones** de forma que el IDE entienda
3. **Facilitar refactorizaciones** con confianza
4. **Mejorar la DX** con autocompletado preciso

Los patrones que he compartido pueden parecer complejos al principio, pero una vez internalizados, escribir código type-safe se vuelve natural. La inversión en aprender TypeScript avanzado se paga con creces en:

- Menos bugs en producción
- Refactorizaciones más seguras
- Onboarding más rápido de nuevos developers
- Código autodocumentado

Mi recomendación: **empieza aplicando un patrón nuevo por semana**. Antes de darte cuenta, estos patrones serán parte natural de tu toolkit.

¿Cuál de estos patrones te resultó más útil? ¿Hay algún patrón de TypeScript que uses frecuentemente que no mencioné? Me encantaría conocer tu experiencia.
