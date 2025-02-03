import React, { useEffect, lazy, Suspense } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import ViewExpenses from "./components/purchases/ViewExpenses";
import TitleBar from "./components/shared/TitleBar";
import Company from "./components/home/Company";
import ViewCompany from "./components/company/ViewCompany";
const Seller = lazy(() => import("./pages/Seller"));
const TopLoadingBar = lazy(() => import("./components/shared/TopLoadingBar"));
const SellerSales = lazy(() => import("./components/seller/sales/SellerSales"));
const SellerInventory = lazy(() =>
  import("./components/seller/inventory/SellerInventory")
);
const SellerEmployee = lazy(() =>
  import("./components/seller/employee/SellerEmployee")
);
const SellerHome = lazy(() => import("./components/seller/home/SellerHome"));
const SaleInvoice = lazy(() => import("./components/sales/SaleInvoice"));

const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./components/auth/Login"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const Products = lazy(() => import("./components/home/Products"));
const Sales = lazy(() => import("./components/home/Sales"));
const Purchases = lazy(() => import("./components/home/Purchases"));
const Inventory = lazy(() => import("./components/home/Inventory"));
const InventoryGrid = lazy(() =>
  import("./components/inventory/InventoryGrid")
);
const InventoryList = lazy(() =>
  import("./components/inventory/InventoryList")
);
const ExpiringInventory = lazy(() =>
  import("./components/inventory/ExpiringInventory")
);
const Stats = lazy(() => import("./components/home/Stats"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ViewProducts = lazy(() => import("./components/products/ViewProducts"));
const AddProduct = lazy(() => import("./components/products/AddProduct"));
const ViewPurchases = lazy(() =>
  import("./components/purchases/ViewPurchases")
);
const AddPurchase = lazy(() => import("./components/purchases/AddPurchase"));
const ViewSales = lazy(() => import("./components/sales/ViewSales"));
const AddSale = lazy(() => import("./components/sales/AddSale"));
const Suppliers = lazy(() => import("./components/home/Suppliers"));
const ViewSuppliers = lazy(() =>
  import("./components/suppliers/ViewSuppliers")
);
const AddSuppliers = lazy(() => import("./components/suppliers/AddSuppliers"));
const PurchaseDetails = lazy(() =>
  import("./components/purchases/PurchaseDetails")
);
const SupplierDetails = lazy(() =>
  import("./components/suppliers/SupplierDetails")
);
const SaleDetails = lazy(() => import("./components/sales/SaleDetails"));
const ProductDetails = lazy(() =>
  import("./components/products/ProductDetails")
);
const SaleReturn = lazy(() => import("./components/sales/SaleReturn"));
const ViewSaleReturns = lazy(() =>
  import("./components/sales/ViewSaleReturns")
);

const Employees = lazy(() => import("./components/home/Employees"));
const ViewEmployees = lazy(() => import("./components/employee/ViewEmployees"));
const AddEmployee = lazy(() => import("./components/employee/AddEmployee"));
const EmployeeDetails = lazy(() =>
  import("./components/employee/EmployeeDetails")
);
const Reports = lazy(() => import("./components/home/Reports"));
const ExpenseReport = lazy(() => import("./components/Reports/ExpenseReport"));
const AddExpense = lazy(() => import("./components/purchases/AddExpense"));
const SalesReport = lazy(() => import("./components/Reports/SalesReport"));
const ProfitLossReport = lazy(() =>
  import("./components/Reports/ProfitLossReport")
);
const ViewPurchaseReturns = lazy(() =>
  import("./components/purchases/ViewPurchaseReturns")
);
const AddPurchaseReturn = lazy(() =>
  import("./components/purchases/AddPurchaseReturn")
);
const TaxReport = lazy(() => import("./components/Reports/TaxReport"));

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const isAuthenticated = user && user?.avatar;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

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
    <HashRouter>
      <ToastContainer
        theme={theme}
        portal={document.body}
        toastStyle={{
          backgroundColor: "var(--color-sidebar)",
          color: "var(--color-text)",
          border: "1px solid var(--color-card)",
          top: "22px",
        }}
      />
      <TopLoadingBar style={{ zIndex: 1000 }} />
      <div className="w-screen h-screen flex flex-col">
        <TitleBar />
        <Suspense
          fallback={
            <div className="w-screen h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center">
              <div className="spinner"></div>
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
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
                <Route path="expenses" element={<ViewExpenses />} />
                <Route path="expenses/add" element={<AddExpense />} />
                <Route path="returns" element={<ViewPurchaseReturns />} />
                <Route path="returns/add" element={<AddPurchaseReturn />} />
              </Route>

              {/* Sales Routes */}
              <Route path="sales" element={<Sales />}>
                <Route path="" element={<ViewSales />} />
                <Route path="add" element={<AddSale />} />
                <Route path=":id" element={<SaleDetails />} />
                <Route path=":id/invoice" element={<SaleInvoice />} />
                <Route path="returns" element={<ViewSaleReturns />} />
                <Route path="returns/add" element={<SaleReturn />} />
              </Route>

              {/* Inventory Route */}
              <Route path="inventory" element={<Inventory />}>
                <Route path="" element={<InventoryList />} />
                <Route path="grid" element={<InventoryGrid />} />
                <Route path="expiring" element={<ExpiringInventory />} />
              </Route>

              {/* Suppliers Routes */}
              <Route path="suppliers" element={<Suppliers />}>
                <Route path="" element={<ViewSuppliers />} />
                <Route path="add" element={<AddSuppliers />} />
                <Route path=":id" element={<SupplierDetails />} />
              </Route>

              {/* Reports */}
              <Route path="reports" element={<Reports />}>
                <Route path="" element={<ExpenseReport />} />
                <Route path="expense" element={<ExpenseReport />} />
                <Route path="sales" element={<SalesReport />} />
                <Route path="tax" element={<TaxReport />} />
                <Route path="profit-loss" element={<ProfitLossReport />} />
              </Route>

              {/* Employee Routes */}
              <Route path="employees" element={<Employees />}>
                <Route path="" element={<ViewEmployees />} />
                <Route path="view" element={<ViewEmployees />} />
                <Route path="add" element={<AddEmployee />} />
                <Route path=":id" element={<EmployeeDetails />} />
              </Route>

              {/* Company Routes */}
              <Route path="company" element={<Company />}>
                <Route path="" element={<ViewCompany />} />
              </Route>
            </Route>

            <Route path="/auth" element={<Auth />}>
              <Route path="" element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {/* Seller Routes */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute>
                  <Seller />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<SellerHome />} />
              <Route path="sales" element={<SellerSales />}>
                <Route path="" element={<ViewSales />} />
                <Route path="add" element={<AddSale />} />
                <Route path=":id" element={<SaleDetails />} />
                <Route path="return" element={<ViewSaleReturns />} />
                <Route path="return/add" element={<SaleReturn />} />
              </Route>
              <Route path="inventory" element={<SellerInventory />}>
                <Route path="" element={<InventoryList />} />
                <Route path="grid" element={<InventoryGrid />} />
              </Route>
              <Route path="employees" element={<SellerEmployee />}>
                <Route path=":id" element={<EmployeeDetails />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
};

export default App;
