const sql = require('mssql');

const config = {
    user: "your-admin",
    password: "LOVEme143",
    server: "flightdbservernew.database.windows.net",
    database: "flightDB",
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function testDBConnection() {
    try {
        let pool = await sql.connect(config);
        console.log("Connected successfully!");
        let result = await pool.request().query("SELECT location FROM locations_table");
        console.log("Sample Data:", result.recordset);
    } catch (error) {
        console.error("Database Connection Error:", error);
    }
}

testDBConnection();