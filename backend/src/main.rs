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
}

#[derive(OpenApi)]
#[openapi(
    paths(
        hello::hello_world,
        users::create_user,
        users::get_user,
        users::update_user,
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
