import { formatDate } from "../utils";
import HoverCard from "../shared/HoverCard";
import Avatar from "../utils/Avatar";

const ProductTable = ({ data = [] }) => {
  return (
    <div className="bg-[var(--color-card)] shadow rounded-lg overflow-hidden p-2 flex flex-col gap-2 overflow-y-auto overflow-x-auto">
      <h2 className="text-xl font-bold p-6 border-b border-neutral-500/50 capitalize">
        Product Details
      </h2>
      <div className="overflow-x-auto overflow-y-auto max-md:max-h-[20vh]">
        <table className="min-w-full max-w-full divide-y divide-neutral-500/50 capitalize">
          <thead className="bg-[var(--color-primary)] sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Image
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider min-w-[150px]">
                Quantity
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider min-w-[150px]">
                Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Tax Rate
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider min-w-[150px]">
                Tax Amount
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
                <td className="px-3 py-2 whitespace-nowrap text-sm ">
                  <Avatar
                    image={data?.image}
                    withBorder={false}
                    fallbackImage="./utils/product-placeholder.png"
                    width={24}
                    alt={data?.name}
                  />
                </td>
                <td className="px-3 py-2 max-w-[100px] text-sm text-ellipsis truncate">
                  {data?.name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm min-w-[150px]">
                  {data?.quantity} {data?.secondaryUnit}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm min-w-[150px]">
                  ₹{Math.round(data?.rate * data?.quantity)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm ">
                  {data.tax}%
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm min-w-[150px]">
                  ₹{data?.taxAmount}
                </td>
              </tr>
            ))}
            <tr className="text-[var(--color-text-light)] p-3 bg-[var(--color-primary)] capitalize">
              <td colSpan={3} className="w-full p-3">
                Total Products: {data?.length}
              </td>
              <td colSpan={3} className="text-right px-3">
                Total Tax: ₹
                {data
                  ?.reduce((acc, curr) => acc + curr?.taxAmount, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaxTable = ({ data = {}, title = "" }) => {
  return (
    <div className="bg-[var(--color-card)] shadow rounded-lg overflow-hidden p-2">
      <h2 className="text-xl font-bold p-6 border-b border-neutral-500/50 capitalize">
        {title} Details
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
                  Tax
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
                    <HoverCard title={`${data?._id.slice(0, 15)}...`}>
                      <ProductTable data={data?.products} />
                    </HoverCard>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    ₹{Math.round(data?.totalAmount)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm ">
                    ₹{(data?.totalTax).toFixed(2)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm min-w-[150px]">
                    {data?.signedBy}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm min-w-[150px]">
                    {formatDate(data?.createdAt)}
                  </td>
                </tr>
              ))}
              <tr className="text-[var(--color-text-light)] p-3 bg-[var(--color-primary)] capitalize">
                <td colSpan={3} className="w-full p-3">
                  Total Transactions: {data?.length}
                </td>
                <td colSpan={2} className="text-right px-3">
                  Total Amount: ₹
                  {data
                    ?.reduce((acc, curr) => acc + curr?.totalTax, 0)
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

export default TaxTable;
