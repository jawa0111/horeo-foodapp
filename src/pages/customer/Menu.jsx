import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Navbar from "../../components/customer/navbar";
import * as menuService from "../../library/services/menu_service";

export default function CustomerMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks"];
  const navigate = useNavigate();

  // ✅ Helper to support both URL types
  const getImageUrl = (img) => img?.url || img;

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const filteredMenuItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, q) => {
    if (q < 1) return;
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: q } : i))
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i._id !== id));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout", {
      state: { cartTotal: cart.reduce((t, i) => t + i.price * i.quantity, 0) },
    });
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await menuService.getMenuItems();
      const available = data.filter((i) => i.status === "available");
      setMenuItems(available);
    } catch (e) {
      console.error("Error fetching menu:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061A3B] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#061A3B] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading menu...</p>
        </div>
      </div>
    );
  }

  const handleImageClick = (item) => setSelectedItem(item);
  const closeImagePopup = () => setSelectedItem(null);

  return (
    <div className="min-h-screen w-full bg-white relative text-white transition-all duration-500">
      <div className="relative z-50">
        <Navbar cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(!isCartOpen)} />
      </div>

      {/* Add padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Category Navigation Bar */}
        <div className="bg-white shadow-md sticky top-16 z-10">
          <div className="w-full overflow-x-auto">
            <div className="inline-flex">
              <div className="flex space-x-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-8 py-3 text-base font-medium transition-all duration-200 border border-l-0 first:border-l ${
                      activeCategory === cat
                        ? "bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white border-transparent scale-105"
                        : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:scale-105"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white shadow-lg rounded-none overflow-hidden hover:shadow-[#061A3B]/30 hover:scale-105 transform transition-all duration-300 flex flex-col border border-gray-200"
                  >
                    {item.images?.length > 0 && (
                      <div
                        className="relative h-48 overflow-hidden cursor-pointer border-b border-gray-100"
                        onClick={() => handleImageClick(item)}
                      >
                        {/* Cloudinary-safe image display */}
                        <img
                          src={getImageUrl(item.images[0])}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-grow text-black">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="text-[#061A3B] font-bold ml-2">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 my-1">{item.category}</p>
                      <p className="text-xs text-gray-500 flex-grow line-clamp-2 my-1">
                        {item.description}
                      </p>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-[#0a8020] hover:bg-[#086b1b] text-white py-2 rounded-md transition-all font-medium shadow-lg hover:shadow-[#0a8020]/40"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div
              className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform ${
                isCartOpen ? "translate-x-0" : "translate-x-full"
              } lg:translate-x-0 lg:fixed lg:right-0 lg:inset-y-0 z-40 transition-transform duration-300 ease-in-out`}
              style={{ marginTop: '64px' }}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 relative">
                  <h2 className="text-xl font-bold text-center text-[#061A3B]">
                    Your Order
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 150px)' }}>
                  {cart.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-4">
                      <div className="text-gray-400 text-center">Cart is Empty</div>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg mb-3 shadow-lg text-black"
                      >
                        <div className="w-20 h-20 overflow-hidden rounded-lg">
                          {/* Cart image fix */}
                          <img
                            src={getImageUrl(item.images?.[0])}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-400">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="p-1 text-gray-400 hover:text-black"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="mx-2 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="p-1 text-gray-400 hover:text-black"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-[#061A3B]/30 bg-white text-black sticky bottom-0">
                  <div className="flex justify-between font-bold mb-2">
                    <span>Total</span>
                    <span>${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#0a8020] hover:bg-[#086b1b] text-white py-3 rounded-lg transition-all font-medium shadow-md hover:shadow-[#0a8020]/40"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Image Preview (Popup Swiper) */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <button
              onClick={closeImagePopup}
              className="absolute top-6 right-6 text-white hover:text-[#061A3B] z-50"
            >
              <X size={28} />
            </button>

            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500 }}
              navigation
              className="w-full max-w-3xl h-[70vh]"
            >
              {selectedItem.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={getImageUrl(img)}
                    className="w-full h-full object-contain bg-black"
                    alt={selectedItem.name}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
