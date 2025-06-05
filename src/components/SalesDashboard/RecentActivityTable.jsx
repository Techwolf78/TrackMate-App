import PropTypes from 'prop-types';
import VisitStatusBadge from './VisitStatusBadge';

const RecentActivityTable = ({ visits }) => {
  return (
    <div className="rounded-xl p-6 shadow mb-10" style={{ backgroundColor: "#FAFEFF" }}>
      <h2 className="text-2xl font-semibold mb-4" style={{ color: "#3999FF" }}>
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
            {visits.slice(0, 3).map((visit) => (
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
                  {Number(visit["Student Count"] || 0).toLocaleString("en-IN")}
                </td>
                <td className="p-2">
                  {visit["Total Contract Value"] != null
                    ? `₹${Number(visit["Total Contract Value"]).toLocaleString("en-IN")}`
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
                    ? `₹${Number(visit["Per Student Rate"]).toLocaleString("en-IN")}`
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RecentActivityTable.propTypes = {
  visits: PropTypes.array.isRequired
};

export default RecentActivityTable;