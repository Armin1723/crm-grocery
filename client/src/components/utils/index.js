import { AiFillProduct } from "react-icons/ai";
import { BsInboxesFill } from "react-icons/bs";
import { FaChartLine, FaHome, FaShoppingCart, FaStore } from "react-icons/fa";

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
  {
    icon: FaStore,
    title: "Suppliers",
    to: "/suppliers",
  }
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
  "dozen",
  "box",
  "packet",
  "bag",
];

export const taxSlabs = [
  {
    name: "GST 5%",
    rate: 5,
  },
  {
    name: "GST 12%",
    rate: 12,
  },
  {
    name: "GST 18%",
    rate: 18,
  },
  {
    name: "GST 28%",
    rate: 28,
  }
]

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
  if(!date) return '';
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const getColor = (height) => {
  if (height <= 20) return '#FF0000ab'; 
  if (height <= 40) return '#FF4500ab'; 
  if (height <= 60) return '#FFA500ab'; 
  if (height <= 80) return '#FFD700ab'; 
  if (height <= 100) return '#FFFF00ab'; 
  if (height <= 120) return '#ADFF2Fab'; 
  if (height <= 140) return '#7FFF00ab'; 
  if (height <= 160) return '#32CD32ab'; 
  if (height <= 180) return '#008000ab'; 
  return '#006400ab'; 
};

export const autoSetConversionFactor = (primaryUnit, secondaryUnit) => {
  if (primaryUnit === "kg" && secondaryUnit === "gram") return 1000;
  if (primaryUnit === "litre" && secondaryUnit === "ml") return 1000;
  if (primaryUnit === "dozen" && secondaryUnit === "piece") return 12;
  if( primaryUnit == secondaryUnit) return 1;
  return 1;
}
