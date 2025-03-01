import React from "react";
import { formatDate } from "../utils";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CustomerPaymentForm = ({
  customer = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {
  const queryClient = useQueryClient();

  const { id: customerId } = useParams();
  const [sales, setSales] = React.useState([]);

  const [selectedSales, setSelectedSales] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchPendingSales = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchPendingSales();
  }, []);

  const makePayment = async () => {
    const id = toast.loading("Processing payment...");
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/customers/${customerId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sales: selectedSales.map((sale) => sale._id),
            amount: selectedSales.reduce(
              (acc, sale) => acc + sale.deficitAmount,
              0
            ),
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      toast.update(id, {
        render: "Payment successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedSales([]);
      setRefetch((prev) => !prev);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.update(id, {
        render: "Payment failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="w-full p-4 bg-[var(--color-primary)] rounded-md font-medium">
        Balance: {customer?.balance}
      </p>

      {sales.length > 0 && !loading && (
        <div>
          <p className="font-medium">Pending Sales:</p>
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-card)] border-b border-neutral-500/50 sticky top-0">
              <tr className="">
                <th className="p-3 text-left max-w-[100px]">ID</th>
                <th className="p-3 text-left min-w-[80px]">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Balance</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
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
                  <td className="p-3">₹{sale?.deficitAmount || 0}</td>
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
                  <td className="p-3">
                    <input
                      type="checkbox"
                      value={sale?._id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSales((p) => [...p, sale]);
                        } else {
                          setSelectedSales((p) =>
                            p.filter((selected) => selected._id !== sale._id)
                          );
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={makePayment}
            disabled={selectedSales.length === 0}
            className="button bg-[var(--color-accent)] text-white text-sm w-full px-2 py-1 my-2 rounded-md disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-none hover:bg-accentDark"
          >
            Pay ₹
            {selectedSales.reduce((acc, sale) => acc + sale.deficitAmount, 0)}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center w-full">
          <div className="spinner" />
        </div>
      )}

    </div>
  );
};

export default CustomerPaymentForm;
