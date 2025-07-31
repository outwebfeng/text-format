# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Text-Format is a multilingual text cleaning and formatting web application built with Next.js 14. It provides various text manipulation tools including format text, clean text, remove line breaks, strip HTML, convert case, and find/replace operations.

## Development Commands

### Local Development
```bash
npm run dev        # Start development server on port 80
npm install        # Install dependencies
```

### Production
```bash
npm run build      # Build for production
npm start          # Start production server
```

### Environment Setup
Copy `.env.example` to `.env.local` and configure:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=your_adsense_client_id
```

## Architecture

### Core Structure
- **Next.js 14 App Router**: Uses the new app directory structure with internationalization
- **Internationalization**: Supports 6 languages (en, zh, ko, ja, de, ar) via next-intl
- **Routing**: Locale-based routing with `[locale]` dynamic segments
- **Styling**: Tailwind CSS with custom configurations

### Key Directories
- `src/app/[locale]/`: Localized pages and components
- `src/components/`: Shared UI components (Header, Footer, GoogleAd, etc.)
- `src/configs/`: Language configuration and text utilities
- `src/context/`: React context providers
- `messages/`: JSON translation files for each locale

### Page Structure
Each tool has its own directory under `src/app/[locale]/`:
- `deleteformat/`: Text formatting removal
- `fontremover/`: Font removal utilities  
- `formathtmlonline/`: HTML formatting tools
- `removeduplicates/`: Duplicate text removal

### Important Files
- `middleware.ts`: Next-intl middleware for locale handling
- `src/i18n.ts`: Internationalization configuration
- `src/config.ts`: Supported locales and language mappings
- `next.config.mjs`: Next.js configuration with performance optimizations

## Development Patterns

### Component Structure
- Each page has a corresponding `PageComponent.tsx` for the main UI
- Server components handle locale setup and data fetching
- Client components are used for interactive features

### Internationalization
- Use `unstable_setRequestLocale(locale)` in server components
- Language text is fetched via `getIndexLanguageText()` and similar utilities
- Translation keys are stored in `messages/[locale].json`

### Styling Approach
- Tailwind CSS with custom color scheme (primary: #020d24)
- Inline critical CSS for performance
- Custom font loading with fallbacks

### Performance Optimizations
- Image optimization configured for `images.text-format.com`
- Resource preloading and DNS prefetching
- Code splitting and module concatenation
- Compression and SWC minification enabled

## TypeScript Configuration
- Base URL set to `src/` for cleaner imports
- Path mapping: `~/*` maps to `src/*`
- Strict mode disabled for flexibility
- Module resolution set to "Bundler"