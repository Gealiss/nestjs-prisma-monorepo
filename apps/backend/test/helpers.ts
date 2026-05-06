/**
 * Parses a database connection string into its components.
 */
export function parseDatabaseConnectionString(connectionString: string): {
  protocol: string;
  user: string;
  password: string;
  host: string;
  port: string;
  dbName: string;
  schema: string;
} {
  const url = new URL(connectionString);
  return {
    protocol: url.protocol,
    user: url.username,
    password: url.password,
    host: url.host,
    port: url.port,
    dbName: url.pathname.slice(1),
    schema: url.searchParams.get('schema') || '',
  };
}
