use rusqlite::{Connection, Result};
use refinery::embed_migrations;

embed_migrations!("migrations");

#[derive(Debug)]
pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        Ok(Database { conn })
    }

    pub fn run_migrations(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        migrations::runner().run(&mut self.conn)?;
        Ok(())
    }

    pub fn get_connection(&self) -> &Connection {
        &self.conn
    }
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub database: std::sync::Arc<std::sync::Mutex<Database>>,
    pub jwt_secret: String,
}