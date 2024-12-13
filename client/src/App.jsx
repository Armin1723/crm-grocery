import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./components/auth/ResetPassword";
import { useSelector } from "react-redux";
import Products from "./components/home/Products";
import Sales from "./components/home/Sales";
import Purchases from "./components/home/Purchases";
import Inventory from "./components/home/Inventory";
import Stats from "./components/home/Stats";
import NotFound from "./pages/NotFound";

const App = () => {
  const theme = useSelector((state) => state.theme.value);
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <ToastContainer theme={theme} />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="" element={<Stats />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>

        <Route path="/auth" element={<Auth />}>
          <Route path="" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
