use actix_web::{test, App, web};
use surjo_backend::handlers::{hello_world, users::{create_user, get_user, list_users, update_user}};
use surjo_backend::models::{Database, AppState, CreateUserRequest, UpdateUserRequest};
use std::sync::{Arc, Mutex};

#[actix_rt::test]
async fn test_hello_world_endpoint() {
    let app = test::init_service(
        App::new()
            .service(hello_world)
    ).await;

    let req = test::TestRequest::get().uri("/api/hello").to_request();
    let resp = test::call_service(&app, req).await;

    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["message"], "Hello World");
    assert!(body["server_time"].is_string());
    assert!(body["load_data"].is_object());
}

#[actix_rt::test]
async fn test_hello_world_response_structure() {
    let app = test::init_service(
        App::new()
            .service(hello_world)
    ).await;

    let req = test::TestRequest::get().uri("/api/hello").to_request();
    let resp = test::call_service(&app, req).await;

    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    
    // Check load data structure
    let load_data = &body["load_data"];
    assert!(load_data["cpu_usage"].is_number());
    assert!(load_data["memory_usage"].is_number());
    assert!(load_data["total_memory"].is_number());
    assert!(load_data["used_memory"].is_number());
}

fn create_test_app_state() -> AppState {
    let mut database = Database::new(":memory:").expect("Failed to create in-memory database");
    database.run_migrations().expect("Failed to run migrations");
    
    AppState {
        database: Arc::new(Mutex::new(database)),
        jwt_secret: "test-secret".to_string(),
    }
}

#[actix_rt::test]
async fn test_create_user() {
    let app_state = create_test_app_state();
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state))
            .service(create_user)
    ).await;

    let user_data = CreateUserRequest {
        email: "test@example.com".to_string(),
        password: "password123".to_string(),
        first_name: Some("Test".to_string()),
        last_name: Some("User".to_string()),
    };

    let req = test::TestRequest::post()
        .uri("/api/users")
        .set_json(&user_data)
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["email"], "test@example.com");
    assert_eq!(body["first_name"], "Test");
    assert_eq!(body["last_name"], "User");
    assert_eq!(body["is_active"], true);
    assert!(body["id"].is_string());
    assert!(body["created_at"].is_string());
    assert!(body["updated_at"].is_string());
}

#[actix_rt::test]
async fn test_create_duplicate_user() {
    let app_state = create_test_app_state();
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state))
            .service(create_user)
    ).await;

    let user_data = CreateUserRequest {
        email: "duplicate@example.com".to_string(),
        password: "password123".to_string(),
        first_name: Some("Test".to_string()),
        last_name: Some("User".to_string()),
    };

    // Create first user
    let req = test::TestRequest::post()
        .uri("/api/users")
        .set_json(&user_data)
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    // Try to create duplicate user
    let req2 = test::TestRequest::post()
        .uri("/api/users")
        .set_json(&user_data)
        .to_request();
    
    let resp2 = test::call_service(&app, req2).await;
    assert_eq!(resp2.status(), 409); // Conflict
}

#[actix_rt::test]
async fn test_list_users() {
    let app_state = create_test_app_state();
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state))
            .service(create_user)
            .service(list_users)
    ).await;

    // Create a user first
    let user_data = CreateUserRequest {
        email: "list_test@example.com".to_string(),
        password: "password123".to_string(),
        first_name: Some("List".to_string()),
        last_name: Some("Test".to_string()),
    };

    let create_req = test::TestRequest::post()
        .uri("/api/users")
        .set_json(&user_data)
        .to_request();
    
    test::call_service(&app, create_req).await;

    // List users
    let list_req = test::TestRequest::get()
        .uri("/api/users")
        .to_request();
    
    let resp = test::call_service(&app, list_req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert!(body.is_array());
    let users = body.as_array().unwrap();
    assert_eq!(users.len(), 1);
    assert_eq!(users[0]["email"], "list_test@example.com");
}

#[actix_rt::test]
async fn test_get_user_by_id() {
    let app_state = create_test_app_state();
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state))
            .service(create_user)
            .service(get_user)
    ).await;

    // Create a user first
    let user_data = CreateUserRequest {
        email: "get_test@example.com".to_string(),
        password: "password123".to_string(),
        first_name: Some("Get".to_string()),
        last_name: Some("Test".to_string()),
    };

    let create_req = test::TestRequest::post()
        .uri("/api/users")
        .set_json(&user_data)
        .to_request();
    
    let create_resp = test::call_service(&app, create_req).await;
    let create_body: serde_json::Value = test::read_body_json(create_resp).await;
    let user_id = create_body["id"].as_str().unwrap();

    // Get user by ID
    let get_req = test::TestRequest::get()
        .uri(&format!("/api/users/{}", user_id))
        .to_request();
    
    let resp = test::call_service(&app, get_req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["id"], user_id);
    assert_eq!(body["email"], "get_test@example.com");
}

#[actix_rt::test]
async fn test_get_nonexistent_user() {
    let app_state = create_test_app_state();
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state))
            .service(get_user)
    ).await;

    let req = test::TestRequest::get()
        .uri("/api/users/nonexistent-id")
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), 404);
}

#[actix_rt::test]
async fn test_update_user() {
    let app_state = create_test_app_state();
    
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(app_state))
            .service(create_user)
            .service(update_user)
    ).await;

    // Create a user first
    let user_data = CreateUserRequest {
        email: "update_test@example.com".to_string(),
        password: "password123".to_string(),
        first_name: Some("Original".to_string()),
        last_name: Some("Name".to_string()),
    };

    let create_req = test::TestRequest::post()
        .uri("/api/users")
        .set_json(&user_data)
        .to_request();
    
    let create_resp = test::call_service(&app, create_req).await;
    let create_body: serde_json::Value = test::read_body_json(create_resp).await;
    let user_id = create_body["id"].as_str().unwrap();

    // Update user
    let update_data = UpdateUserRequest {
        first_name: Some("Updated".to_string()),
        last_name: Some("Name".to_string()),
    };

    let update_req = test::TestRequest::put()
        .uri(&format!("/api/users/{}", user_id))
        .set_json(&update_data)
        .to_request();
    
    let resp = test::call_service(&app, update_req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["id"], user_id);
    assert_eq!(body["first_name"], "Updated");
    assert_eq!(body["last_name"], "Name");
    // Updated timestamp should be different
    assert_ne!(body["created_at"], body["updated_at"]);
}