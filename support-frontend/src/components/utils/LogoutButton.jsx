import React from "react";
import { IoLogOut } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../../redux/features/user/userSlice";

const LogoutButton = ({ expanded = true, otherClasses }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const id = toast.loading("Logging out...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw (data.message || "Logout failed");
      } else {
        localStorage.removeItem("support-user");
        navigate("/auth");
        dispatch(setUser(null));
        toast.update(id, {
          render: "Logout successful",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };
  return (
    <button
      onClick={handleLogout}
      className={` flex justify-center gap-1 items-center text-sm group mt-2 rounded-md bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] w-fit py-1.5 px-4 text-white transition-all duration-300 ease-in ${!expanded && '!px-2'} ${otherClasses}`}
    >
      <IoLogOut className="transition-all duration-300 ease-in font-bold text-xl" />
      <span
        className={`${
          expanded ? "max-w-full " : "max-w-0 hidden"
        } overflow-hidden transition-all duration-300 ease-in`}
      >
        Logout
      </span>
    </button>
  );
};

export default LogoutButton;
