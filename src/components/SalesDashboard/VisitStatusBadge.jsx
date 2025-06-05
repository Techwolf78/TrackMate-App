import PropTypes from 'prop-types';
import { romanToNumber } from '../../utils/dashboardUtils';

const STATUS_COLORS = {
  closure: "bg-green-100 text-green-800",
  lead: "bg-purple-100 text-purple-800",
  default: "bg-gray-100 text-gray-600",
};

const FOLLOWUP_YELLOW_SHADES = [
  "bg-yellow-50 text-yellow-900",
  "bg-yellow-100 text-yellow-800",
  "bg-yellow-200 text-yellow-800",
  "bg-yellow-300 text-yellow-900",
  "bg-yellow-400 text-yellow-900",
  "bg-yellow-500 text-yellow-50",
  "bg-yellow-600 text-yellow-50",
  "bg-yellow-700 text-yellow-50",
];

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
    const match = phase.match(/Follow up - (\w+)/i);
    let shadeClass = STATUS_COLORS.default;
    if (match && match[1]) {
      const index = romanToNumber(match[1]) - 1;
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

export default VisitStatusBadge;