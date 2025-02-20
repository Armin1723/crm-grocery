import { AiFillProduct } from "react-icons/ai";
import { BsInboxesFill } from "react-icons/bs";
import {
  FaChartLine,
  FaHome,
  FaList,
  FaPlus,
  FaShoppingCart,
  FaStore,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";

export const links = [
  {
    icon: FaHome,
    title: "Home",
    to: "/",
    protected: false,
  },
  {
    icon: FaChartLine,
    title: "Sales",
    to: "/sales",
    protected: false,
    sublinks: [
      {
        title: "Add Sale",
        to: "/sales/add",
        icon: FaPlus,
      },
      {
        title: "View Sales",
        to: "/sales",
        icon: FaChartLine,
      },
    ],
  },
  {
    icon: FaShoppingCart,
    title: "Purchases",
    to: "/purchases",
    protected: true,
  },
  {
    icon: FaWallet,
    title: "Expenses",
    to: "/expenses",
    protected: true,
  },
  {
    icon: AiFillProduct,
    title: "Products",
    to: "/products",
    protected: true,
  },
  {
    icon: BsInboxesFill,
    title: "Inventory",
    to: "/inventory",
    protected: false,
    sublinks: [
      {
        title: "Inventory List",
        to: "/inventory",
        icon: FaList,
      },
      {
        title: "Inventory Grid",
        to: "/inventory/grid",
        icon: BsInboxesFill,
      },
    ],
  },
  {
    icon: FaStore,
    title: "Suppliers",
    to: "/suppliers",
    protected: true,
  },
  {
    icon: BiSolidReport,
    title: "Reports",
    to: "/reports",
    protected: true,
  },
  {
    icon: FaUser,
    title: "Employees",
    to: "/employees",
    protected: true,
  },
];

export const categories = [
  {
    category: "Baby Care",
    subCategories: [
      "Baby Bath & Skin Care",
      "Baby Cleaning Supplies",
      "Baby Food & Formula",
      "Baby Gift Sets",
      "Baby Health & Safety",
      "Baby Toys",
      "Diapers & Wipes",
      "Feeding Essentials",
    ],
  },
  {
    category: "Baking & Desserts",
    subCategories: [
      "Cake Decorations",
      "Chocolates & Cocoa",
      "Essences & Food Colors",
      "Flours & Baking Mixes",
      "Frozen Pastries & Desserts",
      "Toppings & Sprinkles",
      "Whipping Cream & Fillings",
    ],
  },
  {
    category: "Beverages",
    subCategories: [
      "Energy Drinks",
      "Flavored Water",
      "Health Drinks",
      "Juices",
      "Mocktail & Cocktail Mixes",
      "Packaged Water",
      "Soft Drinks",
      "Tea & Coffee",
    ],
  },
  {
    category: "Dairy & Bakery",
    subCategories: [
      "Breads & Buns",
      "Cakes & Pastries",
      "Cheese & Butter",
      "Cookies & Biscuits",
      "Eggs",
      "Frozen Desserts & Ice Creams",
      "Milk & Milk Products",
      "Paneer & Cream",
      "Puff Pastries & Croissants",
      "Yogurt & Curd",
    ],
  },
  {
    category: "Electronics",
    subCategories: [
      "Cameras & Accessories",
      "Headphones & Earphones",
      "Home Appliances",
      "Kitchen Appliances",
      "Mobile Accessories",
      "Smartphones",
      "Televisions",
      "Wearable Devices",
    ],
  },
  {
    category: "Fruits & Vegetables",
    subCategories: [
      "Cut & Ready-to-Cook Vegetables",
      "Exotic Fruits",
      "Exotic Vegetables",
      "Fresh Fruits",
      "Fresh Vegetables",
      "Frozen Fruits & Vegetables",
      "Herbs & Microgreens",
      "Organic Produce",
      "Sprouts",
    ],
  },
  {
    category: "Frozen Foods",
    subCategories: [
      "Frozen Berries & Fruits",
      "Frozen Desserts & Ice Creams",
      "Frozen Meat",
      "Frozen Parathas & Rotis",
      "Frozen Seafood",
      "Frozen Snacks (Samosa, Fries, etc.)",
      "Frozen Vegetables",
    ],
  },
  {
    category: "Gourmet & World Food",
    subCategories: [
      "Baking Ingredients",
      "Cheese & Exotic Dairy",
      "Gluten-Free Products",
      "Imported Snacks",
      "International Sauces & Dips",
      "Pasta & Noodles",
      "Ready-to-Eat Gourmet Meals",
      "Specialty Oils (Olive Oil, Avocado Oil, etc.)",
    ],
  },
  {
    category: "Health & Wellness",
    subCategories: [
      "Gluten-Free Products",
      "Health Drinks",
      "Keto Products",
      "Low-Carb Snacks",
      "Nutritional Supplements",
      "Organic & Ayurvedic Products",
      "Sugar-Free Products",
    ],
  },
  {
    category: "Household Items",
    subCategories: [
      "Air Fresheners",
      "Cleaning Supplies",
      "Detergents",
      "Disposable Plates & Cups",
      "Garbage Bags",
      "Kitchen Cleaners",
      "Mops & Cleaning Accessories",
      "Paper Products (Toilet Rolls, Tissues, etc.)",
      "Storage & Organizers",
      "Toilet Cleaners",
    ],
  },
  {
    category: "Meat & Seafood",
    subCategories: [
      "Cold Cuts",
      "Fresh Chicken",
      "Fresh Fish",
      "Fresh Mutton",
      "Frozen Meat & Seafood",
      "Marinated Meat",
      "Processed Meat",
      "Ready-to-Cook Meat",
      "Shellfish (Crabs, Prawns, etc.)",
    ],
  },
  {
    category: "Organic & Specialty Products",
    subCategories: [
      "Eco-Friendly Cleaning Products",
      "Organic Fruits & Vegetables",
      "Organic Grains & Pulses",
      "Organic Snacks",
      "Superfoods (Quinoa, Chia Seeds, etc.)",
      "Vegan Products",
    ],
  },
  {
    category: "Packaged Food",
    subCategories: [
      "Baking Essentials",
      "Cereals & Breakfast Mixes",
      "Energy & Health Mixes",
      "Instant Noodles & Pasta",
      "Ketchup & Mustard",
      "Pickles & Chutneys",
      "Ready-to-Eat Meals",
      "Sauces & Spreads",
      "Snacking Nuts & Seeds",
      "Frozen Meals",
    ],
  },
  {
    category: "Personal Care",
    subCategories: [
      "Bath & Body",
      "Feminine Hygiene Products",
      "Fragrances & Deodorants",
      "Hand Wash & Sanitizers",
      "Hair Care",
      "Men's Grooming",
      "Oral Care",
      "Sanitary Products",
      "Skin Care",
    ],
  },
  {
    category: "Pet Care",
    subCategories: [
      "Pet Accessories (Collars, Bowls, etc.)",
      "Pet Cleaning Products",
      "Pet Food",
      "Pet Grooming",
      "Pet Health Supplements",
      "Pet Toys",
    ],
  },
  {
    category: "Pooja Essentials",
    subCategories: [
      "Camphor",
      "Diyas & Candles",
      "Flowers & Garlands",
      "Havan Samagri",
      "Holy Books & Scriptures",
      "Incense Sticks",
      "Prayer Mats",
      "Pooja Thali Items",
    ],
  },
  {
    category: "Seasonal Items",
    subCategories: [
      "Festive Sweets & Snacks",
      "Gift Hampers",
      "Seasonal Fruits & Vegetables",
      "Summer Essentials (Juices, Ice Creams, etc.)",
      "Winter Essentials (Dry Fruits, Herbal Teas, etc.)",
    ],
  },
  {
    category: "Snacks",
    subCategories: [
      "Chips & Crisps",
      "Cookies & Biscuits",
      "Health & Protein Bars",
      "Instant Snacks",
      "Namkeen & Savories",
      "Packaged Juices",
      "Packaged Sweets",
      "Popcorn",
    ],
  },
  {
    category: "Staples",
    subCategories: [
      "Dry Fruits & Nuts",
      "Edible Oils & Ghee",
      "Flour & Atta",
      "Jaggery & Sweeteners",
      "Organic Staples",
      "Pulses (Dal, Lentils, etc.)",
      "Ready-to-Cook Curry Mixes",
      "Rice & Grains",
      "Salt & Sugar",
      "Spices & Masalas",
    ],
  },
  {
    category: "Stationery",
    subCategories: [
      "Art Supplies",
      "Calculators",
      "Craft Supplies",
      "Desk Organizers",
      "Files & Folders",
      "Notebooks & Diaries",
      "Office Supplies",
      "Pens & Pencils",
      "School Supplies",
    ],
  },
  {
    category: "Toys & Games",
    subCategories: [
      "Action Figures",
      "Board Games",
      "Building Blocks",
      "Dolls & Dollhouses",
      "Educational Toys",
      "Outdoor Toys",
      "Puzzles",
      "Remote Control Toys",
      "Soft Toys",
      "Vehicle Toys",
    ],
  },
];

export const units = [
  "kg",
  "gram",
  "litre",
  "ml",
  "piece",
  "carton",
  "bottle",
  "can",
  "jar",
  "dozen",
  "box",
  "packet",
  "bag",
];

export const taxSlabs = [
  {
    id: 1,
    name: "GST 0%",
    rate: 0,
    description:
      "Exempt from tax, generally applies to export goods and essential items.",
  },
  {
    id: 2,
    name: "GST 3%",
    rate: 3,
    description:
      "Special rate for certain items such as job work or agriculture products.",
  },
  {
    id: 3,
    name: "GST 5% ",
    rate: 5,
    description: "Special rate for mobile phone products.",
  },
  {
    id: 4,
    name: "GST 10%",
    rate: 10,
    description:
      "Special rate for specific services, including low-cost services.",
  },
  {
    id: 5,
    name: "GST 12% ",
    rate: 12,
    description: "Special rate for hotel accommodation with a higher tariff.",
  },
  {
    id: 6,
    name: "GST 18%",
    rate: 18,
    description:
      "Standard rate for most goods and services, including electronics.",
  },
  {
    id: 7,
    name: "GST 20%",
    rate: 20,
    description:
      "Applies on select goods and services like high-end electronics and luxury services.",
  },

  {
    id: 8,
    name: "GST 28%",
    rate: 28,
    description: "Applicable on tobacco products and similar items.",
  },
  {
    id: 9,
    name: "GST 40%",
    rate: 40,
    description: "Applicable on luxury cars and aerated drinks.",
  },
];

export const expenseTypes = [
  { category: "Electricity" },
  { category: "Insurance" },
  { category: "Internet" },
  { category: "Legal" },
  { category: "Logistics" },
  { category: "Maintenance" },
  { category: "Marketing" },
  { category: "Office Supplies" },
  { category: "Petty Expense" },
  { category: "Rent" },
  { category: "Salary" },
  { category: "Travel" },
  { category: "Miscellaneous" },
];

export const expenseCategoryColors = {
  electricity: { bg: "bg-yellow-500/10", border: "border-yellow-400", text: "text-yellow-500" },
  insurance: { bg: "bg-blue-500/10", border: "border-blue-400", text: "text-blue-500" },
  internet: { bg: "bg-purple-500/10", border: "border-purple-400", text: "text-purple-500" },
  legal: { bg: "bg-red-500/10", border: "border-red-400", text: "text-red-500" },
  logistics: { bg: "bg-green-500/10", border: "border-green-400", text: "text-green-500" },
  maintenance: { bg: "bg-gray-500/10", border: "border-gray-400", text: "text-gray-500" },
  marketing: { bg: "bg-orange-500/10", border: "border-orange-400", text: "text-orange-500" },
  "office supplies": { bg: "bg-teal-500/10", border: "border-teal-400", text: "text-teal-500" },
  "petty expense": { bg: "bg-pink-500/10", border: "border-pink-400", text: "text-pink-500" },
  rent: { bg: "bg-indigo-500/10", border: "border-indigo-400", text: "text-indigo-500" },
  salary: { bg: "bg-cyan-500/10", border: "border-cyan-400", text: "text-cyan-500" },
  travel: { bg: "bg-red-500/10", border: "border-red-400", text: "text-red-500" },
  miscellaneous: { bg: "bg-lime-500/10", border: "border-lime-400", text: "text-lime-500" },
  // Default for undefined categories
  default: { bg: "bg-gray-500/10", border: "border-gray-400", text: "text-gray-500" },
};

export const pluralizeWord = (count, word) => {
  // Handle words ending in "y"
  if (word.endsWith("y") && !/[aeiou]y$/i.test(word)) {
    return count === 1 ? word : word.slice(0, -1) + "ies";
  }
  // Handle words ending in "s", "sh", "ch", "x", "z"
  else if (/(s|ss|sh|ch|x|z)$/i.test(word)) {
    return count === 1 ? word : word + "es";
  }
  // Handle words ending in "f" or "fe"
  else if (/(f|fe)$/i.test(word)) {
    return count === 1 ? word : word.replace(/f(e)?$/, "ves");
  }
  // Handle words ending in "o"
  else if (/o$/i.test(word)) {
    return count === 1
      ? word
      : word + (/(photo|piano|zero)$/i.test(word) ? "s" : "es");
  }
  // Default case: just add "s"
  return count === 1 ? word : word + "s";
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const formatDateIntl = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const parseDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatHeight = (unit, value) => {
  if (unit === "gm" || unit === "ml") {
    return value / 1000;
  } else {
    return value * 3;
  }
};

export const getAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getColor = (height) => {
  if (height <= 20) return "#FF0000f1";
  if (height <= 40) return "#FF4500f1";
  if (height <= 60) return "#FFA500f1";
  if (height <= 80) return "#FFD700f1";
  if (height <= 100) return "#FFFF00f1";
  if (height <= 120) return "#ADFF2Ff1";
  if (height <= 140) return "#7FFF00f1";
  if (height <= 160) return "#32CD32f1";
  if (height <= 180) return "#00CC00a2";
  return "#006400f1";
};

export const formatExpiryColor = (expiry) => {
  const diff = new Date(expiry) - new Date();

  // If expiry is more than a month away, return "inherit"
  if (diff > 2592000000) return "inherit";

  if (diff <= 2592000000 && diff > 1209600000) return "#FFD700f1"; // This month
  if (diff <= 1209600000 && diff > 604800000) return "#FFA500f1"; // Less than two weeks
  if (diff <= 604800000 && diff > 0) return "#FF0000ff"; // This week
  if (diff < 0) return "#FF4500f1"; // Expired

  return "inherit";
};

export const autoSetConversionFactor = (primaryUnit, secondaryUnit) => {
  if (primaryUnit === "kg" && secondaryUnit === "gram") return 1000;
  if (primaryUnit === "litre" && secondaryUnit === "ml") return 1000;
  if (primaryUnit === "dozen" && secondaryUnit === "piece") return 12;
  if (primaryUnit == secondaryUnit) return 1;
  return 1;
};

export const isMergable = (inventory) => {
  const { batches } = inventory;
  if (batches && batches?.length < 2) return false;

  // Compare all batches with each other
  for (let i = 0; i < batches?.length; i++) {
    for (let j = i + 1; j < batches?.length; j++) {
      const batchA = batches[i];
      const batchB = batches[j];

      // Check if selling rates are equal
      const isSellingRateEqual = batchA.sellingRate === batchB.sellingRate;

      const isMRPEqual = !batchA.mrp || !batchB.mrp || batchA.mrp == batchB.mrp;

      // Check if expiries are compatible
      const isExpiryCompatible =
        !batchA.expiry || !batchB.expiry || batchA.expiry === batchB.expiry;

      // If both conditions are met, batches are mergable
      if (isSellingRateEqual && isExpiryCompatible && isMRPEqual) {
        return true;
      }
    }
  }

  return false;
};

export const getMonthName = (date) => {
  // If date is not provided, return current month
  const monthNumber = date ? date.split("-")[0] : new Date().getMonth() + 1;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[monthNumber - 1]}-${date.split("-")[1]}`;
};
