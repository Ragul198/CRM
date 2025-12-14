import React from 'react'
import { Link } from 'react-router-dom'
import Notes from '../components/Notes';
import { Toaster } from 'react-hot-toast';
import EditLead from './EditLead.jsx';

const EnquiryView = () => {

  return (
    <div className='mt-4'>
        <Toaster />

        <div><Link to='/' className='hover:text-[#C2410C]'>Dashboard</Link> / <Link to='/enquiry' className='hover:text-[#C2410C]'>Enquiries </Link> / <span className="text-[#C2410C]"> Edit Enquiry </span></div>
        
        {/* edit leads */}
        
        <div className='h-auto bg-white mt-9 p-5 w-full'>
            <EditLead />
        </div>

        {/* notes for leads */}
        <div className='h-auto bg-white mt-5 p-5 w-full'>
            <Notes />
        </div>

    </div>
  )
}

export default EnquiryView