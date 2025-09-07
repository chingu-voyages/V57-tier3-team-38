import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { Pool } from "pg";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Postgres connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// // Example route
// app.get("/", (req, res) => {
//   res.send("Backend is running ");
// });

// // Example DB query route
// app.get("/users", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM users");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
