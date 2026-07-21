const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

// ==========================================================================
// CONFIGURATION: Enter your PostgreSQL password here
// ==========================================================================
const DB_PASSWORD = process.env.DB_PASSWORD;; 
const DB_NAME = 'detective_agency';

// Global variable for the main database connection pool
let pool;

// ==========================================================================
// 1. AUTOMATIC DATABASE & TABLE CREATION
// ==========================================================================
async function initDatabase() {
    // Connect to the default 'postgres' database first to check if our database exists
    const adminPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: DB_PASSWORD,
        port: 5432,
    });

    try {
        // Query to check if the target database already exists
        const checkDbResult = await adminPool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1", 
            [DB_NAME]
        );

        if (checkDbResult.rows.length === 0) {
            console.log(`Database "${DB_NAME}" not found. Creating...`);
            // Database names cannot be parameterized with $1, so using a safe constant variable
            await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
            console.log(`Database "${DB_NAME}" successfully created!`);
        } else {
            console.log(`Database "${DB_NAME}" already exists.`);
        }
    } catch (err) {
        console.error('Error during database checking/creation:', err.stack);
    } finally {
        // Always close the temporary admin connection pool
        await adminPool.end();
    }

    // Initialize the main connection pool directly linked to our project database
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: DB_NAME,
        password: DB_PASSWORD,
        port: 5432,
    });

    // Create the contact requests table if it doesn't exist yet
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contacts_requests (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(createTableQuery);
        console.log('Database structure verified: "contacts_requests" table is ready.');
    } catch (err) {
        console.error('Error during table creation:', err.stack);
    }
}

// Execute the database initialization
initDatabase();

// ==========================================================================
// 2. MIDDLEWARES FOR INCOMING DATA AND STATIC FILES
// ==========================================================================
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Serve all frontend assets (HTML, CSS, JS, Images) from the project root directory
app.use(express.static(path.join(__dirname)));


// ==========================================================================
// 3. CONTACT FORM SUBMISSION HANDLING (POST REQUEST)
// ==========================================================================
// Redirect root URL to the main HTML page
app.get('/', (req, res) => {
    res.redirect('/main.html');
});

app.post('/api/contact', async (req, res) => {
    const { name, email, phone } = req.body;

    // Validate that the client provided all required form fields
    if (!name || !email || !phone) {
        return res.status(400).json({ success: false, message: 'All form fields are required!' });
    }

    try {
        const queryText = `
            INSERT INTO contacts_requests (full_name, email, phone) 
            VALUES ($1, $2, $3) 
            RETURNING id
        `;
        const values = [name, email, phone];
        
        const result = await pool.query(queryText, values);
        // Corrected rows[0].id reference to accurately display database serial response
        console.log(`Request saved in database under ID: ${result.rows[0].id}`);
        
        res.status(200).json({ success: true, message: 'Request successfully accepted!' });
    } catch (err) {
        console.error('Error writing data to PostgreSQL:', err);
        res.status(500).json({ success: false, message: 'Server-side storage error occurred.' });
    }
});

// ==========================================================================
// 4. START WEB SERVER
// ==========================================================================
app.listen(PORT, () => {
    console.log(`Server is running and accessible at: http://localhost:${PORT}/main.html`);
});
