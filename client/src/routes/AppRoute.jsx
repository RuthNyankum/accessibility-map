import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import ServiceDetailsPage from "../pages/ServiceDetailsPage";
import MapPage from "../pages/MapPage";
import AddServicePage from "../pages/AddServicePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";

import AdminOverviewPage from "../pages/admin/AdminOverviewPage";
import AdminPendingPage from "../pages/admin/AdminPendingPage";
import AdminServicesPage from "../pages/admin/AdminServicesPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AboutPage from "../pages/AboutPage";
import TermsOfUsePage from "../pages/TermsOfUsePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import AccessibilityStatementPage from "../pages/AccessibilityStatementPage";
import ContactPage from "../pages/ContactPage";

export default function AppRoute() {
  return (
    <Routes>
      {/*  Public routes (with Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route
          path="/accessibility-statement"
          element={<AccessibilityStatementPage />}
        />
        <Route path="/contact-us" element={<ContactPage />} />

        {/* Protected routes (require login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/add-service" element={<AddServicePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/*  Auth routes (no Navbar / Footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/*  Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/pending" element={<AdminPendingPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      {/* Fallback for any unmatched route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
