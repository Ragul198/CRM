import React, { useState } from "react";
import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaBarsStaggered } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import NotificationPopup from "./NotificationPopup";
import { markAllNotificationsRead } from "../redux/logSclice"; // adjust the path if needed
import { markAllLogsAsReadApi } from "../api/fetchdata";

const Navbar = ({ menuOpen, setMenuOpen }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const me = useSelector((state) => state.users.currentUser);
  const logs = useSelector((state) => state.logs.logs);
  const flogs = logs.filter((log) => {if (log.type==="lead_deleted") return log});
  console.log("FLogs:", flogs);
  console.log("All Logs:", logs);
  const filteredNotifications = logs.filter((log) => {
    
    return (
      (log.type === "lead_created" ||
      log.type === "lead_deleted" ||
      log.type === "user_created" ||
      log.type === "user_deleted" ||
      log.type === "leads_uploaded" ||
      (log.type === "status_change" && log.details?.toStatus === "Converted"))&&
      (log.userId !== me._id)
    );
  });
  console.log("Filtered Notifications:", filteredNotifications);
  const unviewedCount = filteredNotifications.filter(
  (n) => !(n.readBy || []).includes(me._id)
).length;



  console.log("Unviewed Count:", unviewedCount);

  const handleNotificationClick = async() => {
    const willOpen = !openNotifications;
    setOpenNotifications(willOpen);

    if (willOpen && me?._id) {
    try {
      // call API
      await markAllLogsAsReadApi(me._id);

      // update redux immediately for UI responsiveness
      dispatch(markAllNotificationsRead(me._id));
    } catch (err) {
      console.error("Failed to mark logs as read:", err);
    }
  }
  };

  const handleClickProfile = () => {
    setOpenProfile(!openProfile);
    navigate("/profile");
  };

  return (
    <div className="relative w-full border-b border-gray-300 shadow-xs h-[90px] sticky top-0 z-50 bg-white">
      <div className="p-6 flex flex-row justify-between sm:justify-between md:justify-end">
        <div className="block sm:block md:hidden">
          <FaBarsStaggered
            onClick={() => setMenuOpen(!menuOpen)}
            size={40}
            className="bg-orange-100 text-orange-500 rounded p-2"
          />
        </div>
        <div className="flex gap-4 items-center relative">
          <div
            className="cursor-pointer rounded p-1 text-black relative"
            onClick={handleNotificationClick}
          >
            <FiBell size={30} />
            {unviewedCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {unviewedCount}
              </span>
            )}
          </div>
          <NotificationPopup visible={openNotifications} />
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenProfile(!openProfile)}
          >
            {me?.avatar ? (
              <img
                src={me.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <FaUserCircle className="text-orange-500" size={30} />
            )}
          </div>
          {openProfile && (
            <div className="p-3 bg-white rounded-md z-20 absolute top-20 shadow-md cursor-pointer">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleClickProfile}
              >
                <IoMdSettings />
                Profile Setting
              </div>
            </div>
          )}
          <div className="text-xl">{me?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
