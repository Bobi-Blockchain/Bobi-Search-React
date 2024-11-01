const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const connectionString = process.env.REACT_APP_CONN_STRING;
if (!connectionString) {
    console.error("Connection string is not defined in the environment variables.");
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
});

app.use(cors());
app.use(express.json());

pool.query(`
    CREATE TABLE IF NOT EXISTS count (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
    );
`).catch(error => {
    console.error("Error creating table:", error);
    process.exit(1);
});

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

// New endpoint to handle Brave API request
app.get("/api/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${query}`,
            {
                method: "GET",
                headers: {
                    "X-Subscription-Token": process.env.REACT_APP_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data from Brave API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});