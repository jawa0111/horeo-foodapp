import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import * as menuService from "../../library/services/menu_service";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    status: "available",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const data = await menuService.getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Open add modal
  const handleAddItem = () => setIsModalOpen(true);

  // Close add modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImageFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setNewItem({
      name: "",
      category: "",
      description: "",
      price: "",
      status: "available",
      images: [],
    });
  };

  // Delete modal functions
  const handleDelete = (id) => {
    const item = menuItems.find((i) => i._id === id);
    if (item) setItemToDelete(item);
  };

  const cancelDelete = () => setItemToDelete(null);

  const confirmDelete = async () => {
    try {
      await menuService.deleteMenuItem(itemToDelete._id);
      setMenuItems(menuItems.filter((item) => item._id !== itemToDelete._id));
      setItemToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit modal functions
  const handleEdit = (id) => {
    const item = menuItems.find((i) => i._id === id);
    if (item) {
      // Create a deep copy of the item to avoid mutating the original
      const itemToEdit = JSON.parse(JSON.stringify(item));

      // Initialize images array if it doesn't exist
      if (!itemToEdit.images) {
        itemToEdit.images = [];
      }

      // If there's a single image in the item, convert it to an array
      if (itemToEdit.image) {
        if (!Array.isArray(itemToEdit.images)) {
          itemToEdit.images = [itemToEdit.image];
        } else if (itemToEdit.images.length === 0) {
          itemToEdit.images = [itemToEdit.image];
        }
      }

      // Ensure all image URLs are absolute and handle both string and object formats
      if (Array.isArray(itemToEdit.images)) {
        itemToEdit.images = itemToEdit.images
          .map((img) => {
            if (!img) return null;
            
            // Handle both string URLs and image objects with url property
            const imgUrl = typeof img === 'string' ? img : (img.url || '');
            
            if (!imgUrl) return null;
            
            if (
              imgUrl.startsWith("http") ||
              imgUrl.startsWith("blob:") ||
              imgUrl.startsWith("data:")
            ) {
              return typeof img === 'string' ? img : { ...img, url: imgUrl };
            }

            const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            // Remove any leading slashes to prevent double slashes
            const cleanPath = imgUrl.startsWith("/") ? imgUrl.substring(1) : imgUrl;
            const fullUrl = `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${cleanPath}`;
            
            return typeof img === 'string' ? fullUrl : { ...img, url: fullUrl };
          })
          .filter(Boolean); // Remove any null/undefined values
      }

      // Initialize imageFiles array if it doesn't exist
      if (!itemToEdit.imageFiles) {
        itemToEdit.imageFiles = [];
      }

      console.log("Editing item:", itemToEdit); // Debug log
      setEditingItem(itemToEdit);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await menuService.updateMenuItem(
        editingItem._id,
        editingItem
      );
      setMenuItems(
        menuItems.map((item) => (item._id === updated._id ? updated : item))
      );
      setEditingItem(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Add new item
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate number of images (max 4)
    if (imageFiles.length + selectedFiles.length > 4) {
      alert("You can upload a maximum of 4 images");
      return;
    }

    // Create preview URLs for selected files
    const fileReaders = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            file,
            preview: event.target.result,
            timestamp: Date.now(), // Add timestamp to maintain upload order
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((newFilePreviews) => {
      // Combine existing files with new ones and sort by timestamp
      const combinedFiles = [...imageFiles, ...newFilePreviews].sort(
        (a, b) => a.timestamp - b.timestamp
      );

      setImageFiles(combinedFiles);
      setNewItem((prev) => ({
        ...prev,
        images: combinedFiles.map((fp) => fp.preview),
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newItem.name ||
      !newItem.category ||
      !newItem.description ||
      !newItem.price
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();

      // Add all fields to formData with proper values
      formData.append("name", newItem.name);
      formData.append("category", newItem.category);
      formData.append("description", newItem.description);
      formData.append("price", parseFloat(newItem.price));
      formData.append("status", newItem.status || "available");

      // Append all image files in the correct order (oldest first)
      imageFiles
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach((fileData) => {
          formData.append("images", fileData.file);
        });

      // Log form data for debugging
      console.log("Submitting form data:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const addedItem = await menuService.addMenuItem(formData);
      setMenuItems([addedItem, ...menuItems]);
      handleCloseModal();
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Failed to add menu item");
    } finally {
      setIsUploading(false);
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-white font-medium px-4 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Item ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Price ($)
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-0"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  #{item._id.toString().slice(-4).padStart(4, "0")}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      item.status === "unavailable"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {item.status === "unavailable"
                      ? "Unavailable"
                      : "Available"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={
                          item.images[0]?.url?.startsWith("http")
                            ? item.images[0].url
                            : `${
                                import.meta.env.VITE_API_BASE_URL ||
                                "http://localhost:5000/api"
                              }${item.images[0]?.url?.startsWith("/") ? "" : "/"}${
                                item.images[0]?.url || ''
                              }`
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const container = e.target.parentElement;
                          if (!container.querySelector(".image-error")) {
                            const errorMsg = document.createElement("div");
                            errorMsg.className =
                              "w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200";
                            errorMsg.innerHTML =
                              '<span class="text-xs text-gray-500">No image</span>';
                            container.appendChild(errorMsg);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute -bottom-1 -right-1 bg-gray-100 text-gray-600 text-xs font-medium px-1.5 py-0.5 rounded-full border border-white">
                        +{item.images.length - 1}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-4">
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Menu Item
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{itemToDelete.name}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Add New Menu Item
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newItem.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Salad">Salad</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drink">Drink</option>
                    <option value="Appetizer">Appetizer</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the dish..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newItem.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="image-upload"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item Image
                </label>
                <div className="mt-1">
                  <div className="flex items-center gap-2 mb-3">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {imageFiles.length > 0
                        ? "Add More Images"
                        : "Upload Images"}
                    </label>
                    <input
                      id="image-upload"
                      name="images"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    {imageFiles.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {imageFiles.length} of 4 images selected
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {newItem.images?.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          key={idx}
                          src={typeof img === 'string' ? img : (img?.url || '')}
                          alt={`Preview ${idx + 1}`}
                          className="h-20 w-20 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedImages = [...newItem.images];
                            const updatedFiles = [...imageFiles];
                            updatedImages.splice(idx, 1);
                            updatedFiles.splice(idx, 1);
                            setNewItem((prev) => ({
                              ...prev,
                              images: updatedImages,
                            }));
                            setImageFiles(updatedFiles);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {newItem.images?.length < 4 && (
                      <label className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 sticky bottom-0 bg-white border-t border-gray-200 mt-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isUploading
                      ? "bg-yellow-400"
                      : "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center justify-center min-w-[120px] transition-all duration-300`}
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Add Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Menu Item
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const formData = new FormData();
                  formData.append("name", editingItem.name);
                  formData.append("category", editingItem.category);
                  formData.append("description", editingItem.description || "");
                  formData.append("price", editingItem.price);
                  formData.append("status", editingItem.status || "available");

               // Send updated remaining images list to backend
const existingImages = editingItem.images
  .filter((img) => typeof img === "object" && img.publicId);

formData.append("existingImages", JSON.stringify(existingImages));

// Send newly added images
if (editingItem.imageFiles?.length > 0) {
  editingItem.imageFiles.forEach((file) => {
    if (file instanceof File) {
      formData.append("images", file);
    }
  });
}


                  const updatedItem = await menuService.updateMenuItem(
                    editingItem._id,
                    formData
                  );

                  setMenuItems(
                    menuItems.map((item) =>
                      item._id === editingItem._id ? updatedItem : item
                    )
                  );
                  setEditingItem(null);
                } catch (err) {
                  alert(err.message);
                }
              }}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editingItem?.name || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editingItem?.category || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Salad">Salad</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drink">Drink</option>
                    <option value="Appetizer">Appetizer</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editingItem?.description || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the dish..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={editingItem?.price || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editingItem?.status || "available"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-image-upload"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Images (Max 4)
                </label>
                <div className="mt-1">
                  <div className="flex items-center gap-2 mb-3">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {editingItem?.images?.length > 0
                        ? "Add More Images"
                        : "Upload Images"}
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const files = Array.from(e.target.files);
                            const newImages = files.map((file) =>
                              URL.createObjectURL(file)
                            );
                            setEditingItem((prev) => ({
                              ...prev,
                              imageFiles: [
                                ...(prev.imageFiles || []),
                                ...files,
                              ],
                              images: [...(prev.images || []), ...newImages],
                            }));
                          }
                        }}
                      />
                    </label>
                    {editingItem?.images?.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {editingItem.images.length} of 4 images selected
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {editingItem?.images?.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          key={idx}
                          src={typeof img === 'string' ? img : (img?.url || '')}
                          alt={`Preview ${idx + 1}`}
                          className="h-20 w-20 object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            // Get the image URL, handling both string and object formats
                            const imgUrl = typeof img === 'string' ? img : (img?.url || '');
                            
                            // If the image fails to load, try to construct the full URL
                            if (
                              imgUrl && 
                              !imgUrl.startsWith("http") &&
                              !imgUrl.startsWith("blob:") &&
                              !imgUrl.startsWith("data:")
                            ) {
                              const baseUrl =
                                import.meta.env.VITE_API_BASE_URL ||
                                "http://localhost:5000/api";
                              const cleanPath = img.startsWith("/")
                                ? imgUrl.substring(1)
                                : imgUrl;
                              e.target.src = `${baseUrl}${
                                baseUrl.endsWith("/") ? "" : "/"
                              }${cleanPath}`;
                              return; // Let it try again with the new URL
                            }

                            // If we still can't load the image, show the error message
                            e.target.style.display = "none";
                            const container = e.target.parentElement;
                            if (!container.querySelector(".image-error")) {
                              const errorMsg = document.createElement("div");
                              errorMsg.className =
                                "h-20 w-20 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 image-error";
                              errorMsg.innerHTML =
                                '<span class="text-xs text-gray-500">No image</span>';
                              container.appendChild(errorMsg);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Are you sure you want to remove this image?"
                              )
                            ) {
                              try {
                                // Get the image URL, handling both string and object formats
                               // Determine publicId (Cloudinary reference)
const publicId =
  typeof img === "object" && img.publicId
    ? img.publicId
    : null;

if (publicId) {
  try {
    await menuService.deleteMenuItemImage(editingItem._id, publicId);
  } catch (error) {
    console.log("Server delete failed but UI update will continue.");
  }
}


                                // Remove from local state
                              const updatedImages = editingItem.images.filter((_, i) => i !== idx);


                                // Also remove from imageFiles if it exists there
                                let updatedFiles = [
                                  ...(editingItem.imageFiles || []),
                                ];
                                if (idx < updatedFiles.length) {
                                  updatedFiles.splice(idx, 1);
                                }

                                setEditingItem((prev) => ({
                                  ...prev,
                                  images: updatedImages,
                                  imageFiles: updatedFiles,
                                }));
                              } catch (err) {
                                console.error("Error deleting image:", err);
                                alert(
                                  "Failed to delete image: " +
                                    (err.message || "Unknown error")
                                );
                              }
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {editingItem?.images?.length < 4 && (
                      <label className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const files = Array.from(e.target.files);
                              const newImages = files.map((file) => ({
                                url: URL.createObjectURL(file),
                                file,
                                timestamp: Date.now(),
                              }));

                              // Combine existing and new images, sort by timestamp
                              const allImages = [
                                ...(editingItem.imageFiles || []).map(
                                  (file, idx) => ({
                                    url: editingItem.images[idx],
                                    file,
                                    timestamp:
                                      editingItem.timestamps?.[idx] || 0,
                                  })
                                ),
                                ...newImages,
                              ].sort((a, b) => a.timestamp - b.timestamp);

                              setEditingItem((prev) => ({
                                ...prev,
                                imageFiles: allImages.map((img) => img.file),
                                images: allImages.map((img) => img.url),
                                timestamps: allImages.map(
                                  (img) => img.timestamp
                                ),
                              }));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 sticky bottom-0 bg-white border-t border-gray-200 mt-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
