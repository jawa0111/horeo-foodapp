const BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/report`;

export const fetchSalesReport = async (filter = "daily") => {
  try {
    const response = await fetch(`${BASE_URL}?filter=${filter}`);
    if (!response.ok) throw new Error("Failed to fetch sales report");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return { reportData: [], mostOrdered: [] };
  }
};
