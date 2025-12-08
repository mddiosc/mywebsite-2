/**
 * TransitionLink component for smooth page navigation
 *
 * A React 19 enhanced link component that uses useTransition for seamless
 * navigation without hiding the current page content while loading.
 *
 * Features:
 * - Keeps current page visible during navigation
 * - Provides visual feedback during transitions
 * - Supports all standard Link props
 * - Accessible with proper ARIA attributes
 */

import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react'
import type { To, NavigateOptions } from 'react-router'

import { useNavigationTransition } from '../hooks/useNavigationTransition'

/**
 * Props interface for TransitionLink component
 */
export interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** The destination path or location object */
  to: To
  /** Navigation options passed to react-router */
  options?: NavigateOptions
  /** Child elements to render inside the link */
  children: ReactNode
  /** Additional className when navigation is pending */
  pendingClassName?: string
  /** Whether to show a loading indicator during navigation */
  showLoadingIndicator?: boolean
  /** Ref forwarded to the anchor element (React 19 style - no forwardRef needed) */
  ref?: Ref<HTMLAnchorElement>
}

/**
 * A link component that uses React 19's useTransition for smooth navigation
 *
 * Unlike standard links that immediately hide content and show a loader,
 * TransitionLink keeps the current page visible while the new page loads,
 * providing a much smoother user experience.
 *
 * @example
 * ```tsx
 * <TransitionLink
 *   to="/about"
 *   className="text-indigo-600 hover:text-indigo-500"
 *   pendingClassName="opacity-70"
 * >
 *   About Us
 * </TransitionLink>
 * ```
 */
export function TransitionLink({
  to,
  options,
  children,
  className,
  pendingClassName,
  onClick,
  ref,
  ...rest
}: TransitionLinkProps) {
  const { navigateWithTransition, isNavigating } = useNavigationTransition()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't interfere with modified clicks (new tab, etc.)
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }

    event.preventDefault()

    // Call any custom onClick handler first
    if (onClick) {
      onClick(event)
    }

    navigateWithTransition(to, options)
  }

  const href = typeof to === 'string' ? to : (to.pathname ?? '')
  const combinedClassName = [className, isNavigating ? pendingClassName : '']
    .filter(Boolean)
    .join(' ')

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      className={combinedClassName}
      aria-busy={isNavigating ? 'true' : undefined}
      {...rest}
    >
      {children}
    </a>
  )
}

export default TransitionLink
