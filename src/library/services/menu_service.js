const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}/menu`;

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, get the text instead
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (!response.ok) {
    // If we have validation errors from the server, include them in the error
    if (data && data.errors) {
      const errorMessages = Object.entries(data.errors)
        .filter(([_, value]) => value) // Filter out undefined/null values
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      throw new Error(errorMessages || data.message || "Validation failed");
    }
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }
  return data;
};

export const getMenuItems = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

export const addMenuItem = async (formData) => {
  // Ensure all required fields are present
  const requiredFields = ["name", "category", "description", "price"];
  const missingFields = requiredFields.filter((field) => !formData.get(field));

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Create a new FormData instance and append all fields
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.get("name"));
  formDataToSend.append("category", formData.get("category"));
  formDataToSend.append("description", formData.get("description") || "");
  formDataToSend.append("price", parseFloat(formData.get("price")) || 0);
  formDataToSend.append("status", formData.get("status") || "available");

  // Handle multiple images
  const imageFiles = formData.getAll("images");
  imageFiles.forEach((file, index) => {
    if (file instanceof File) {
      formDataToSend.append("images", file);
    }
  });

  const response = await fetch(API_URL, {
    method: "POST",
    body: formDataToSend,
    credentials: "include",
  });
  return handleResponse(response);
};

export const updateMenuItem = async (id, formData) => {
  // Create a new FormData instance and append all fields
  const formDataToSend = new FormData();

  // Append all fields that exist in the form data
  if (formData.get("name")) formDataToSend.append("name", formData.get("name"));
  if (formData.get("category"))
    formDataToSend.append("category", formData.get("category"));
  if (formData.get("description"))
    formDataToSend.append("description", formData.get("description"));
  if (formData.get("price"))
    formDataToSend.append("price", parseFloat(formData.get("price")));
  if (formData.get("status"))
    formDataToSend.append("status", formData.get("status"));

  // Handle multiple images
  const imageFiles = formData.getAll("images");
  imageFiles.forEach((file, index) => {
    if (file instanceof File) {
      formDataToSend.append("images", file);
    }
  });

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formDataToSend,
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });
  return handleResponse(response);
};

export const deleteMenuItem = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};

export const deleteMenuItemImage = async (menuItemId, imageUrl) => {
  if (!menuItemId || !imageUrl) {
    throw new Error(
      "Missing required parameters: menuItemId and imageUrl are required"
    );
  }

  try {
    // Extract just the filename from the full URL or path
    let imagePath = imageUrl;

    // If it's a full URL, extract just the filename part
    if (imageUrl.includes("/")) {
      // First remove any query parameters
      const basePath = imageUrl.split("?")[0];
      // Then get just the filename
      imagePath = basePath.substring(basePath.lastIndexOf("/") + 1);
    }

    console.log(`Deleting image with filename: ${imagePath}`);

    // Encode the image path for URL safety (only encode the filename, not the slashes)
    const encodedImagePath = encodeURIComponent(imagePath);
    const url = `${API_URL}/${menuItemId}/images/${encodedImagePath}`;
    console.log("Request URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Get the response as text first to avoid JSON parsing issues
    const responseText = await response.text();

    // If the response is not OK, throw an error with the status text
    if (!response.ok) {
      // Try to parse as JSON, but fall back to text if it fails
      try {
        const errorData = responseText ? JSON.parse(responseText) : {};
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Failed to delete image: ${response.statusText || "Unknown error"}`
        );
      } catch (e) {
        // If we can't parse as JSON, use the raw text
        throw new Error(
          responseText ||
            `Failed to delete image: ${response.statusText || "Unknown error"}`
        );
      }
    }

    // Try to parse the response as JSON, but return the text if it fails
    try {
      return responseText ? JSON.parse(responseText) : { success: true };
    } catch (e) {
      return { success: true, message: responseText };
    }
  } catch (error) {
    console.error("Error in deleteMenuItemImage:", error);

    // Clean up error message
    let errorMessage = error.message;
    if (errorMessage.includes("require is not defined")) {
      errorMessage = "Failed to delete image. Please try again.";
    } else if (errorMessage.includes("Failed to fetch")) {
      errorMessage =
        "Unable to connect to the server. Please check your internet connection.";
    }

    throw new Error(errorMessage);
  }
};
