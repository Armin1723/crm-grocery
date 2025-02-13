import React from "react";
import { FaMoon } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/features/theme/themeSlice";
import { MdSunny } from "react-icons/md";

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(toggleTheme())}>
      {theme === "dark" ? (
        <FaMoon className="text-2xl hover:fill-accentDark transition-all duration-300 ease-in" />
      ) : (
        <MdSunny className="text-2xl hover:fill-accentDark transition-all duration-300 ease-in" />
      )}
    </button>
  );
};

export default ThemeToggle;
