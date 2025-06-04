import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import PropTypes from "prop-types";

const STATUS_COLORS = {
  closure: "bg-green-100 text-green-800",
  lead: "bg-purple-100 text-purple-800", // Changed lead to purple for distinct color
  default: "bg-gray-100 text-gray-600",
};

// Yellow shades for follow-up phases, from light to darker
const FOLLOWUP_YELLOW_SHADES = [
  "bg-yellow-50 text-yellow-900", // I
  "bg-yellow-100 text-yellow-800", // II
  "bg-yellow-200 text-yellow-800", // III
  "bg-yellow-300 text-yellow-900", // IV
  "bg-yellow-400 text-yellow-900", // V
  "bg-yellow-500 text-yellow-50", // VI
  "bg-yellow-600 text-yellow-50", // VII
  "bg-yellow-700 text-yellow-50", // VIII
];

const romanToNumber = (roman) => {
  const romanMap = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
  };
  return romanMap[roman] || 0;
};

const SalesVisitDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  // New states for pagination and date filtering
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterMonth, setFilterMonth] = useState(""); // "" means All Months

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const visitsRef = ref(db, "salesVisits");
        const snapshot = await get(visitsRef);
        if (snapshot.exists()) {
          const dataObj = snapshot.val();
          const data = Object.entries(dataObj).map(([id, value]) => ({
            id,
            ...value,
          }));
          setVisits(data);
        } else {
          setVisits([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const loadCities = () => {
    if (!citiesLoaded) {
      const uniqueCities = [
        ...new Set(visits.map((v) => v["City"]).filter(Boolean)),
      ].sort();
      setCityOptions(uniqueCities);
      setCitiesLoaded(true);
    }
  };

  // Filter visits by city, date range and sort desc by Visit Code
  const filteredVisits = visits
    .filter((v) =>
      filterCity ? v["City"]?.toLowerCase() === filterCity.toLowerCase() : true
    )
    .filter((v) => {
      const rawDate = v["dateandtime"];
      if (!rawDate) return true;

      // Since the format is MM/DD/YYYY, we can directly parse it
      const parsedDate = new Date(rawDate.split(",")[0]); // Get only the date part before the comma

      if (isNaN(parsedDate)) return true;

      // Filter by custom date range
      if (dateFrom && parsedDate < new Date(dateFrom)) return false;
      if (dateTo && parsedDate > new Date(dateTo)) return false;

      // Filter by month
      if (filterMonth) {
        const visitMonth = parsedDate.getMonth() + 1;
        return visitMonth === Number(filterMonth);
      }

      return true;
    })

    .sort((a, b) => {
      const codeA = a["Visit Code"] || "";
      const codeB = b["Visit Code"] || "";
      return codeB.localeCompare(codeA, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

  // Pagination
  const totalPages = Math.ceil(filteredVisits.length / rowsPerPage);
  const paginatedVisits = filteredVisits.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalVisits = filteredVisits.length;
  const successfulConversions = filteredVisits.filter(
    (v) => v["Visit Phase"]?.toLowerCase() === "closure"
  ).length;
  const pendingFollowups = filteredVisits.filter((v) =>
    v["Visit Phase"]?.toLowerCase().includes("follow")
  ).length;

  const getAverage = (key) => {
    const total = filteredVisits.reduce((sum, v) => {
      return sum + (Number(v[key]) || 0);
    }, 0);
    return filteredVisits.length > 0
      ? (total / filteredVisits.length).toFixed(2)
      : "0.00";
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredVisits);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales_visits.csv");
  };

  const VisitStatusBadge = ({ phase }) => {
    if (!phase) return null;

    const phaseLower = phase.toLowerCase();

    if (phaseLower === "lead") {
      return (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS.lead}`}
        >
          {phase}
        </span>
      );
    }

    if (phaseLower.includes("follow up")) {
      // Extract Roman numeral after "Follow up - "
      const match = phase.match(/Follow up - (\w+)/i);
      let shadeClass = STATUS_COLORS.default;
      if (match && match[1]) {
        const index = romanToNumber(match[1]) - 1; // zero-based index
        if (index >= 0 && index < FOLLOWUP_YELLOW_SHADES.length) {
          shadeClass = FOLLOWUP_YELLOW_SHADES[index];
        }
      }

      return (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${shadeClass}`}
        >
          {phase}
        </span>
      );
    }

    if (phaseLower === "closure") {
      return (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS.closure}`}
        >
          {phase}
        </span>
      );
    }

    // Default fallback
    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS.default}`}
      >
        {phase}
      </span>
    );
  };

  VisitStatusBadge.propTypes = {
    phase: PropTypes.string,
  };

  return (
    <>
      <style>
        {`
        @keyframes greenBlink {
          0%, 100% {
            background-color: #34D399;
          }
          50% {
            background-color: #065F46;
          }
        }

        .animate-green-blink {
          animation: greenBlink 1s infinite;
        }
      `}
      </style>

      <div className="min-h-screen bg-white p-4 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-4xl font-semibold text-gray-800 text-center">
              Sales Visit Dashboard
            </h1>
            <p className="text-gray-500 text-center mt-1 sm:mt-2">
              Monitor sales visits, conversions, and follow-ups at a glance.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading data...</div>
          ) : (
            <>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <select
                    onClick={loadCities}
                    value={filterCity}
                    onChange={(e) => {
                      setFilterCity(e.target.value);
                      setCurrentPage(1); // reset page on filter change
                    }}
                    className="appearance-none px-4 py-2 border rounded w-full pr-10"
                  >
                    <option value="">All City</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {/* Filter Icon with Conditional Green Circle */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <div
                      className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        filterCity
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {/* Heroicons filter SVG */}
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

                <div className="flex gap-2 w-full sm:w-auto">
                  {/* From Date */}
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

                  {/* To Date */}
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

                <div className="relative w-full sm:w-48">
                  <select
                    value={filterMonth}
                    onChange={(e) => {
                      setFilterMonth(e.target.value);
                      setCurrentPage(1); // reset pagination
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

                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow whitespace-nowrap"
                >
                  Export CSV
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <StatCard
                  label="Total Visits"
                  value={totalVisits}
                  color="blue"
                />
                <StatCard
                  label="Successful Conversions"
                  value={successfulConversions}
                  color="green"
                />
                <StatCard
                  label="Pending Follow-ups"
                  value={pendingFollowups}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <StatCard
                  label="Average Student Count"
                  value={Number(getAverage("Student Count"))}
                  color="blue"
                />
                <StatCard
                  label="Average Contract Value"
                  value={`₹${getAverage("Total Contract Value")}`}
                  color="green"
                />
                <StatCard
                  label="Avg. Per Student Rate"
                  value={`₹${getAverage("Per Student Rate")}`}
                  color="red"
                />
              </div>

              <div
                className="rounded-xl p-6 shadow mb-10"
                style={{ backgroundColor: "#FAFEFF" }}
              >
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{ color: "#3999FF" }}
                >
                  Recent Activity
                </h2>
                <div className="overflow-auto max-h-80 text-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e3f4fb" }}>
                        {[
                          "Visit Code",
                          "College",
                          "City",
                          "Phase",
                          "Students",
                          "Value",
                          "Point of Contact Name",
                          "Point of Contact Number",
                          "Courses",
                          "Auto Date",
                          "Per Student Rate",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="p-2 font-medium text-left"
                            style={{ color: "#3999FF" }}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisits.slice(0, 3).map((visit) => (
                        <tr
                          key={visit.id}
                          style={{ borderTop: "1px solid #eef7fb" }}
                        >
                          <td className="p-2">{visit["Visit Code"]}</td>
                          <td className="p-2">{visit["College Name"]}</td>
                          <td className="p-2">{visit["City"]}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <VisitStatusBadge phase={visit["Visit Phase"]} />
                          </td>

                          <td className="p-2">
                            {Number(visit["Student Count"] || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td className="p-2">
                            {visit["Total Contract Value"] != null
                              ? `₹${Number(
                                  visit["Total Contract Value"]
                                ).toLocaleString("en-IN")}`
                              : ""}
                          </td>
                          <td className="p-2">
                            {visit["Point of Contact Name"]}
                          </td>
                          <td className="p-2">
                            {visit["Point of Contact Number"]}
                          </td>
                          <td className="p-2">{visit["Courses"]}</td>
                          <td className="p-2">
                            {visit["Auto Date"]
                              ? new Date(
                                  visit["Auto Date"]
                                ).toLocaleDateString()
                              : ""}
                          </td>
                          <td className="p-2">
                            {visit["Per Student Rate"] != null
                              ? `₹${Number(
                                  visit["Per Student Rate"]
                                ).toLocaleString("en-IN")}`
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* All Records Table with sticky header and pagination */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  All Records
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
                    <thead className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                      <tr>
                        {[
                          "Date & Time", // ✅ Add this
                          "Visit Code",
                          "College",
                          "City",
                          "Phase",
                          "Students",
                          "Value",
                          "Contact Name",
                          "Contact Number",

                          "Auto Date",
                          "Rate",
                          "Courses",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedVisits.map((visit, idx) => (
                        <tr
                          key={visit.id}
                          className={`${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 border-b border-gray-100`}
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                            {visit["dateandtime"]?.split(",")[0] || ""}
                          </td>
                          <td className="px-3 py-2 text-blue-600 font-medium break-words whitespace-normal">
                            {visit["Visit Code"]}
                          </td>
                          <td className="px-3 py-2 break-words whitespace-normal">
                            {visit["College Name"]}
                          </td>
                          <td className="px-3 py-2 break-words whitespace-normal">
                            {visit["City"]}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <VisitStatusBadge phase={visit["Visit Phase"]} />
                          </td>

                          <td className="px-3 py-2 text-right">
                            {Number(visit["Student Count"] || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {visit["Total Contract Value"] != null
                              ? `₹${Number(
                                  visit["Total Contract Value"]
                                ).toLocaleString("en-IN")}`
                              : ""}
                          </td>
                          <td className="px-3 py-2 break-words whitespace-normal">
                            {visit["Point of Contact Name"]}
                          </td>
                          <td className="px-3 py-2 break-words whitespace-normal">
                            {visit["Point of Contact Number"]}
                          </td>

                          <td className="px-3 py-2 whitespace-normal">
                            {visit["Auto Date"]
                              ? new Date(
                                  visit["Auto Date"]
                                ).toLocaleDateString()
                              : ""}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {visit["Per Student Rate"] != null
                              ? `₹${Number(
                                  visit["Per Student Rate"]
                                ).toLocaleString("en-IN")}`
                              : ""}
                          </td>
                          <td className="px-3 py-2 break-words whitespace-normal">
                            {visit["Courses"]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-blue-600 border-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-blue-600 border-blue-600 hover:bg-blue-100"
                      }`}
                      aria-current={currentPage === i + 1 ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages || totalPages === 0
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-blue-600 border-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value, color }) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
  };

  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-IN")
      : value?.includes("₹")
      ? `₹${Number(value.replace(/[₹,]/g, "")).toLocaleString("en-IN")}`
      : value;

  return (
    <div
      className={`rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-start justify-center ${colorMap[color]}`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="text-3xl font-bold mt-2">{formattedValue}</p>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.oneOf(["blue", "green", "red"]).isRequired,
};

export default SalesVisitDashboard;
