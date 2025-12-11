const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/order`;

export const getAllOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}?${queryParams}`);

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const result = await response.json();
    return {
      ...result,
      data: {
        orders: result.data.orders,
        pagination: {
          total: result.data.total,
          totalPages: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
