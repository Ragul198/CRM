import React, { useState } from "react";
import "../css/scrollbar.css";
import { IoIosSearch } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "../redux/leadSlice.jsx";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { updateLeadStatus } from "../api/fetchdata.jsx"; // ✅ use API

const Quotation = () => {
  const dispatch = useDispatch();

  const leads = useSelector((state) => state.leads.leads);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotQualifiedModal, setShowNotQualifiedModal] = useState(false);
  const [notQualifiedLead, setNotQualifiedLead] = useState(null);
  const [failedReason, setFailedReason] = useState("");
  const [failedMessage, setFailedMessage] = useState("");
  const [failedDate, setFailedDate] = useState(new Date().toISOString().slice(0, 10));

  // Filter status = Quotation
  const quotationLeads = leads.filter((lead) => lead.status === "Quotation" || lead.status === "Quotation Sent");

  // Search filter
  const filteredLeads = quotationLeads.filter((lead) => {
    const lowerSearch = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(lowerSearch) ||
      lead.email.toLowerCase().includes(lowerSearch) ||
      lead.phone.includes(searchQuery) ||
      lead.company.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);

  const sortedLeads = [...filteredLeads].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const paginatedLeads = sortedLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleChange = (lead) => async (e) => {
    try {
      const newStatus = e.target.value;

      if (newStatus === "Failed") {
        // Open your popup modal here for this lead
        setNotQualifiedLead(lead);
        setFailedReason("");
        setFailedMessage("");
        setFailedDate(new Date().toISOString().slice(0, 10));
        setShowNotQualifiedModal(true);
        // Don't update status directly here, wait for modal submit
        return;
      }

      if (newStatus === "Opportunity" && !lead.assignedTo) {
        toast('Please assign an engineer before changing status to Qualified.', {
          icon: '⚠️',
          style: {
            color: 'black',
          },
        });
        return;
      }

      if(lead.sentEmail === false &&  ( newStatus === "Converted" || newStatus === "Quotation Sent" )){
        toast('Please send quotation to lead mail', {
          icon: '⚠️',
          style: {
            color: 'black',
          },
        });
        return;
      }

      // Normal status update
      const updated = await updateLeadStatus(lead._id, { status: newStatus });
      dispatch(updateLead({ id: lead._id, changes: { status: updated.status } }));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Not authorized to update this lead.");
      } else {
        toast.error("Failed to update lead.");
      }
    }
  };
  return (
    <div id="table-width-fixed" className="mt-4">
      <Toaster />

      {/* Breadcrumbs */}
      <div>
        <Link to="/" className="hover:text-[#C2410C]">
          Dashboard
        </Link>{" "}
        / <span className="text-[#C2410C]"> Quotations </span>
      </div>

      {/* Header */}
      <div className="mt-4">
        <div className="flex flex-row gap-4 items-center">
          <RiMoneyRupeeCircleFill
            size={40}
            className="bg-orange-100 text-orange-500 rounded p-2"
          />
          <p className="text-gray-700 font-extrabold text-2xl">
            Quotation Leads
          </p>
        </div>

        <p className="text-gray-600 mt-3 ml-1">
          Stay on top of leads awaiting quotations
        </p>

        {/* Search */}
        <div className="mt-2 w-full max-w-md cursor-pointer relative">
          <IoIosSearch
            size={22}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search quotations..."
            className="w-full pl-10 pr-4 py-2 border bg-white border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="mt-7 overflow-x-auto w-auto rounded-md bg-white shadow-md">
          <table className="w-full border-b border-gray-300 rounded-md text-sm text-left">
            <thead className="bg-white text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-3 border-b border-gray-300 text-start">Name</th>
                <th className="p-3 border-b border-gray-300 text-start">Email</th>
                <th className="p-3 border-b border-gray-300 text-start">Phone</th>
                <th className="p-3 border-b border-gray-300 text-start">Company</th>
                <th className="p-3 border-b border-gray-300 text-start">Priority</th>
                <th className="p-3 border-b border-gray-300 text-start">Status</th>
                <th className="p-3 border-b border-gray-300 text-start">Assigned To</th>
                <th className="p-3 border-b border-gray-300 text-start">Date</th>
                <th className="p-3 border-b border-gray-300 text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-300 text-blue-700 ">
                       <Link to={`/opportunityView/${lead._id}`}state={{ fromSection: "quotation" }}>{lead.name}</Link>
                    </td>
                    <td className="p-3 border-b border-gray-300"><a href={`mailto:${lead.email}`} className="outline-none w-full hover:text-blue-600 hover:underline">{lead.email}</a></td>
                    <td className="p-3 border-b border-gray-300"><a href={`tel:${lead.phone}`} className="outline-none w-full hover:text-blue-600 hover:underline">{lead.phone}</a></td>
                    <td className="p-3 border-b border-gray-300">{lead.company}</td>
                    <td className="p-3 border-b border-gray-300">{lead.priority}</td>

                    {/* ✅ Status Update with DB */}
                    <td className="p-3 border-b border-gray-300">
                      <select
                        className="bg-blue-100 border-2 border-blue-300 rounded-md px-2 py-1"
                        value={lead.status}
                        onChange={handleChange(lead)}
                      >
                        {/* Options: converted, failed, follow-up (plus keep current) */}
                        {[lead.status,"Quotation Sent", "Converted","Follow-up","Failed"]
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="p-3 border-b border-gray-300">{lead.assignedTo}</td>
                    <td className="p-3 border-b border-gray-300">{lead.createdAt?.split("T")[0]}</td>
                    <td className="p-3 border-b border-gray-300">
                      <button className="hover:bg-gray-200 px-3 py-2 cursor-pointer">
                        <MdDelete
                          size={20}
                          className="text-red-500"
                          onClick={() =>
                            toast("Delete action not implemented yet", {
                              icon: "⚠️",
                            })
                          }
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="p-4 border-b border-gray-300 text-gray-700 text-center"
                    colSpan={9}
                  >
                    No Quotations Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          {showNotQualifiedModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">Not Qualified Details</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Failed Reason</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#FB6514]">
                <input
                  type="text"
                  className="outline-none w-full"
                  value={failedReason} onChange={e => setFailedReason(e.target.value)}
                  placeholder="Failed Reason"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Failed Message</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#FB6514]">
                <input
                  type="text"
                  className="outline-none w-full"
                  value={failedMessage} onChange={e => setFailedMessage(e.target.value)}
                  placeholder="Failed Message"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Date</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:border-[#FB6514]">
                <input
                  type="date"
                  className="outline-none w-full"
                  value={failedDate} onChange={e => setFailedDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setShowNotQualifiedModal(false)} className="px-4 py-2 border border-gray-400 rounded cursor-pointer">Cancel</button>
              <button
                onClick={async () => {
                  if (!failedReason || !failedDate) {
                    toast.error("Please enter required fields.");
                    return;
                  }
                  try {
                    const updated = await updateLeadStatus(notQualifiedLead._id, {
                      status: "Failed",
                      failedReason,
                      failedMessage,
                      failedDate,
                    });
                    dispatch(updateLead({ id: notQualifiedLead._id, changes: updated }));
                    setShowNotQualifiedModal(false);
                    toast.success("Lead marked as Not Qualified.");
                  } catch (err) {
                    toast.error("Failed to update lead.");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center p-3 gap-3 md:gap-0">
          <div className="flex gap-2 items-center">
            <p className="text-gray-600">Rows per page:</p>
            <select
              value={rowsPerPage}
              onChange={handleRowsChange}
              className="text-gray-700 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-orange-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
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
    </div>
  );
};

export default Quotation;
