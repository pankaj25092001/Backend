import express, { json } from "express";
const app = express();
import cors from "cors";
app.use(cors());
import DB from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();


app.use(json());
DB.testConnection();

function validateRequest(req, res, next) {
  if(req.headers.authorization!==process.env.API_KEY){
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }
  next();
}

async function main() {
  try {
    // Create students table
    await DB.pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        grade VARCHAR(10)
      )
    `);
    console.log("✅ Students table ready.");
 
    // Insert dummy data
    await DB.pool.query(
      `INSERT INTO students (name, age, grade) VALUES ?`,
      [
        [
          ["Alice", 20, "A"],
          ["Bob", 22, "B"],
          ["Charlie", 21, "A"],
        ],
      ]
    );
 
    console.log("✅ Dummy data inserted.");
 
    // Fetch students
    const [rows] = await DB.pool.query("SELECT * FROM students");
    console.log("📚 Student Records:", rows);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}
 
main();
 
// API Routes
app.get("/api/students", validateRequest, async (req, res) => {
  try {
    const [rows] = await DB.pool.query("SELECT * FROM students");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error");
  }
});

app.post("/api/students", validateRequest, async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const [result] = await DB.pool.query(
      `INSERT INTO students (name, age, grade) VALUES (?, ?, ?)`,
      [name, age, grade]
    );
    res.status(201).json({ id: result.insertId, name, age, grade });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error");
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, grade } = req.body;
    const [result] = await DB.pool.query(
      `UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?`,
      [name, age, grade, id]
    );
    if (result.affectedRows > 0) {
      res.json({ id, name, age, grade });
    } else {
      res.status(404).send("Student not found");
    }
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error");
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await DB.pool.query(
      `DELETE FROM students WHERE id = ?`,
      [id]
    );
    if (result.affectedRows > 0) {
      res.sendStatus(204);
    } else {
      res.status(404).send("Student not found");
    }
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error");
  }
});

app.listen(3000, () => console.log("🚀 Server is running on port 3000"));