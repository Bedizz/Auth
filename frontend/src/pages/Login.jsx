import React, { useState } from 'react'
import {motion} from "framer-motion"
import { Lock,Mail, Loader} from "lucide-react"
import Input from '../components/Input'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const {login,error,isLoading} =useAuthStore()

  
  const handleSubmitForm = async(e) => {
    e.preventDefault();
    try {
      await login(email,password)
      toast.success("Logged in successfully")
    } catch (error) {
      toast.error("something went wrong")
    }
  }

  return (
<motion.div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to bg-emerald-500 text-transparent bg-clip-text'>Login</h2>
      <form onSubmit={handleSubmitForm}>
      
      <Input 
      icon={Mail}
      type="text"
      placeholder="Email"
      value={email}
      onChange={(e)=> setEmail(e.target.value)} />
      <Input 
      icon={Lock}
      type="text"
      placeholder="Password"
      value={password}
      onChange={(e)=> setPassword(e.target.value)} />
     
      {error && <p className='text-red-500 text-center font-bold'>{error}</p>}
      <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover: to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
      whileHover={{scale:1.02}}
      whileTap={{scale:0.98}}
      type='submit'
      disabled={isLoading}>
        
        {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto'/> : "Login"}
      </motion.button>
      </form>
      </div>
      <Link to={"/forgot-password"} className='text-sm text-green-400 hover:underline flex justify-start ml-10 mb-5'>Forgot your password?</Link>
      <div className='flex justify-center items-center px-8 py-4 bg-gray-900 bg-opacity-50  '>
        <p className='text-sm text-gray-400'>Don't have an account? {" "}
          <Link to={"/signup"}
          className='hover:underline text-green-400'>Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default Login
