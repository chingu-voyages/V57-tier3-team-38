import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import pullRequestRoutes from "./routes/pullrequests";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

// DEV CORS: echo back any Origin (handles preflight too)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API routes
app.use("/api", pullRequestRoutes);

// Optional Postgres
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.on("error", (err) => console.error("Postgres pool error:", err));
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, githubOwner: process.env.GITHUB_OWNER, githubRepo: process.env.GITHUB_REPO });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

process.on("SIGINT", async () => { if (pool) await pool.end().catch(() => {}); process.exit(0); });
