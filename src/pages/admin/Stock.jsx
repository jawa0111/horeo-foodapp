import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, X, AlertTriangle } from "lucide-react";
import * as stockService from "../../library/services/stock_service";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    name: "",
    category: "",
    supplier: "",
    quantity: "",
    price: "",
    status: "in-stock",
  });

  // Fetch stocks from backend on mount
  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const data = await stockService.getStocks();
    setStocks(data);
  };

  // Add or Edit Stock
  const handleAddStock = () => {
    setEditingStock(null);
    setNewStock({
      name: "",
      category: "",
      supplier: "",
      quantity: "",
      price: "",
      status: "in-stock",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setNewStock({ ...stock });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price"
          ? parseFloat(value) || ""
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStock) {
      await stockService.updateStock(editingStock._id, newStock);
    } else {
      await stockService.addStock(newStock);
    }
    fetchStocks();
    handleCloseModal();
  };

  // Delete Stock
  const handleDelete = (stock) => {
    setStockToDelete(stock);
  };

  const confirmDelete = async () => {
    await stockService.deleteStock(stockToDelete._id);
    fetchStocks();
    setStockToDelete(null);
  };

  const cancelDelete = () => setStockToDelete(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Stocks</h1>
        <button
          onClick={handleAddStock}
          className="flex items-center gap-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-white font-medium px-4 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Stock
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Item ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Supplier
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Last Updated
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr
                key={stock._id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  #{stock._id.slice(-4)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {stock.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {stock.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {stock.supplier}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {stock.quantity}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      stock.quantity === 0
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : stock.quantity < 20
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {stock.quantity === 0
                      ? "Out of Stock"
                      : stock.quantity < 20
                      ? "Low Stock"
                      : "In Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(stock.lastUpdated).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-4">
                  <button
                    onClick={() => handleEdit(stock)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(stock)}
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

      {/* Delete Modal */}
      {stockToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Stock
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{stockToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingStock ? "Edit Stock" : "Add New Stock"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  name="name"
                  value={newStock.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  name="category"
                  value={newStock.category}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <input
                  name="supplier"
                  value={newStock.supplier}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={newStock.quantity}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={newStock.price}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300"
                >
                  {editingStock ? "Update" : "Add"} Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
