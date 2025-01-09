import React from 'react'

const Footer = () => {
  return (
    <div className='w-full bg-[var(--color-sidebar)] text-center flex items-center justify-center min-h-[5vh] py-2 border-t border-neutral-500/50'>
      Digicrowd Solutions @{new Date().getFullYear()}. All rights reserved.
    </div>
  )
}

export default Footer
