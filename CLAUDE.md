# Claude.md - Development Workflow

## Project Structure
- `backend/` - Rust backend with Actix Web and SQLite
- `frontend/` - (To be added) Frontend web application
- `admin/` - (To be added) Admin panel

## Backend Development

### Prerequisites
- Rust 1.70+
- SQLite3
- Cargo

### Local Development
```bash
# Run database migrations
cd backend
cargo run -- migrate

# Start the development server
cargo run -- serve

# Or just run with default CLI (Hello World)
cargo run
```

### API Endpoints
- `GET /api/hello` - Hello World endpoint with server time and load data
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `POST /api/auth/login` - Login with password
- `POST /api/auth/google` - Google OAuth authentication
- `GET /swagger-ui/` - Swagger API documentation

### Database
- SQLite database (`surjo.db`)
- Migrations using Refinery CLI
- Schema includes users, oauth_providers, sessions, permissions, and user_permissions tables

### Environment Variables
```bash
DATABASE_URL=surjo.db
JWT_SECRET=your-secret-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RUST_LOG=info
```

## Development Workflow

### Feature Development
1. Create a new branch for each task
   - Branch naming: `feature/feature-name`, `fix/bug-name`, `chore/task-name`
2. Make changes and test locally
3. Add end-to-end tests for new features (particularly in backend)
4. Update Bruno API spec when API changes
5. Run linter, formatter, and tests before committing
6. Commit changes with descriptive messages
7. Push to the new branch
8. Create a pull request
9. Reference GitHub issue if provided

### Testing
```bash
# Run tests
cargo test

# Run with coverage
cargo test --coverage

# Format code
cargo fmt

# Run linter
cargo clippy
```

### Commands
```bash
# Run migrations
cargo run -- migrate

# Start server
cargo run -- serve

# CLI help
cargo run -- --help
```

## Authentication
- Password-based authentication with bcrypt
- Google OAuth integration
- JWT tokens for session management
- Role-based access control with permissions

## Documentation
- Swagger UI available at `/swagger-ui/`
- API documentation generated from code using utoipa
- TypeScript types can be generated from Rust structs (when configured)

## Next Steps
- Add comprehensive user CRUD operations
- Implement full authentication flow
- Add TypeScript type generation
- Create frontend applications
- Add comprehensive testing
- Set up CI/CD pipeline