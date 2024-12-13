import { AiFillProduct } from "react-icons/ai";
import { BsInboxesFill } from "react-icons/bs";
import { FaChartLine, FaHome, FaShoppingCart } from "react-icons/fa";

export const links = [
  {
    icon: FaHome,
    title: "Home",
    to: "/",
  },
  {
    icon: FaChartLine,
    title: "Sales",
    to: "/sales",
  },
  {
    icon: FaShoppingCart,
    title: "Purchases",
    to: "/purchases",
  },
  {
    icon: AiFillProduct,
    title: "Products",
    to: "/products",
  },
  {
    icon: BsInboxesFill,
    title: "Inventory",
    to: "/inventory",
  },
];
