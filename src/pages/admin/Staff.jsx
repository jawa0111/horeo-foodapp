import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  User,
  Calendar,
  Briefcase,
  MapPin,
  DollarSign,
} from "lucide-react";
import * as staffService from "../../library/services/staff_service";

export default function StaffPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Cashier",
    salary: "",
    joinDate: "",
    address: "",
  });

  const roles = ["Cashier", "Cook", "Waiter"];

  // Fetch staff from backend
  const fetchStaff = async () => {
    try {
      const data = await staffService.getAllStaff();
      setStaffMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = (staff) => setStaffToDelete(staff);
  const cancelDelete = () => setStaffToDelete(null);

  const confirmDelete = async () => {
    try {
      await staffService.deleteStaff(staffToDelete._id);
      setStaffMembers(staffMembers.filter((s) => s._id !== staffToDelete._id));
      setStaffToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setNewStaff(staff);
    setIsModalOpen(true);
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setNewStaff({
      name: "",
      role: "Cashier",
      salary: "",
      joinDate: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const updated = await staffService.updateStaff(
          editingStaff._id,
          newStaff
        );
        setStaffMembers(
          staffMembers.map((s) => (s._id === updated._id ? updated : s))
        );
      } else {
        const created = await staffService.createStaff(newStaff);
        setStaffMembers([created, ...staffMembers]);
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Staff Management
        </h1>
        <button
          onClick={handleAddStaff}
          className="flex items-center gap-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-white font-medium px-4 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Salary
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Join Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffMembers.map((staff) => (
              <tr
                key={staff._id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  #{staff._id?.slice(-4)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-800">
                      {staff.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    {staff.role}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    {staff.salary}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    {staff.joinDate
                      ? new Date(staff.joinDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {staff.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(staff)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Staff Member
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{staffToDelete?.name}</span>?
                This action cannot be undone.
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

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newStaff.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={newStaff.role}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={newStaff.salary}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="joinDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Join Date
                </label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  value={newStaff.joinDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newStaff.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                  {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
