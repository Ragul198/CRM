import React from "react";
import { useSelector } from "react-redux";

const NotificationPopup = ({ visible }) => {
  const logs = useSelector((state) => state.logs.logs);
  const me = useSelector((state) => state.users.currentUser);

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

  if (!visible) return null;

  return (
    <div
      className="absolute right-6 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-orange-50 border border-orange-300 rounded-lg shadow-md z-50 p-4"
      style={{ boxShadow: "0 4px 12px rgba(255, 165, 85, 0.3)" }}
    >
      <h4 className="font-bold text-orange-700 mb-4 border-b border-orange-300 pb-2">
        Notifications
      </h4>
      {filteredNotifications.length === 0 ? (
        <p className="text-orange-800 text-center italic">No new notifications</p>
      ) : (
        <ul className="space-y-3">
          {filteredNotifications.map((notif) => (
            <li
              key={notif._id}
              className="bg-white rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-orange-900 font-semibold text-sm">
                {notif.type === "lead_created" && (
                  <>
                    Lead <strong>{notif.details.leadName}</strong> created and assigned to{" "}
                    <strong>{notif.details.assignedTo}</strong>.
                  </>
                )}
                {notif.type === "lead_deleted" && (
                  <>
                    Lead <strong>{notif.details.leadName}</strong> was deleted.
                  </>
                )}
                {(notif.type === "user_created" || notif.type === "user_deleted") && (
                  <>
                    User <strong>{notif.details.userName}</strong> {notif.type === "user_created" ? "created" : "deleted"}.
                  </>
                )}
                {(notif.type === "leads_uploaded" ) && (
                  <>
                    User <strong>{notif.user}</strong> Uploaded {notif.details.leadcount} leads.
                  </>
                )}
                {notif.type === "status_change" && notif.details?.toStatus === "Converted" && (
                  <>
                    Lead <strong>{notif.details.leadName}</strong> has been converted.
                  </>
                )}
                
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPopup;
