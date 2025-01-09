import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./components/auth/ResetPassword";
import { useSelector } from "react-redux";
import Products from "./components/home/Products";
import Sales from "./components/home/Sales";
import Purchases from "./components/home/Purchases";
import Inventory from "./components/home/Inventory";
import Stats from "./components/home/Stats";
import NotFound from "./pages/NotFound";
import ViewProducts from "./components/products/ViewProducts";
import AddProduct from "./components/products/AddProduct";
import ViewPurchases from "./components/purchases/ViewPurchases";
import AddPurchase from "./components/purchases/AddPurchase";
import ViewSales from "./components/sales/ViewSales";
import AddSale from "./components/sales/AddSale";
import Suppliers from "./components/home/Suppliers";
import ViewSuppliers from "./components/suppliers/ViewSuppliers";
import AddSuppliers from "./components/suppliers/AddSuppliers";
import PurchaseDetails from "./components/purchases/PurchaseDetails";
import SupplierDetails from "./components/suppliers/SupplierDetails";
import SaleDetails from "./components/sales/SaleDetails";
import ProductDetails from "./components/products/ProductDetails";
import SaleReturn from "./components/sales/SaleReturn";
import ViewSaleReturns from "./components/sales/ViewSaleReturns";
import Reports from "./components/home/Reports";
import ExpenseReport from "./components/Reports/ExpenseReport";
import AddExpense from "./components/purchases/AddExpense";

const App = () => {
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    // Prevent scrolling on number input fields
    const handleWheel = (event) => {
      if (
        document.activeElement.type === "number" &&
        document.activeElement === event.target
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [theme]);

  return (
    <BrowserRouter>
      <ToastContainer
        theme={theme}
        toastStyle={{
          backgroundColor: "var(--color-sidebar)",
          color: "var(--color-text)",
          border: "1px solid var(--color-card)",
        }}
      />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="" element={<Stats />} />

          {/* Product Routes */}
          <Route path="products" element={<Products />}>
            <Route path="" element={<ViewProducts />} />
            <Route path="add" element={<AddProduct />} />
            <Route path=":id" element={<ProductDetails />} />
          </Route>

          {/* Purchase Routes */}
          <Route path="purchases" element={<Purchases />}>
            <Route path="" element={<ViewPurchases />} />
            <Route path="add" element={<AddPurchase />} />
            <Route path=":id" element={<PurchaseDetails />} />
            <Route path="expense" element={<AddExpense />} />
          </Route>

          {/* Sales Routes */}
          <Route path="sales" element={<Sales />}>
            <Route path="" element={<ViewSales />} />
            <Route path="add" element={<AddSale />} />
            <Route path=":id" element={<SaleDetails />} />
            <Route path="returns" element={<ViewSaleReturns />} />
            <Route path="add-return" element={<SaleReturn />} />
          </Route>

          <Route path="inventory" element={<Inventory />} />

          {/* Suppliers Routes */}
          <Route path="/suppliers" element={<Suppliers />}>
            <Route path="" element={<ViewSuppliers />} />
            <Route path="add" element={<AddSuppliers />} />
            <Route path=":id" element={<SupplierDetails />} />
          </Route>

          {/* Reports */}
          <Route path="reports" element={<Reports />}>
            <Route path="" element={<ExpenseReport />} />
          </Route>
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
