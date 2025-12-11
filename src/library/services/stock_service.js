// frontend/src/library/services/stock_service.js

const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/stock`;

export const getStocks = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addStock = async (stock) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stock),
  });
  return res.json();
};

export const updateStock = async (id, stock) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stock),
  });
  return res.json();
};

export const deleteStock = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return res.json();
};
