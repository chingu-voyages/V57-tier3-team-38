import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import pullRequestRoutes from "./routes/pullrequests";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

// CORS: allow any localhost port (Next dev) — tighten later for prod
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/], credentials: true }));
app.use(express.json());

// API routes
app.use("/api", pullRequestRoutes);

// ---- Optional Postgres (only if DATABASE_URL is set) -----------------------
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.on("error", (err) => {
    console.error("Postgres pool error:", err);
  });
}

// Example health route (handy for debugging)
app.get("/health", (_req, res) => {
  res.json({ ok: true, githubOwner: process.env.GITHUB_OWNER, githubRepo: process.env.GITHUB_REPO });
});

// Example DB route (uncomment when you actually have a table)
// app.get("/users", async (_req, res) => {
//   if (!pool) return res.status(503).json({ error: "DB not configured" });
//   try {
//     const result = await pool.query("SELECT * FROM users");
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "DB query failed" });
//   }
// });

// Start server (single listen)
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown (optional)
process.on("SIGINT", async () => {
  if (pool) await pool.end().catch(() => {});
  process.exit(0);
});
