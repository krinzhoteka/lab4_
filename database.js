// database.js
const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Records (
        ID INTEGER PRIMARY KEY,
        name TEXT,
        message TEXT
      );
    `;

        this.db.run(createTableQuery);
    }

    GetByID(id, callback) {
        const query = 'SELECT * FROM Records WHERE ID = ?';
        this.db.get(query, [id], callback);
    }

    GetByName(name, callback) {
        const query = 'SELECT * FROM Records WHERE name = ?';
        this.db.all(query, [name], callback);
    }

    Add(record, callback) {
        const query = 'INSERT INTO Records (ID, name, message) VALUES (?, ?, ?)';
        this.db.run(query, [record.ID, record.name, record.message], callback);
    }

    Update(id, message, callback) {
        const query = 'UPDATE Records SET message = ? WHERE ID = ?';
        this.db.run(query, [message, id], callback);
    }

    Delete(id, callback) {
        const query = 'DELETE FROM Records WHERE ID = ?';
        this.db.run(query, [id], callback);
    }
}

module.exports = Database;
