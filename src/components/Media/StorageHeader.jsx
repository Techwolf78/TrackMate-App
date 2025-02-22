import React from "react";
import { FaCloud } from "react-icons/fa";
import UserProfileDropdown from "./UserProfileDropdown"; // Import the UserProfileDropdown component

function StorageHeader({ email }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      {/* Storage Title on the Top */}
      <h1 className="text-4xl font-bold text-left text-blue-600 flex items-center mb-4 sm:mb-0">
        <FaCloud className="mr-2 text-blue-600" size={30} />
        Storage
      </h1>
      {/* Use ProfileDropdown Component here */}
      <UserProfileDropdown email={email} />
    </div>
  );
}

export default StorageHeader;
