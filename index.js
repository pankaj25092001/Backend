import pool from "./db.js";
 
async function main() {
  try {
    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        grade VARCHAR(10)
      )
    `);
    console.log("✅ Students table ready.");
 
    // Insert dummy data
    await pool.query(
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
    const [rows] = await pool.query("SELECT * FROM students");
    console.log("📚 Student Records:", rows);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    pool.end();
  }
}
 
main();