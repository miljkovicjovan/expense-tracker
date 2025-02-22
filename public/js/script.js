document.addEventListener("DOMContentLoaded", fetchExpenses);

// Fetch and display expenses
async function fetchExpenses() {
  const response = await fetch("/expenses");
  const expenses = await response.json();

  const tableBody = document.querySelector("#expensesTable tbody");
  tableBody.innerHTML = "";

  expenses.forEach(expense => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.description || "-"}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Submit form
document.getElementById("expenseForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const response = await fetch("/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, category, description }),
  });

  const result = await response.json();

  if (!result.error) {
    fetchExpenses();
    document.getElementById("expenseForm").reset();
  } else {
    alert("Error deleting expense: " + result.error);
  }
});

// Delete an expense
async function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  const response = await fetch(`/expenses/${id}`, { method: "DELETE" });
  const result = await response.json();

  if (!result.error) {
    fetchExpenses();
  } else {
    alert("Error deleting expense: " + result.error);
  }
}
