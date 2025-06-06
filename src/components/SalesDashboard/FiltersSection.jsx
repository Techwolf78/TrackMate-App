import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import Select from 'react-select';

// 🔧 Custom styles for react-select
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.3)' : 'none',
    padding: '2px 4px',
    minHeight: '40px',
    fontSize: '0.875rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#eff6ff',
    borderRadius: '0.25rem',
    padding: '2px 4px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1d4ed8',
    fontWeight: 500,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#1d4ed8',
    ':hover': {
      backgroundColor: '#bfdbfe',
      color: '#1e3a8a',
    },
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '0.875rem',
    color: '#6b7280',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const FiltersSection = ({
  loadCities,
  filterCity,
  setFilterCity,
  setCurrentPage,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  filterMonth,
  setFilterMonth,
  cityOptions,
  filteredVisits,
}) => {
  const handleExport = () => {
    const csv = Papa.unparse(filteredVisits);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sales_visits.csv');
  };

  const handleResetFilters = () => {
    setFilterCity([]);
    setDateFrom('');
    setDateTo('');
    setFilterMonth([]);
    setCurrentPage(1);
  };

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ].map((month, index) => ({
    label: month,
    value: index + 1,
  }));

  const selectedMonths = monthOptions.filter((m) =>
    filterMonth.includes(m.value)
  );

  const citySelectOptions = cityOptions.map((city) => ({
    label: city,
    value: city,
  }));

  const selectedCities = citySelectOptions.filter((c) =>
    filterCity.includes(c.value)
  );

  return (
    <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between w-full">
      {/* City Multi-Select */}
      <div className="w-full sm:w-64">
        <Select
          isMulti
          options={citySelectOptions}
          value={selectedCities}
          onChange={(selected) => {
            setFilterCity(selected.map((opt) => opt.value));
            setCurrentPage(1);
          }}
          onMenuOpen={loadCities}
          placeholder="Select Cities..."
          styles={customSelectStyles}
        />
      </div>

      {/* Date Range Filters */}
      <div className="flex gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 pr-8 w-full sm:w-auto"
          />
          {dateFrom && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full animate-green-blink bg-green-500"></span>
          )}
        </div>
        <div className="relative w-full sm:w-auto">
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 pr-8 w-full sm:w-auto"
          />
          {dateTo && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full animate-green-blink bg-green-500"></span>
          )}
        </div>
      </div>

      {/* Month Multi-Select */}
      <div className="w-full sm:w-64">
        <Select
          isMulti
          options={monthOptions}
          value={selectedMonths}
          onChange={(selected) => {
            setFilterMonth(selected.map((opt) => opt.value));
            setCurrentPage(1);
          }}
          placeholder="Select Months..."
          styles={customSelectStyles}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.327-2A9.004 9.004 0 003 12.055M4.818 16.318A9.004 9.004 0 0021 12.055M20 20v-5h-.581"
            />
          </svg>
          Reset
        </button>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow whitespace-nowrap hover:bg-blue-700 transition"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
};

FiltersSection.propTypes = {
  loadCities: PropTypes.func.isRequired,
  filterCity: PropTypes.array.isRequired,
  setFilterCity: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  dateFrom: PropTypes.string.isRequired,
  setDateFrom: PropTypes.func.isRequired,
  dateTo: PropTypes.string.isRequired,
  setDateTo: PropTypes.func.isRequired,
  filterMonth: PropTypes.array.isRequired,
  setFilterMonth: PropTypes.func.isRequired,
  cityOptions: PropTypes.array.isRequired,
  filteredVisits: PropTypes.array.isRequired,
};

export default FiltersSection;
