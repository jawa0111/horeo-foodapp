const BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/checkout`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return await response.json();
};

// Create a new order
export const createOrder = async (orderData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  return await handleResponse(res);
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const res = await fetch(`${BASE_URL}/${orderId}`);
  return await handleResponse(res);
};

// Get all orders with optional pagination and filters
export const getOrders = async (page = 1, limit = 10, filters = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  const res = await fetch(`${BASE_URL}?${queryParams}`);
  return await handleResponse(res);
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${BASE_URL}/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  return await handleResponse(res);
};

// Delete order
export const deleteOrder = async (orderId) => {
  const res = await fetch(`${BASE_URL}/${orderId}`, {
    method: "DELETE",
  });
  return await handleResponse(res);
};

// Get orders by customer contact info (email or phone)
export const getCustomerOrders = async (contactInfo) => {
  const res = await fetch(
    `${BASE_URL}/customer/${encodeURIComponent(contactInfo)}`
  );
  return await handleResponse(res);
};

// Health check
export const healthCheck = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/health`
  );
  return await handleResponse(res);
};

// Update order payment status
export const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
      }/orders/${orderId}/payment-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update payment status");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to update payment status:", error);
    throw error;
  }
};
