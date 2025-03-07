import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database"; // Firebase database imports
import { db } from "../../../firebaseConfig"; // Firebase configuration
import UserProfile from "./PlacementUserDropdown"; // Import the new UserProfile component

function PlacementForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    city: "",
    clientName: "",
    clientDesignation: "",
    clientEmail: "",
    clientContact: "",
    crRep: "",
    visitPurpose: "",
    industry: "",
    domain: "", // This will store the selected domain (default dropdown value)
    otherDomain: "", // This will store the custom domain if 'Other' is selected
    hiringPeriod: "",
    numbersForHiring: "",
    pitched: "",
    jdReceived: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState("");
  const [visitCode, setVisitCode] = useState(""); // Visit Code state

  const navigate = useNavigate();

  // Function to get the last visit code from Firebase
  const getLastVisitCode = async () => {
    const placementVisitRef = ref(db, "placement_visitcode");

    const snapshot = await get(placementVisitRef);
    if (snapshot.exists()) {
      const lastCode = snapshot.val().visitCode; // Get the last visit code from Firebase
      return lastCode;
    }
    return null;
  };

  const incrementVisitCode = (lastCode) => {
    const num = parseInt(lastCode.split('_')[2], 10); // Change index to 2 (the number after "Placement_Visit_")
    const nextCodeNum = num + 1; // Increment the number
    return `Placement_Visit_${String(nextCodeNum).padStart(2, '0')}`; // Zero-pad the number for consistent formatting
  };

  // Fetch the last visit code and set the new visit code
  useEffect(() => {
    const fetchVisitCode = async () => {
      try {
        const lastCode = await getLastVisitCode();
        if (lastCode) {
          const nextCode = incrementVisitCode(lastCode); // Generate the next code
          setVisitCode(nextCode); // Set the visit code in the state
        } else {
          const defaultCode = "Placement_Visit_01"; // Default code if no data exists
          setVisitCode(defaultCode);
        }
      } catch (error) {
        console.error("Error fetching last visit code:", error);
        setVisitCode("Placement_01"); // Fallback to default code in case of error
      }
    };

    fetchVisitCode();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsModalOpen(true);
    setIsLoading(true);

    const finalDomain =
      formData.domain === "Other" ? formData.otherDomain : formData.domain;

    const data = {
      visitCode: visitCode,
      companyName: formData.companyName,
      city: formData.city,
      clientName: formData.clientName,
      clientDesignation: formData.clientDesignation,
      clientEmail: formData.clientEmail,
      clientContact: formData.clientContact,
      crRep: formData.crRep,
      visitPurpose: formData.visitPurpose,
      industry: formData.industry,
      domain: finalDomain,
      hiringPeriod: formData.hiringPeriod,
      numbersForHiring: formData.numbersForHiring,
      pitched: formData.pitched,
      jdReceived: formData.jdReceived,
    };

    try {
      // Save visitCode under placement_visitcode node in Firebase
      const visitCodeRef = ref(db, "placement_visitcode");
      await set(visitCodeRef, {
        visitCode: visitCode,
      });

      // Submit data to Google Sheets
      await fetch(
        "https://script.google.com/macros/s/AKfycbwWz8oqbN65VDZfW_Ics6eYqJcaIBiLnsS1kbjW15Ebak0Ez6mHyGAJJINFki5XuyU/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      setSuccessMessage("Your data has been successfully submitted!");
      setFormData({
        companyName: "",
        city: "",
        clientName: "",
        clientDesignation: "",
        clientEmail: "",
        clientContact: "",
        crRep: "",
        visitPurpose: "",
        industry: "",
        domain: "",
        otherDomain: "",
        hiringPeriod: "",
        numbersForHiring: "",
        pitched: "",
        jdReceived: "",
      });

      // Generate a new visit code for the next submission
      const newVisitCode = incrementVisitCode(visitCode);
      setVisitCode(newVisitCode);

      // Hide the modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setSuccessMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const formClass = "bg-white p-8 max-w-3xl w-full font-inter";
  const inputClass =
    "mt-2 p-2 w-full border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-teal-500"; // Underline style added
  const buttonClass =
    "bg-white text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white hover:border-teal-600 transition duration-300 px-6 py-3 font-semibold rounded-lg w-full";

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className={formClass}>
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-semibold underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m7-7l-7 7 7 7"
              />
            </svg>
            Back
          </button>

          {/* Visit Code */}
          <div className="text-sm font-semibold">{visitCode}</div>

          {/* User Profile Component */}
          <UserProfile /> 
        </div>
        
        {/* All your form fields go here */}
        <div className="mb-4">
          <label htmlFor="companyName" className="text-sm font-semibold">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="text-sm font-semibold">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="clientName" className="text-sm font-semibold">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            id="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="clientDesignation" className="text-sm font-semibold">
            Client Designation
          </label>
          <input
            type="text"
            name="clientDesignation"
            id="clientDesignation"
            value={formData.clientDesignation}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="clientEmail" className="text-sm font-semibold">
            Client Email
          </label>
          <input
            type="email"
            name="clientEmail"
            id="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="clientContact" className="text-sm font-semibold">
            Client Contact
          </label>
          <input
            type="text"
            name="clientContact"
            id="clientContact"
            value={formData.clientContact}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="crRep" className="text-sm font-semibold">
            CR Representative
          </label>
          <input
            type="text"
            name="crRep"
            id="crRep"
            value={formData.crRep}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="visitPurpose" className="text-sm font-semibold">
            Visit Purpose
          </label>
          <input
            type="text"
            name="visitPurpose"
            id="visitPurpose"
            value={formData.visitPurpose}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="industry" className="text-sm font-semibold">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            id="industry"
            value={formData.industry}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="domain" className="text-sm font-semibold">
            Domain
          </label>
          <select
            name="domain"
            id="domain"
            value={formData.domain}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Domain</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.domain === "Other" && (
          <div className="mb-4">
            <label htmlFor="otherDomain" className="text-sm font-semibold">
              Other Domain
            </label>
            <input
              type="text"
              name="otherDomain"
              id="otherDomain"
              value={formData.otherDomain}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="hiringPeriod" className="text-sm font-semibold">
            Hiring Period
          </label>
          <input
            type="text"
            name="hiringPeriod"
            id="hiringPeriod"
            value={formData.hiringPeriod}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="numbersForHiring" className="text-sm font-semibold">
            Number of People for Hiring
          </label>
          <input
            type="text"
            name="numbersForHiring"
            id="numbersForHiring"
            value={formData.numbersForHiring}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pitched" className="text-sm font-semibold">
            Pitched (Yes/No)
          </label>
          <input
            type="text"
            name="pitched"
            id="pitched"
            value={formData.pitched}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="jdReceived" className="text-sm font-semibold">
            JD Received (Yes/No)
          </label>
          <input
            type="text"
            name="jdReceived"
            id="jdReceived"
            value={formData.jdReceived}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className={buttonClass}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementForm;
