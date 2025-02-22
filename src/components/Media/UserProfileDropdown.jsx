import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { FaEllipsisV, FaSignOutAlt } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileDropdown = () => {
  const email = localStorage.getItem("userEmail");  // Retrieve email from localStorage

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle sign out
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("User signed out");

      // Clear the selected option and email from sessionStorage and localStorage
      sessionStorage.removeItem("selectedOption"); // Clear selected option
      localStorage.removeItem("userEmail"); // Clear user email from localStorage

      toast.success("Logged out successfully");
      navigate("/adminlogin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="flex items-center relative">
      {/* Name Section */}
      <div className="flex items-center space-x-2 p-2">
        <p className="text-lg md:text-2xl font-medium text-blue-600">
          <span>Welcome Back! </span>
          <span>
            {email
              ? email.split("@")[0].replace(/\b\w/g, (char) => char.toUpperCase())
              : "User"}
          </span>
        </p>
      </div>

      {/* Circle Avatar with Image */}
      <div className="w-6 h-6 md:w-10 md:h-10 bg-blue-100 text-white rounded-full flex items-center justify-center">
        <img
          src="user.png"
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Dropdown Icon */}
      <div className="ml-1 relative">
        <FaEllipsisV
          onClick={toggleDropdown}
          className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200 ease-in-out text-lg sm:text-base md:text-xl"
          aria-expanded={isDropdownOpen}
          aria-label="More options"
        />
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 text-gray-700 shadow-md rounded-lg w-36 md:w-40 p-1 md:p-2 lg:p-1 border border-gray-100 z-10 transition-transform transform origin-top scale-100 hover:scale-105"
          >
            <ul>
              <li
                className="flex items-center py-2 px-4 text-sm sm:text-base xs:text-xs hover:bg-blue-100 rounded-md cursor-pointer transition-all duration-150 ease-in-out"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-2 text-lg" />
                Sign Out
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileDropdown.propTypes = {
  email: PropTypes.string.isRequired,
};

export default ProfileDropdown;
