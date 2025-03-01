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

const TitleBar = lazy(() => import("./components/shared/TitleBar"));
const Company = lazy(() => import("./components/home/Company"));
const ViewCompany = lazy(() => import("./components/company/ViewCompany"));
const AddCompany = lazy(() => import("./components/company/AddCompany"));
const Register = lazy(() => import("./components/auth/Register"));
const Otp = lazy(() => import("./components/auth/Otp"));
const SellerProducts = lazy(() =>
  import("./components/seller/products/SellerProducts")
);
const SellerPurchases = lazy(() =>
  import("./components/seller/purchases/SellerPurchases")
);
const SellerSuppliers = lazy(() =>
  import("./components/seller/suppliers/SellerSupplier")
);
const Expenses = lazy(() => import("./components/home/Expenses"));
const ViewExpenses = lazy(() => import("./components/expenses/ViewExpenses"));
const AddExpense = lazy(() => import("./components/expenses/AddExpense"));
const SellerExpenses = lazy(() =>
  import("./components/seller/expenses/SellerExpenses")
);
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const Settings = lazy(() => import("./components/home/Settings"));
const ViewSettings = lazy(() => import("./components/settings/ViewSettings"));
const Customers = lazy(() => import("./components/home/Customers"));
const ViewCustomers = lazy(() => import("./components/customer/ViewCustomers"));
const AddCustomer = lazy(() => import("./components/customer/AddCustomer"));
const CustomerDetails = lazy(() =>
  import("./components/customer/CustomerDetails")
);
const SellerCustomers = lazy(() =>
  import("./components/seller/customers/SellerCustomers")
);
const BalanceReport = lazy(() => import("./components/Reports/BalanceReport"));
const Seller = lazy(() => import("./pages/Seller"));
const TopLoadingBar = lazy(() => import("./components/shared/TopLoadingBar"));
const SellerSales = lazy(() => import("./components/seller/sales/SellerSales"));
const SellerInventory = lazy(() =>
  import("./components/seller/inventory/SellerInventory")
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
  const isAuthenticated = user && user?.name;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  } else if (!user.company) {
    return <Navigate to="/company/add" state={{ from: location }} replace />;
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
        stacked
        theme={theme}
        portal={document.body}
        toastStyle={{
          backgroundColor: "var(--color-sidebar)",
          color: "var(--color-text)",
          border: "1px solid var(--color-card)",
          top: "22px",
          fontSize: "14px",
          padding: "8px",
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
            {/* Base Route for adding company on the first login */}
            <Route path="/company/add" element={<AddCompany />} />

            {/* Protected Routes */}
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
                <Route path="returns" element={<ViewPurchaseReturns />} />
                <Route path="returns/add" element={<AddPurchaseReturn />} />
              </Route>

              {/* Expense Routes */}
              <Route path="expenses" element={<Expenses />}>
                <Route path="" element={<ViewExpenses />} />
                <Route path="add" element={<AddExpense />} />
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

              {/* Customer Routes */}
              <Route path="customers" element={<Customers />}>
                <Route path="" element={<ViewCustomers />} />
                <Route path="add" element={<AddCustomer />} />
                <Route path=":id" element={<CustomerDetails />} />
              </Route>

              {/* Reports */}
              <Route path="reports" element={<Reports />}>
                <Route path="" element={<ExpenseReport />} />
                <Route path="expense" element={<ExpenseReport />} />
                <Route path="sales" element={<SalesReport />} />
                <Route path="tax" element={<TaxReport />} />
                <Route path="profit-loss" element={<ProfitLossReport />} />
                <Route path="balances" element={<BalanceReport />} />
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

              {/* Settings */}
              <Route path="settings" element={<Settings />}>
                <Route path="" element={<ViewSettings />} />
              </Route>
            </Route>

            <Route path="/auth" element={<Auth />}>
              <Route path="" element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="otp" element={<Otp />} />
              <Route path="register" element={<Register />} />
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
              <Route path="purchases" element={<SellerPurchases />}>
                <Route path="" element={<ViewPurchases />} />
                <Route path="add" element={<AddPurchase />} />
                <Route path=":id" element={<PurchaseDetails />} />
                <Route path="returns" element={<ViewPurchaseReturns />} />
                <Route path="returns/add" element={<AddPurchaseReturn />} />
              </Route>
              <Route path="expenses" element={<SellerExpenses />}>
                <Route path="" element={<ViewExpenses />} />
                <Route path="add" element={<AddExpense />} />
              </Route>
              <Route path="products" element={<SellerProducts />}>
                <Route path="" element={<ViewProducts />} />
                <Route path="add" element={<AddProduct />} />
                <Route path=":id" element={<ProductDetails />} />
              </Route>
              <Route path="suppliers" element={<SellerSuppliers />}>
                <Route path="" element={<ViewSuppliers />} />
                <Route path="add" element={<AddSuppliers />} />
                <Route path=":id" element={<SupplierDetails />} />
              </Route>
              <Route path="customers" element={<SellerCustomers />}>
                <Route path="" element={<ViewCustomers />} />
                <Route path="add" element={<AddCustomer />} />
                <Route path=":id" element={<CustomerDetails />} />
              </Route>
              <Route path="reports" element={<Reports />}>
                <Route path="" element={<ExpenseReport />} />
                <Route path="expense" element={<ExpenseReport />} />
                <Route path="sales" element={<SalesReport />} />
                <Route path="tax" element={<TaxReport />} />
                <Route path="profit-loss" element={<ProfitLossReport />} />
                <Route path="balances" element={<BalanceReport />} />
              </Route>
              <Route path="settings" element={<Settings />}>
                <Route path="" element={<ViewSettings />} />
              </Route>
            </Route>

            {/* Privacy Policy */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            {/* Terms of Use */}
            <Route path="terms-of-use" element={<TermsOfUse />} />
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
           </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
};

export default App;
