import React, { useState, useEffect, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  DollarSign,
  CreditCard,
  User,
  Search,
  Printer,
} from "lucide-react";
import * as billingService from "../../library/services/billing_service";
import { getMenuItems } from "../../library/services/menu_service";

export default function BillingPage() {
  const [billings, setBillings] = useState([]);
  const [billingToDelete, setBillingToDelete] = useState(null);
  const [editingBilling, setEditingBilling] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newBilling, setNewBilling] = useState({
    order_Id: `ORD-${Date.now()}`,
    item_Id: "",
    item_name: "",
    quantity: "",
    customer_id: "",
    order_date: new Date().toISOString().split("T")[0],
    total_amount: "",
    discount_amount: "0",
    payment_method: "",
    staff_id: "",
  });

  // Fetch data from backend
  const fetchBillings = async () => {
    try {
      const data = await billingService.getBillings();
      setBillings(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchBillings();
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getMenuItems();
      // Map menu items to match the expected format
      const formattedItems = data.map((item) => ({
        item_id: item._id, // or item.id depending on your API response
        item_name: item.name,
        price: item.price,
        // Add any other necessary fields from the menu item
      }));
      setItems(formattedItems);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_id?.toString().includes(searchTerm)
    );
  }, [items, searchTerm]);

  const handleItemSelect = (item) => {
    setNewBilling((prev) => ({
      ...prev,
      item_Id: item.item_id,
      item_name: item.item_name,
      total_amount: (item.price * (newBilling.quantity || 1)).toFixed(2),
    }));
    setSearchTerm(item.item_name);
    setIsDropdownOpen(false);
  };

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e.target.value) || 0;
    const selectedItem = items.find(
      (item) => item.item_id === newBilling.item_Id
    );
    const total = selectedItem
      ? (selectedItem.price * quantity).toFixed(2)
      : "";

    setNewBilling((prev) => ({
      ...prev,
      quantity: e.target.value,
      total_amount: total,
    }));
  };

  const handleDelete = (order_Id) => {
    const bill = billings.find((b) => b.order_Id === order_Id);
    setBillingToDelete(bill);
  };

  const confirmDelete = async () => {
    try {
      await billingService.deleteBilling(billingToDelete.order_Id);
      setBillings(
        billings.filter((b) => b.order_Id !== billingToDelete.order_Id)
      );
      setBillingToDelete(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const cancelDelete = () => setBillingToDelete(null);

  const handleEdit = (order_Id) => {
    const bill = billings.find((b) => b.order_Id === order_Id);
    setEditingBilling({ ...bill });
    setNewBilling({ ...bill });
    setIsModalOpen(true);
  };

  const handleAddBilling = () => {
    setEditingBilling(null);
    setSearchTerm("");
    setIsDropdownOpen(false);
    setNewBilling({
      order_Id: `ORD-${Date.now()}`,
      item_Id: "",
      item_name: "",
      quantity: "1",
      customer_id: "",
      order_date: new Date().toISOString().split("T")[0],
      total_amount: "",
      discount_amount: "0",
      payment_method: "",
      staff_id: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBilling(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBilling((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBilling) {
        const updated = await billingService.updateBilling(
          editingBilling.order_Id,
          newBilling
        );
        setBillings(
          billings.map((b) => (b.order_Id === updated.order_Id ? updated : b))
        );
      } else {
        const created = await billingService.addBilling(newBilling);
        setBillings([created, ...billings]);
      }
      handleCloseModal();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handlePrint = (bill) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Format the order date
    const orderDate = new Date(bill.order_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Get current date and time for printing
    const now = new Date();
    const printDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const printTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create the print content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Invoice - ${bill.order_Id}</title>
        <style>
          @media print {
            @page { margin: 0; }
            body { 
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .invoice-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #06236B;
            }
            .invoice-subtitle {
              color: #666;
              margin-bottom: 15px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .invoice-section {
              margin-bottom: 30px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #06236B;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px dashed #eee;
            }
            .total-row {
              display: flex;
              justify-content: flex-end;
              margin-top: 15px;
              font-weight: bold;
              font-size: 1.1em;
            }
            .thank-you {
              text-align: center;
              margin-top: 40px;
              font-style: italic;
              color: #666;
            }
            .print-only {
              display: block;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="invoice-title">The Europe Plate</div>
          <div class="invoice-subtitle">Restaurant & Cafe</div>
          <div>123 Gourmet Street, Foodie City</div>
          <div>Phone: (123) 456-7890 | Email: info@theeuropeplate.com</div>
        </div>
        
        <div class="invoice-details">
          <div>
            <div><strong>Order ID:</strong> ${bill.order_Id}</div>
            <div><strong>Order Date:</strong> ${orderDate}</div>
            <div><strong>Printed:</strong> ${printDate} at ${printTime}</div>
          </div>
          <div>
            <div><strong>Customer ID:</strong> ${
              bill.customer_id || "Walk-in"
            }</div>
            <div><strong>Payment Method:</strong> ${
              bill.payment_method || "N/A"
            }</div>
          </div>
        </div>
        
        <div class="invoice-section">
          <div class="section-title">Order Details</div>

          <table class="item-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${bill.item_name}</td>
                <td>${bill.quantity}</td>
                <td>$${(bill.total_amount / bill.quantity).toFixed(2)}</td>
                <td>$${parseFloat(bill.total_amount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-row">
            <table class="total-table">
              <tbody>
                <tr>
                  <td>Subtotal:</td>
                  <td>$${parseFloat(bill.total_amount).toFixed(2)}</td>
                </tr>
                ${
                  bill.discount_amount > 0
                    ? `<tr>
                        <td>Discount:</td>
                        <td>-$${parseFloat(bill.discount_amount).toFixed(
                          2
                        )}</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="border-top: 1px solid #333; padding-top: 5px;"><strong>Total:</strong></td>
                  <td style="border-top: 1px solid #333; padding-top: 5px;"><strong>$${(
                    parseFloat(bill.total_amount) -
                    (parseFloat(bill.discount_amount) || 0)
                  ).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <script>
          // Automatically trigger print when the window loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <button
          onClick={handleAddBilling}
          className="flex items-center gap-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-white font-medium px-4 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c]">
            <tr>
              <th className="px-3 py-3 text-left font-medium text-white whitespace-nowrap">
                Order ID
              </th>
              <th className="px-3 py-3 text-left font-medium text-white whitespace-nowrap">
                Item
              </th>
              <th className="px-3 py-3 text-left font-medium text-white whitespace-nowrap">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Discount
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Staff
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {billings.map((bill) => (
              <tr
                key={bill.order_Id}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {bill.order_Id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {bill.item_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {bill.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" /> {bill.customer_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(bill.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> {bill.total_amount}
                </td>
                <td className="px-6 py-4 text-sm text-red-500">
                  {bill.discount_amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-500" />{" "}
                  {bill.payment_method}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {bill.staff_id}
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => handleEdit(bill.order_Id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bill.order_Id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePrint(bill)}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors hover:shadow-sm"
                    title="Print Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {/* Delete Modal */}
      {billingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Billing Record
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete billing record{" "}
                <span className="font-semibold">
                  {billingToDelete.order_Id}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
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
                {editingBilling ? "Edit Billing" : "Add New Billing"}
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
                  Order ID
                </label>
                <input
                  name="order_Id"
                  value={newBilling.order_Id}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  readOnly
                />
              </div>
              <div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Search Item
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (e.target.value) {
                          setIsDropdownOpen(true);
                        }
                      }}
                      onFocus={() => searchTerm && setIsDropdownOpen(true)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10"
                      placeholder="Search items..."
                    />
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              key={item.item_id}
                              onClick={() => handleItemSelect(item)}
                              className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm text-gray-700"
                            >
                              <div className="font-medium">
                                {item.item_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Price: ${item.price}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No items found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  name="item_name"
                  value={newBilling.item_name}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={newBilling.quantity}
                  onChange={handleQuantityChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer ID
                </label>
                <input
                  name="customer_id"
                  value={newBilling.customer_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order Date
                </label>
                <input
                  type="date"
                  name="order_date"
                  value={newBilling.order_date}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={newBilling.total_amount}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount_amount"
                  min="0"
                  value={newBilling.discount_amount}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  name="payment_method"
                  value={newBilling.payment_method}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Staff ID
                </label>
                <input
                  name="staff_id"
                  value={newBilling.staff_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
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
                  {editingBilling ? "Update Bill" : "Add Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
