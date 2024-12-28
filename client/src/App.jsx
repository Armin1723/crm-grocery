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
import ViewProducts from "./components/products/ViewProducts";
import AddProduct from "./components/products/AddProduct";
import ViewPurchases from "./components/purchases/ViewPurchases";
import AddPurchase from "./components/purchases/AddPurchase";
import ViewSales from "./components/sales/ViewSales";
import AddSale from "./components/sales/AddSale";
import Sale from "./components/sales/Sale";
import SaleInvoiceModal from "./components/sales/SaleInvoiceModal";
import SalePage from "./components/sales/SalePage";
import Suppliers from "./components/home/Suppliers";
import ViewSuppliers from "./components/suppliers/ViewSuppliers";
import AddSuppliers from "./components/suppliers/AddSuppliers";
import PurchaseDetails from "./components/purchases/PurchaseDetails";
import SupplierDetails from "./components/suppliers/SupplierDetails";

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
          </Route>

          {/* Purchase Routes */}
          <Route path="purchases" element={<Purchases />}>
            <Route path="" element={<ViewPurchases />} />
            <Route path="add" element={<AddPurchase />} />
            <Route path=":id" element={<PurchaseDetails />} />
          </Route>

          {/* Sales Routes */}
          <Route path="sales" element={<Sales />}>
            <Route path="" element={<ViewSales />} />
            <Route path="add" element={<AddSale />} />
          </Route>
          <Route path="sales/:id" element={<SalePage />}>
            <Route path='' element={<Sale />} />
            <Route path="invoice" element={<SaleInvoiceModal />} />
          </Route>

          <Route path="inventory" element={<Inventory />} />

          <Route path="/suppliers" element={<Suppliers />} >
            <Route path="" element={<ViewSuppliers />} />
            <Route path="add" element={<AddSuppliers />} />
            <Route path=":id" element={<SupplierDetails />} />
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
