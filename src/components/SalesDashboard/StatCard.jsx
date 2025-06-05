import PropTypes from 'prop-types';

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

export default StatCard;