import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  CreditCard,
  Package,
  UserCog,
  Users,
  FileText,
  LogOut,
} from "lucide-react"; // ensure you have lucide-react installed

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#06236B] to-[#0a3a9c] text-white flex flex-col justify-between shadow-lg">
      {/* Logo Section */}
      <div>
        <div className="flex items-center justify-center py-6 border-b border-white/10">
          <Link
            to="/"
            className="flex items-center space-x-1 hover:opacity-90 transition-opacity"
          >
            <span className="text-3xl font-bold text-white">Horeo</span>
            <span className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white px-1 text-3xl font-bold rounded-sm">
              Plate
            </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 space-y-1">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/menu"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <Utensils className="w-5 h-5" />
            Menu
          </NavLink>
          <NavLink
            to="/admin/billing"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <CreditCard className="w-5 h-5" />
            Billing
          </NavLink>
          <NavLink
            to="/admin/stock"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <Package className="w-5 h-5" />
            Stock
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <FileText className="w-5 h-5" />
            Orders
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <Users className="w-5 h-5" />
            Customer
          </NavLink>
          <NavLink
            to="/admin/staff"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <UserCog className="w-5 h-5" />
            Staff
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                  : "text-white/90 hover:bg-white/10 hover:text-white rounded-r-lg"
              } transition-all duration-200`
            }
          >
            <FileText className="w-5 h-5" />
            Report
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Admin</p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
          </div>
        </div>
        <NavLink
          to="/login"
          onClick={() => {
            // Handle logout logic here
            navigate("/login");
          }}
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-6 py-3 ${
              isActive
                ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border-l-4 border-yellow-400 font-semibold"
                : "text-white/90 hover:bg-white/10 hover:text-yellow-300 rounded-r-lg"
            } transition-all duration-200`
          }
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
}
