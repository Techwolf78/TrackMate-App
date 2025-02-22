import { FaCloud } from "react-icons/fa";
import PlacementProfile from "./PlacementProfile";
import PropTypes from "prop-types";  // Import PropTypes

function StorageHeader({ email }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-left text-blue-600 flex items-center mb-4 sm:mb-0">
        <FaCloud className="mr-2 text-blue-600" size={30} />
        Placement Docs
      </h1>
      <PlacementProfile email={email} />
    </div>
  );
}

StorageHeader.propTypes = {
  email: PropTypes.string.isRequired,  // Validate email prop
};

export default StorageHeader;
