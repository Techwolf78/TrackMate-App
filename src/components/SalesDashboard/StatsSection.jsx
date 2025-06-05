import PropTypes from 'prop-types';
import StatCard from './StatCard';
import { getAverage } from '../../utils/dashboardUtils.js';

const StatsSection = ({ 
  visits, 
  totalVisits, 
  successfulConversions, 
  pendingFollowups 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Visits" value={totalVisits} color="blue" />
        <StatCard label="Successful Conversions" value={successfulConversions} color="green" />
        <StatCard label="Pending Follow-ups" value={pendingFollowups} color="red" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard 
          label="Average Student Count" 
          value={Number(getAverage(visits, "Student Count"))} 
          color="blue" 
        />
        <StatCard 
          label="Average Contract Value" 
          value={`₹${getAverage(visits, "Total Contract Value")}`} 
          color="green" 
        />
        <StatCard 
          label="Avg. Per Student Rate" 
          value={`₹${getAverage(visits, "Per Student Rate")}`} 
          color="red" 
        />
      </div>
    </>
  );
};

StatsSection.propTypes = {
  visits: PropTypes.array.isRequired,
  totalVisits: PropTypes.number.isRequired,
  successfulConversions: PropTypes.number.isRequired,
  pendingFollowups: PropTypes.number.isRequired
};

export default StatsSection;