document.addEventListener("DOMContentLoaded", async () => {
  await fetchCategories();
  await fetchExpenses();
});

// Fetch and display expenses
async function fetchExpenses() {
  try {
    const response = await fetch("/expenses");
    if (!response.ok) throw new Error("Failed to fetch expenses");

    const expenses = await response.json();
    const tableBody = document.querySelector("#expensesTable tbody");
    tableBody.innerHTML = "";

    expenses.forEach(expense => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.description || "-"}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

// Fetch and populate categories
async function fetchCategories() {
  try {
    const response = await fetch("/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");

    const categories = await response.json();
    const categorySelect = document.getElementById("category");

    categorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Submit form
document.getElementById("expenseForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, category, description }),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Error adding expense");

    await fetchExpenses();
    document.getElementById("expenseForm").reset();
  } catch (error) {
    alert("Error adding expense: " + error.message);
  }
});

// Delete an expense
async function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    const response = await fetch(`/expenses/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Error deleting expense");

    await fetchExpenses();
  } catch (error) {
    alert("Error deleting expense: " + error.message);
  }
}
