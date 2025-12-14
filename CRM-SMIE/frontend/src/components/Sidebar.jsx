import React, { useEffect } from 'react'
import { LuLayoutDashboard } from "react-icons/lu";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { BsCheck2Square } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { CiTrash } from "react-icons/ci";
import { RiFileUserLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import { SlQuestion } from "react-icons/sl";
import { RiUserFollowLine } from "react-icons/ri";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdManageHistory } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import '../css/scrollbar.css'
import axiosInstance from '../api/axiosInstance.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getLogout } from '../redux/userSlice.jsx';
import toast from 'react-hot-toast'

const Sidebar = ({menuOpen,setMenuOpen}) => {

  const dispatch = useDispatch()

  const location = useLocation()

  const navigate = useNavigate()

  useEffect(()=>{
    setMenuOpen(false)
  },[location.pathname])

  const fetchLogout = async () => {
    try{
      const {data} = await axiosInstance.get('/auth/logout')
      dispatch(getLogout())
      toast.success(data.message)
      navigate('/login')
    }catch(err){
      console.log(`fetching logout error : ${err.message}`)
    }
  }

  const me = useSelector((state) => state.users.currentUser)
  
  const menuItems = me?.role === "Super Admin" ? ( [
    { label: "Dashboard", icon: <LuLayoutDashboard />, path: "/" },
    { label: "Leads", icon: <RiFileUserLine />, path: "/leads" },
    { label: "Opportunities", icon: <HiArrowTrendingUp />, path: "/opportunities" },
    { label: "Enquiry", icon: <SlQuestion />, path: "/enquiry" },
    { label: "Quotation", icon: <MdOutlinePayment />, path: "/quotation" },
    { label: "Converted", icon: <BsCheck2Square />, path: "/converted" },
    { label: "Follow up", icon: <RiUserFollowLine />, path: "/followup" },
    { label: "Account", icon: <MdManageAccounts />, path: "/account" },
    { label: "Report", icon: <TbReportAnalytics />, path: "/report" },
    { label: "Lead's History", icon: <MdManageHistory />, path: "/leadsHistory" },
  ]) : me?.role === "Coordinator" ? ([
    { label: "Dashboard", icon: <LuLayoutDashboard />, path: "/" },
    { label: "Leads", icon: <RiFileUserLine />, path: "/leads" },
    
  ]) : me?.role === "Engineer" ? ([
    { label: "Dashboard", icon: <LuLayoutDashboard />, path: "/" },
    { label: "Opportunities", icon: <HiArrowTrendingUp />, path: "/opportunities" },
    { label: "Enquiry", icon: <SlQuestion />, path: "/enquiry" },
    { label: "Quotation", icon: <MdOutlinePayment />, path: "/quotation" },
    { label: "Converted", icon: <BsCheck2Square />, path: "/converted" },
    { label: "Follow up", icon: <RiUserFollowLine />, path: "/followup" },
    
  ]) : me?.role === "Admin" ? ([
    { label: "Dashboard", icon: <LuLayoutDashboard />, path: "/" },
    { label: "Leads", icon: <RiFileUserLine />, path: "/leads" },
    { label: "Opportunities", icon: <HiArrowTrendingUp />, path: "/opportunities" },
    { label: "Enquiry", icon: <SlQuestion />, path: "/enquiry" },
    { label: "Quotation", icon: <MdOutlinePayment />, path: "/quotation" },
    { label: "Converted", icon: <BsCheck2Square />, path: "/converted" },
    { label: "Follow up", icon: <RiUserFollowLine />, path: "/followup" },
    { label: "Account", icon: <MdManageAccounts />, path: "/account" },
    { label: "Report", icon: <TbReportAnalytics />, path: "/report" },
    { label: "Lead's History", icon: <MdManageHistory />, path: "/leadsHistory" },
  ]) : null;

  const activityItems = me?.role === "Super Admin" ? ([
    { label: "Calendar", icon: <FaRegCalendarAlt />, path: "/calendar" },
    { label: "Activity Logs", icon: <FaArrowTrendUp />, path: "/activityLogs"},
    { label: "Create User", icon: <FiUserPlus />, path: "/createUser" },
    { label: "User", icon: <FiUsers />, path: "/users" },
    { label: "Trash", icon: <CiTrash />, path: "/trash" }
  ]) : me?.role === "Coordinator" ? ([
    { label: "Calendar", icon: <FaRegCalendarAlt />, path: "/calendar" },
    // { label: "Trash", icon: <CiTrash />, path: "/trash" }
  ]) : me?.role === "Engineer" ? ([
    { label: "Calendar", icon: <FaRegCalendarAlt />, path: "/calendar" },
    // { label: "Trash", icon: <CiTrash />, path: "/trash" }
  ]) : me?.role === "Admin" ? ([
    { label: "Calendar", icon: <FaRegCalendarAlt />, path: "/calendar" },
    { label: "Activity Logs", icon: <FaArrowTrendUp />, path: "/activityLogs"},
    { label: "Create User", icon: <FiUserPlus />, path: "/createUser" },
    { label: "User", icon: <FiUsers />, path: "/users" },
    { label: "Trash", icon: <CiTrash />, path: "/trash" }
  ]) : null;

  const renderMenu = (items) =>
    items?.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link key={item.label} to={item.path}>
          <div
            className={`flex gap-2 items-center font-medium focus:outline-hidden rounded-md md:p-3 p-1 cursor-pointer ${
              isActive
                ? "bg-orange-100 text-gray-900"
                : "bg-transparent text-gray-600"
            }`}
          >
            {item.icon}
            <li>{item.label}</li>
          </div>
        </Link>
      );
    });
  return (
    <div className={`fixed top-0 left-0 h-full w-[200px] mt-20 md:mt-0 bg-white border-r border-gray-300 shadow-md z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:block`}>
    <div className="max-w-[250px] h-screen border-r border-gray-300 shadow-sm z-50 flex flex-col">

      {/* logo */}
      <div className="flex justify-center items-center border-b border-gray-300 sticky top-0 bg-white">
        <div className="p-4 hidden sm:hidden md:block">
          <Link to={"/"}>
            {" "}
            <img
              src="https://smie-crm.vercel.app/assets/logo-Ck8_dChu.png"
              className="w-30 h-18"
            />
          </Link>
        </div>
      </div>

      <div className="overflow-y-auto custom-scrollbar">

        {/* main menu */}
        <div className="px-5 py-3">
          <ul className="flex flex-col">{renderMenu(menuItems)}</ul>
        </div>

        {/* activities */}
        <div className="px-6">
          <h4 className="text-gray-600 font-semibold text-xl">Activities</h4>
          <ul className="flex flex-col mt-1 md:mb-0 md:mt-4">{renderMenu(activityItems)}</ul>
        </div>

      </div>

      {/* logout */}
      <div className="flex gap-2 items-center border-t border-gray-300 w-full inset-0 px-5 hover:text-black hover:bg-gray-200 h-[40px] ms-2.5 md:ms-0 md:h-[60px]">
        <span>
          <IoIosLogOut />
        </span>
        <button
          type='button'
          onClick={fetchLogout}
          className="text-gray-600 font-semibold cursor-pointer"
        >
          logout
        </button>
      </div>
    </div>
    </div>
  )
}

export default Sidebar;