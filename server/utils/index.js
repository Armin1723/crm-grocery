const roundToTwo = (num) => Math.round(num * 100) / 100;

const roles = {
  admin: ["products", "inventory", "sales", "purchases", "suppliers", "employees", "reports"],
  seller: ["sales", "purchases", "inventory"],
};

module.exports = {
  roundToTwo,
  roles,
};
