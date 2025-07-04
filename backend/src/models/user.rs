use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use rusqlite::{Connection, Result as SqliteResult};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct User {
    pub id: String,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CreateUserRequest {
    pub email: String,
    pub password: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UpdateUserRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        UserResponse {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}

impl User {
    pub fn create(
        conn: &Connection,
        email: &str,
        password_hash: &str,
        first_name: Option<&str>,
        last_name: Option<&str>,
    ) -> SqliteResult<Self> {
        let user_id = Uuid::new_v4().to_string();
        let now = Utc::now();
        
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
                now.to_rfc3339(),
                now.to_rfc3339(),
            ],
        )?;
        
        Ok(User {
            id: user_id,
            email: email.to_string(),
            first_name: first_name.map(|s| s.to_string()),
            last_name: last_name.map(|s| s.to_string()),
            is_active: true,
            created_at: now,
            updated_at: now,
        })
    }
    
    pub fn find_by_id(conn: &Connection, user_id: &str) -> SqliteResult<Option<Self>> {
        let mut stmt = conn.prepare(
            "SELECT id, email, first_name, last_name, is_active, created_at, updated_at 
             FROM users WHERE id = ?1"
        )?;
        
        let user_result = stmt.query_row([user_id], |row| {
            Ok(User {
                id: row.get(0)?,
                email: row.get(1)?,
                first_name: row.get(2)?,
                last_name: row.get(3)?,
                is_active: row.get(4)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?)
                    .map_err(|_| rusqlite::Error::InvalidColumnType(5, "created_at".to_string(), rusqlite::types::Type::Text))?
                    .with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?)
                    .map_err(|_| rusqlite::Error::InvalidColumnType(6, "updated_at".to_string(), rusqlite::types::Type::Text))?
                    .with_timezone(&Utc),
            })
        });
        
        match user_result {
            Ok(user) => Ok(Some(user)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(e),
        }
    }
    
    pub fn find_all(conn: &Connection) -> SqliteResult<Vec<Self>> {
        let mut stmt = conn.prepare(
            "SELECT id, email, first_name, last_name, is_active, created_at, updated_at 
             FROM users ORDER BY created_at DESC"
        )?;
        
        let user_iter = stmt.query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                email: row.get(1)?,
                first_name: row.get(2)?,
                last_name: row.get(3)?,
                is_active: row.get(4)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?)
                    .map_err(|_| rusqlite::Error::InvalidColumnType(5, "created_at".to_string(), rusqlite::types::Type::Text))?
                    .with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?)
                    .map_err(|_| rusqlite::Error::InvalidColumnType(6, "updated_at".to_string(), rusqlite::types::Type::Text))?
                    .with_timezone(&Utc),
            })
        })?;
        
        let mut users = Vec::new();
        for user in user_iter {
            users.push(user?);
        }
        Ok(users)
    }
    
    pub fn update(
        conn: &Connection,
        user_id: &str,
        first_name: Option<&str>,
        last_name: Option<&str>,
    ) -> SqliteResult<Option<Self>> {
        let now = Utc::now();
        
        let rows_affected = conn.execute(
            "UPDATE users SET first_name = ?1, last_name = ?2, updated_at = ?3 WHERE id = ?4",
            rusqlite::params![first_name, last_name, now.to_rfc3339(), user_id],
        )?;
        
        if rows_affected == 0 {
            return Ok(None);
        }
        
        Self::find_by_id(conn, user_id)
    }
}