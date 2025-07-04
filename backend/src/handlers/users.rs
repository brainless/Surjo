use actix_web::{get, post, put, web, HttpResponse, Result};
use crate::models::{AppState, CreateUserRequest, UpdateUserRequest, UserResponse, User};
use bcrypt;

#[utoipa::path(
    post,
    path = "/api/users",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "User created successfully", body = UserResponse)
    )
)]
#[post("/api/users")]
pub async fn create_user(
    user_data: web::Json<CreateUserRequest>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Hash the password
    let password_hash = match bcrypt::hash(&user_data.password, bcrypt::DEFAULT_COST) {
        Ok(hash) => hash,
        Err(_) => return Ok(HttpResponse::InternalServerError().json("Failed to hash password")),
    };
    
    // Get database connection
    let database = state.database.lock().unwrap();
    let conn = database.get_connection();
    
    // Create user
    match User::create(
        conn,
        &user_data.email,
        &password_hash,
        user_data.first_name.as_deref(),
        user_data.last_name.as_deref(),
    ) {
        Ok(user) => {
            let response = UserResponse::from(user);
            Ok(HttpResponse::Created().json(response))
        }
        Err(rusqlite::Error::SqliteFailure(err, _)) 
            if err.code == rusqlite::ErrorCode::ConstraintViolation => {
            Ok(HttpResponse::Conflict().json("User with this email already exists"))
        }
        Err(_) => Ok(HttpResponse::InternalServerError().json("Failed to create user")),
    }
}

#[utoipa::path(
    get,
    path = "/api/users/{id}",
    responses(
        (status = 200, description = "User found", body = UserResponse),
        (status = 404, description = "User not found")
    )
)]
#[get("/api/users/{id}")]
pub async fn get_user(
    path: web::Path<String>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    
    // Get database connection
    let database = state.database.lock().unwrap();
    let conn = database.get_connection();
    
    // Find user
    match User::find_by_id(conn, &user_id) {
        Ok(Some(user)) => {
            let response = UserResponse::from(user);
            Ok(HttpResponse::Ok().json(response))
        }
        Ok(None) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(_) => Ok(HttpResponse::InternalServerError().json("Database error")),
    }
}

#[utoipa::path(
    put,
    path = "/api/users/{id}",
    request_body = UpdateUserRequest,
    responses(
        (status = 200, description = "User updated successfully", body = UserResponse),
        (status = 404, description = "User not found")
    )
)]
#[put("/api/users/{id}")]
pub async fn update_user(
    path: web::Path<String>,
    user_data: web::Json<UpdateUserRequest>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    
    // Get database connection
    let database = state.database.lock().unwrap();
    let conn = database.get_connection();
    
    // Update user
    match User::update(
        conn,
        &user_id,
        user_data.first_name.as_deref(),
        user_data.last_name.as_deref(),
    ) {
        Ok(Some(user)) => {
            let response = UserResponse::from(user);
            Ok(HttpResponse::Ok().json(response))
        }
        Ok(None) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(_) => Ok(HttpResponse::InternalServerError().json("Database error")),
    }
}

#[utoipa::path(
    get,
    path = "/api/users",
    responses(
        (status = 200, description = "List of users", body = Vec<UserResponse>)
    )
)]
#[get("/api/users")]
pub async fn list_users(
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // Get database connection
    let database = state.database.lock().unwrap();
    let conn = database.get_connection();
    
    // Find all users
    match User::find_all(conn) {
        Ok(users) => {
            let response: Vec<UserResponse> = users.into_iter().map(UserResponse::from).collect();
            Ok(HttpResponse::Ok().json(response))
        }
        Err(_) => Ok(HttpResponse::InternalServerError().json("Database error")),
    }
}