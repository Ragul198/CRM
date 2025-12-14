import React, { useState } from "react";
import "../css/scrollbar.css";
import { IoIosSearch } from "react-icons/io";
import { SiTicktick } from "react-icons/si";
import { FaBuilding, FaUsers, FaCalendar, FaPhone, FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Account = () => {
  const leads = useSelector((state) => state.leads.leads);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(12);

  // Filter leads with status "Converted" and group by company
  const convertedLeads = leads.filter((lead) => lead.status === "Converted");
  
  // Group leads by company
  const companyGroups = convertedLeads.reduce((acc, lead) => {
    const companyName = lead.company.trim();
    if (!acc[companyName]) {
      acc[companyName] = [];
    }
    acc[companyName].push(lead);
    return acc;
  }, {});

  // Convert to array and get unique company data
  const companyAccounts = Object.entries(companyGroups).map(([companyName, companyLeads]) => {
    // Get the most recent lead for company details
    const latestLead = companyLeads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    
    return {
      company: companyName,
      leadCount: companyLeads.length,
      leads: companyLeads,
      latestLead,
      totalRevenue: companyLeads.reduce((sum, lead) => sum + (lead.price || 0), 0),
      primaryContact: latestLead.name,
      email: latestLead.email,
      phone: latestLead.phone,
      assignedTo: latestLead.assignedTo,
      lastActivity: latestLead.updatedAt,
      location: `${latestLead.city}, ${latestLead.state}`,
      priority: latestLead.priority
    };
  });

  console.log('Company Accounts:', companyAccounts);

  // Search filter
  const filteredAccounts = companyAccounts.filter((account) => {
    const lowerSearch = searchQuery.toLowerCase();
    return (
      account.company.toLowerCase().includes(lowerSearch) ||
      account.primaryContact.toLowerCase().includes(lowerSearch) ||
      account.email.toLowerCase().includes(lowerSearch) ||
      account.phone.includes(searchQuery) ||
      account.location.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredAccounts.length / cardsPerPage);

  // Sort by most recent activity
  const sortedAccounts = [...filteredAccounts].sort(
    (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
  );

  const paginatedAccounts = sortedAccounts.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handleCardsChange = (e) => {
    setCardsPerPage(Number(e.target.value));
    setPage(1);
  };
  
  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  
  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-4 px-4">
      {/* Breadcrumb */}
      <div>
        <Link to="/" className="hover:text-[#C2410C]">
          Dashboard
        </Link>{" "}
        / <span className="text-[#C2410C]"> Accounts </span>
      </div>

      {/* Header */}
      <div className="mt-4">
        <div className="flex flex-row gap-4 items-center">
          <SiTicktick
            size={40}
            className="bg-orange-100 text-orange-500 rounded p-2"
          />
          <div>
            <h1 className="text-gray-900 font-extrabold text-2xl">Company Accounts</h1>
            <p className="text-gray-600 text-sm">Converted clients organized by company</p>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
          <div className="relative w-full max-w-md">
            <IoIosSearch
              size={22}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search companies, contacts, locations..."
              className="w-full pl-10 pr-4 py-2 border bg-white border-gray-300 focus:border-orange-500 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm">
              <strong className="text-orange-600">{companyAccounts.length}</strong> Companies
            </span>
            <span className="bg-white px-3 py-2 rounded-lg shadow-sm">
              <strong className="text-green-600">{convertedLeads.length}</strong> Total Accounts
            </span>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedAccounts.length > 0 ? (
            paginatedAccounts.map((account, index) => (
              <Link
                key={index}
                to={`/accountView/${account.latestLead._id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border hover:border-orange-200">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <FaBuilding className="text-orange-600 text-lg" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate text-sm">
                          {account.company}
                        </h3>
                        <p className="text-xs text-gray-500">{account.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(account.priority)}`}>
                      {account.priority}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="text-center bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{account.leadCount}</div>
                      <div className="text-xs text-gray-600">Accounts</div>
                    </div>
                    {/* <div className="text-center bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">
                        ${account.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div> */}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FaUsers className="text-gray-400 text-xs" />
                      <span className="text-gray-700 truncate">{account.primaryContact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaEnvelope className="text-gray-400 text-xs" />
                      <span className="text-gray-600 truncate">{account.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-gray-400 text-xs" />
                      <span className="text-gray-600">{account.phone}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="text-xs" />
                        <span>{new Date(account.lastActivity).toLocaleDateString()}</span>
                      </div>
                      <span className="text-orange-600 font-medium group-hover:text-orange-700">
                        View Details →
                      </span>
                    </div>
                    {/* {account.assignedTo && (
                      <div className="mt-1 text-xs text-gray-600">
                        Managed by: <span className="font-medium">{account.assignedTo}</span>
                      </div>
                    )} */}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <FaBuilding className="text-4xl mb-2 opacity-50" />
              <p className="text-lg">No Company Accounts Found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center p-4 mt-6 bg-white rounded-lg shadow-sm gap-3 md:gap-0">
          <div className="flex gap-2 items-center">
            <p className="text-gray-600">Cards per page:</p>
            <select
              value={cardsPerPage}
              onChange={handleCardsChange}
              className="text-gray-700 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-orange-500"
            >
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="24">24</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md border ${
                page === 1
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-black border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">{page} / {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md border ${
                page === totalPages
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-black border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
