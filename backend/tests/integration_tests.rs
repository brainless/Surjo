use actix_web::{test, App};
use surjo_backend::handlers::hello_world;

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