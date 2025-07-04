# Surjo WebApp

A modern web application built with SolidJS, TypeScript, and TailwindCSS.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Features

- **SolidJS** - Fast, reactive UI framework
- **TypeScript** - Full type safety
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast development and build tool
- **Auto-generated API types** - Type-safe API integration
- **Mobile-first design** - Responsive and touch-friendly

## Development

The app connects to the backend API at `http://localhost:8080`. Make sure the backend server is running before starting development.

See `CLAUDE.md` for detailed development instructions.

## API Integration

API types are automatically generated from the backend OpenAPI schema:

```bash
pnpm generate-types
```

This creates `src/types/api.ts` with all API endpoints and data structures.

## Available Scripts

### `pnpm dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `pnpm build`

Builds the app for production to the `dist` folder.
It correctly bundles Solid in production mode and optimizes the build for the best performance.

### `pnpm preview`

Serves the production build locally for testing.

### `pnpm generate-types`

Generates TypeScript types from the backend OpenAPI schema.

## Deployment

Learn more about deploying your application with the [Vite documentation](https://vite.dev/guide/static-deploy.html).