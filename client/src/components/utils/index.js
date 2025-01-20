import { AiFillProduct } from "react-icons/ai";
import { BsInboxesFill } from "react-icons/bs";
import { FaChartLine, FaHome, FaShoppingCart, FaStore } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";

export const links = [
  {
    icon: FaHome,
    title: "Home",
    to: "/",
    protected : true,
  },
  {
    icon: FaChartLine,
    title: "Sales",
    to: "/sales",
    protected : false,
  },
  {
    icon: FaShoppingCart,
    title: "Purchases",
    to: "/purchases",
    protected : true,
  },
  {
    icon: AiFillProduct,
    title: "Products",
    to: "/products",
    protected : true,
  },
  {
    icon: BsInboxesFill,
    title: "Inventory",
    to: "/inventory",
    protected : false,
  },
  {
    icon: FaStore,
    title: "Suppliers",
    to: "/suppliers",
    protected : true,
  },
  {
    icon: BiSolidReport,
    title: "Reports",
    to: "/reports",
    protected : true,
  },
];

export const categories = [
  {
    category: "Fruits & Vegetables",
    subCategories: [
      "Fresh Fruits",
      "Fresh Vegetables",
      "Exotic Fruits",
      "Exotic Vegetables",
      "Herbs & Microgreens",
      "Organic Produce",
      "Cut & Ready-to-Cook Vegetables",
      "Sprouts",
      "Frozen Fruits & Vegetables",
    ],
  },
  {
    category: "Dairy & Bakery",
    subCategories: [
      "Milk & Milk Products",
      "Cheese & Butter",
      "Paneer & Cream",
      "Eggs",
      "Yogurt & Curd",
      "Breads & Buns",
      "Cakes & Pastries",
      "Cookies & Biscuits",
      "Puff Pastries & Croissants",
      "Frozen Desserts & Ice Creams",
    ],
  },
  {
    category: "Meat & Seafood",
    subCategories: [
      "Fresh Chicken",
      "Fresh Mutton",
      "Fresh Fish",
      "Shellfish (Crabs, Prawns, etc.)",
      "Processed Meat",
      "Cold Cuts",
      "Frozen Meat & Seafood",
      "Marinated Meat",
      "Ready-to-Cook Meat",
    ],
  },
  {
    category: "Snacks",
    subCategories: [
      "Chips & Crisps",
      "Popcorn",
      "Namkeen & Savories",
      "Cookies & Biscuits",
      "Packaged Juices",
      "Packaged Sweets",
      "Health & Protein Bars",
      "Instant Snacks",
    ],
  },
  {
    category: "Staples",
    subCategories: [
      "Rice & Grains",
      "Flour & Atta",
      "Pulses (Dal, Lentils, etc.)",
      "Edible Oils & Ghee",
      "Salt & Sugar",
      "Spices & Masalas",
      "Ready-to-Cook Curry Mixes",
      "Organic Staples",
      "Dry Fruits & Nuts",
      "Jaggery & Sweeteners",
    ],
  },
  {
    category: "Packaged Food",
    subCategories: [
      "Instant Noodles & Pasta",
      "Cereals & Breakfast Mixes",
      "Ready-to-Eat Meals",
      "Frozen Meals",
      "Sauces & Spreads",
      "Pickles & Chutneys",
      "Baking Essentials",
      "Ketchup & Mustard",
      "Snacking Nuts & Seeds",
      "Energy & Health Mixes",
    ],
  },
  {
    category: "Beverages",
    subCategories: [
      "Tea & Coffee",
      "Soft Drinks",
      "Juices",
      "Energy Drinks",
      "Flavored Water",
      "Packaged Water",
      "Health Drinks",
      "Mocktail & Cocktail Mixes",
    ],
  },
  {
    category: "Personal Care",
    subCategories: [
      "Skin Care",
      "Hair Care",
      "Oral Care",
      "Bath & Body",
      "Men's Grooming",
      "Sanitary Products",
      "Fragrances & Deodorants",
      "Hand Wash & Sanitizers",
      "Feminine Hygiene Products",
    ],
  },
  {
    category: "Household Items",
    subCategories: [
      "Cleaning Supplies",
      "Detergents",
      "Paper Products (Toilet Rolls, Tissues, etc.)",
      "Kitchen Cleaners",
      "Toilet Cleaners",
      "Air Fresheners",
      "Mops & Cleaning Accessories",
      "Garbage Bags",
      "Storage & Organizers",
      "Disposable Plates & Cups",
    ],
  },
  {
    category: "Baby Care",
    subCategories: [
      "Baby Food & Formula",
      "Diapers & Wipes",
      "Baby Bath & Skin Care",
      "Feeding Essentials",
      "Baby Toys",
      "Baby Health & Safety",
      "Baby Cleaning Supplies",
      "Baby Gift Sets",
    ],
  },
  {
    category: "Frozen Foods",
    subCategories: [
      "Frozen Vegetables",
      "Frozen Snacks (Samosa, Fries, etc.)",
      "Frozen Desserts & Ice Creams",
      "Frozen Meat",
      "Frozen Seafood",
      "Frozen Berries & Fruits",
      "Frozen Parathas & Rotis",
    ],
  },
  {
    category: "Health & Wellness",
    subCategories: [
      "Nutritional Supplements",
      "Health Drinks",
      "Gluten-Free Products",
      "Keto Products",
      "Organic & Ayurvedic Products",
      "Sugar-Free Products",
      "Low-Carb Snacks",
    ],
  },
  {
    category: "Pet Care",
    subCategories: [
      "Pet Food",
      "Pet Grooming",
      "Pet Toys",
      "Pet Cleaning Products",
      "Pet Health Supplements",
      "Pet Accessories (Collars, Bowls, etc.)",
    ],
  },
  {
    category: "Baking & Desserts",
    subCategories: [
      "Flours & Baking Mixes",
      "Chocolates & Cocoa",
      "Essences & Food Colors",
      "Toppings & Sprinkles",
      "Cake Decorations",
      "Whipping Cream & Fillings",
      "Frozen Pastries & Desserts",
    ],
  },
  {
    category: "Pooja Essentials",
    subCategories: [
      "Incense Sticks",
      "Camphor",
      "Diyas & Candles",
      "Flowers & Garlands",
      "Pooja Thali Items",
      "Holy Books & Scriptures",
      "Prayer Mats",
      "Havan Samagri",
    ],
  },
  {
    category: "Gourmet & World Food",
    subCategories: [
      "International Sauces & Dips",
      "Imported Snacks",
      "Cheese & Exotic Dairy",
      "Specialty Oils (Olive Oil, Avocado Oil, etc.)",
      "Pasta & Noodles",
      "Baking Ingredients",
      "Ready-to-Eat Gourmet Meals",
      "Gluten-Free Products",
    ],
  },
  {
    category: "Organic & Specialty Products",
    subCategories: [
      "Organic Fruits & Vegetables",
      "Organic Grains & Pulses",
      "Organic Snacks",
      "Superfoods (Quinoa, Chia Seeds, etc.)",
      "Vegan Products",
      "Eco-Friendly Cleaning Products",
    ],
  },
  {
    category: "Seasonal Items",
    subCategories: [
      "Festive Sweets & Snacks",
      "Gift Hampers",
      "Seasonal Fruits & Vegetables",
      "Winter Essentials (Dry Fruits, Herbal Teas, etc.)",
      "Summer Essentials (Juices, Ice Creams, etc.)",
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
  }
];

export const expenseTypes = [
  "Electricity",
  "Insurance",
  "Internet",
  "Legal",
  "Logistics",
  "Maintenance",
  "Marketing",
  "Office Supplies",
  "Petty Expense",
  "Rent",
  "Salary",
  "Travel",
  "Miscellaneous"
];

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

export const formatHeight = (unit, value) => {
  if (unit === "gm" || unit === "ml") {
    return value / 1000;
  } else {
    return value * 3;
  }
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
