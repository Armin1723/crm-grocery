import React from "react";
import { formatDate } from "../utils";

const CustomerPaymentForm = ({ customer }) => {
  const [sales, setSales] = React.useState([]);

  React.useEffect(() => {
    const fetchPendingSales = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/customers/${
            customer?._id
          }/sales?pending=true`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching the sales");
        }
        const data = await response.json();
        setSales(data.sales);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPendingSales();
  }, []);

  return (
    <div className="flex flex-col ">
      <p>Balance: {customer?.balance}</p>

      {sales.length > 0 && (
        <div>
          <p>Pending Sales:</p>
          <table className="w-full">
            <th>
                
            </th>
            {sales.map((sale, index) => (
              <tr
                key={index}
                className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
              >
                <td className="p-3 truncate text-ellipsis max-w-[100px]">
                  {sale?._id}
                </td>
                <td className="p-3 min-w-[80px]">
                  {formatDate(sale?.createdAt)}
                </td>
                <td className="p-3">₹{sale?.totalAmount}</td>
                <td className="p-3">
                  ₹{sale?.paidAmount || sale?.totalAmount}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      sale?.deficitAmount > 0
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    {sale?.deficitAmount > 0 ? "Pending" : "Paid"}
                  </span>
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerPaymentForm;
