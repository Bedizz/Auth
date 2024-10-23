import React from 'react'
import {motion} from "framer-motion"
import { useAuthStore } from '../store/authStore';
import {formatDate} from "../utils/date"
import toast from 'react-hot-toast';

const Dashboard = () => {
    const {user,logout} = useAuthStore()
    const handleLogout = () => {
        logout()
        toast.success("Logged out successfully")

    }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      
      className="max-w-md w-full mx-auto mt-10 p-8 ☐ bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg
rounded-x1 shadow-2x1 border ☐ border-gray-800"
    >
      <h2
        className="text-3x1 font-bold mb-6 text-center bg-gradient-to-r from-green-400 ☐ to-emerald-600
text-transparent bg-clip-text"
      >
        Dashboard
      </h2>
      <div className="space-y-6">
      <motion.div
className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.2 }} >
<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
<p className=' text-gray-300'>Name: {user.name}</p>
<p className=' text-gray-300'>Email: {user.email}</p>
</motion.div>
<motion.div
className='p-4 bg-gray-800 bg-opacity-50 rounded-1g border border-gray-700'
initial={{ opacity:0 , y: 20 }}
animate={{ opacity: 1, y:0}}
transition={{ delay: 0.4 }}>
<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
<p className=' text-gray-300'>
<span className='font-bold' >Joined: </span>
{new Date(user.createdAt).toLocaleDateString("de", {
year: "numeric",
month: "long",
day: "numeric",
})}
</p>
<p className=' text-gray-300'>
<span className='font-bold'>Last Login: </span>
{formatDate(user.lastLogin)}
</p>
</motion.div>
<motion.button
whileHover={{scale: 1.05}}
whileTap={{scale: 0.95}}
onClick={handleLogout} className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 hover:from-green-600 hover:to-green-900'>
Logout
</motion.button>
      </div>
    </motion.div>
  );
}

export default Dashboard
