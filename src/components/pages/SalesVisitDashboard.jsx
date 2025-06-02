import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import PropTypes from "prop-types";

const SalesVisitDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

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

  const filteredVisitsDesc = visits
    .filter((v) =>
      filterCity ? v["City"]?.toLowerCase() === filterCity.toLowerCase() : true
    )
    .sort((a, b) => {
      const codeA = a["Visit Code"] || "";
      const codeB = b["Visit Code"] || "";
      return codeB.localeCompare(codeA, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

  const filteredVisitsAsc = [...filteredVisitsDesc].sort((a, b) => {
    const codeA = a["Visit Code"] || "";
    const codeB = b["Visit Code"] || "";
    return codeA.localeCompare(codeB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const totalVisits = filteredVisitsDesc.length;
  const successfulConversions = filteredVisitsDesc.filter(
    (v) => v["Visit Phase"]?.toLowerCase() === "closure"
  ).length;
  const pendingFollowups = filteredVisitsDesc.filter((v) =>
    v["Visit Phase"]?.toLowerCase().includes("follow")
  ).length;

  const getAverage = (key) => {
    const total = filteredVisitsDesc.reduce((sum, v) => {
      return sum + (Number(v[key]) || 0);
    }, 0);
    return filteredVisitsDesc.length > 0
      ? (total / filteredVisitsDesc.length).toFixed(2)
      : "0.00";
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredVisitsDesc);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales_visits.csv");
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="mb-10 border-b pb-4">
          <h1 className="text-4xl font-semibold text-gray-800 text-center">
            Sales Visit Dashboard
          </h1>
          <p className="text-gray-500 text-center mt-2">
            Monitor sales visits, conversions, and follow-ups at a glance.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading data...</div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <select
                onClick={loadCities}
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="px-4 py-2 border rounded w-full sm:w-64"
              >
                <option value="">All City</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow"
              >
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <StatCard label="Total Visits" value={totalVisits} color="blue" />
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
                    {filteredVisitsDesc.slice(0, 3).map((visit) => (
                      <tr
                        key={visit.id}
                        style={{ borderTop: "1px solid #eef7fb" }}
                      >
                        <td className="p-2">{visit["Visit Code"]}</td>
                        <td className="p-2">{visit["College Name"]}</td>
                        <td className="p-2">{visit["City"]}</td>
                        <td className="p-2">{visit["Visit Phase"]}</td>
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
                            ? new Date(visit["Auto Date"]).toLocaleDateString()
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

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                All Records
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      {[
                        "Visit Code",
                        "College",
                        "City",
                        "Phase",
                        "Students",
                        "Value",
                        "Contact Name",
                        "Contact Number",
                        "Courses",
                        "Auto Date",
                        "Rate",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-3 py-2 text-left font-medium text-gray-600"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitsAsc.map((visit, idx) => (
                      <tr
                        key={visit.id}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 border-b border-gray-100`}
                      >
                        <td className="px-3 py-2 text-blue-600 font-medium break-words">
                          {visit["Visit Code"]}
                        </td>
                        <td className="px-3 py-2 break-words whitespace-normal">
                          {visit["College Name"]}
                        </td>
                        <td className="px-3 py-2 break-words whitespace-normal">
                          {visit["City"]}
                        </td>
                        <td className="px-3 py-2 break-words whitespace-normal">
                          {visit["Visit Phase"]}
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
                        <td className="px-3 py-2 break-words whitespace-normal">
                          {visit["Courses"]}
                        </td>
                        <td className="px-3 py-2 break-words whitespace-normal">
                          {visit["Auto Date"]
                            ? new Date(visit["Auto Date"]).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="px-3 py-2 text-right">
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
          </>
        )}
      </div>
    </div>
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
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  color: PropTypes.oneOf(["blue", "green", "red"]).isRequired,
};


export default SalesVisitDashboard;
