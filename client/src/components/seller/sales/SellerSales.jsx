import React from 'react'
import { Outlet } from 'react-router-dom';

const SellerSales = () => {
  return (
    <div className='flex flex-col rounded-md bg-[var(--color-sidebar)] select-none p-2 flex-1 w-full h-full gap-3 overflow-y-auto overflow-x-hidden'>
      <Outlet />
    </div>
  )
}

export default SellerSales
