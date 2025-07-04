use actix_web::{get, HttpResponse, Result};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use sysinfo::System;
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct HelloWorldResponse {
    pub message: String,
    pub server_time: chrono::DateTime<Utc>,
    pub load_data: LoadData,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LoadData {
    pub cpu_usage: f32,
    pub memory_usage: f32,
    pub total_memory: u64,
    pub used_memory: u64,
}

#[utoipa::path(
    get,
    path = "/api/hello",
    responses(
        (status = 200, description = "Hello World response", body = HelloWorldResponse)
    )
)]
#[get("/api/hello")]
pub async fn hello_world() -> Result<HttpResponse> {
    let mut system = System::new_all();
    system.refresh_all();
    
    let load_data = LoadData {
        cpu_usage: system.global_cpu_usage(),
        memory_usage: (system.used_memory() as f32 / system.total_memory() as f32) * 100.0,
        total_memory: system.total_memory(),
        used_memory: system.used_memory(),
    };
    
    let response = HelloWorldResponse {
        message: "Hello World".to_string(),
        server_time: Utc::now(),
        load_data,
    };
    
    Ok(HttpResponse::Ok().json(response))
}