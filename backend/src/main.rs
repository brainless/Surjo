use actix_web::{web, App, HttpServer, middleware::Logger};
use clap::{Parser, Subcommand};
use std::sync::{Arc, Mutex};
use dotenvy::dotenv;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod models;
mod handlers;

use models::{Database, AppState};
use handlers::*;
use handlers::users::list_users;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the web server
    Serve,
    /// Run database migrations
    Migrate,
    /// Create a new user
    CreateUser {
        /// User email address
        #[arg(short, long)]
        email: String,
        /// User password
        #[arg(short, long)]
        password: String,
        /// First name (optional)
        #[arg(long)]
        first_name: Option<String>,
        /// Last name (optional)
        #[arg(long)]
        last_name: Option<String>,
    },
    /// Set user as superadmin
    SetSuperadmin {
        /// User email address
        #[arg(short, long)]
        email: String,
    },
}

#[derive(OpenApi)]
#[openapi(
    paths(
        hello::hello_world,
        users::create_user,
        users::get_user,
        users::update_user,
        users::list_users,
        auth::login,
        auth::google_auth,
    ),
    components(
        schemas(
            hello::HelloWorldResponse,
            hello::LoadData,
            models::UserResponse,
            models::CreateUserRequest,
            models::UpdateUserRequest,
            models::LoginRequest,
            models::LoginResponse,
            models::GoogleAuthRequest,
        )
    ),
    tags(
        (name = "hello", description = "Hello World API"),
        (name = "users", description = "User management API"),
        (name = "auth", description = "Authentication API")
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    dotenv().ok();
    env_logger::init();
    
    let cli = Cli::parse();
    
    match &cli.command {
        Some(Commands::Serve) => {
            println!("Starting web server...");
            start_server().await.unwrap();
        }
        Some(Commands::Migrate) => {
            println!("Running database migrations...");
            run_migrations().await.unwrap();
        }
        Some(Commands::CreateUser { email, password, first_name, last_name }) => {
            println!("Creating user: {}", email);
            create_user_cli(email, password, first_name.as_deref(), last_name.as_deref()).await.unwrap();
        }
        Some(Commands::SetSuperadmin { email }) => {
            println!("Setting {} as superadmin", email);
            set_superadmin_cli(email).await.unwrap();
        }
        None => {
            println!("Hello World");
        }
    }
}

async fn start_server() -> std::io::Result<()> {
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "surjo.db".to_string());
    let jwt_secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "your-secret-key".to_string());
    
    let mut database = Database::new(&database_url).expect("Failed to connect to database");
    database.run_migrations().expect("Failed to run migrations");
    
    let app_state = AppState {
        database: Arc::new(Mutex::new(database)),
        jwt_secret,
    };
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .wrap(Logger::default())
            .service(hello_world)
            .service(create_user)
            .service(get_user)
            .service(update_user)
            .service(list_users)
            .service(login)
            .service(google_auth)
            .service(
                SwaggerUi::new("/swagger-ui/{_:.*}")
                    .url("/api-docs/openapi.json", ApiDoc::openapi()),
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

async fn run_migrations() -> Result<(), Box<dyn std::error::Error>> {
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "surjo.db".to_string());
    let mut database = Database::new(&database_url)?;
    database.run_migrations()?;
    println!("Migrations completed successfully!");
    Ok(())
}

async fn create_user_cli(
    email: &str,
    password: &str,
    first_name: Option<&str>,
    last_name: Option<&str>,
) -> Result<(), Box<dyn std::error::Error>> {
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "surjo.db".to_string());
    let mut database = Database::new(&database_url)?;
    database.run_migrations()?;
    
    // Hash the password
    let password_hash = bcrypt::hash(password, bcrypt::DEFAULT_COST)?;
    
    // Generate user ID
    let user_id = uuid::Uuid::new_v4().to_string();
    
    // Insert user into database
    let conn = database.get_connection();
    conn.execute(
        "INSERT INTO users (id, email, password_hash, first_name, last_name, is_active, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        rusqlite::params![
            user_id,
            email,
            password_hash,
            first_name,
            last_name,
            true,
            chrono::Utc::now().to_rfc3339(),
            chrono::Utc::now().to_rfc3339(),
        ],
    )?;
    
    println!("User created successfully!");
    println!("User ID: {}", user_id);
    println!("Email: {}", email);
    if let Some(name) = first_name {
        println!("First Name: {}", name);
    }
    if let Some(name) = last_name {
        println!("Last Name: {}", name);
    }
    
    Ok(())
}

async fn set_superadmin_cli(email: &str) -> Result<(), Box<dyn std::error::Error>> {
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "surjo.db".to_string());
    let mut database = Database::new(&database_url)?;
    database.run_migrations()?;
    
    let conn = database.get_connection();
    
    // Find the user by email
    let mut stmt = conn.prepare("SELECT id FROM users WHERE email = ?1")?;
    let user_id: String = stmt.query_row([email], |row| {
        Ok(row.get(0)?)
    })?;
    
    // Get admin permission ID
    let mut stmt = conn.prepare("SELECT id FROM permissions WHERE name = 'admin'")?;
    let admin_permission_id: String = stmt.query_row([], |row| {
        Ok(row.get(0)?)
    })?;
    
    // Add admin permission to user (ignore if already exists)
    let permission_id = uuid::Uuid::new_v4().to_string();
    match conn.execute(
        "INSERT INTO user_permissions (id, user_id, permission_id, granted_at) 
         VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![
            permission_id,
            user_id,
            admin_permission_id,
            chrono::Utc::now().to_rfc3339(),
        ],
    ) {
        Ok(_) => {
            println!("Successfully granted admin permissions to {}", email);
        }
        Err(rusqlite::Error::SqliteFailure(err, _)) if err.code == rusqlite::ErrorCode::ConstraintViolation => {
            println!("User {} already has admin permissions", email);
        }
        Err(e) => return Err(e.into()),
    }
    
    Ok(())
}
