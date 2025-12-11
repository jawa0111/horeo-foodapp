import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Filter,
  Search,
} from "lucide-react";
import * as customerService from "../../library/services/customer_service";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [unregisteredCustomers, setUnregisteredCustomers] = useState([]);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Combine both customer lists for easier filtering
  const allCustomers = [...customers, ...unregisteredCustomers];

  // Debug logs to help identify the issue
  console.log("Registered customers:", customers.length);
  console.log("Unregistered customers:", unregisteredCustomers.length);
  console.log("All customers:", allCustomers.length);

  // Filter customers based on active tab and search term
  const filteredCustomers = allCustomers.filter((customer) => {
    if (!customer) return false;

    const searchLower = searchTerm.toLowerCase();
    const nameMatch =
      customer.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch =
      customer.email?.toLowerCase().includes(searchLower) || false;
    const phoneMatch = customer.phone?.includes(searchTerm) || false;

    const matchesSearch = nameMatch || emailMatch || phoneMatch;

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "registered")
      return customer.isRegistered && matchesSearch;
    if (activeTab === "unregistered")
      return !customer.isRegistered && matchesSearch;

    return false;
  });

  // Fetch all customers from backend and separate them by registration status
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all customers at once
      const allCustomers = await customerService.getCustomers();

      // Separate customers by registration status
      const registered = allCustomers.filter(
        (customer) => customer.isRegistered === true
      );
      const unregistered = allCustomers.filter(
        (customer) => customer.isRegistered === false
      );

      setCustomers(registered);
      setUnregisteredCustomers(unregistered);
    } catch (err) {
      console.error("Error fetching customers:", err.message);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = (id, isUnregistered = false) => {
    const customerList = isUnregistered ? unregisteredCustomers : customers;
    const customer = customerList.find((c) => c._id === id);
    setCustomerToDelete({ ...customer, isUnregistered });
  };

  const confirmDelete = async () => {
    try {
      await customerService.deleteCustomer(customerToDelete._id);

      if (customerToDelete.isUnregistered) {
        setUnregisteredCustomers(
          unregisteredCustomers.filter((c) => c._id !== customerToDelete._id)
        );
      } else {
        setCustomers(customers.filter((c) => c._id !== customerToDelete._id));
      }
      setCustomerToDelete(null);
    } catch (err) {
      console.error("Error deleting customer:", err.message);
      setError("Failed to delete customer. Please try again.");
    }
  };

  const cancelDelete = () => setCustomerToDelete(null);

  // Add / Edit customer
  const handleEdit = (id, isUnregistered = false) => {
    const customerList = isUnregistered ? unregisteredCustomers : customers;
    const customer = customerList.find((c) => c._id === id);
    setEditingCustomer({ ...customer, isUnregistered });
    setNewCustomer({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setIsModalOpen(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setNewCustomer({ name: "", email: "", phone: "", address: "" });
    setIsModalOpen(true);
  };

  const handleRegisterCustomer = async (unregisteredCustomer) => {
    // Convert unregistered customer to registered by adding email
    setNewCustomer({
      name: unregisteredCustomer.name || "",
      email: "", // User will fill this in
      phone: unregisteredCustomer.phone || "",
      address: unregisteredCustomer.address || "",
    });
    setEditingCustomer({ ...unregisteredCustomer, isUnregistered: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setNewCustomer({ name: "", email: "", phone: "", address: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      if (editingCustomer) {
        // Update existing customer
        const updated = await customerService.updateCustomer(
          editingCustomer._id,
          newCustomer
        );

        if (editingCustomer.isUnregistered) {
          // If unregistered customer is being updated with email, move to registered
          if (newCustomer.email && newCustomer.email !== "") {
            setUnregisteredCustomers(
              unregisteredCustomers.filter((c) => c._id !== editingCustomer._id)
            );
            setCustomers([updated, ...customers]);
          } else {
            // Still unregistered, just update
            setUnregisteredCustomers(
              unregisteredCustomers.map((c) =>
                c._id === updated._id ? updated : c
              )
            );
          }
        } else {
          // Update registered customer
          setCustomers(
            customers.map((c) => (c._id === updated._id ? updated : c))
          );
        }
      } else {
        // Add new customer
        const added = await customerService.addCustomer(newCustomer);

        // Determine if it's registered or unregistered based on email
        if (added.email && added.email !== "") {
          setCustomers([added, ...customers]);
        } else {
          setUnregisteredCustomers([added, ...unregisteredCustomers]);
        }
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving customer:", err.message);
      setError("Failed to save customer. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Customer Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddCustomer}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Users className="h-4 w-4" />
            All Customers
            <span className="inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {customers.length + unregisteredCustomers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("registered")}
            className={`${
              activeTab === "registered"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <UserCheck className="h-4 w-4" />
            Registered
            <span className="inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {customers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("unregistered")}
            className={`${
              activeTab === "unregistered"
                ? "border-yellow-500 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <UserX className="h-4 w-4" />
            Unregistered
            <span className="inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              {unregisteredCustomers.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Orders
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UserX className="h-8 w-8 mb-2" />
                    <p>
                      No customers found{" "}
                      {searchTerm ? `matching "${searchTerm}"` : ""}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.email && (
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.isRegistered === true
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {customer.isRegistered === true ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Registered
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          Unregistered
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.address ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="max-w-xs truncate">
                          {customer.address}
                        </span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.joinDate
                      ? new Date(customer.joinDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm flex items-center gap-2">
                    {(!customer.email || customer.email === "") && (
                      <button
                        onClick={() => handleRegisterCustomer(customer)}
                        className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors hover:shadow-sm text-sm font-medium"
                        title="Register Customer"
                      >
                        <UserPlus className="w-4 h-4" />
                        Register
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleEdit(
                          customer._id,
                          !customer.email || customer.email === ""
                        )
                      }
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:shadow-sm"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {/* <button
                      onClick={() =>
                        handleDelete(
                          customer._id,
                          !customer.email || customer.email === ""
                        )
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Customer
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{customerToDelete.name}</span>?
              {customerToDelete.isUnregistered &&
                " This is an unregistered customer."}
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
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCustomer
                  ? editingCustomer.isUnregistered
                    ? "Register Customer"
                    : "Edit Customer"
                  : "Add New Customer"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {["name", "email", "phone", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    {field === "name" ? "*" : ""}
                  </label>
                  {field === "address" ? (
                    <textarea
                      name={field}
                      rows="3"
                      value={newCustomer[field]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder={
                        field === "email" && editingCustomer?.isUnregistered
                          ? "Add email to register customer"
                          : ""
                      }
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={newCustomer[field]}
                      onChange={handleInputChange}
                      required={field === "name"}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder={
                        field === "email" && editingCustomer?.isUnregistered
                          ? "Add email to register customer"
                          : ""
                      }
                    />
                  )}
                </div>
              ))}
              <div className="mt-6 flex justify-end gap-3">
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
                  {editingCustomer
                    ? editingCustomer.isUnregistered
                      ? "Register Customer"
                      : "Update Customer"
                    : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
