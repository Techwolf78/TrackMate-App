import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig"; // Firebase auth import
import { signOut } from "firebase/auth"; // Firebase sign-out method

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
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  // Inside your component function:
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const navigate = useNavigate();

  // Dynamically generate Visit Code for Placement
  const generateVisitCode = () => {
    return `PLACEMENT-VIST-${Math.floor(Math.random() * 10000)}`; // Unique visit code for Placement
  };

  // Use sessionStorage to persist visitCode for Placement
  const [visitCode, setVisitCode] = useState(
    sessionStorage.getItem("placementVisitCode") || generateVisitCode()
  );

  // Store the generated visitCode in sessionStorage if not already set
  useEffect(() => {
    if (!sessionStorage.getItem("placementVisitCode")) {
      sessionStorage.setItem("placementVisitCode", visitCode);
    }
  }, [visitCode]);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      // Check if the click is outside of the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close the dropdown if clicked outside
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle change for the domain dropdown
  const handleDomainChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      domain: value,
      otherDomain: value === "Other" ? prevData.otherDomain : "", // Reset custom domain if not "Other"
    }));
  };

  // Handle the custom domain input
  const handleOtherDomainChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      otherDomain: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsModalOpen(true);
    setIsLoading(true);

    // Use the custom domain if 'Other' was selected, else use the selected domain
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
      domain: finalDomain, // Set domain to the custom value if 'Other' is selected
      hiringPeriod: formData.hiringPeriod,
      numbersForHiring: formData.numbersForHiring,
      pitched: formData.pitched,
      jdReceived: formData.jdReceived,
    };

    try {
      // Simulate submission
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

      // Show success message after form submission
      setSuccessMessage("Your data has been successfully submitted!");

      // Reset form data
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
        otherDomain: "", // Reset custom domain
        hiringPeriod: "",
        numbersForHiring: "",
        pitched: "",
        jdReceived: "",
      });

      const newVisitCode = generateVisitCode();
      sessionStorage.setItem("placementVisitCode", newVisitCode);
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

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      navigate("/home"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
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
          {/* User Profile Circle */}
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full bg-blue-100 cursor-pointer flex items-center justify-center text-white"
              onClick={toggleDropdown} // Toggle the dropdown on click
            >
              <img
                src="/user.png" // Reference to the image in the public folder
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Dropdown for Logout */}
            {dropdownOpen && (
              <div
                ref={dropdownRef} // Attach the ref to the dropdown container
                className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Client Designation
            </label>
            <input
              type="text"
              name="clientDesignation"
              value={formData.clientDesignation}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Email ID</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Client Contact No.
            </label>
            <input
              type="text"
              name="clientContact"
              value={formData.clientContact}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">CR Rep</label>
            <select
              name="crRep"
              value={formData.crRep}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select CR Rep</option>
              <option value="Yes">Shashi Kant Sir</option>
              <option value="No">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Visit Purpose</label>
            <input
              type="text"
              name="visitPurpose"
              value={formData.visitPurpose}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Domain</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleDomainChange}
              className={inputClass}
            >
              <option value="">Select Domain</option>
              <option value="Engineering">Engineering</option>
              <option value="MBA">MBA</option>
              <option value="Other">Other</option>
            </select>

            {/* Show additional input for custom domain when "Other" is selected */}
            {formData.domain === "Other" && (
              <div className="mt-2">
                <input
                  type="text"
                  name="otherDomain"
                  value={formData.otherDomain}
                  onChange={handleOtherDomainChange}
                  className={inputClass}
                  placeholder="Enter Other Domain"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Hiring Period</label>
            <input
              type="text"
              name="hiringPeriod"
              value={formData.hiringPeriod}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Numbers for Hiring
            </label>
            <input
              type="number"
              name="numbersForHiring"
              value={formData.numbersForHiring}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pitched</label>
            <select
              name="pitched"
              value={formData.pitched}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Pitched</option>
              <option value="Colleges">Colleges</option>
              <option value="Gryphon">Gryphon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">JD Received</label>
            <input
              type="text"
              name="jdReceived"
              value={formData.jdReceived}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button type="submit" className={buttonClass}>
              Submit
            </button>
          </div>
        </div>
      </form>

      {/* Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div>
              {isLoading ? (
                <>
                  <div className="text-xl font-semibold mb-4">Saving...</div>
                  <div className="animate-spin rounded-full border-t-4 border-teal-500 w-12 h-12 mx-auto mb-4"></div>
                </>
              ) : (
                <>
                  <div className="text-xl font-semibold mb-4">
                    {successMessage}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementForm;
