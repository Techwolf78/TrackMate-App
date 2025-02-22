import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFileAlt, FaVideo, FaUserAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();
  const [isReportClicked, setIsReportClicked] = useState(false);
  const [mediaText, setMediaText] = useState("Media");

  useEffect(() => {
    const selectedOption = sessionStorage.getItem("selectedOption");
    if (selectedOption === "bills") {
      setMediaText("Bills");
    } else if (selectedOption === "placementDocs") {
      setMediaText("Docs");
    } else {
      setMediaText("Media");
    }
  }, [location.pathname]);

  const isMediaOrDocsActive = location.pathname === '/media' || location.pathname === '/docs';
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isSalesOrPlacement = location.pathname === '/sales' || location.pathname === '/placement';
  const isReportActive = isSalesOrPlacement;
  const isProfileActive = location.pathname === '/spent';
  const isReportDisabled = !isSalesOrPlacement;

  const handleReportClick = () => {
    if (isReportDisabled) {
      setIsReportClicked(true);
      setTimeout(() => {
        setIsReportClicked(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed font-inter bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around items-center z-50 shadow-lg">
      <div className="text-center">
        <Link
          to="/"
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300 ${isHome ? 'text-green-500' : 'text-white'}`}
        >
          <FaHome size={24} className={isHome ? 'text-green-500' : 'text-white'} />
          <span className={isHome ? 'text-green-500' : 'text-white'}>Home</span>
        </Link>
      </div>

      <div className="relative text-center group">
        <Link
          to={isSalesOrPlacement ? "/report" : "#"}
          onClick={handleReportClick}
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300
            ${isReportActive ? 'text-green-500' : isReportClicked ? 'text-red-500' : (isReportDisabled ? 'text-white' : 'text-white')}
            ${!isSalesOrPlacement ? 'pointer-events-none' : ''}`}
        >
          <FaFileAlt size={24} className={isReportActive ? 'text-green-500' : isReportClicked ? 'text-red-500' : 'text-white'} />
          <span className={isReportActive ? 'text-green-500' : isReportClicked ? 'text-red-500' : 'text-white'}>
            Report
          </span>
        </Link>
        
        {isReportDisabled && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Not Clickable
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          to={isAuthenticated ? (mediaText === "Bills" ? "/media" : "/docs") : "/adminlogin"}
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300 ${
            isMediaOrDocsActive ? 'text-green-500' : 'text-white'
          }`}
        >
          <FaVideo size={24} className={isMediaOrDocsActive ? 'text-green-500' : 'text-white'} />
          <span className={isMediaOrDocsActive ? 'text-green-500' : 'text-white'}>
            {mediaText}
          </span>
        </Link>
      </div>

      <div className="text-center">
        <Link
          to="/spent"
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300 ${isProfileActive ? 'text-green-500' : 'text-white'}`}
        >
          <FaUserAlt size={24} className={isProfileActive ? 'text-green-500' : 'text-white'} />
          <span className={isProfileActive ? 'text-green-500' : 'text-white'}>Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Navbar;
