import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'

const Header = () => {
  const { profile } = useAuthStore()
  // console.log(profile);

  return (
    <div className='flex items-center gap-2'>
      <h1 className="text-2xl font-bold flex flex-wrap items-center gap-1">
        <span className='text-purple-700 text-3xl'>Hello,</span>
        <span className='text-3xl text-gray-700'>{profile?.personal?.first_name} 👋</span>
      </h1>
    </div>
  )
}

export default Header
