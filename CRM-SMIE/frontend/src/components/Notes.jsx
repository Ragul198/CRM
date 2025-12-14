import React, { useState } from 'react'
import { SlNote } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';
import { BsSendPlusFill } from "react-icons/bs";

const Notes = () => {
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    const CreateNote = () => {
        setLoading(false)
        try{
            // navigate('/followup')
        }catch(err){
            console.log(err)
        }finally{
            setLoading(true)
        }
    }

  return (
    <>
    {/* notes for leads */}
    <div className='flex flex-row gap-3'>
        <SlNote size={38} className='bg-orange-100 text-orange-500 rounded p-2' />
        <p className='text-xl md:text-2xl font-bold text-gray-500 mb-6'>Lead Notes</p>
    </div>
    {/* all notes */}
    <div>
        <div className='mt-5 bg-gray-100 rounded-2xl p-3 w-full xl:w-[50%]'>
            <div className='text-md'>
                hi this is notes
            </div>
            <p className='text-sm mt-3 text-end'>By {"engineer"} on {"13/08/25"} at {"12:06:08"} am</p>
        </div>
        <div className='mt-5 bg-gray-100 rounded-2xl p-3 w-full xl:w-[50%]'>
            <div className='text-md'>
                No Notes Data Available
            </div>
        </div>
    </div>
    {/* craete note */}
    <div className='flex flex-col md:flex-row items-center gap-0 md:gap-3'>
        <input type="text" placeholder='Create notes...' className='p-3 mt-6 w-full xl:w-[50%] bg-orange-100 rounded-2xl focus:outline-hidden' />
        <div className={`bg-[#FB6514] w-full xl:w-[50%] text-white mt-5 px-4 py-3 rounded-md flex justify-center ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`} onClick={()=>!loading && CreateNote()}>
            <button className='flex gap-3 items-center font-semibold cursor-pointer' > {loading ? "Creating..." : <><BsSendPlusFill /> Create Notes</>}</button>
        </div>
    </div>
    </>
  )
}

export default Notes