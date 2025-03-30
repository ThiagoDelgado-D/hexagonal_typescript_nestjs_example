import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .dev.env file
dotenv.config({ path: '.dev.env' });

async function testDatabaseConnection() {
  console.log('Testing database connection...');

  try {
    // Create connection options
    const options: DataSourceOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: ['**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    };

    // Display connection details (without sensitive information)
    console.log('\nDatabase Connection Details:');
    console.log('---------------------------');
    console.log(`Type: ${options.type}`);
    
    // Parse the URL if it exists to display host and database name
    if (options.url) {
      try {
        const url = new URL(options.url);
        console.log(`Host: ${url.hostname}`);
        console.log(`Port: ${url.port || '5432 (default)'}`);
        console.log(`Database: ${url.pathname.substring(1)}`);
        console.log(`Username: ${url.username}`);
        console.log(`SSL: ${options.ssl ? 'Enabled' : 'Disabled'}`);
      } catch (e) {
        console.log('URL could not be parsed');
      }
    } else {
      console.log('No DATABASE_URL environment variable found');
    }
    
    console.log('\nAttempting to connect to database...');
    
    // Create and initialize DataSource
    const dataSource = new DataSource(options);
    await dataSource.initialize();
    
    console.log('✅ Connection established successfully');
    
    // Test a simple query
    const result = await dataSource.query('SELECT NOW()');
    console.log('✅ Database query successful:', result[0].now);
    
    // Close the connection
    await dataSource.destroy();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    console.log(`\nDatabase connection test ${success ? 'completed successfully' : 'failed'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\nAn unexpected error occurred:', error);
    process.exit(1);
  });

