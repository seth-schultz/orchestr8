---
id: performance-frontend-optimization
category: skill
tags: [performance, frontend, webpack, react, vue, bundle, lazy-loading, optimization]
capabilities:
  - Bundle size optimization
  - Code splitting and lazy loading
  - Rendering performance optimization
  - Web vitals improvement
estimatedTokens: 640
useWhen:
  - Optimizing React application performance with code splitting, lazy loading, and tree shaking reducing bundle size
  - Building progressive web app with service worker caching enabling offline functionality and instant page loads
  - Implementing Core Web Vitals optimization improving LCP, FID, and CLS scores for better user experience
  - Designing image optimization strategy with WebP format, responsive images, and lazy loading for faster rendering
  - Creating performance budget enforcement in CI/CD preventing bundle size regressions and lighthouse score drops
---

# Frontend Performance Optimization

## Bundle Analysis

```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};

# Vite bundle analysis
npm run build -- --mode analyze
npx vite-bundle-visualizer

# Next.js bundle analysis
ANALYZE=true npm run build
```

## Code Splitting

```javascript
// React lazy loading
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Dynamic imports with webpack magic comments
const Chart = lazy(() =>
  import(/* webpackChunkName: "chart" */ './Chart')
);

// Preload on hover
function ProductLink({ id }) {
  const handleHover = () => {
    import('./ProductDetail'); // Preload component
  };

  return <Link to={`/product/${id}`} onMouseEnter={handleHover}>View</Link>;
}
```

## Tree Shaking

```javascript
// ✅ Named imports (tree-shakeable)
import { debounce } from 'lodash-es';

// ❌ Default import (imports entire library)
import _ from 'lodash';

// Package.json sideEffects
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// Webpack optimization
module.exports = {
  optimization: {
    usedExports: true,
    minimize: true,
    sideEffects: true
  }
};
```

## Asset Optimization

```javascript
// Image optimization
// Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // LCP image
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Responsive images
<img
  src="/image-800.jpg"
  srcSet="/image-400.jpg 400w, /image-800.jpg 800w, /image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  loading="lazy"
  alt="Description"
/>

// WebP with fallback
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img src="/image.jpg" alt="Description" loading="lazy" />
</picture>
```

## React Performance

```javascript
// Memoization
import { memo, useMemo, useCallback } from 'react';

// Memo component (prevent re-render)
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* render */}</div>;
});

// useMemo (cache computed value)
function ProductList({ products, filter }) {
  const filtered = useMemo(() => {
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  return <List items={filtered} />;
}

// useCallback (cache function)
function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Child onClick={handleClick} />;
}

// Virtual scrolling (react-window)
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Lazy Hydration

```javascript
// React lazy hydration
import { lazy } from 'react';

const HeavyWidget = lazy(() => import('./HeavyWidget'));

function App() {
  return (
    <div>
      <header>{/* Hydrated immediately */}</header>
      <main>{/* Critical content */}</main>
      <Suspense fallback={null}>
        <HeavyWidget /> {/* Hydrated when visible */}
      </Suspense>
    </div>
  );
}

// Next.js dynamic with ssr: false
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), {
  ssr: false, // Don't render on server
  loading: () => <Skeleton />
});
```

## Critical CSS

```javascript
// Inline critical CSS
// Next.js _document.js
import { extractCritical } from '@emotion/server';

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const page = await ctx.renderPage();
    const { html, css, ids } = extractCritical(page.html);
    return { ...page, html, styles: <style dangerouslySetInnerHTML={{ __html: css }} /> };
  }
}

// Webpack critical CSS plugin
const CriticalCssPlugin = require('critical-css-webpack-plugin');

plugins: [
  new CriticalCssPlugin({
    base: 'dist/',
    src: 'index.html',
    dest: 'index.html',
    inline: true,
    minify: true,
    extract: true,
    width: 1920,
    height: 1080
  })
]
```

## Resource Hints

```html
<!-- Preconnect to third-party origins -->
<link rel="preconnect" href="https://api.example.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="https://analytics.example.com" />

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/critical.css" as="style" />

<!-- Prefetch next page -->
<link rel="prefetch" href="/dashboard.js" />

<!-- Modulepreload for ES modules -->
<link rel="modulepreload" href="/app.js" />
```

## Rendering Optimization

```javascript
// Debounce expensive operations
import { debounce } from 'lodash-es';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((value) => {
      fetchResults(value);
    }, 300),
    []
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return <input value={query} onChange={handleChange} />;
}

// RequestAnimationFrame for smooth animations
function AnimatedComponent() {
  const ref = useRef();

  useEffect(() => {
    let rafId;
    const animate = () => {
      // Update DOM
      ref.current.style.transform = `translateX(${position}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <div ref={ref} />;
}

// Intersection Observer for lazy loading
function LazyImage({ src, alt }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={isVisible ? src : undefined}
      alt={alt}
      loading="lazy"
    />
  );
}
```

## Web Vitals Monitoring

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_label: id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Target values:
// LCP < 2.5s
// FID < 100ms
// CLS < 0.1
```

## Key Principles

✅ **Code split routes** - Load only what's needed
✅ **Optimize images** - Use WebP, lazy load, responsive
✅ **Minimize bundles** - Tree shake, analyze, eliminate duplicates
✅ **Lazy hydrate** - Defer non-critical component hydration
✅ **Measure Web Vitals** - Track LCP, FID, CLS
✅ **Cache aggressively** - Use service workers, HTTP cache

## Related Skills

**Performance Family:**
- orchestr8://skills/performance-optimization - Overview of performance optimization principles and when to use each domain
- orchestr8://skills/performance-api-optimization - API optimization to complement frontend performance
- orchestr8://skills/performance-profiling-techniques - Browser profiling tools and performance diagnostics

**Related Patterns:**
- orchestr8://patterns/performance-caching - Client-side caching strategies including service workers
- orchestr8://patterns/architecture-microservices - Frontend architecture patterns for large applications

**Implementation Examples:**
- orchestr8://examples/typescript-rest-api-complete - Full-stack TypeScript application with frontend optimization
