import PropTypes from 'prop-types';

function StateSelect({ state, handleChange }) {
  const indianStatesAndUTs = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  const sortedStatesAndUTs = indianStatesAndUTs.sort();

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">State</label>
      <select
        name="state"
        value={state}
        onChange={handleChange}
        className="p-3 w-full max-w-full border-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all duration-300 box-border overflow-hidden"
        aria-label="Select State"
      >
        <option value="">Select State</option>
        {sortedStatesAndUTs.map((stateOption) => (
          <option key={stateOption} value={stateOption}>
            {stateOption}
          </option>
        ))}
      </select>

      {/* Custom Arrow Icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

// PropTypes Validation
StateSelect.propTypes = {
  state: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default StateSelect;
