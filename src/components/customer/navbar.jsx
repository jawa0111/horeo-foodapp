import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ cartItemCount = 0, onCartClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authLogout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-10 py-3 bg-white/95 backdrop-blur-sm shadow-md">
      <Link to="/" className="flex-shrink-0">
        <span className="brand-text">Horeo</span>
      </Link>

      <div className="flex-1 flex justify-end items-center">
        <ul className="hidden md:flex space-x-8 text-base font-medium mr-8">
        <li>
          <Link 
            to="/home" 
            className={`nav-link ${isActive("/home") ? 'active' : 'text-gray-700'}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/menu" 
            className={`nav-link ${isActive("/menu") ? 'active' : 'text-gray-700'}`}
          >
            Menu
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className={`nav-link ${isActive("/about") ? 'active' : 'text-gray-700'}`}
          >
            About us
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive("/contact") ? 'active' : 'text-gray-700'}`}
          >
            Contact
          </Link>
        </li>
        </ul>

        <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-2">
            <Link
              to="/profile"
              className="flex items-center space-x-1 text-gray-700 hover:text-[#FF8A00] transition-colors"
              title="Profile"
            >
              <User size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-[#FF4D4D] text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white px-5 py-2 rounded-full hover:opacity-90 transition"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </div>
    </nav>
  );
};

export default Navbar;
