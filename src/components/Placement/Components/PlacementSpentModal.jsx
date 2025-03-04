// PlacementSpentModal.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../../firebaseConfig";
import CompanyList from "../../Placement/Components/CompanyList";
import { format } from "date-fns";

const PlacementSpentModal = ({ isOpen, onClose, handleSave }) => {
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [spentAmount, setSpentAmount] = useState("");
  const [visitType, setVisitType] = useState("");
  const [company, setCompany] = useState(""); // Changed from college to company
  const [otherCompanyName, setOtherCompanyName] = useState(""); // Changed from otherCollegeName to otherCompanyName
  const [additionalCompanies, setAdditionalCompanies] = useState([]); // Changed from additionalColleges to additionalCompanies
  const [food, setFood] = useState("");
  const [fuel, setFuel] = useState("");
  const [stay, setStay] = useState("");
  const [toll, setToll] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state

  if (!isOpen) return null;

  const handleAddCompany = () => {
    setAdditionalCompanies([...additionalCompanies, ""]);
  };

  const handleCompanyChange = (index, value) => {
    const newCompanies = [...additionalCompanies];
    newCompanies[index] = value;
    setAdditionalCompanies(newCompanies);
  };

  const handleDeleteCompany = (index) => {
    const newCompanies = additionalCompanies.filter((_, i) => i !== index);
    setAdditionalCompanies(newCompanies);
  };

  // Function to save each record and handle retry logic
  const saveRecordWithRetry = async (spentData, retries = 3) => {
    const newSpentRef = ref(db, "plac_spent/" + Date.now());
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

    const dateToSave = selectedDate.getTime();

    // Remove all validation checks. The form will submit regardless of field content.

    // Convert inputs to numbers for calculations (they will default to 0 if empty)
    const allocatedAmountNum = parseFloat(allocatedAmount) || 0;
    const spentAmountNum = parseFloat(spentAmount) || 0;
    const foodNum = parseFloat(food) || 0;
    const fuelNum = parseFloat(fuel) || 0;
    const stayNum = parseFloat(stay) || 0;
    const tollNum = parseFloat(toll) || 0;

    // Calculate total companies including main and additional companies
    const totalCompanies =
      additionalCompanies.length +
      (company === "Other" ? 1 : 0) +
      (company !== "" && company !== "Other" ? 1 : 0);

    // Calculate split amounts for food, fuel, stay, and toll
    const foodSplit = foodNum / totalCompanies;
    const fuelSplit = fuelNum / totalCompanies;
    const staySplit = stayNum / totalCompanies;
    const tollSplit = tollNum / totalCompanies;

    const spentDataArray = [];

    const mainCompany = company === "Other" ? otherCompanyName : company;
    if (company !== "") {
      spentDataArray.push({
        allocatedAmount: allocatedAmountNum / totalCompanies,
        spentAmount: spentAmountNum / totalCompanies,
        visitType,
        company: mainCompany,
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave,
      });
    }

    additionalCompanies.forEach((companyName) => {
      spentDataArray.push({
        allocatedAmount: allocatedAmountNum / totalCompanies,
        spentAmount: spentAmountNum / totalCompanies,
        visitType,
        company: companyName,
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
    setCompany("");
    setOtherCompanyName("");
    setAdditionalCompanies([]);
    setFood("");
    setFuel("");
    setStay("");
    setToll("");
    
    setIsSubmitting(false); // Stop loader
  };

  const formatDate = (date) => {
    return format(date, "dd/MM/yyyy");
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
            value={company}
            onChange={(e) => setCompany(e.target.value)} // Changed college to company
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
          >
            <option value="">Select Company</option>
            <CompanyList />
          </select>

          {company === "Other" && (
            <input
              type="text"
              value={otherCompanyName}
              onChange={(e) => setOtherCompanyName(e.target.value)} // Changed from otherCollegeName to otherCompanyName
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
              placeholder="Enter Other Company Name"
            />
          )}

          {visitType === "Multiple Visit" &&
            additionalCompanies.map((company, index) => (
              <div key={index} className="flex items-center space-x-1">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => handleCompanyChange(index, e.target.value)} // Changed from handleCollegeChange to handleCompanyChange
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
                  placeholder={`Company ${index + 2}`}
                />
                <button
                  onClick={() => handleDeleteCompany(index)} // Changed from handleDeleteCollege to handleDeleteCompany
                  className="text-red-500 hover:text-red-700 transition text-sm"
                >
                  ✖
                </button>
              </div>
            ))}

          {visitType === "Multiple Visit" && (
            <button
              onClick={handleAddCompany} // Changed from handleAddCollege to handleAddCompany
              className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
            >
              Add Company
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
            placeholder="Food"
          />
          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Fuel"
          />
          <input
            type="number"
            value={stay}
            onChange={(e) => setStay(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Stay"
          />
          <input
            type="number"
            value={toll}
            onChange={(e) => setToll(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Toll"
          />

          {/* Loader */}
          {isSubmitting && (
            <div className="w-full flex justify-center items-center space-x-2">
              <div className="animate-spin w-6 h-6 border-4 border-t-4 border-indigo-500 border-solid rounded-full"></div>
              <p>Submitting...</p>
            </div>
          )}

          <button
            onClick={handleFormSubmit}
            className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

PlacementSpentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default PlacementSpentModal;
