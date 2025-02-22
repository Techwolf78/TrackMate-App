import PropTypes from 'prop-types';
import { useState } from 'react';
import imageCompression from 'browser-image-compression'; // Import the compression library

const formatFileSize = (bytes) => {
  const sizes = ['bytes', 'KB', 'MB'];
  if (bytes === 0) return '0 bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / (1024 ** i)).toFixed(i > 0 ? 2 : 0)} ${sizes[i]}`;
};

const BillsModal = ({
  isOpen,
  onClose,
  saveToFirebase,
  setShowSuccessToast,
  setShowErrorToast,
  folderName // Add folderName prop
}) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const CLOUD_NAME = "dcjmaapvi";
  const UPLOAD_PRESET = "tracker";

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxFileSize = 10 * 1024 * 1024;

    const newFiles = [];

    for (let file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Only image files (JPG, PNG, JPEG) are allowed.");
        continue;
      }
      if (file.size > maxFileSize) {
        // Compress the image if it's too large
        try {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 10, // Set max size to 10MB
            maxWidthOrHeight: 1024, // Resize the image to fit within this width or height
            useWebWorker: true
          });
          newFiles.push(compressedFile);
        } catch (error) {
          alert(`${file.name} couldn't be compressed properly!`);
          console.error(error);
        }
      } else {
        // If it's already under the 10MB limit, just add it as is
        newFiles.push(file);
      }
    }

    if (newFiles.length > 0) {
      setFiles([...files, ...newFiles]);
      setUploadProgress([...uploadProgress, ...newFiles.map(() => 0)]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploadProgress(uploadProgress.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (files.some(file => file.size > 10 * 1024 * 1024)) {
      alert("Please select an image file smaller than 10MB.");
      return;
    }

    setIsUploading(true);
    uploadFiles(files);
  };

  const uploadFiles = async (filesToUpload) => {
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("cloud_name", CLOUD_NAME);
  
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await response.json();
  
        console.log('Cloudinary Response:', data);
  
        const additionalData = {
          ...data,
          dept: "sales" 
        };
  
        saveToFirebase(additionalData, folderName);
  
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? 100 : p));
      } catch (error) {
        console.error("Upload failed:", error);
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    }
  
    setIsUploading(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setFiles([]);
      setUploadProgress([]);
      setShowSuccessToast(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-2">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="font-bold text-xl">×</span>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-white border border-gray-400 flex items-center justify-center rounded-full mr-4">
            <img src="./upload.png" alt="Upload" className="w-6 h-6" />
          </div>
          <h3 className="text-xl text-gray-700 font-semibold">Upload Your Bills</h3>
        </div>

        <div className="border-dashed border-2 border-gray-400 rounded-xl p-8 text-center">
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer block"
          >
            <p className="text-gray-700">Drag & Drop files or click to browse</p>
            <p className="text-gray-500 text-sm mt-2">Supported formats: JPG, PNG (up to 10MB)</p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg mt-2">
                <span className="text-sm text-gray-600">
                  {file.name} ({formatFileSize(file.size)})
                </span>
                <div className="flex items-center">
                  {isUploading && (
                    <div className="w-20 h-2 bg-gray-200 rounded mr-4">
                      <div
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${uploadProgress[index]}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 text-xl"
                    disabled={isUploading}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="w-full bg-indigo-500 text-white py-2 rounded-lg mt-6 disabled:opacity-50"
          onClick={handleUploadClick}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

BillsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  saveToFirebase: PropTypes.func.isRequired,
  setShowSuccessToast: PropTypes.func.isRequired,
  setShowErrorToast: PropTypes.func.isRequired,
  folderName: PropTypes.string.isRequired
};

export default BillsModal;
