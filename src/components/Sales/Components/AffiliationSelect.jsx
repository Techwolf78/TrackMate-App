import PropTypes from 'prop-types';

const AffiliationSelect = ({ affiliation, otherAffiliation, handleChange }) => {
  const affiliationOptions = [
    "Autonomous",
    "Savitribai Phule Pune University (SPPU)",
    "University of Mumbai",
    "Shivaji University (Kolhapur)",
    "Dr. Babasaheb Ambedkar Marathwada University (Aurangabad)",
    "Rashtrasant Tukadoji Maharaj Nagpur University",
    "Sant Gadge Baba Amravati University",
    "North Maharashtra University (Jalgaon)",
    "Solapur University",
    "Swami Ramanand Teerth Marathwada University (Nanded)",
    "Yashwantrao Chavan Maharashtra Open University (Nashik)",
    "Dr. Babasaheb Ambedkar Technological University (Lonere)",
    "Maharashtra University of Health Sciences (Nashik)",
    "Maharashtra Animal and Fishery Sciences University (Nagpur)",
    "Mahatma Phule Krishi Vidyapeeth (Rahuri)",
    "Dr. Panjabrao Deshmukh Krishi Vidyapeeth (Akola)",
    "Vasantrao Naik Marathwada Krishi Vidyapeeth (Parbhani)",
    "Dr. Balasaheb Sawant Konkan Krishi Vidyapeeth (Dapoli)",
    "Maharashtra National Law University (Mumbai)",
    "Maharashtra National Law University (Nagpur)",
    "Maharashtra National Law University (Aurangabad)",
    "Dr. Homi Bhabha State University (Mumbai)",
    "HSNC University (Mumbai)",
    "Deccan College Postgraduate and Research Institute (Pune)",
    "Gokhale Institute of Politics and Economics (Pune)",
    "Tilak Maharashtra Vidyapeeth (Pune)",
    "Tata Institute of Social Sciences (Mumbai)",
    "Symbiosis International University (Pune)",
    "Bharati Vidyapeeth (Pune)",
    "D.Y. Patil University (Navi Mumbai)",
    "MIT Art, Design and Technology University (Pune)",
    "Ajeenkya D Y Patil University (Pune)",
    "Flame University (Pune)",
    "Amity University (Mumbai)",
    "Sandip University (Nashik)",
    "Chhatrapati Shivaji Maharaj University (Navi Mumbai)",
    "MGM University (Aurangabad)",
    "Vishwakarma University (Pune)",
    "Spicer Adventist University (Pune)",
    "Symbiosis Skills and Professional University (Pune)",
    "MIT World Peace University (Pune)",
    "Institute of Chemical Technology (Mumbai)",
    "Veermata Jijabai Technological Institute (Mumbai)",
    "College of Engineering Pune (Pune)",
    "Other"
  ];

  // Sort the options alphabetically
  const sortedAffiliationOptions = affiliationOptions.sort();

  // Move "Other" to the end of the list
  const finalAffiliationOptions = sortedAffiliationOptions.filter(option => option !== "Other");
  finalAffiliationOptions.push("Other");

  return (
    <div>
      <label className="block text-sm font-medium">Affiliation</label>
      <select
        name="affiliation"
        value={affiliation}
        onChange={handleChange}
        className="p-2 w-full border-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select Affiliation</option>
        {finalAffiliationOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Show this input only if "Other" is selected */}
      {affiliation === "Other" && (
        <div className="mt-2">
          <input
            type="text"
            name="otherAffiliation"
            value={otherAffiliation}
            onChange={handleChange}
            className="p-2 w-full border-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter other affiliation"
          />
        </div>
      )}
    </div>
  );
};

// Add PropTypes validation
AffiliationSelect.propTypes = {
  affiliation: PropTypes.string.isRequired,
  otherAffiliation: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default AffiliationSelect;
