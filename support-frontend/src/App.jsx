import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "./index.css";

const Login = React.lazy(() => import("./Components/auth/Login"));
const ForgotPassword = React.lazy(() =>
  import("./Components/auth/ForgotPassword")
);
const ResetPassword = React.lazy(() =>
  import("./Components/auth/ResetPassword")
);

const Stats = React.lazy(() => import("./components/home/Stats"));
const Leads = React.lazy(() => import("./components/home/Leads"));
const Clients = React.lazy(() => import("./components/home/Clients"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Tickets = React.lazy(() => import("./components/home/Tickets"));
const ViewLeads = React.lazy(() => import("./components/leads/ViewLeads"));
const AddLead = React.lazy(() => import("./components/leads/AddLead"));
const LeadDetails = React.lazy(() => import("./components/leads/LeadDetails"));
const ViewTickets = React.lazy(() => import("./components/tickets/ViewTickets"));
const ClosedTickets = React.lazy(() => import("./components/tickets/ClosedTickets"));
const TicketDetails = React.lazy(() => import("./components/tickets/TicketDetails"));
const ViewClients = React.lazy(() => import("./components/clients/ViewClients"));
const ClientDetails = React.lazy(() => import("./components/clients/ClientDetails"));

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const isAuthenticated = user && user?.name;
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
  }, [theme]);

  return (
    <BrowserRouter>
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
      <div className="w-screen h-screen flex flex-col">
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

              {/* Lead Routes */}
              <Route path="leads" element={<Leads />}>
                <Route path="" element={<ViewLeads />} />
                <Route path="add" element={<AddLead />} />
                <Route path=":id" element={<LeadDetails />} />
              </Route>

              {/* Ticket Routes */}
              <Route path="tickets" element={<Tickets />}>
                <Route path="" element={<ViewTickets />} />
                <Route path="closed" element={<ClosedTickets />} />
                <Route path=":id" element={<TicketDetails />} />
              </Route>

              {/* Client Routes */}
              <Route path="clients" element={<Clients />} >
                <Route path="" element={<ViewClients />} />
                <Route path=":id" element={<ClientDetails />} />  
              </Route>
            </Route>

            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />}>
              <Route path="" element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
