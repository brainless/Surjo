use actix_web::{post, web, HttpResponse, Result};
use crate::models::{AppState, LoginRequest, LoginResponse, GoogleAuthRequest, UserResponse};
use bcrypt::verify;
use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Deserialize, Serialize};
use chrono::{Duration, Utc};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String, // user_id
    email: String,
    is_admin: bool,
    exp: usize,
}

#[utoipa::path(
    post,
    path = "/api/auth/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = LoginResponse),
        (status = 401, description = "Invalid credentials")
    )
)]
#[post("/api/auth/login")]
pub async fn login(
    credentials: web::Json<LoginRequest>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let conn = match state.database.lock() {
        Ok(db) => db,
        Err(_) => return Ok(HttpResponse::InternalServerError().json("Database error")),
    };
    
    // Find user by email
    let mut stmt = match conn.get_connection().prepare(
        "SELECT id, email, password_hash, first_name, last_name, is_active, created_at, updated_at 
         FROM users WHERE email = ?1"
    ) {
        Ok(stmt) => stmt,
        Err(_) => return Ok(HttpResponse::InternalServerError().json("Database error")),
    };
    
    let user_result = stmt.query_row([&credentials.email], |row| {
        Ok((
            row.get::<_, String>(0)?,      // id
            row.get::<_, String>(1)?,      // email
            row.get::<_, Option<String>>(2)?, // password_hash
            row.get::<_, Option<String>>(3)?, // first_name
            row.get::<_, Option<String>>(4)?, // last_name
            row.get::<_, bool>(5)?,        // is_active
            row.get::<_, String>(6)?,      // created_at
            row.get::<_, String>(7)?,      // updated_at
        ))
    });
    
    let (user_id, email, password_hash, first_name, last_name, is_active, created_at, updated_at) = match user_result {
        Ok(user) => user,
        Err(_) => return Ok(HttpResponse::Unauthorized().json("Invalid credentials")),
    };
    
    // Check if user is active
    if !is_active {
        return Ok(HttpResponse::Unauthorized().json("Account is disabled"));
    }
    
    // Check password
    let password_hash = match password_hash {
        Some(hash) => hash,
        None => return Ok(HttpResponse::Unauthorized().json("Invalid credentials")),
    };
    
    if !verify(&credentials.password, &password_hash).unwrap_or(false) {
        return Ok(HttpResponse::Unauthorized().json("Invalid credentials"));
    }
    
    // Check if user has admin permissions
    let mut stmt = match conn.get_connection().prepare(
        "SELECT COUNT(*) FROM user_permissions up 
         JOIN permissions p ON up.permission_id = p.id 
         WHERE up.user_id = ?1 AND p.name = 'admin'"
    ) {
        Ok(stmt) => stmt,
        Err(_) => return Ok(HttpResponse::InternalServerError().json("Database error")),
    };
    
    let is_admin: i64 = stmt.query_row([&user_id], |row| row.get(0)).unwrap_or_default();
    
    let is_admin = is_admin > 0;
    
    // Create JWT token
    let exp = (Utc::now() + Duration::days(7)).timestamp() as usize;
    let claims = Claims {
        sub: user_id.clone(),
        email: email.clone(),
        is_admin,
        exp,
    };
    
    let token = match encode(&Header::default(), &claims, &EncodingKey::from_secret(state.jwt_secret.as_ref())) {
        Ok(token) => token,
        Err(_) => return Ok(HttpResponse::InternalServerError().json("Token generation error")),
    };
    
    // Parse timestamps
    let created_at = chrono::DateTime::parse_from_rfc3339(&created_at)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Invalid date format"))?
        .with_timezone(&chrono::Utc);
    let updated_at = chrono::DateTime::parse_from_rfc3339(&updated_at)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Invalid date format"))?
        .with_timezone(&chrono::Utc);
    
    let user_response = UserResponse {
        id: user_id,
        email,
        first_name,
        last_name,
        is_active,
        created_at,
        updated_at,
    };
    
    let response = LoginResponse {
        token,
        user: user_response,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

#[utoipa::path(
    post,
    path = "/api/auth/google",
    request_body = GoogleAuthRequest,
    responses(
        (status = 200, description = "Google authentication successful", body = LoginResponse),
        (status = 401, description = "Invalid Google code")
    )
)]
#[post("/api/auth/google")]
pub async fn google_auth(
    _auth_data: web::Json<GoogleAuthRequest>,
    _state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // TODO: Implement Google OAuth - for now return not implemented
    Ok(HttpResponse::NotImplemented().json("Google OAuth not implemented yet"))
}