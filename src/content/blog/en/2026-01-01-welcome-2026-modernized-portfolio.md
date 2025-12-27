---
title: "Welcome 2026! Modernized Portfolio with Dark Mode and Glassmorphism"
description: "Celebrating the arrival of 2026 with a completely revamped portfolio. Discover the visual and technical changes I've implemented: dark mode, glassmorphism, 3D animations, and a redesigned mobile experience."
date: "2026-01-01"
tags: ["portfolio", "react", "design", "dark-mode", "glassmorphism", "ui-ux", "2026"]
author: "Miguel Ángel de Dios"
slug: "welcome-2026-modernized-portfolio"
featured: true
---

## 🎉 Happy New Year 2026

Welcome to 2026! I hope you had an excellent holiday season and that this new year brings exciting projects, continuous learning, and lots of quality code.

As I mentioned in my [last post about frontend challenges for 2026](/en/blog/happy-holidays-frontend-challenges-2026), this year promises to be transformative for web development. And what better way to start it than with a completely renovated portfolio.

---

## 🎨 Why Modernize Now?

During the last few weeks, in some spare time between holiday celebrations, I decided to give my portfolio a complete refresh. Not just for aesthetics (although that counts too), but to:

1. **Practice with 2026 design trends** - Glassmorphism, dark mode, micro-interactions
2. **Improve user experience** - Especially on mobile devices
3. **Practice what I preach** - If I talk about trends, I should implement them
4. **Have a personal playground** - To experiment with new techniques

The result: **two Pull Requests** that completely transformed the site's visual experience.

---

## 🌓 Dark Mode: More Than A Toggle

### The Challenge

Implementing dark mode isn't just inverting colors. It's creating a coherent experience that:

- Is comfortable for the eyes in dark environments
- Maintains visual hierarchy
- Preserves brand identity
- Persists user preference

### The Implementation

I opted for a class-based system with a React context:

```tsx
// Simplified ThemeContext
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Retrieve saved preference
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply class to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Optimized Color Palette

One of the most important decisions was creating a brighter palette for dark mode:

```css
/* Light mode */
--primary: hsl(220, 90%, 56%);
--accent: hsl(340, 82%, 52%);

/* Dark mode - more vibrant colors */
--primary-light: hsl(220, 90%, 65%);
--accent-light: hsl(340, 82%, 60%);
```

**Result:** Better contrast and readability without sacrificing aesthetics.

---

## ✨ Glassmorphism: The Premium Effect

Glassmorphism is **THE** visual trend of 2026. That frosted glass effect you see in iOS, Windows 11, and now in my portfolio.

### The Recipe

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* In dark mode */
.dark .glass-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Where I Applied It

- **Project cards** - With 3D hover effects
- **Navbar** - With adaptive transparency on scroll
- **Contact form** - For a more modern look
- **Badges and buttons** - Details that make the difference

**Tip:** Don't overuse glassmorphism. Use it strategically to create visual hierarchy.

---

## 🎭 Micro-Interactions: Details Matter

Micro-interactions are what separate a functional site from one that feels **alive**.

### Staggered Letter Animations

In the hero, each letter of the title appears with a slight delay:

```tsx
const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};
```

### 3D Hover Effects

Project cards now have depth:

```css
.project-card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
```

### Buttons with Shine Effect

A shine effect that crosses the button on hover:

```css
.button {
  position: relative;
  overflow: hidden;
}

.button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.button:hover::after {
  transform: translateX(100%);
}
```

---

## 📱 Redesigned Mobile Navigation

The mobile experience was functional, but basic. Now it's **spectacular**.

### Before vs After

**Before:**

- Standard hamburger menu
- Simple list of links
- No animations

**After:**

- Glassmorphism overlay with animated orbs
- Icons for each section
- Smooth entry/exit animations
- Body scroll locking
- Better touch accessibility

### Featured Code

```tsx
// Lock scroll when menu is open
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [mobileMenuOpen]);
```

### Meaningful Icons

Each link now has an icon that reinforces its meaning:

- 🏠 Home → `HomeIcon`
- 👤 About → `UserIcon`
- 📁 Projects → `FolderIcon`
- 📰 Blog → `NewspaperIcon`
- ✉️ Contact → `EnvelopeIcon`

**Result:** More intuitive and visually appealing navigation.

---

## 🎯 Bento Grid Layout

Inspired by modern designs from Apple and Notion, I implemented a Bento Grid layout for the features section:

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {features.map((feature, index) => (
    <motion.div
      key={feature.name}
      className="glass-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Feature content */}
    </motion.div>
  ))}
</div>
```

This layout:

- Adapts perfectly to different screen sizes
- Creates clear visual hierarchy
- Allows highlighting important elements with different sizes

---

## 📊 Content Improvements

Not everything was visual. I also optimized the content:

### Curated Skills

**Before:** 28 technologies listed
**After:** 10 essential skills

Why? Less is more. I prefer to show what I truly master rather than an endless list.

### More Concise Copy

Each section was rewritten to be:

- More direct
- More impactful
- Easier to scan

### Consistent Terminology

Unified terms across the site for better coherence.

---

## 🛠️ Tech Stack

All this was made possible thanks to:

- **React 19** - With the latest features
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Declarative animations
- **Headless UI** - Accessible components
- **Heroicons** - Consistent icons
- **Vite** - Ultra-fast build tool

---

## 📈 Results and Learnings

### Improvement Metrics

- **Load time:** No significant changes (optimized from the start)
- **Visual engagement:** Subjectively much better
- **Mobile experience:** Complete transformation
- **Accessibility:** Improved with better contrast and touch areas

### What I Learned

1. **Glassmorphism requires balance** - Too little and it's not noticeable, too much and it's overwhelming
2. **Dark mode is an art** - It's not just inverting colors
3. **Micro-interactions matter** - They're the details people remember
4. **Mobile-first is critical** - Most traffic comes from mobile
5. **Visual consistency is key** - A coherent design system makes the difference

---

## 🔮 Next Steps

This is just the beginning. For the coming weeks I plan to:

1. **Add page animations** - View Transitions API
2. **Optimize images** - Improved lazy loading
3. **Create more content** - Regular technical posts
4. **Experiment with AI** - Integrate some interesting functionality
5. **Improve SEO** - Continuous optimization

---

## 💭 Final Thoughts

Modernizing my portfolio was more than a technical exercise. It was an opportunity to:

- **Practice what I preach** - Implement the trends I analyze
- **Step out of my comfort zone** - Experiment with visual design
- **Create something to be proud of** - A showcase of my skills
- **Learn by doing** - The best way to master new techniques

If you're thinking about renovating your portfolio, my advice:

> Don't wait for it to be perfect. Start with small changes, iterate constantly, and above all: **have fun in the process**.

---

## 🎊 Happy 2026

May this year bring you:

- 🚀 Exciting projects
- 💡 Continuous learning
- 🤝 Great collaborations
- ⚡ Clean and efficient code
- 🎯 Achieved goals

**See you in the next post!**

What improvements have you made (or plan to make) to your portfolio this year? I'd love to hear about it in the comments.

---

*P.S.: If you liked this post, share it with other developers who are thinking about renovating their portfolio. Thanks for reading!* ✨
