import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineIdentification } from "react-icons/hi2";
import { FaUserEdit } from "react-icons/fa";
import toast from 'react-hot-toast';
import { IoSendSharp } from "react-icons/io5";

const EditLead = () => {

    const [loading,setLoading] = useState(false)

    const [Qloading,setQloading] = useState(false)

    const navigate = useNavigate()

    const editLead = () => {
        setLoading(false)
        try{
            // navigate('/followup')
        }catch(err){
            console.log(err)
        }finally{
            setLoading(true)
        }
    }

    const sendEmail = () => {
        setQloading(false)
        try{
            // navigate('/followup')
        }catch(err){
            console.log(err)
        }finally{
            setQloading(true)
        }
    }

    const warn = (message) => {
        toast(message, {
            icon: "⚠️",
            style: {
            border: '1px solid #facc15',
            padding: '8px',
            color: '#92400e',
            background: '#fef9c3',
            },
        });
    };

    const disabledShow = () => {
        warn("The Created By field is read-only")
    }

    const sourceData = ['IndiaMart', 'Facebook', 'JustDial', 'LinkedIn', 'Website', 'Instagram', 'Email', 'Referral', 'Other']

  return (
    <div>
        {/* leads information */}
            <div className='flex md:flex-row md:justify-between flex-col'>
                <div className='flex flex-row gap-3'>
                    <HiOutlineIdentification size={40} className='bg-orange-100 text-orange-500 rounded p-2' />
                    <p className='text-xl md:text-2xl font-bold text-gray-500 mb-6'>Lead's Information</p>
                </div>
                <div className='flex flex-col md:flex-row md:gap-4'>
                    <div className={`bg-[#FB6514] mt-2 text-white px-4 py-3 rounded-md flex justify-center ${Qloading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`} onClick={()=>!Qloading && sendEmail()}>
                        <button className='flex gap-3 items-center font-semibold cursor-pointer' > {Qloading ? "Sending..." : <><IoSendSharp /> Send Quotation</>}</button>
                    </div>
                    <div className={`bg-[#FB6514] mt-2 text-white px-4 py-3 rounded-md flex justify-center ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`} onClick={()=>!loading && editLead()}>
                        <button className='flex gap-3 items-center font-semibold cursor-pointer' > {loading ? "Editing..." : <><FaUserEdit /> Update Lead</>}</button>
                    </div>
                </div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 space-x-5 space-y-4 mt-6 md:mt-0'>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="ln" className='text-md font-bold text-gray-500'>Lead Name: </label>
                    <input type="text" id='ln' value={"leads name1"} className='p-3 focus:outline-amber-400 cursor-pointer' />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="cb" className='text-md font-bold text-gray-500'>CreatedBy: </label>
                    <input type="text" id='cb' value={"creator name"} className='p-3 focus:outline-amber-400 cursor-pointer' disabled onMouseOver={disabledShow} />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="at" className='text-md font-bold text-gray-500'>AssignedTo: </label>
                    <select name="" id="at" className='p-3 w-40 me-11 focus:outline-amber-400 cursor-pointer'>
                        <option value="engineers">engineers</option>
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="pr" className='text-md font-bold text-gray-500'>Priority: </label>
                    <select name="" id="pr" className='w-40 p-3 me-11 focus:outline-amber-400 cursor-pointer'>
                        <option value="high">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="com" className='text-md font-bold text-gray-500'>Company Name: </label>
                    <input type="text" id='com' value={"ABC Company"} className='p-3 focus:outline-amber-400 cursor-pointer' />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="sta" className='text-md font-bold text-gray-500'>Status: </label>
                    <select name="" id="sta" className='p-3 w-40 me-11 focus:outline-amber-400 cursor-pointer'>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Quotation">Quotation</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="fn" className='text-md font-bold text-gray-500'>First Name: </label>
                    <input type="text" id='fn' value={"first name1"} className='p-3 focus:outline-amber-400 cursor-pointer' />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="lan" className='text-md font-bold text-gray-500'>Last Name: </label>
                    <input type="text" id='lan' value={"last name1"} className='p-3 focus:outline-amber-400 cursor-pointer' />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="em" className='text-md font-bold text-gray-500'>Email: </label>
                    <input type="email" id='em' value={"email1"} className='p-3 focus:outline-amber-400 cursor-pointer' />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="pn" className='text-md font-bold text-gray-500'>Phone Number: </label>
                    <input type="text" id='pn' value={"687979868"} className='p-3 focus:outline-amber-400 cursor-pointer' />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="co" className='text-md font-bold text-gray-500'>Country: </label>
                    <select name="" id="co" className='p-3 w-40 me-11 focus:outline-amber-400 cursor-pointer'>
                        <option value="countries">countries</option>
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center '>
                    <label htmlFor="st" className='text-md font-bold text-gray-500'>State: </label>
                    <select name="" id="st" className='p-3 w-40 me-11 focus:outline-amber-400 cursor-pointer'>
                        <option value="states">states</option>
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="ct" className='text-md font-bold text-gray-500'>City: </label>
                    <select name="" id="ct" className='p-3 w-40 me-11 focus:outline-amber-400 cursor-pointer'>
                        <option value="cities">cities</option>
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="add" className='text-md font-bold text-gray-500'>Address: </label>
                    <textarea name="" id="add" rows={1} className='me-11 p-3 focus:outline-amber-400 cursor-pointer' value={"123 street"} />
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="ct" className='text-md font-bold text-gray-500'>Source: </label>
                    <select name="" id="ct" className='p-3 w-40 me-11 focus:outline-amber-400 cursor-pointer'>
                        {sourceData.map((s,i)=>(
                            <option key={i} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-row gap-3 items-center'>
                    <label htmlFor="qa" className='text-md font-bold text-gray-500'>Quote Amount: </label>
                    <input type="text" id='qa' value={"Rs.25000"} className='p-3 focus:outline-amber-400 text-green-700 cursor-pointer' />
                </div>

            </div>
    </div>
  )
}

export default EditLead