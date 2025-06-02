import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ref, get, set } from "firebase/database"; // Firebase database imports
import { db } from "../../../firebaseConfig"; // Firebase configuration

function SalesVisitCode({ onCodeGenerated }) {
  const [visitCode, setVisitCode] = useState("");

  // Function to get the last visit code from Firebase
  const getLastVisitCode = async () => {
    const salesVisitRef = ref(db, "sales_visitcode");

    const snapshot = await get(salesVisitRef);
    if (snapshot.exists()) {
      const lastCode = snapshot.val().visitCode; // Get the last visit code from Firebase
      return lastCode;
    }
    return null;
  };

  const incrementVisitCode = (lastCode) => {
    const num = parseInt(lastCode.split('_')[2], 10); // Change split delimiter to '_'
    const nextCodeNum = num + 1;
    return `sales_visit_${String(nextCodeNum).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchVisitCode = async () => {
      try {
        const lastCode = await getLastVisitCode();
        if (lastCode) {
          const nextCode = incrementVisitCode(lastCode); // Generate the next code
          setVisitCode(nextCode); // Set the visit code in the state
          // Save the next visit code to Firebase
          const salesVisitRef = ref(db, "sales_visitcode");
          await set(salesVisitRef, { visitCode: nextCode }); // Update the visit code in Firebase
        } else {
          const defaultCode = "sales_visit_01";
          setVisitCode(defaultCode);
          // Save the default visit code to Firebase
          const salesVisitRef = ref(db, "sales_visitcode");
          await set(salesVisitRef, { visitCode: defaultCode }); // Save the default code in Firebase
        }
      } catch (error) {
        console.error("Error fetching last visit code:", error);
        const defaultCode = "sales_visit_01";
        setVisitCode(defaultCode);
        // Save the default visit code to Firebase
        const salesVisitRef = ref(db, "sales_visitcode");
        await set(salesVisitRef, { visitCode: defaultCode }); // Save the default code in Firebase
      }
    };

    fetchVisitCode();
  }, []);

  useEffect(() => {
    // Save the visit code to sessionStorage and call onCodeGenerated when it's set
    if (visitCode) {
      sessionStorage.setItem("salesVisitCode", visitCode);
      onCodeGenerated(visitCode);
    }
  }, [visitCode, onCodeGenerated]);

  return null;
}

SalesVisitCode.propTypes = {
  onCodeGenerated: PropTypes.func.isRequired,
};

export default SalesVisitCode;
