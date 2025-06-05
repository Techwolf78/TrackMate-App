import PropTypes from 'prop-types';
import VisitStatusBadge from './VisitStatusBadge';

const AllRecordsTable = ({ visits, currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        All Records
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
          <thead className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
            <tr>
              {[
                "Date & Time",
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
            {visits.map((visit, idx) => (
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
                  {Number(visit["Student Count"] || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-2 text-right">
                  {visit["Total Contract Value"] != null
                    ? `₹${Number(visit["Total Contract Value"]).toLocaleString("en-IN")}`
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
                    ? new Date(visit["Auto Date"]).toLocaleDateString()
                    : ""}
                </td>
                <td className="px-3 py-2 text-right">
                  {visit["Per Student Rate"] != null
                    ? `₹${Number(visit["Per Student Rate"]).toLocaleString("en-IN")}`
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
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
  );
};

AllRecordsTable.propTypes = {
  visits: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default AllRecordsTable;