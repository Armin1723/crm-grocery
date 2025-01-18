import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LogoutButton from "../components/utils/LogoutButton";
import { useNavigate } from "react-router-dom";
import ViewSales from "../components/sales/ViewSales";

const Seller = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else if (user.role !== "employee") {
      navigate("/");
    }
  }, []);
  return <div className="w-full min-h-dvh flex flex-col items-center justify-center">
    <p>Seller Page</p>
    <p className="capitalize">Welcome {user.name}</p>
    <ViewSales />
    <LogoutButton />
  </div>;
};

export default Seller;
