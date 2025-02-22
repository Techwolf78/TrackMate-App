import React from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const FileDetailSidebar = ({ 
  selectedFile, 
  onClose, 
  onDownload, 
  formatFileSize, 
  formatToMonthDayYear 
}) => {
  if (!selectedFile) return null;

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-10 p-6 transform transition-all duration-300 ease-in-out rounded-lg overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-blue-600 transition-all duration-200 ease-in-out"
      >
        <FaTimes />
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {selectedFile.original_filename}
      </h2>
      <div className="relative w-full h-56 mb-6 rounded-lg overflow-hidden shadow-md">
        <img
          src={selectedFile.secure_url}
          alt={selectedFile.original_filename}
          className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-all duration-300 ease-in-out"
        />
      </div>
      <div className="space-y-3 text-gray-700 text-lg">
        <p>
          <strong className="text-gray-900">Size:</strong>{" "}
          {formatFileSize(selectedFile.size)}
        </p>
        <p>
          <strong className="text-gray-900">Dimensions:</strong>{" "}
          {selectedFile.width}x{selectedFile.height}
        </p>
        <p>
          <strong className="text-gray-900">Uploaded At:</strong>{" "}
          {formatToMonthDayYear(selectedFile.created_at)}
        </p>
        <p>
          <strong className="text-gray-900">Format:</strong>{" "}
          {selectedFile.format}
        </p>
      </div>
      <button
        onClick={() => onDownload(selectedFile.secure_url, selectedFile.original_filename)}
        className="mt-6 w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-500 hover:to-blue-400 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Download
      </button>
    </div>
  );
};

FileDetailSidebar.propTypes = {
  selectedFile: PropTypes.shape({
    original_filename: PropTypes.string.isRequired,
    secure_url: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  formatFileSize: PropTypes.func.isRequired,
  formatToMonthDayYear: PropTypes.func.isRequired
};

export default FileDetailSidebar;