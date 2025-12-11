import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../../library/services/checkout_service";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartTotal, setCartTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Get cart total from location state or fallback to 0
    if (location.state?.cartTotal) {
      setCartTotal(location.state.cartTotal);
    }
  }, [location.state]);

  const serviceCharge = cartTotal * 0.1; // 10% service charge
  const total = cartTotal + serviceCharge; // Total includes service charge

  const [formData, setFormData] = useState({
    deliveryTime: "now",
    sender: {
      title: "",
      firstName: "",
      lastName: "",
      code: "+94",
      mobile: "",
      email: user?.email || "",
    },
    sameAsSender: true,
    recipient: {
      title: "",
      firstName: "",
      lastName: "",
      code: "+94",
      mobile: "",
    },
    address: {
      location: "Colombo", // Default location, you can make this dynamic
      details: "",
      instructions: "",
    },
    paymentMethod: "online",
    termsAgreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSameAsSenderChange = (e) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sameAsSender: isChecked,
      recipient: isChecked
        ? {
            ...prev.sender,
            mobile: "", // Reset mobile as it has a different format
          }
        : {
            title: "",
            firstName: "",
            lastName: "",
            code: "+94",
            mobile: "",
          },
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.sender.title) return "Title is required";
    if (!formData.sender.firstName) return "First name is required";
    if (!formData.sender.lastName) return "Last name is required";
    if (!formData.sender.email) return "Email is required";
    if (!formData.sender.mobile) return "Phone number is required";

    if (!formData.sameAsSender) {
      if (!formData.recipient.firstName)
        return "Recipient first name is required";
      if (!formData.recipient.lastName)
        return "Recipient last name is required";
      if (!formData.recipient.mobile)
        return "Recipient phone number is required";
    }

    if (!formData.address.details) return "Address details are required";
    if (!formData.termsAgreed)
      return "Please agree to the terms and conditions";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If user is not logged in, show login modal
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Prepare order data for API
      const orderData = {
        deliveryTime: formData.deliveryTime,
        sender: {
          title: formData.sender.title,
          firstName: formData.sender.firstName,
          lastName: formData.sender.lastName,
          code: formData.sender.code,
          mobile: formData.sender.mobile,
          email: formData.sender.email,
        },
        recipient: formData.sameAsSender
          ? {
              title: formData.sender.title,
              firstName: formData.sender.firstName,
              lastName: formData.sender.lastName,
              code: formData.sender.code,
              mobile: formData.sender.mobile,
            }
          : {
              title: formData.recipient.title || formData.sender.title,
              firstName: formData.recipient.firstName,
              lastName: formData.recipient.lastName,
              code: formData.recipient.code,
              mobile: formData.recipient.mobile,
            },
        sameAsSender: formData.sameAsSender,
        address: {
          location: formData.address.location,
          details: formData.address.details,
          instructions: formData.address.instructions,
        },
        paymentMethod: formData.paymentMethod,
        cartTotal: cartTotal,
        termsAgreed: formData.termsAgreed,
      };

      console.log("Submitting order:", orderData);

      // Call the order service
      const response = await createOrder(orderData);

      if (response.success) {
        console.log("Order created successfully:", response.data);

        const createdOrder = response.data;

        // Redirect based on payment method
        if (formData.paymentMethod === "online") {
          // Redirect to Stripe payment page
          navigate("/payment", {
            state: {
              order: createdOrder,
              total: total,
            },
          });
        } else {
          // For Cash on Delivery, go directly to confirmation
          navigate("/order-confirmation", {
            state: {
              order: createdOrder,
              orderId: createdOrder.orderId,
            },
          });
        }
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle guest checkout
  const handleGuestCheckout = () => {
    setShowLoginModal(false);
    // Continue with guest checkout
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    // Proceed with order submission
    submitOrder();
  };

  // Function to handle order submission
  const submitOrder = async () => {
    try {
      const orderData = {
        deliveryTime: formData.deliveryTime,
        sender: {
          title: formData.sender.title,
          firstName: formData.sender.firstName,
          lastName: formData.sender.lastName,
          code: formData.sender.code,
          mobile: formData.sender.mobile,
          email: formData.sender.email,
        },
        recipient: formData.sameAsSender
          ? {
              title: formData.sender.title,
              firstName: formData.sender.firstName,
              lastName: formData.sender.lastName,
              code: formData.sender.code,
              mobile: formData.sender.mobile,
            }
          : {
              title: formData.recipient.title || formData.sender.title,
              firstName: formData.recipient.firstName,
              lastName: formData.recipient.lastName,
              code: formData.recipient.code,
              mobile: formData.recipient.mobile,
            },
        sameAsSender: formData.sameAsSender,
        address: {
          location: formData.address.location,
          details: formData.address.details,
          instructions: formData.address.instructions,
        },
        paymentMethod: formData.paymentMethod,
        cartTotal: cartTotal,
        termsAgreed: formData.termsAgreed,
      };

      const response = await createOrder(orderData);

      if (response.success) {
        const createdOrder = response.data;

        if (formData.paymentMethod === "online") {
          navigate("/payment", {
            state: {
              order: createdOrder,
              total: total,
            },
          });
        } else {
          navigate("/order-confirmation", {
            state: {
              order: createdOrder,
              orderId: createdOrder.orderId,
            },
          });
        }
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sign In or Continue as Guest
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Sign in to track your orders and enjoy a faster checkout
              experience.
            </p>
            <div className="space-y-3">
              <button
                onClick={() =>
                  navigate("/login", { state: { from: location.pathname } })
                }
                className="w-full bg-[#06236B] text-white py-2 px-4 rounded-md hover:bg-[#0a3a9c] transition-colors"
              >
                Sign In / Register
              </button>
              <button
                onClick={handleGuestCheckout}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue as Guest
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600">
            Fill in the details below to complete your purchase
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Delivery Time Section */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  1
                </span>
                Delivery Time
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-4">
                  {["now", "later"].map((option) => (
                    <label key={option} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryTime"
                        value={option}
                        checked={formData.deliveryTime === option}
                        onChange={handleChange}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className={`p-4 border-2 rounded-lg transition-all ${
                          formData.deliveryTime === option
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${
                              formData.deliveryTime === option
                                ? "border-green-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.deliveryTime === option && (
                              <div className="w-3 h-3 rounded-full bg-green-600"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800">
                            {option === "now"
                              ? "Deliver Now"
                              : "Schedule for Later"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 ml-8">
                          {option === "now"
                            ? "Get your order as soon as possible"
                            : "Choose a preferred delivery time"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sender Details Section */}
            <div className="p-6 md:p-8 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  2
                </span>
                Your Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sender.title"
                    value={formData.sender.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Title</option>
                    {["Mr.", "Mrs.", "Miss", "Dr.", "Prof."].map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sender.firstName"
                    value={formData.sender.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sender.lastName"
                    value={formData.sender.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="sender.email"
                    value={formData.sender.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                      +94
                    </span>
                    <input
                      type="tel"
                      name="sender.mobile"
                      value={formData.sender.mobile}
                      onChange={handleChange}
                      placeholder="77 123 4567"
                      className="flex-1 min-w-0 block w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details Section */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    3
                  </span>
                  Recipient Details
                </h2>
                <div className="flex items-center mt-3 sm:mt-0">
                  <input
                    id="sameAsSender"
                    name="sameAsSender"
                    type="checkbox"
                    checked={formData.sameAsSender}
                    onChange={handleSameAsSenderChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#FF8A00] focus:ring-[#FF8A00]"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="sameAsSender"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Same as my information
                  </label>
                </div>
              </div>

              {!formData.sameAsSender && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="recipient.title"
                      value={formData.recipient.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Title</option>
                      {["Mr.", "Mrs.", "Miss", "Dr.", "Prof."].map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="recipient.firstName"
                      value={formData.recipient.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="recipient.lastName"
                      value={formData.recipient.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                        +94
                      </span>
                      <input
                        type="tel"
                        name="recipient.mobile"
                        value={formData.recipient.mobile}
                        onChange={handleChange}
                        placeholder="77 123 4567"
                        className="flex-1 min-w-0 block w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Delivery Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address.details"
                      rows="3"
                      value={formData.address.details}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                      placeholder="House/Apartment number, street name, etc."
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="address.instructions"
                      rows="2"
                      value={formData.address.instructions}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] transition"
                      placeholder="Any special instructions for delivery?"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="p-6 md:p-8 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                  4
                </span>
                Payment Method
              </h2>

              <div className="space-y-4">
                {[
                  {
                    id: "online",
                    label: "Credit/Debit Card",
                    description: "Pay securely with your credit or debit card",
                    icon: "💳",
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    description: "Pay when you receive your order",
                    icon: "💰",
                  },
                ].map((method) => (
                  <label key={method.id} className="block cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleChange}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div
                      className={`p-4 border-2 rounded-xl transition-all ${
                        formData.paymentMethod === method.id
                          ? "border-green-600 bg-white shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-4">{method.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {method.label}
                          </div>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                              formData.paymentMethod === method.id
                                ? "border-green-600 bg-green-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.paymentMethod === method.id && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6 flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="termsAgreed"
                    type="checkbox"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#FF8A00] focus:ring-[#FF8A00]"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#06236B] to-[#0a3a9c] hover:from-[#0a3a9c] hover:to-[#06236B] transition-colors"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#06236B] to-[#0a3a9c] hover:from-[#0a3a9c] hover:to-[#06236B] transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-[#0a8020] hover:bg-[#086b1b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a8020] transition-all transform ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-[1.01]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order - ${total.toFixed(2)}
                      <svg
                        className="ml-2 -mr-1 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-sm text-gray-500">
                  {formData.paymentMethod === "online"
                    ? "Your payment will be processed securely"
                    : "You will pay when you receive your order"}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
