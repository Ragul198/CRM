import React from 'react'
import { Link } from 'react-router-dom'
import Notes from '../components/Notes';
import { Toaster } from 'react-hot-toast';
import EditLead from './EditLead.jsx';

const QuotationView = () => {

  return (
    <div className='mt-4'>
        <Toaster />

        <div><Link to='/' className='hover:text-[#C2410C]'>Dashboard</Link> / <Link to='/quotation' className='hover:text-[#C2410C]'>Quotations</Link> / <span className="text-[#C2410C]"> Edit Quotation </span></div>
        
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

export default QuotationView