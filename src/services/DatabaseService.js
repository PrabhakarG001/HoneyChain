import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('honeychain_sync.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hiveId TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        temperature REAL,
        humidity REAL,
        weight REAL,
        soundLevel REAL,
        synced INTEGER DEFAULT 0
      );
    `);
  }
  return db;
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
};

export const insertBatchedData = async (hiveId, dataBatch) => {
  const database = await initDatabase();
  const statement = await database.prepareAsync(
    'INSERT INTO sensor_data (hiveId, timestamp, temperature, humidity, weight, soundLevel) VALUES ($hiveId, $timestamp, $temp, $hum, $weight, $sound)'
  );

  try {
    for (const record of dataBatch) {
      await statement.executeAsync({
        $hiveId: hiveId,
        $timestamp: record.timestamp,
        $temp: record.temperature,
        $hum: record.humidity,
        $weight: record.weight,
        $sound: record.soundLevel,
      });
    }
  } finally {
    await statement.finalizeAsync();
  }
};

export const getUnsyncedData = async () => {
  const database = await initDatabase();
  return await database.getAllAsync('SELECT * FROM sensor_data WHERE synced = 0');
};

export const markDataAsSynced = async (ids) => {
  if (!ids || ids.length === 0) return;
  const database = await initDatabase();
  const placeholders = ids.map(() => '?').join(',');
  await database.runAsync(`UPDATE sensor_data SET synced = 1 WHERE id IN (${placeholders})`, ids);
};
