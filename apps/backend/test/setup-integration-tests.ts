/// <reference types="node" />
import { parseDatabaseConnectionString } from './helpers';

const dbConnectionString = process.env.DATABASE_URL;

if (dbConnectionString) {
  const { dbName } = parseDatabaseConnectionString(dbConnectionString);

  // Ensure the database connection string is for a test database (should contain "test" in its name)
  if (!dbName.toLowerCase().includes('test')) {
    throw new Error(
      `[Safety Check] Invalid database: "${dbName}". Ensure it is a test database (should contain "test" in its name).`,
    );
  }

  console.log(`Database name "${dbName}" is valid for testing.`);
}
