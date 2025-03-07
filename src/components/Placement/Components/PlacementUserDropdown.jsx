import { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function SalesUserDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get the userSale from session storage
  const userSale = sessionStorage.getItem('userSale');

  // Extract the part before "@" in the email address and capitalize the first letter
  const username = userSale
    ? userSale.split('@')[0].charAt(0).toUpperCase() + userSale.split('@')[0].slice(1)
    : 'Guest'; // Default to 'Guest' if userSale is not available

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-row-reverse items-center space-x-2 sm:space-x-4">
        {/* Display the user profile image */}
        <div
          className="w-10 h-10 rounded-full bg-blue-100 cursor-pointer flex items-center justify-center text-white"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen ? 'true' : 'false'}
        >
          <img
            src="/user.png"
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Display the welcome message with the username, visible only on larger screens */}
        <span className="text-lg font-semibold text-blue-600 hidden sm:block">
          Welcome <span className="font-extrabold">{username}</span>!
        </span>
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default SalesUserDropdown;
