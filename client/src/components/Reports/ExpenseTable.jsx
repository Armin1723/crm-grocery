import { Link } from "react-router-dom";
import { formatDate } from "../utils";

const ExpenseTable = ({ expenses }) => {
  return (
    <div className="bg-[var(--color-card)] shadow rounded-lg overflow-hidden p-2">
      <h2 className="text-xl font-bold p-6 border-b border-neutral-500/50">
        Expense Details
      </h2>
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
            {expenses?.map((expense, index) => (
              <tr key={index} className={`${index % 2 !== 0 && "bg-[var(--color-primary)]"}`}>
                <td className="px-6 py-2 whitespace-nowrap text-sm ">
                  {formatDate(expense?.createdAt)}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm ">
                  {expense?.category}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm ">
                  <Link to={`/suppliers/${expense.supplierId}`}>
                    {expense?.supplier}
                  </Link>
                </td>
                <td className="w-full px-6 py-2 whitespace-nowrap text-sm ">
                  {expense?.signedBy}
                </td>
                <td className="w-full px-6 py-2 whitespace-nowrap text-sm ">
                  ₹{expense?.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="text-[var(--color-text-light)] p-3 bg-[var(--color-primary)]">
              <td colSpan={3} className="w-full p-3">
                Total Expenses: {expenses?.length}
              </td>
              <td colSpan={2} className="text-right">
                Total Amount: ₹
                {expenses
                  ?.reduce((acc, curr) => acc + curr.amount, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
