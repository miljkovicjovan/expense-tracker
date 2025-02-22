import express from "express";
import supabase from "./db.js";

const router = express.Router();

// EXPENSES ROUTES

// Fetch all expenses
router.get("/expenses", async (req, res) => {
  const { data, error } = await supabase.from("expenses").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a new expense
router.post("/expenses", async (req, res) => {
  const { amount, category, description } = req.body;
  if (!amount || !category) {
    return res.status(400).json({ error: "Amount and category are required" });
  }

  const { data, error } = await supabase.from("expenses").insert([{ amount, category, description }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Delete an expense
router.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Expense deleted successfully" });
});

// CATEGORIES ROUTES

// Fetch all categories
router.get("/categories", async (req, res) => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a new category
/*router.post("/categories", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const { data, error } = await supabase.from("categories").insert([{ name }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});*/

export default router;
