const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = async function (context, req) {
    try {
        context.log("🔍 Connecting to SQL Server...");
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT location FROM locations_table");

        if (!result.recordset.length) {
            throw new Error("🚨 No locations found in database.");
        }

        context.res = {
            status: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: { locations: result.recordset.map(row => row.location) }
        };
    } catch (error) {
        context.log("❌ Database Error:", error);
        context.res = { status: 500, body: { error: "Database connection failed.", details: error.message } };
    }
};