import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import PropTypes from 'prop-types';

const DateFilter = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);  // Track if filter is applied
  const dropdownRef = useRef(null);
  const filterButtonRef = useRef(null); // Reference for the filter button

  const handleApplyFilter = () => {
    onFilterChange({ startDate, endDate });
    setIsFilterApplied(true); // Mark filter as applied
    setShowDropdown(false);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange({ startDate: "", endDate: "" });
    setIsFilterApplied(false); // Reset applied filter state
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <style>
        {`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .blinking {
            animation: blink 1s infinite;
          }

          .tooltip {
            position: absolute;
            top: -30px;
            left: 40%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }

          .filter-button:hover .tooltip {
            opacity: 1;
          }
        `}
      </style>

      <button
        ref={filterButtonRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`p-2 mr-2 rounded-lg text-white transition-colors flex items-center ${isFilterApplied ? "bg-green-500" : "bg-blue-500"} filter-button`}
      >
        <FaFilter className="mr-1" />
        {isFilterApplied && (
          <span className="ml-0 md:ml-2 text-xs bg-green-600 text-white py-1 px-2 rounded-full flex items-center space-x-1">
            <span>Active</span>
            <span
              className={`w-1.5 h-1.5 rounded-full bg-white ${isFilterApplied ? "blinking" : ""}`}
            ></span>
          </span>
        )}
        {/* Tooltip */}
        <span className="tooltip">Filter</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between space-x-2">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add PropTypes validation
DateFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default DateFilter;
