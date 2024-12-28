# CRM Grocery

A modern Customer Relationship Management system designed specifically for grocery stores. Manage inventory, track sales, handle supplier relationships, and monitor customer interactions all in one place.

## Features

- **Inventory Management**
  - Track stock levels
  - Manage product categories
  - Set reorder points
  - Record expiry dates

- **Supplier Management**
  - Maintain supplier profiles
  - Track purchase orders
  - Monitor payment history
  - Handle supplier invoices

- **Sales Tracking**
  - Record transactions
  - Generate invoices
  - Track payment statuses
  - Monitor sales trends

- **Customer Management**
  - Store customer information
  - Track purchase history
  - Manage loyalty programs
  - Handle feedback

## Tech Stack

- React.js
- Node.js
- Express
- MongoDB
- TailwindCSS

## Installation

```bash
# Clone the repository
git clone https://github.com/Armin1723/crm-grocery.git

# Navigate to project directory
cd crm-grocery

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Project Structure

```
crm-grocery/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── utils/
│   └── App.jsx
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License

## Author

[Armin1723](https://github.com/Armin1723)
