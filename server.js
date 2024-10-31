const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
    connectionString: process.env.REACT_APP_CONN_STRING,
});

app.use(express.json());

pool.query(`
    CREATE TABLE IF NOT EXISTS count (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
    );
`);

app.get("/api/count", async (req, res) => {
    try {
        const result = await pool.query("SELECT value FROM count WHERE id = 1");
        if (result.rows.length === 0) {
            await pool.query("INSERT INTO count (value) VALUES (0)");
            res.json({ value: 0 });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error("Error fetching count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/increment", async (req, res) => {
    try {
        await pool.query("UPDATE count SET value = value + 1 WHERE id = 1");
        const result = await pool.query("SELECT value FROM count WHERE id = 1");
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error incrementing count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
