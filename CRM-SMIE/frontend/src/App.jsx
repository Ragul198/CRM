import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Login from "./components/Login.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Layout from "./components/Layout.jsx";

import Profile from "./pages/Profile.jsx";
import Users from "./pages/Users.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leads from "./pages/Leads.jsx";
import Opportunies from "./pages/Opportunities.jsx";
import Enquiry from "./pages/Enquiry.jsx";
import Quotation from "./pages/Quotation.jsx";
import Converted from "./pages/Converted.jsx";
import FollowUp from "./pages/FollowUp.jsx";
import Account from "./pages/Account.jsx";
import Report from "./pages/Report.jsx";
import Trash from "./pages/Trash.jsx";
import Calendar from "./pages/Calendar.jsx";
import FollowUpView from "./pages/FollowUpView.jsx";
import QuotationView from "./pages/QuotationView.jsx";
import ConvertedView from "./pages/ConvertedView.jsx";
import EnquiryView from "./pages/EnquiryView.jsx";
import ActivityLogs from "./pages/ActivityLogs.jsx";
import LeadsHistory from "./pages/LeadsHistory.jsx";
import LeadsView from "./pages/LeadsView.jsx";
import OpportunityView from "./pages/OpportunityView.jsx";
import CreateLead from "./pages/CreateLead.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import HistoryDetails from "./pages/HistoryDetails.jsx";
import AddQuotation from "./pages/AddQuotation.jsx";
import AccountView from "./pages/AccountView.jsx";
import NotFound from "./pages/NotFound.jsx";

import { postLogin } from "./redux/userSlice.jsx";
import axiosInstance from "./api/axiosInstance.jsx";
import { initSocket } from "./api/socketIO.jsx";
import { registerSocketListeners } from "./api/socketListeners.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx"; // ⬅️ new import

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        dispatch(postLogin(data));
        const socket = initSocket(data.data._id, data.data.role);
        registerSocketListeners(socket, dispatch);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [dispatch]);

  const currentUser = useSelector((state) => state.users.currentUser);

  if (loading) {
    return (
      <div className="bg-gray-50 flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Dashboard />} />

          {/* Accessible to all roles that have Leads */}
          <Route
            path="leads"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Coordinator"]}>
                <Leads />
              </ProtectedRoute>
            }
          />
          <Route path="leadsView/:id" element={<LeadsView />} />
          <Route path="leads/create" element={<CreateLead />} />

          <Route
            path="opportunities"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Engineer"]}>
                <Opportunies />
              </ProtectedRoute>
            }
          />
          <Route path="opportunityView/:id" element={<OpportunityView />} />

          <Route
            path="enquiry"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Engineer"]}>
                <Enquiry />
              </ProtectedRoute>
            }
          />
          <Route path="enquiryView" element={<EnquiryView />} />

          <Route
            path="quotation"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Engineer"]}>
                <Quotation />
              </ProtectedRoute>
            }
          />
          <Route path="quotationView/:id" element={<QuotationView />} />
          <Route path="addQuotation/:id" element={<AddQuotation />} />

          <Route
            path="converted"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Engineer"]}>
                <Converted />
              </ProtectedRoute>
            }
          />
          <Route path="convertedView/:id" element={<ConvertedView />} />

          <Route path="followup" element={<FollowUp />} />
          <Route path="followupView" element={<FollowUpView />} />

          <Route
            path="account"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="accountView/:id" element={<AccountView />} />

          <Route
            path="report"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <Report />
              </ProtectedRoute>
            }
          />

          <Route
            path="leadsHistory"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <LeadsHistory />
              </ProtectedRoute>
            }
          />
          <Route path="leadsHistoryView" element={<HistoryDetails />} />

          <Route path="calendar" element={<Calendar />} />

          <Route
            path="activityLogs"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <ActivityLogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="createUser"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="usersView" element={<UserDetails />} />

          <Route
            path="trash"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
                <Trash />
              </ProtectedRoute>
            }
          />

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:uToken" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />

      </Routes>

      <Toaster />
    </>
  );
};

export default App;
