import React from "react";
import { formatDate } from "../utils";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const SupplierPaymentForm = ({
  supplier = {},
  closeModal = () => {},
  setRefetch = () => {},
}) => {

  const queryClient = useQueryClient();

  const { id: supplierId } = useParams();
  const [purchases, setPurchases] = React.useState([]);

  const [selectedPurchases, setSelectedPurchases] = React.useState([]);

  React.useEffect(() => {
    const fetchPendingPurchases = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/suppliers/${
            supplier?._id
          }/purchases?pending=true`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching pending purchases");
        }
        const data = await response.json();
        setPurchases(data.purchases);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPendingPurchases();
  }, []);

  const makePayment = async () => {
    const id = toast.loading("Processing payment...");
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/suppliers/${supplierId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purchases: selectedPurchases.map((purchase) => purchase._id),
            amount: selectedPurchases.reduce(
              (acc, purchase) => acc + purchase.deficitAmount,
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
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });  
      setSelectedPurchases([]);
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
        Balance: {supplier?.balance}
      </p>

      {purchases.length > 0 && (
        <div>
          <p className="font-medium">Pending Purchases:</p>
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-card)] border-b border-neutral-500/50 sticky top-0">
              <tr className="">
                <th className="p-3 text-left max-w-[100px]">ID</th>
                <th className="p-3 text-left pl-0 min-w-[80px]">Date</th>
                <th className="p-3 text-left pl-0">Total</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Balance</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-500/20 hover:bg-[var(--color-card)] hover:bg-opacity-60 cursor-pointer"
                >
                  <td className="p-3 truncate text-ellipsis max-w-[100px]">
                    {purchase?._id}
                  </td>
                  <td className="p-3 min-w-[80px]">
                    {formatDate(purchase?.createdAt)}
                  </td>
                  <td className="p-3">₹{purchase?.totalAmount}</td>
                  <td className="p-3">
                    ₹{purchase?.paidAmount || purchase?.totalAmount}
                  </td>
                  <td className="p-3">₹{purchase?.deficitAmount || 0}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        purchase?.deficitAmount > 0
                          ? "bg-orange-500/20 text-orange-500"
                          : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {purchase?.deficitAmount > 0 ? "Pending" : "Paid"}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      value={purchase?._id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPurchases((p) => [...p, purchase]);
                        } else {
                          setSelectedPurchases((p) =>
                            p.filter((selected) => selected._id !== purchase._id)
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
            disabled={selectedPurchases.length === 0}
            className="button bg-[var(--color-accent)] text-white text-sm w-full px-2 py-1 my-2 rounded-md disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-none hover:bg-accentDark"
          >
            Pay ₹
            {selectedPurchases.reduce((acc, purchase) => acc + purchase.deficitAmount, 0)}
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplierPaymentForm;
