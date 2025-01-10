import { formatDate } from "../utils";

const SalesTable = ({ data = {}, title = "" }) => {
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
                  Customer
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
                  }`}
                >
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    {formatDate(data?.createdAt)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    <span 
                      className={`border rounded-lg px-3 text-xs ${
                        title === "sales" ? "border-green-600 bg-green-500/20 text-green-500" : "border-red-400 bg-red-400/10 text-red-400"
                      }`}
                    >
                      {data?.category}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    {data?.customer || "Walk-in"}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    {data?.signedBy}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    ₹{data?.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="text-[var(--color-text-light)] p-3 bg-[var(--color-primary)] capitalize">
                <td colSpan={3} className="w-full p-3">
                  Total {title}: {data?.length}
                </td>
                <td colSpan={2} className="text-right px-3">
                  Total Amount: ₹
                  {data?.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
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

export default SalesTable;
