const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/staff`;

export const getAllStaff = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch staff");
  return await res.json();
};

export const createStaff = async (staffData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  });
  if (!res.ok) throw new Error("Failed to create staff");
  return await res.json();
};

export const updateStaff = async (id, staffData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  });
  if (!res.ok) throw new Error("Failed to update staff");
  return await res.json();
};

export const deleteStaff = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete staff");
  return await res.json();
};
