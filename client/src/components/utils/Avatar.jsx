import React from 'react'

const Avatar = ({image}) => {
  return (
    <img 
      src={image || 'https://github.com/shadcn.png'} alt="avatar" loading='lazy' className="w-12 bg-[var(--bg-primary)] max-sm:w-8 aspect-square rounded-full border border-black shadow-md" />
  )
}

export default Avatar
