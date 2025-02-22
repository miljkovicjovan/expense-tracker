import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET EXPENSES
app.get("/expenses", async (req, res) => {
  const { data, error } = await supabase.from("expenses").select("*");

  if (error) {
    console.error("Error fetching expenses:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// POST EXPENSE
app.post("/expenses", async (req, res) => {
  const { amount, category, description } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ error: "Amount and category are required" });
  }

  const { data, error } = await supabase.from("expenses").insert([{ amount, category, description }]);

  if (error) {
    console.error("Database Insert Error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Expense added!", data });
});

// DELETE EXPENSE
app.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Expense deleted successfully" });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
