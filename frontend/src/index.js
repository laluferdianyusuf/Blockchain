import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Dashboard from "./pages/common/Dashboard";
import LandingPage from "./pages/common/LandingPage";
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import Generate from "./pages/certificates/Generate";
import History from "./pages/certificates/History";
import VerifyOtp from "./pages/admin/verifyOtp";
import Profile from "./pages/admin/Profile";

const App = () => {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/v1/landing" element={<LandingPage />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/certificate/generate" element={<Generate />} />
            <Route path="/certificate/owner/history" element={<History />} />
            <Route path="/user/verify/otp" element={<VerifyOtp />} />
            <Route path="/user/profile" element={<Profile />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </Provider>
  );
};
const rootElement = document.getElementById("root");

const root = createRoot(rootElement);
root.render(<App />);
