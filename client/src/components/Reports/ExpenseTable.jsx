import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../utils";
import HoverCard from "../shared/HoverCard";
import PurchaseDetails from "../purchases/PurchaseDetails";

const ExpenseTable = ({ title = "", data }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[var(--color-card)] shadow rounded-lg overflow-hidden p-2">
      <h2 className="text-xl font-bold p-6 border-b border-neutral-500/50 capitalize">
        {title} Details
      </h2>
      {data?.length > 0 ? (
        <div className="overflow-x-auto overflow-y-auto max-md:max-h-[60vh]">
          <table className="min-w-full divide-y divide-neutral-500/50 capitalize">
            <thead className="bg-[var(--color-primary)] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Signed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-card)] divide-y divide-neutral-500/50 text-[var(--color-text-light)]">
              {data?.map((data, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 !== 0 && "bg-[var(--color-primary)]"
                  } ${data?.category === "purchase" && "cursor-pointer"}`}
                  onClick={() => navigate(`/purchases/${data?.purchaseId || data?._id}`)}
                >
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    {(data.category === "purchase" || data.category === 'return') ? (
                      <HoverCard title={formatDate(data?.createdAt)}>
                        <PurchaseDetails purchase={data} idBackup={data?.purchaseId || data?._id} />
                      </HoverCard>
                    ) : (
                      formatDate(data?.createdAt)
                    )}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    <span
                      className={`px-3 rounded-lg border text-xs cursor-pointer ${
                        data?.category === "purchase"
                          ? "bg-yellow-400/20 text-yellow-500 border-yellow-400 hover:bg-yellow-400/30"
                          : "bg-blue-400/20 border-blue-400 text-blue-400 hover:bg-blue-400/30"
                      }`}
                    >
                      {data?.category}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    <Link to={`/suppliers/${data.supplierId}`}>
                      {data?.supplier}
                    </Link>
                  </td>
                  <td className="w-full px-6 py-2 whitespace-nowrap text-sm ">
                    {data?.signedBy}
                  </td>
                  <td className="w-full px-6 py-2 whitespace-nowrap text-sm ">
                    ₹{data?.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="text-[var(--color-text-light)] p-3 bg-[var(--color-primary)]">
                <td colSpan={3} className="w-full p-3">
                  Total Expenses: {data?.length}
                </td>
                <td colSpan={2} className="text-right">
                  Total Amount: ₹
                  {data?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-6 capitalize">No {title} found.</div>
      )}
    </div>
  );
};

export default ExpenseTable;
