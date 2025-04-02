import { useState, useEffect } from "react";
import SalesUserDropdown from "./SalesUserDropdown";
import SalesBackButton from "./SalesBackButton";
import AffiliationSelect from "./AffiliationSelect"; // Import the new component
import StateSelect from "./StateSelect"; // Import the StateSelect component

function SalesForm() {
  const [formData, setFormData] = useState({
    collegeName: "",
    city: "",
    state: "",
    pointOfContactName: "",
    pointOfContactDesignation: "",
    pointOfContactNumber: "",
    pointOfContactEmail: "",
    accreditation: "",
    otherAccreditation: "",
    affiliation: "",
    otherAffiliation: "",
    salesRep: "",
    visitPurpose: "",
    courses: "",
    otherCourse: "",
    visitPhase: "",
    autoDate: "",
    studentCount: "",
    perStudentRate: "",
    totalContractValue: "",
    remarks: "",
    proposal: "", 
    mou: "",      
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const generateVisitCode = () => {
    return `SALES-VIST-${Math.floor(Math.random() * 10000)}`;
  };

  const [visitCode, setVisitCode] = useState(
    sessionStorage.getItem("salesVisitCode") || generateVisitCode()
  );

  useEffect(() => {
    if (!sessionStorage.getItem("salesVisitCode")) {
      sessionStorage.setItem("salesVisitCode", visitCode);
    }
  }, [visitCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    setIsModalOpen(true);
    setIsLoading(true);

    setTimeout(async () => {
      const data = {
        visitCode: visitCode,
        collegeName: formData.collegeName,
        city: formData.city,
        state: formData.state,
        pointOfContactName: formData.pointOfContactName,
        pointOfContactDesignation: formData.pointOfContactDesignation,
        pointOfContactNumber: formData.pointOfContactNumber,
        pointOfContactEmail: formData.pointOfContactEmail,
        accreditation: formData.accreditation === "Other" ? formData.otherAccreditation : formData.accreditation,
        affiliation: formData.affiliation === "Other" ? formData.otherAffiliation : formData.affiliation,
        salesRep: formData.salesRep,
        visitPurpose: formData.visitPurpose,
        courses: formData.courses === "Other" ? formData.otherCourse : formData.courses,
        visitPhase: formData.visitPhase,
        autoDate: formData.autoDate,
        studentCount: formData.studentCount,
        perStudentRate: formData.perStudentRate,
        totalContractValue: formData.totalContractValue,
        remarks: formData.remarks,
        proposal: formData.proposal, 
        mou: formData.mou,           
      };
      

      try {
        // Remove unused response variable
        await fetch(
          "https://script.google.com/macros/s/AKfycbymNThKKEdl3lzDZiy2KGM8JGMRX1AeBIsklC3JNqIDtVhcLJDgOdgv_5TsoZT0h9k/exec",
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
        setSuccessMessage("Data submitted successfully!");
      } catch (error) {
        console.error("Error during submission:", error);
        setSuccessMessage(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMessage("");
          setFormData({
            collegeName: "",
            city: "",
            state: "",
            pointOfContactName: "",
            pointOfContactDesignation: "",
            pointOfContactNumber: "",
            pointOfContactEmail: "",
            accreditation: "",
            otherAccreditation: "",
            affiliation: "",
            otherAffiliation: "",
            salesRep: "",
            visitPurpose: "",
            courses: "",
            otherCourse: "",
            visitPhase: "",
            autoDate: "",
            studentCount: "",
            perStudentRate: "",
            totalContractValue: "",
            remarks: "",
            proposal: "",  
            mou: "",     
          });
          

          sessionStorage.removeItem("salesVisitCode");
          setVisitCode(generateVisitCode());
        }, 2000);
      }
    }, 500);
  };

  const formClass = "bg-white p-8 max-w-3xl w-full font-inter";
  const inputClass =
    "p-2 w-full border-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none";
  const buttonClass =
    "bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors";

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className={formClass}>
        <div className="flex justify-between items-center mb-4">
          <SalesBackButton />
          <div className="text-sm font-semibold">{visitCode}</div>
          <SalesUserDropdown />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">College Name</label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* State Select Component */}
          <StateSelect state={formData.state} handleChange={handleChange} />

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Point of Contact Name
            </label>
            <input
              type="text"
              name="pointOfContactName"
              value={formData.pointOfContactName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Point of Contact Email
            </label>
            <input
              type="email"
              name="pointOfContactEmail"
              value={formData.pointOfContactEmail}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Change Client Designation */}
          <div>
            <label className="block text-sm font-medium">
              Point of Contact Designation
            </label>
            <input
              type="text"
              name="pointOfContactDesignation"
              value={formData.pointOfContactDesignation}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Change Client Contact */}
          <div>
            <label className="block text-sm font-medium">
              Point of Contact Number
            </label>
            <input
              type="text"
              name="pointOfContactNumber"
              value={formData.pointOfContactNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Accreditation</label>
            <select
              name="accreditation"
              value={formData.accreditation}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Accreditation</option>
              <option value="NBA">NBA</option>
              <option value="NRIF">NRIF</option>
              <option value="NAAC">NAAC</option>
              <option value="NABH">NABH</option>
              <option value="Other">Other</option>
            </select>

            {/* Show this input only if "Other" is selected */}
            {formData.accreditation === "Other" && (
              <div className="mt-2">
                <input
                  type="text"
                  name="otherAccreditation"
                  value={formData.otherAccreditation}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter other accreditation"
                />
              </div>
            )}
          </div>

          {/* Affiliation Field */}
          {/* Affiliation Select Component */}
          <AffiliationSelect
            affiliation={formData.affiliation}
            otherAffiliation={formData.otherAffiliation}
            handleChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium">Sales Rep</label>
            <select
              name="salesRep"
              value={formData.salesRep}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Sales Rep</option>
              <option value="Dheeraj">Dheeraj Jalali</option>
              <option value="Nishad">Nishad Kulkarni</option>
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
            <label className="block text-sm font-medium">Courses</label>
            <select
              name="courses"
              value={formData.courses}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Course</option>
              <option value="Eng.">Eng.</option>
              <option value="MBA">MBA</option>
              <option value="Other">Other</option>
            </select>

            {/* Show input if "Other" is selected */}
            {formData.courses === "Other" && (
              <div className="mt-2">
                <input
                  type="text"
                  name="otherCourse"
                  value={formData.otherCourse}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter other course"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Visit Phase</label>
            <select
              name="visitPhase"
              value={formData.visitPhase}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Visit Phase</option>
              <option value="Lead">Lead</option>
              <option value="Follow up - I">Follow up - I</option>
              <option value="Follow up - II">Follow up - II</option>
              <option value="Follow up - III">Follow up - III</option>
              <option value="Follow up - IV">Follow up - IV</option>
              <option value="Follow up - V">Follow up - V</option>
              <option value="Follow up - VI">Follow up - VI</option>
              <option value="Follow up - VII">Follow up - VII</option>
              <option value="Follow up - VIII">Follow up - VIII</option>
              <option value="Closure">Closure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Auto Date</label>
            <input
              type="date"
              name="autoDate"
              value={formData.autoDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Student Count</label>
            <input
              type="number"
              name="studentCount"
              value={formData.studentCount}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Per Student Rate
            </label>
            <input
              type="number"
              name="perStudentRate"
              value={formData.perStudentRate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Total Contract Value
            </label>
            <input
              type="number"
              name="totalContractValue"
              value={formData.totalContractValue}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Remarks for Next Visit
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              rows="4"
            />
          </div>

          {/* Proposal Dropdown */}
          <div>
            <label className="block text-sm font-medium">Proposal</label>
            <select
              name="proposal"
              value={formData.proposal || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* MOU Dropdown */}
          <div>
            <label className="block text-sm font-medium">MOU</label>
            <select
              name="mou"
              value={formData.mou || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
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

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 px-8">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setIsConfirmModalOpen(false)}
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

            {/* Confirmation Modal Content */}
            <div>
              <div className="text-xl font-semibold mb-4">
                Are you sure you want to submit the form?
              </div>
              <div className="space-x-4">
                <button
                  onClick={handleConfirmSubmit}
                  className="bg-indigo-500 text-white px-6 py-2 rounded-lg"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesForm;
