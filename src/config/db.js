const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('./env');
const logger = require('./logger');

const db = new Database(config.dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

function initDatabase() {
  const schemaPath = path.join(__dirname, '../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  logger.info({ dbPath: config.dbPath }, 'Database initialized');
}

function resetDatabaseForTests() {
  if (!config.isTest) {
    throw new Error('resetDatabaseForTests can be used only in test environment');
  }
  db.exec('DROP TABLE IF EXISTS users;');
  initDatabase();
}

if (require.main === module) {
  initDatabase();
}

module.exports = {
  db,
  initDatabase,
  resetDatabaseForTests
};
