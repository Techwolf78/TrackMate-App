import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

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
  filteredVisits
}) => {
  const handleExport = () => {
    const csv = Papa.unparse(filteredVisits);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales_visits.csv");
  };

  const handleResetFilters = () => {
  setFilterCity("");
  setDateFrom("");
  setDateTo("");
  setFilterMonth("");
  setCurrentPage(1);
};

  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* City Filter */}
      <div className="relative w-full sm:w-64">
        <select
          onClick={loadCities}
          value={filterCity}
          onChange={(e) => {
            setFilterCity(e.target.value);
            setCurrentPage(1);
          }}
          className="appearance-none px-4 py-2 border rounded w-full pr-10"
        >
          <option value="">All City</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <div
            className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors duration-200 ${
              filterCity
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </div>
        </div>
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
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full animate-green-blink"></span>
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
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full animate-green-blink"></span>
          )}
        </div>
      </div>

      {/* Month Filter */}
      <div className="relative w-full sm:w-48">
        <select
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
            setCurrentPage(1);
          }}
          className="appearance-none px-4 py-2 border rounded w-full pr-10"
        >
          <option value="">All Months</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

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
    className="px-4 py-2 bg-blue-600 text-white rounded shadow whitespace-nowrap"
  >
    Export CSV
  </button>
</div>

    </div>
  );
};

FiltersSection.propTypes = {
  loadCities: PropTypes.func.isRequired,
  filterCity: PropTypes.string.isRequired,
  setFilterCity: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  dateFrom: PropTypes.string.isRequired,
  setDateFrom: PropTypes.func.isRequired,
  dateTo: PropTypes.string.isRequired,
  setDateTo: PropTypes.func.isRequired,
  filterMonth: PropTypes.string.isRequired,
  setFilterMonth: PropTypes.func.isRequired,
  cityOptions: PropTypes.array.isRequired,
  filteredVisits: PropTypes.array.isRequired,
};

export default FiltersSection;