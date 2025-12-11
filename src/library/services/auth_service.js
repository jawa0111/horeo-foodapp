const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/auth`;

// Register User
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data; // { message, user }
  } catch (error) {
    throw error;
  }
};

// Login User
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token in localStorage
    localStorage.setItem("token", data.token);

    return data; // { message, token, username, email }
  } catch (error) {
    throw error;
  }
};

// Optional: Logout
export const logout = () => {
  localStorage.removeItem("token");
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to send reset email");
  }

  return await res.json();
};

export const resetPassword = async (token, password, confirmPassword) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password, confirmPassword }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to reset password");
  }

  return await res.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch profile");
  }

  return await res.json();
};
