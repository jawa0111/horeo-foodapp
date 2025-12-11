import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import Navbar from "../../components/customer/navbar";

const StaticMenu = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Dummy food data
  const dummyMenuItems = [
    // Starters
    {
      _id: 1,
      name: "Crispy Calamari",
      description: "Lightly fried squid served with marinara sauce and lemon wedges",
      price: 12.99,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FsYW1hcmklMjBmcmllZHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      _id: 2,
      name: "Bruschetta",
      description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
      price: 9.99,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80"
    },
    {
      _id: 3,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
      price: 10.99,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Flc2FyJTIwc2FsYWR8ZW58MHx8MHx8fDA%3D"
    },
    
    // Main Course
    {
      _id: 4,
      name: "Grilled Ribeye Steak",
      description: "12oz USDA Prime ribeye, garlic mashed potatoes, and grilled asparagus",
      price: 34.99,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWt8ZW58MHx8MHx8fDA%3D"
    },
    {
      _id: 5,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, fresh mozzarella, and basil",
      price: 16.99,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D"
    },
    {
      _id: 6,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables",
      price: 26.99,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JpbGxlZCUyMHNhbG1vbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      _id: 7,
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms, white wine, and parmesan",
      price: 19.99,
      category: "Main Course",
      image: "https://img.freepik.com/free-photo/mushroom-risotto-with-parmesan-cheese-garnish_2829-1993.jpg?w=800&t=st=1702310400~exp=1702314000~hmac=1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1"
    },
    
    // Desserts
    {
      _id: 8,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
      price: 9.99,
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwbGF2YSUyMGNha2V8ZW58MHx8MHx8fDA%3D"
    },
    {
      _id: 9,
      name: "Tiramisu",
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
      price: 8.99,
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80"
    },
    
    // Drinks
    {
      _id: 10,
      name: "Mojito",
      description: "Classic Cuban cocktail with rum, mint, lime, sugar, and soda",
      price: 11.99,
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9qaXRvfGVufDB8fDB8fHww"
    },
    {
      _id: 11,
      name: "Red Wine",
      description: "House selection of premium red wine, glass",
      price: 12.99,
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVkJTIwd2luZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      _id: 12,
      name: "Iced Tea",
      description: "Freshly brewed iced tea with lemon",
      price: 4.99,
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9qaXRvfGVufDB8fDB8fHww"
    }
  ];

  const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks"];
  
  const filteredMenuItems = activeCategory === "All" 
    ? dummyMenuItems 
    : dummyMenuItems.filter(item => item.category === activeCategory);

  const cartItemCount = cart.reduce((count, item) => count + (item.quantity || 0), 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => 
          i._id === item._id ? { ...i, quantity: (i.quantity || 0) + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, q) => {
    if (q < 1) return;
    setCart(prev => 
      prev.map(i => (i._id === id ? { ...i, quantity: q } : i))
    );
  };

  const removeFromCart = (id) => 
    setCart(prev => prev.filter(i => i._id !== id));

  return (
    <div className="min-h-screen w-full bg-white relative text-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover our delicious selection of dishes made with the finest ingredients
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-6 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-[#0a3a9c] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-semibold text-[#0a3a9c]">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-[#0a3a9c] text-white py-2 px-4 rounded-lg hover:bg-[#06236B] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-[#0a3a9c] text-white p-4 rounded-full shadow-lg hover:bg-[#06236B] transition-colors z-20"
      >
        <ShoppingCart size={24} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Order</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-[#0a3a9c]"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-[#0a3a9c]"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-semibold text-lg mb-6">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      className="w-full bg-[#0a3a9c] text-white py-3 rounded-lg hover:bg-[#06236B] transition-colors"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticMenu;
