import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../../firebaseConfig";

// This component is responsible for fetching the last placement code and generating the next one
const PlacementVisitCode = () => {
  const [visitCode, setVisitCode] = useState("");

  useEffect(() => {
    const fetchLastVisitCode = async () => {
      try {
        const spentRef = ref(db, "sales_spent/");
        const snapshot = await get(spentRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const lastCode = getLastPlacementCode(data);
          const nextCode = incrementPlacementCode(lastCode);
          setVisitCode(nextCode);
        } else {
          setVisitCode("Placement_01"); // Default to Placement_01 if no data found
        }
      } catch (error) {
        console.error("Error fetching last placement code:", error);
      }
    };

    fetchLastVisitCode();
  }, []);

  // Function to extract the last placement code from Firebase data
  const getLastPlacementCode = (data) => {
    const codes = Object.values(data)
      .map((item) => item.visitCode)
      .filter((code) => code.startsWith("Placement_"));
    const lastCode = codes.sort((a, b) => {
      const numA = parseInt(a.split("_")[1]);
      const numB = parseInt(b.split("_")[1]);
      return numB - numA; // Sort in descending order
    })[0];

    return lastCode || "Placement_00"; // Default to "Placement_00" if no code found
  };

  // Function to increment the placement code
  const incrementPlacementCode = (lastCode) => {
    const lastCodeNumber = parseInt(lastCode.split("_")[1]);
    const nextCodeNumber = lastCodeNumber + 1;
    return `Placement_${nextCodeNumber.toString().padStart(2, "0")}`;
  };

  return visitCode; // Just return the next code
};

export default PlacementVisitCode;
