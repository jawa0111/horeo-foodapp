import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import StockPage from "./pages/admin/Stock";
import CustomerPage from "./pages/admin/Customer";
import StaffPage from "./pages/admin/Staff";
import CustomerHome from "./pages/customer/Home";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import MenuPage from "./pages/customer/Menu";
import AdminMenuPage from "./pages/admin/Menu";
import AdminBillingPage from "./pages/admin/Billing";
import SalesReport from "./pages/admin/SalesReport";
import AboutPage from "./pages/customer/About";
import ContactPage from "./pages/customer/Contact";
import CheckoutPage from "./pages/customer/Checkout";
import ProfilePage from "./pages/customer/Profile";
import Sidebar from "./components/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import StripePaymentPage from "./components/StripePaymentpage";
import EmailSentPage from "./pages/EmailSentPage";
import { AuthProvider } from "./context/AuthContext";
import OrdersPage from "./pages/admin/Orders";
import StaticMenu from "./pages/customer/StaticMenu";

// Layout component that includes the sidebar and content area
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<CustomerHome />} />
            <Route path="/menu" element={<StaticMenu />} />
            <Route path="/old-menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/static-menu" element={<StaticMenu />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/email-sent" element={<EmailSentPage />} />
            <Route path="/payment" element={<StripePaymentPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/orders"
              element={
                <AdminLayout>
                  <OrdersPage />
                </AdminLayout>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/stock"
              element={
                <AdminLayout>
                  <StockPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/customers"
              element={
                <AdminLayout>
                  <CustomerPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/staff"
              element={
                <AdminLayout>
                  <StaffPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/menu"
              element={
                <AdminLayout>
                  <AdminMenuPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/billing"
              element={
                <AdminLayout>
                  <AdminBillingPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <AdminLayout>
                  <SalesReport />
                </AdminLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
