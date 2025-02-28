import { useSelector } from "react-redux";
import { formatDate } from "../utils";
import { Link } from "react-router-dom";

const BalanceTable = ({ data = {}, title = "" }) => {
  const user = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";
  const baseUrl = isAdmin ? "" : "/seller";

  return (
    <div className="bg-[var(--color-card)] shadow rounded-lg overflow-hidden p-2">
      <h2 className="text-xl font-bold p-6 border-b border-neutral-500/50 capitalize">
        {title} Balance Details
      </h2>
      {data?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full max-w-full divide-y divide-neutral-500/50 capitalize">
            <thead className="bg-[var(--color-primary)] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  {title?.toLowerCase().includes("credit")
                    ? "Customer"
                    : "Supplier"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider min-w-[150px]">
                  Signed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider min-w-[150px]">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-card)] divide-y divide-neutral-500/50 text-[var(--color-text-light)]">
              {data?.map((data, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 !== 0 && "bg-[var(--color-primary)]"
                  } cursor-pointer`}
                >
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    <Link to={`${baseUrl}${
                        title.toLowerCase().includes("credit")
                          ? "/sales"
                          : "/purchases"
                      }/${data?._id}`}
                      className="text-accent hover:text-accentDark hover:underline text-ellipsis truncate">
                      {data?._id}
                    </Link>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    ₹{data?.totalAmount}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    ₹{data?.deficitAmount}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    {title?.toLowerCase().includes("credit")
                      ? data?.customer?.name
                      : data?.supplier?.name}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm min-w-[150px]">
                    {data?.signedByName}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm min-w-[150px]">
                    {formatDate(data?.createdAt)}
                  </td>
                </tr>
              ))}
              <tr className="text-[var(--color-text-light)] p-3 bg-[var(--color-primary)] capitalize">
                <td colSpan={4} className="w-full p-3">
                  Total Transactions: {data?.length}
                </td>
                <td colSpan={2} className="text-right px-3">
                  Total Amount: ₹
                  {data
                    ?.reduce((acc, curr) => acc + curr?.deficitAmount, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-6 capitalize">No {title} found</div>
      )}
    </div>
  );
};

export default BalanceTable;
