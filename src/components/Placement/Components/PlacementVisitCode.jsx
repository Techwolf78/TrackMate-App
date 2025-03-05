import { useEffect, useState } from "react";
import { ref, get } from "firebase/database"; // Removed unused imports
import { db } from "../../../firebaseConfig";
import PropTypes from 'prop-types';

// Function to get the last placement code from the most recent transaction
const getLastPlacementCode = async () => {
  const spentRef = ref(db, "sales_spent/");

  const snapshot = await get(spentRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const keys = Object.keys(data);
    const lastTransactionKey = keys[keys.length - 1]; // Get the last transaction key
    const lastCode = data[lastTransactionKey].visitCode; // Assuming visitCode is saved under each transaction
    return lastCode;
  }
  return null;
};

// Function to increment the placement code
const incrementPlacementCode = (lastCode) => {
  const num = parseInt(lastCode.split('_')[1], 10); // Extract the number after 'Placement_'
  const nextCodeNum = num + 1; // Increment the number
  return `Placement_${nextCodeNum}`; // Directly append the incremented number
};

const PlacementVisitCode = ({ onCodeChange }) => {
  const [visitCode, setVisitCode] = useState("");

  useEffect(() => {
    const fetchLastVisitCode = async () => {
      try {
        const lastCode = await getLastPlacementCode();
        if (lastCode) {
          const nextCode = incrementPlacementCode(lastCode); // Generate the next code
          setVisitCode(nextCode);
          onCodeChange(nextCode); // Pass the generated code to the parent component
        } else {
          const defaultCode = "Placement_01"; // Default code if no data exists
          setVisitCode(defaultCode);
          onCodeChange(defaultCode); // Pass default code to the parent component
        }
      } catch (error) {
        console.error("Error fetching last placement code:", error);
        const defaultCode = "Placement_01"; // Fallback to default code in case of error
        setVisitCode(defaultCode);
        onCodeChange(defaultCode); // Pass default code to the parent component
      }
    };

    fetchLastVisitCode();
  }, [onCodeChange]);

  return (
    <div>
      <label htmlFor="visitCode" className="text-sm font-semibold">Visit Code</label>
      <input
        type="text"
        id="visitCode"
        value={visitCode}
        readOnly
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
      />
    </div>
  );
};

// PropTypes validation
PlacementVisitCode.propTypes = {
  onCodeChange: PropTypes.func.isRequired,
};

export default PlacementVisitCode;
