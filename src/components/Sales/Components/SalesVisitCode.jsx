import React, { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database"; // Firebase imports
import { db } from "../../../firebaseConfig"; // Firebase configuration
import PropTypes from 'prop-types';

// Function to get the last visit code from Firebase
const getLastVisitCode = async () => {
  const salesRef = ref(db, "placement_visitcode"); // Reference to the Firebase data

  const snapshot = await get(salesRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const keys = Object.keys(data);
    const lastTransactionKey = keys[keys.length - 1]; // Get the last transaction key
    const lastCode = data[lastTransactionKey].visitCode; // Assuming visitCode is saved under each transaction
    return lastCode;
  }
  return null;
};

// Function to increment the visit code based on the last visit code
const incrementVisitCode = (lastCode) => {
  const num = parseInt(lastCode.split('_')[2], 10); // Extract the number after 'placement_visit_'
  const nextCodeNum = num + 1; // Increment the number
  return `placement_visit_${nextCodeNum.toString().padStart(2, '0')}`; // Return the incremented code, padded with zero if needed
};

const PlacementVisitCode = ({ onCodeChange }) => {
  const [visitCode, setVisitCode] = useState("");

  useEffect(() => {
    const fetchVisitCode = async () => {
      try {
        const lastCode = await getLastVisitCode();
        if (lastCode) {
          const nextCode = incrementVisitCode(lastCode); // Generate the next code
          setVisitCode(nextCode);
          onCodeChange(nextCode); // Pass the generated code to the parent component
        } else {
          const defaultCode = "placement_visit_01"; // Default code if no data exists
          setVisitCode(defaultCode);
          onCodeChange(defaultCode); // Pass default code to the parent component
        }
      } catch (error) {
        console.error("Error fetching last visit code:", error);
        const defaultCode = "placement_visit_01"; // Fallback to default code in case of error
        setVisitCode(defaultCode);
        onCodeChange(defaultCode); // Pass default code to the parent component
      }
    };

    fetchVisitCode();
  }, [onCodeChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Saving the visitCode to Firebase
      await set(ref(db, "placement_visitcode"), { visitCode });
      console.log("Visit code saved:", visitCode);

      // Here you can trigger the modal success message logic if needed
    } catch (error) {
      console.error("Error saving visit code:", error);
    }
  };

  return (
    <div>
      <div className="text-sm font-semibold">
        <p>Visit Code: {visitCode}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Visit Code
        </button>
      </form>
    </div>
  );
};

// PropTypes validation
PlacementVisitCode.propTypes = {
  onCodeChange: PropTypes.func.isRequired, // Prop type validation for onCodeChange
};

export default PlacementVisitCode;
