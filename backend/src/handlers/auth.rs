use actix_web::{post, web, HttpResponse, Result};
use crate::models::{AppState, LoginRequest, LoginResponse, GoogleAuthRequest};

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
    _credentials: web::Json<LoginRequest>,
    _state: web::Data<AppState>,
) -> Result<HttpResponse> {
    // TODO: Implement password authentication
    Ok(HttpResponse::Unauthorized().json("Invalid credentials"))
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
    // TODO: Implement Google OAuth
    Ok(HttpResponse::Unauthorized().json("Invalid Google code"))
}