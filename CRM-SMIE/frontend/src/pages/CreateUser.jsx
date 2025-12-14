import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUserPlus } from "react-icons/fi";
import { Link } from 'react-router-dom';
import {postUser} from '../redux/userSlice.jsx'
import axiosInstance from '../api/axiosInstance.jsx';
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast';
import { fetchEngineersWithTaskCount } from '../api/fetchdata.jsx';
import { setEngineerTaskCounts } from '../redux/leadSlice.jsx';

const CreateUser = () => {

    const dispatch = useDispatch()

    const [newUser,setNewUser] = useState({name:"",email:"",password:"",role:"",phoneNum: ""})

    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const validatePass = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/
        return regex.test(password)
    }

    const addUser = async (newUser) => {
        if(!validateEmail(newUser.email)){
            toast.error('Please enter valid email address')
            return false;
        }
        if(!validatePass(newUser.password)){
            toast.error("Password must be at least 6 chars with 1 uppercase and 1 number")
            return false;
        }
        setLoading(true)
        try{
            const {data} = await axiosInstance.post('/users',newUser)
            dispatch(postUser(data))
            const engineersWithTaskCount = await fetchEngineersWithTaskCount();
            dispatch(setEngineerTaskCounts(engineersWithTaskCount));
            toast.success(data.message)
            setTimeout(() => {
                navigate('/users')
            }, 1000);
        }catch(err){
            if(err.response && err.response.data && err.response.data.message){
                toast.error(err.response.data.message)
            }else{
                toast.error('Something went wrong')
            }
        }finally{
            setLoading(false)
        }
    }

  return (
    <div>

        <div className='md:mt-4'>
            <div><Link to='/' className='hover:text-[#C2410C]'>Dashboard</Link> / <Link className='hover:text-[#C2410C]' to='/users'>Users</Link> / <span className='text-[#C2410C]'>Create User</span></div>
        </div>

        <div className='flex items-center justify-center'>

            <div className='shadow-md rounded-xl bg-white lg:w-2xl md:w-lg mt-2 md:mt-5 lg:mt-5 xl:mt-0 w-auto'>

                <div className='bg-[#FB6514] rounded-t-xl px-6 py-2 md:py-8 text-white font-semibold'> 

                    <div className='flex gap-4 items-center'>
                        <div className='w-10 h-10 rounded-sm bg-[#FA7F2E] flex items-center justify-center'><FiUserPlus size={25}/></div>
                        <p className='text-xl md:text-2xl font-semibold'>Create New User</p>
                    </div>

                </div>

                <div className='flex flex-col gap-2 p-6'>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="un">User Name</label>
                        <input value={newUser?.name} onChange={(e)=>setNewUser({...newUser,name: e.target.value})} type="text" id='un' className='border border-gray-300 rounded-md px-4 py-3 focus:border-[#FB6514] outline-none' placeholder='Enter username' />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="em">Email</label>
                        <input value={newUser?.email} pattern='' onChange={(e)=>setNewUser({...newUser,email: e.target.value})} type="email" id='em' className='border border-gray-300 rounded-md px-4 py-3 focus:border-[#FB6514] outline-none' placeholder='Enter email' />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="mn">Mobile Number</label>
                        <input value={newUser?.phoneNum} onChange={(e)=>setNewUser({...newUser,phoneNum: e.target.value})} type="number" id='mn' className='border border-gray-300 rounded-md px-4 py-3 focus:border-[#FB6514] outline-none' placeholder='Enter mobile number' />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="ur">User Role</label>
                        <select value={newUser?.role} onChange={(e)=>setNewUser({...newUser,role: e.target.value})} name="userRole" id="ur" className='border border-gray-300 rounded-md px-4 py-3 focus:border-[#FB6514] outline-none'>
                            <option value="">select user role</option>
                            {/* <option value="Super Admin">Super Admin</option> */}
                            <option value="Coordinator">Coordinator</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="pa">Password</label>
                        <input value={newUser?.password} onChange={(e)=>setNewUser({...newUser,password: e.target.value})} type="password" id='pa' className='border border-gray-300 rounded-md px-4 py-3 focus:border-[#FB6514] outline-none' placeholder='Enter password' />
                    </div>

                    <div className={`bg-[#FB6514] mt-2 text-white px-4 py-3 rounded-md flex justify-center ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`} onClick={()=>!loading && addUser(newUser)}>
                        <button className='flex gap-3 items-center font-semibold cursor-pointer' > {loading ? "Creating..." : <><FiUserPlus /> Create User</>}</button>
                    </div>

                </div>

            </div>

        </div>

    </div>
  )
}

export default CreateUser