import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../library/services/auth_service";
import Navbar from "../../components/customer/navbar";
import { User, Mail, Calendar, ShoppingBag, DollarSign, Phone, MapPin } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfileData(response.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8A00] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center space-x-6">
              <div className="bg-[#FF8A00] text-white rounded-full h-24 w-24 flex items-center justify-center text-3xl font-bold">
                {profileData?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData?.name}</h1>
                <p className="text-gray-600">@{profileData?.username}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <User className="text-[#FF8A00]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{profileData?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="text-[#FF8A00]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profileData?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="text-[#FF8A00]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-900">{profileData?.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="text-[#FF8A00]" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(profileData?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Statistics */}
          {profileData?.customer && (
            <>
              <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-[#FF8A00] to-[#ff9f33] rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Total Orders</p>
                        <p className="text-4xl font-bold mt-2">{profileData.customer.orders || 0}</p>
                      </div>
                      <ShoppingBag size={48} className="opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#06236B] to-[#0a2f8a] rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Total Spent</p>
                        <p className="text-4xl font-bold mt-2">
                          ${(profileData.customer.totalSpent || 0).toFixed(2)}
                        </p>
                      </div>
                      <DollarSign size={48} className="opacity-80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Address Information */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {profileData.customer.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="text-[#FF8A00]" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{profileData.customer.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {profileData.customer.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-[#FF8A00] mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{profileData.customer.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {profileData.customer.lastOrderDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-[#FF8A00]" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Last Order</p>
                        <p className="font-medium text-gray-900">
                          {new Date(profileData.customer.lastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}