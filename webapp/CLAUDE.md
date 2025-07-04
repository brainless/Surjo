# Claude.md - Webapp Development

## Project Structure
- `src/` - Source files
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `lib/` - Utility libraries and API client
  - `types/` - TypeScript type definitions
  - `assets/` - Static assets

## Technology Stack
- **Framework**: SolidJS with TypeScript
- **Build Tool**: Vite
- **Routing**: Solid Router
- **Styling**: TailwindCSS
- **API Types**: Generated from backend OpenAPI schema

## Development

### Prerequisites
- Node.js 18+
- pnpm package manager
- Backend server running on `http://localhost:8080`

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate API types from backend
pnpm generate-types
```

### API Integration
- Types are auto-generated from backend OpenAPI schema
- API client in `src/lib/api.ts` provides typed methods
- Run `pnpm generate-types` after backend API changes
- All API calls return `ApiResponse<T>` with error handling

### Components
- Custom components in `src/components/`
- No external UI library - build components as needed
- Mobile-first responsive design with TailwindCSS
- Follow existing component patterns

### Pages
- Route components in `src/pages/`
- Lazy-loaded for better performance
- Each page should be self-contained

### Development Workflow
1. Create new branch for features
2. Use typed API client for all backend calls
3. Build mobile-first responsive components
4. Test on mobile devices/viewports
5. Regenerate types if backend changes
6. Format code and run type checks
7. Commit with descriptive messages

### Environment Configuration
- Development: `http://localhost:8080` (backend)
- Production: Configure API base URL as needed

## API Type Generation
The webapp uses auto-generated TypeScript types from the backend OpenAPI specification:

```bash
# Generate types from running backend
pnpm generate-types
```

This creates `src/types/api.ts` with all API types and endpoints.

## Mobile-First Design
- All components use mobile-first approach
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Touch-friendly interface elements
- Optimized for mobile performance

## Testing
- Add tests for components and pages
- Test API integration with mock responses
- Test responsive design on different screen sizes

## Commands
```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm preview         # Preview production build
pnpm generate-types  # Generate API types

# Code Quality
pnpm lint            # Run linter (when configured)
pnpm format          # Format code (when configured)
pnpm typecheck       # Run TypeScript checks
```