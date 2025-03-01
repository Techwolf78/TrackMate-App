// PlacementSpentModal.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../../firebaseConfig";
import CompanyList from "../../Placement/Components/CompanyList";
import { format } from "date-fns"; 
import PlacementVisitCode from "../../Placement/Components/PlacementVisitCode"; 

const PlacementSpentModal = ({ isOpen, onClose, handleSave }) => {
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [spentAmount, setSpentAmount] = useState("");
  const [visitType, setVisitType] = useState("");
  const [college, setCollege] = useState("");
  const [otherCollegeName, setOtherCollegeName] = useState("");
  const [additionalColleges, setAdditionalColleges] = useState([]);
  const [food, setFood] = useState("");
  const [fuel, setFuel] = useState("");
  const [stay, setStay] = useState("");
  const [toll, setToll] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [visitCode, setVisitCode] = useState(""); // State for visit code

  if (!isOpen) return null;

  // Handle the change of visit code from PlacementVisitCode
  const handleVisitCodeChange = (newCode) => {
    setVisitCode(newCode);
  };

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

  const handleFormSubmit = () => {
    // If no date is selected, use today's date
    const dateToSave = selectedDate.getTime(); 

    if (!allocatedAmount || !spentAmount || !visitType || !college || !visitCode) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Calculate total colleges including main and additional colleges
    const totalColleges =
      additionalColleges.length +
      (college === "Other" ? 1 : 0) +
      (college !== "" && college !== "Other" ? 1 : 0);

    // Calculate split amounts for food, fuel, stay, and toll
    const foodSplit = (parseFloat(food) || 0) / totalColleges;
    const fuelSplit = (parseFloat(fuel) || 0) / totalColleges;
    const staySplit = (parseFloat(stay) || 0) / totalColleges;
    const tollSplit = (parseFloat(toll) || 0) / totalColleges;

    const spentDataArray = [];

    const mainCollege = college === "Other" ? otherCollegeName : college;
    if (college !== "") {
      spentDataArray.push({
        allocatedAmount: allocatedAmount / totalColleges,
        spentAmount: spentAmount / totalColleges,
        visitType,
        college: mainCollege, 
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave, 
        visitCode, 
      });
    }

    additionalColleges.forEach((collegeName) => {
      spentDataArray.push({
        allocatedAmount: allocatedAmount / totalColleges,
        spentAmount: spentAmount / totalColleges,
        visitType,
        college: collegeName, 
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave, 
        visitCode, 
      });
    });

    spentDataArray.forEach((spentData) => {
      const newSpentRef = ref(db, "plac_spent/" + Date.now());
      set(newSpentRef, spentData)
        .then(() => {
          console.log("Data saved successfully!");
          handleSave(spentData);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    });

    // Reset the form after submission
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
    setVisitCode(""); // Reset visit code
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
          {/* Pass onCodeChange to PlacementVisitCode */}
          <PlacementVisitCode onCodeChange={handleVisitCodeChange} />

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
            <option value="">Select Company</option>
            <CompanyList />
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
          >
            Save
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
