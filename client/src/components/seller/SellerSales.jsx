import React from 'react'
import ChipNav from '../utils/ChipNav'
import { FaChartLine, FaPlus } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

const SellerSales = () => {
    const chipData = [
        {
          label: "Sales",
          icon: FaChartLine,
          to: "/seller",
        },
        {
          label: "Add Sale",
          icon: FaPlus,
          to: "/seller/sales/add",
        },
      ];
  return (
    <div className='flex flex-col rounded-md bg-[var(--color-sidebar)] select-none p-2 border border-neutral-500/50 flex-1 w-full overflow-y-auto'>
      <ChipNav chips={chipData} baseUrl='/seller/sales' />
      <Outlet />
    </div>
  )
}

export default SellerSales
