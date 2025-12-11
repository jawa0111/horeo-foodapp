// frontend/src/library/services/customer_service.js

const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/customer`;

export const getCustomers = async (type = null) => {
  const url = type ? `${API_URL}?type=${type}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
};

export const getRegisteredCustomers = async () => {
  return getCustomers("registered");
};

export const getUnregisteredCustomers = async () => {
  return getCustomers("unregistered");
};

export const addCustomer = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add customer");
  return res.json();
};

export const addUnregisteredCustomer = async (orderData) => {
  const res = await fetch(`${API_URL}/unregistered`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to add unregistered customer");
  return res.json();
};

export const findOrCreateUnregistered = async (phone, orderData) => {
  const res = await fetch(`${API_URL}/find-or-create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, ...orderData }),
  });
  if (!res.ok) throw new Error("Failed to find or create customer");
  return res.json();
};

export const updateCustomer = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
};

export const registerCustomer = async (id, customerData) => {
  const res = await fetch(`${API_URL}/${id}/register`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) throw new Error("Failed to register customer");
  return res.json();
};

export const incrementCustomerOrders = async (id, orderAmount) => {
  const res = await fetch(`${API_URL}/${id}/increment-orders`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderAmount }),
  });
  if (!res.ok) throw new Error("Failed to increment orders");
  return res.json();
};

export const deleteCustomer = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
  return res.json();
};
