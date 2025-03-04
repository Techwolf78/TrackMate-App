import PropTypes from "prop-types";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../../firebaseConfig";
import CollegeList from "./CollegeList"; // Kept CollegeList as is
import { format } from "date-fns"; // Using date-fns for date formatting

const SalesSpentModal = ({ isOpen, onClose, handleSave }) => {
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [spentAmount, setSpentAmount] = useState("");
  const [visitType, setVisitType] = useState("");
  const [college, setCollege] = useState(""); // Keeping the College terminology
  const [otherCollegeName, setOtherCollegeName] = useState(""); // Keeping the College terminology
  const [additionalColleges, setAdditionalColleges] = useState([]); // Keeping the College terminology
  const [food, setFood] = useState("");
  const [fuel, setFuel] = useState("");
  const [stay, setStay] = useState("");
  const [toll, setToll] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state

  if (!isOpen) return null;

  const handleAddCollege = () => {
    setAdditionalColleges([...additionalColleges, ""]);
  };

  const handleCollegeChange = (index, value) => {
    const newColleges = [...additionalColleges];
    newColleges[index] = value;
    setAdditionalColleges(newColleges);
  };

  const handleDeleteCollege = (index) => {
    const newColleges = additionalColleges.filter((_, i) => i !== index);
    setAdditionalColleges(newColleges);
  };

  // Retry logic for saving the data
  const saveRecordWithRetry = async (spentData, retries = 3) => {
    const newSpentRef = ref(db, "plac_spent/" + Date.now()); // Firebase reference for plac_spent
    try {
      await set(newSpentRef, spentData); // Try to save the record
      console.log("Data saved:", spentData);
      return true; // Return true if save is successful
    } catch (error) {
      console.error("Error saving data:", error);

      // Retry logic
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts remaining`);
        return await saveRecordWithRetry(spentData, retries - 1);
      } else {
        console.log("Failed after multiple attempts.");
        return false; // Return false if all retries fail
      }
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true); // Start loader

    const dateToSave = selectedDate.getTime(); // Convert selected date to timestamp

    // Convert inputs to numbers for calculations (they will default to 0 if empty)
    const allocatedAmountNum = parseFloat(allocatedAmount) || 0;
    const spentAmountNum = parseFloat(spentAmount) || 0;
    const foodNum = parseFloat(food) || 0;
    const fuelNum = parseFloat(fuel) || 0;
    const stayNum = parseFloat(stay) || 0;
    const tollNum = parseFloat(toll) || 0;

    // Calculate total colleges (including main and additional colleges)
    const totalColleges =
      additionalColleges.length +
      (college === "Other" ? 1 : 0) +
      (college !== "" && college !== "Other" ? 1 : 0);

    // Calculate split amounts for food, fuel, stay, and toll
    const foodSplit = foodNum / totalColleges;
    const fuelSplit = fuelNum / totalColleges;
    const staySplit = stayNum / totalColleges;
    const tollSplit = tollNum / totalColleges;

    const spentDataArray = [];

    // Add the main college (or selected college)
    const mainCollege = college === "Other" ? otherCollegeName : college;
    if (college !== "") {
      spentDataArray.push({
        allocatedAmount: allocatedAmountNum / totalColleges,
        spentAmount: spentAmountNum / totalColleges,
        visitType,
        college: mainCollege,
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave,
      });
    }

    // Add the additional colleges
    additionalColleges.forEach((collegeName) => {
      spentDataArray.push({
        allocatedAmount: allocatedAmountNum / totalColleges,
        spentAmount: spentAmountNum / totalColleges,
        visitType,
        college: collegeName,
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave,
      });
    });

    // Submit each record one by one with retries
    const allSaveResults = [];
    for (let i = 0; i < spentDataArray.length; i++) {
      const spentData = spentDataArray[i];
      const saveResult = await saveRecordWithRetry(spentData); // Wait for each save attempt
      allSaveResults.push(saveResult);
    }

    // Check if all records were saved successfully
    if (allSaveResults.every((result) => result)) {
      console.log("All data saved successfully!");
      handleSave(spentDataArray); // Call the callback to handle the success
    } else {
      console.log("Some records failed to save. Please try again.");
    }

    // Reset form fields after saving
    setAllocatedAmount("");
    setSpentAmount("");
    setVisitType("");
    setCollege("");
    setOtherCollegeName("");
    setAdditionalColleges([]);
    setFood("");
    setFuel("");
    setStay("");
    setToll("");

    setIsSubmitting(false); // Stop loader
  };

  // Format the date to DD/MM/YYYY using date-fns
  const formatDate = (date) => {
    return format(date, "dd/MM/yyyy"); // Formats it as DD/MM/YYYY (e.g., 22/02/2025)
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-1 mb-8">
      <div className="bg-white p-4 rounded-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto shadow-lg">
        <div
          onClick={onClose}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="font-bold text-lg">×</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Spent - {formatDate(selectedDate)} {/* Display the current date */}
        </h3>

        <div className="space-y-3">
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
          >
            <option value="">Visit Type</option>
            <option value="Single Visit">Single Visit</option>
            <option value="Multiple Visit">Multiple Visit</option>
          </select>

          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
          >
            <option value="">Select College</option>
            <CollegeList /> {/* Use CollegeList here */}
          </select>

          {college === "Other" && (
            <input
              type="text"
              value={otherCollegeName}
              onChange={(e) => setOtherCollegeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
              placeholder="Enter Other College Name"
            />
          )}

          {visitType === "Multiple Visit" &&
            additionalColleges.map((college, index) => (
              <div key={index} className="flex items-center space-x-1">
                <input
                  type="text"
                  value={college}
                  onChange={(e) => handleCollegeChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
                  placeholder={`College ${index + 2}`}
                />
                <button
                  onClick={() => handleDeleteCollege(index)}
                  className="text-red-500 hover:text-red-700 transition text-sm"
                >
                  ✖
                </button>
              </div>
            ))}

          {visitType === "Multiple Visit" && (
            <button
              onClick={handleAddCollege}
              className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
            >
              Add College
            </button>
          )}

          <input
            type="number"
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Allocated Amount"
          />

          <input
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Spent Amount"
          />

          <input
            type="number"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Food Amount"
          />

          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Fuel Amount"
          />

          <input
            type="number"
            value={stay}
            onChange={(e) => setStay(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Stay Amount"
          />

          <input
            type="number"
            value={toll}
            onChange={(e) => setToll(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Toll Amount"
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition text-sm"
            onClick={handleFormSubmit}
            disabled={isSubmitting} // Disable submit button while submitting
          >
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

SalesSpentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default SalesSpentModal;
