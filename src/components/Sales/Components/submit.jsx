import { useState } from "react";
import { db } from "../../../firebaseConfig";
import { ref, set } from "firebase/database";
import SpentModal from "./SalesSpentModal";
import BillsModal from "./BillsModal";
import PlacementDocsModal from "./PlacementDocsModal"; // Import the new modal

function Submit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isPlacementDocsModalOpen, setIsPlacementDocsModalOpen] =
    useState(false); // State for Placement Docs modal

  // Toast notifications
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleSave = (spentData) => {
    const {
      allocatedAmount,
      spentAmount,
      visitType,
      college,
      additionalColleges,
    } = spentData;

    // Validate that all required fields are filled
    if (
      allocatedAmount &&
      spentAmount &&
      visitType &&
      (college || additionalColleges.length > 0)
    ) {
      console.log("Data Saved:", spentData);

      // Close the modal and reset form fields
      setIsModalOpen(false);

      // Show success toast after saving data
      setShowSuccessToast(true);

      // Hide success toast after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const saveToFirebase = (fileData, folderName = "uploaded_files") => {
    const formattedDate = new Date(fileData.created_at).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  
    // Prepare the data to store in Firebase
    const dbData = {
      secure_url: fileData.secure_url,   // The secure URL of the uploaded image
      public_id: fileData.public_id,     // Cloudinary public ID
      original_filename: fileData.original_filename, // Original filename
      size: fileData.bytes,              // Size in bytes
      format: fileData.format,           // Image format (JPG, PNG, etc.)
      width: fileData.width,             // Image width (from Cloudinary)
      height: fileData.height,           // Image height (from Cloudinary)
      created_at: formattedDate,         // Formatted creation date
    };
  
    // Save data to Firebase
    set(ref(db, `${folderName}/${Date.now()}`), dbData)
      .catch((error) => {
        console.error("Firebase save error:", error);
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      });
  };
  

  return (
    <div className="flex justify-center font-inter items-center bg-white mb-10 pt-2 ">
      <div className="flex flex-col md:flex-row justify-center font-inter items-center bg-white  pt-2 ">
        <div className="flex space-x-0 md:space-x-12 flex-col md:flex-row max-w-2xl">
          <button
            className="bg-white text-blue-500 border-2 border-blue-500 px-6 md:px-6 py-2 w-full hover:bg-blue-500 hover:text-white hover:border-blue-600 mb-4 md:mb-0"
            onClick={() => setIsModalOpen(true)}
          >
            Spent
          </button>
          <button
            className="bg-white text-blue-500 border-2 border-blue-500 px-6 md:px-10 py-2 w-full hover:bg-blue-500 hover:text-white hover:border-blue-600 mb-4 md:mb-0"
            onClick={() => setIsBillModalOpen(true)}
          >
            Bills
          </button>
          <button
            className="bg-white text-blue-500 border-2 border-blue-500 px-6 md:px-10 py-2 w-full hover:bg-blue-500 hover:text-white hover:border-blue-600"
            onClick={() => setIsPlacementDocsModalOpen(true)} // Open Placement Docs modal
          >
            Placement Docs
          </button>
        </div>
      </div>

      <SpentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSave={handleSave}
      />

      <BillsModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        saveToFirebase={saveToFirebase}
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
        folderName="bills" // Pass folder name as prop
      />

      <PlacementDocsModal
        isOpen={isPlacementDocsModalOpen}
        onClose={() => setIsPlacementDocsModalOpen(false)}
        saveToFirebase={saveToFirebase}
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
        folderName="placement_docs" // Pass folder name as prop
      />

      {/* Toast Notifications */}
      {showSuccessToast && (
        <div className="fixed top-2 left-2 right-2 bg-green-500 text-white text-center py-3 z-50">
          <p>Data saved successfully!</p>
        </div>
      )}
      {showErrorToast && (
        <div className="fixed top-2 left-2 right-2 bg-red-500 text-white text-center py-3 z-50">
          <p>Upload failed. Please try again.</p>
        </div>
      )}
    </div>
  );
}

export default Submit;
