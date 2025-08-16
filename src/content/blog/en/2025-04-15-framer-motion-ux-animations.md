---
title: "Framer Motion: Animations that improve UX without sacrificing performance"
description: "I explore how to implement effective animations with Framer Motion that enhance user experience, optimize performance perception, and maintain accessibility."
date: "2025-04-15"
tags: ["framer-motion", "animations", "ux", "performance", "accessibility", "react"]
author: "Miguel Ángel de Dios"
slug: "framer-motion-ux-animations"
featured: false
---

Web animations have evolved from being "decorative" elements to becoming fundamental components of user experience. In my experience developing interfaces, I've learned that **the best animations are those users don't consciously notice**, but make the application feel more fluid and responsive.

## The real purpose of animations

### Beyond decoration

Effective animations serve three main functions:

1. **Spatial orientation**: They help users understand the application flow
2. **State feedback**: They communicate what's happening in real-time
3. **Performance perception**: They make the application feel faster

```tsx
// ❌ Animation without clear purpose
const DecorativeComponent = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    <h1>Spinning title!</h1>
  </motion.div>
);

// ✅ Animation with UX purpose
const NavigationFeedback = () => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    Navigate to projects
  </motion.button>
);
```

## Practical implementation with Framer Motion

### Optimized configuration

My base setup includes configurations that prioritize performance:

```tsx
// motion.config.ts
import { domAnimation, LazyMotion } from "framer-motion";

export const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);
```

### Entry animations that tell a story

```tsx
// components/AnimatedSection.tsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export const AnimatedSection = ({ children, className }: Props) => (
  <motion.section
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10%" }}
    variants={containerVariants}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div key={index} variants={itemVariants}>
        {child}
      </motion.div>
    ))}
  </motion.section>
);
```

## Effective animation patterns

### 1. Micro-interactions that build trust

```tsx
// hooks/useButtonAnimation.ts
export const useButtonAnimation = (isLoading: boolean) => {
  const variants = {
    idle: { scale: 1 },
    loading: { scale: 0.95 },
    success: { scale: 1.05 },
    error: { scale: 1, x: [-10, 10, -10, 10, 0] }
  };

  const getCurrentState = () => {
    if (isLoading) return "loading";
    return "idle";
  };

  return { variants, currentState: getCurrentState() };
};

// components/AnimatedButton.tsx
const AnimatedButton = ({ onClick, isLoading, children }: Props) => {
  const { variants, currentState } = useButtonAnimation(isLoading);
  
  return (
    <motion.button
      variants={variants}
      animate={currentState}
      whileTap="tap"
      onClick={onClick}
      disabled={isLoading}
      className="button-primary"
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner />
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
```

### 2. Page transitions that maintain context

```tsx
// components/PageTransition.tsx
const pageVariants = {
  initial: { 
    opacity: 0, 
    x: "-100vw",
    transition: { type: "spring", stiffness: 50 }
  },
  in: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 18 }
  },
  out: { 
    opacity: 0, 
    x: "100vw",
    transition: { type: "spring", stiffness: 50 }
  }
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    className="page-container"
  >
    {children}
  </motion.div>
);
```

### 3. Intelligent loading visual feedback

```tsx
// components/ContentLoader.tsx
const ContentLoader = ({ isLoading, children }: Props) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="skeleton-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## Performance optimization

### Techniques for smooth animations

```tsx
// utils/animationOptimizations.ts
export const performantTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 1
};

export const gpuAcceleratedProps = {
  style: {
    transform: "translateZ(0)", // Force GPU layer
    willChange: "transform"     // Hint to browser
  }
};

// Hook to optimize complex animations
export const useOptimizedAnimation = (shouldAnimate: boolean) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (shouldAnimate) {
      setIsAnimating(true);
      // Cleanup after animation
      const timeout = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [shouldAnimate]);
  
  return {
    shouldRender: isAnimating || shouldAnimate,
    animationProps: isAnimating ? gpuAcceleratedProps : {}
  };
};
```

### Measuring performance impact

```tsx
// hooks/useAnimationPerformance.ts
export const useAnimationPerformance = () => {
  useEffect(() => {
    let frameCount = 0;
    let startTime = Date.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = Date.now();
      
      if (currentTime - startTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - startTime));
        
        if (fps < 50) {
          console.warn(`Animation performance warning: ${fps}fps`);
        }
        
        frameCount = 0;
        startTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);
};
```

## Accessibility in animations

### Respecting user preferences

```tsx
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// components/AccessibleMotion.tsx
const AccessibleMotion = ({ children, ...motionProps }: Props) => {
  const prefersReducedMotion = useReducedMotion();
  
  const accessibleProps = prefersReducedMotion 
    ? { initial: false, animate: false, exit: false }
    : motionProps;
  
  return (
    <motion.div {...accessibleProps}>
      {children}
    </motion.div>
  );
};
```

### Inclusive animations

```tsx
// constants/accessibleAnimations.ts
export const accessibleVariants = {
  // Subtle movements instead of large displacements
  subtle: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  
  // Durations that respect cognitive needs
  comfortable: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] // Smooth easing
  },
  
  // Alternatives without movement
  static: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
};
```

## Advanced use cases

### Animated notification system

```tsx
// components/NotificationSystem.tsx
const notificationVariants = {
  initial: { x: 300, opacity: 0, scale: 0.8 },
  animate: { 
    x: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    x: 300, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const NotificationSystem = () => {
  const notifications = useNotifications();
  
  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            variants={notificationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            className={`notification notification-${notification.type}`}
          >
            <NotificationContent {...notification} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

### Real-time data animations

```tsx
// components/AnimatedChart.tsx
const AnimatedChart = ({ data }: { data: ChartData[] }) => {
  return (
    <svg viewBox="0 0 400 200" className="chart">
      {data.map((point, index) => (
        <motion.circle
          key={point.id}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#3B82F6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        />
      ))}
      <motion.path
        d={generatePath(data)}
        stroke="#3B82F6"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
};
```

## Reflections on the future of animations

Web animations are evolving to be **smarter and more contextual**. Instead of applying universal effects, the best implementations adapt animations based on:

- **The device**: More conservative animations on low-end devices
- **Connectivity**: Reduce complex animations on slow connections
- **Usage context**: More subtle animations in professional applications
- **User preferences**: Systems that learn from interactions

```tsx
// hooks/useAdaptiveAnimations.ts
export const useAdaptiveAnimations = () => {
  const prefersReducedMotion = useReducedMotion();
  const { isLowEnd } = useDeviceCapabilities();
  const { isSlowConnection } = useConnection();
  
  const shouldReduceAnimations = prefersReducedMotion || isLowEnd || isSlowConnection;
  
  return {
    duration: shouldReduceAnimations ? 0.1 : 0.3,
    type: shouldReduceAnimations ? "tween" : "spring",
    stiffness: shouldReduceAnimations ? undefined : 400
  };
};
```

## Conclusion: Animations that truly matter

After implementing hundreds of animations, I've come to this philosophy: **the best animations are those that solve real usability problems**. It's not about impressing, but creating more fluid and understandable experiences.

Effective animations:

- **Reduce cognitive load** for the user
- **Improve performance perception**
- **Provide immediate feedback** on actions
- **Respect accessibility preferences**
- **Optimize automatically** based on context

In my next post, we'll explore how to implement a design token system that includes consistent animations throughout the application, maintaining visual and functional coherence.

What do you think about the balance between functionality and aesthetics in web animations? Have you noticed how micro-interactions affect your experience as a user?
