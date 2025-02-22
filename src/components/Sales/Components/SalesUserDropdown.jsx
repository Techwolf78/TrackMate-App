import { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function SalesUserDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
      <div
        className="w-10 h-10 rounded-full bg-blue-100 cursor-pointer flex items-center justify-center text-white"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <img
          src="/user.png"
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
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