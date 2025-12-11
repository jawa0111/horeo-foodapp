// frontend/src/library/services/billing_service.js

const BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/billing`;

export const getBillings = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch billings");
  return await res.json();
};

export const addBilling = async (billing) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(billing),
  });
  if (!res.ok) throw new Error("Failed to add billing");
  return await res.json();
};

export const updateBilling = async (order_Id, billing) => {
  const res = await fetch(`${BASE_URL}/${order_Id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(billing),
  });
  if (!res.ok) throw new Error("Failed to update billing");
  return await res.json();
};

export const deleteBilling = async (order_Id) => {
  const res = await fetch(`${BASE_URL}/${order_Id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete billing");
  return await res.json();
};
