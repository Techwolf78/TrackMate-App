import React, { useEffect, useState, useRef, useCallback } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import debounce from "lodash.debounce";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaFileImage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileDetailSidebar from "../FileDetailSidebar";
import StorageHeader from "../Media/StorageHeader";
import DateFilter from "../Placement Docs/DateFilter";

function PlacementDocs() {
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const searchInputRef = useRef(null);
  const hasMoreFiles = filteredFiles.length < files.length;
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add the event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount or when dropdown is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const filesRef = ref(db, "bills");
      const snapshot = await get(filesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fileArray = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key, // Store the Firebase key
        })).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFiles(fileArray);
        applyFilters(fileArray); // Pass files to applyFilters
      } else {
        setFiles([]);
        setFilteredFiles([]);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const applyFilters = useCallback(
    (filesToFilter = files) => {
      let filtered = [...filesToFilter];

      // Apply date filter
      if (dateFilter.startDate) {
        filtered = filtered.filter(
          (file) => new Date(file.created_at) >= new Date(dateFilter.startDate)
        );
      }
      if (dateFilter.endDate) {
        filtered = filtered.filter(
          (file) => new Date(file.created_at) <= new Date(dateFilter.endDate)
        );
      }

      // Apply search filter
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((file) =>
          file.original_filename.toLowerCase().includes(lowerQuery)
        );
      }

      setFilteredFiles(filtered.slice(0, perPage * page));
    },
    [dateFilter, searchQuery, files, page, perPage]
  );

  useEffect(() => {
    if (files.length > 0) {
      applyFilters(files);
    }
  }, [files, applyFilters]);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setPage(1);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/adminlogin");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  const handleLoadMore = () => {
    console.log("Has More Files:", hasMoreFiles); // Debugging to check if this is the problem
    if (!hasMoreFiles) {
      toast.success("No more files to load.");
      return;
    }
    setPage((prev) => {
      const newPage = prev + 1;
      applyFilters(); // Reapply filters for the next page
      return newPage;
    });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail.split("@")[0]);
  }, []);

  const formatToMonthDayYear = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d)
      ? ""
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const handleSearchChange = debounce(() => {
    setPage(1);
  }, 300);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Generate search suggestions
    const lowerQuery = query.toLowerCase();
    const suggestions = files
      .filter((file) =>
        file.original_filename.toLowerCase().includes(lowerQuery)
      )
      .map((file) => file.original_filename);
    setSearchSuggestions([...new Set(suggestions)]);

    handleSearchChange();
  };

  const handleInputClick = (e) => {
    e.stopPropagation(); // Prevent click from propagating to the document
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, searchSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedSuggestion = searchSuggestions[highlightedIndex];
      setSearchQuery(selectedSuggestion);
      searchInputRef.current.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchSuggestions([]);
    setPage(1);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleFileClick = (file) => setSelectedFile(file);
  const handleCloseSidebar = () => setSelectedFile(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const getFileTypeIcon = (fileFormat) => (
    <div className="p-2 rounded-full bg-cyan-400 inline-block">
      <FaFileImage />
    </div>
  );

  const handleDelete = async (firebaseKey) => {
    try {
      const fileRef = ref(db, `bills/${firebaseKey}`);
      await remove(fileRef);
      setFiles(files.filter((file) => file.firebaseKey !== firebaseKey));
      setFilteredFiles(
        filteredFiles.filter((file) => file.firebaseKey !== firebaseKey)
      );
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Error deleting file. Please try again.");
    }
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    await handleDelete(fileToDelete.firebaseKey); // Use fileToDelete.firebaseKey
    setIsDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setFileToDelete(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mb-10 relative font-inter">
      <StorageHeader email={email} />

      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-300 hover:border-blue-500 transition-all duration-200">
          {searchSuggestions.length > 0 && (
            <button
  onClick={() => setSearchSuggestions([])}
  className="text-gray-600 hover:text-gray-900 transition-all duration-150 ml-3"
  title="Clear Suggestions"  // Tooltip text
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>

          )}

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search files..."
            onClick={handleInputClick} // Prevent click from closing the dropdown
            className="w-full px-6 py-3 rounded-lg focus:outline-none text-gray-700 placeholder-gray-400 placeholder-opacity-60"
          />

          <DateFilter onFilterChange={handleDateFilterChange} />

          {/* Clear Search Button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="px-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-lg z-50 border border-gray-100 max-h-48 overflow-y-auto">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`p-3 hover:bg-blue-100 cursor-pointer transition-colors ${
                  index === highlightedIndex ? "bg-blue-100" : ""
                } ${index === 0 ? "rounded-t-lg" : ""} ${
                  index === searchSuggestions.length - 1 ? "rounded-b-lg" : ""
                }`}
              >
                <span className="text-gray-700">
                  {highlightMatch(suggestion, searchQuery)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredFiles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 text-6xl">🔍</div>
          <p className="text-gray-600 mb-2">
            {searchQuery
              ? "No files found matching your search"
              : "No files available"}
          </p>
          <p className="text-gray-500 text-sm">
            {searchQuery
              ? "Try different keywords or check the spelling"
              : "Upload new files to get started"}
          </p>
        </div>
      )}

      {filteredFiles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Recent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFiles.slice(0, 4).map((file, index) => (
              <div
                key={index}
                className="bg-white p-3 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleFileClick(file)}
              >
                <div className="relative w-full h-32 mb-2 overflow-hidden rounded-lg">
                  <img
                    src={file.secure_url}
                    alt={file.original_filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-base text-center text-gray-700 truncate">
                  {file.original_filename}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredFiles.length > 0 && (
        <div className="transition-all duration-300">
          <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b text-left">File Name</th>
                <th className="py-3 px-4 border-b text-left">Size</th>
                <th className="py-3 px-4 border-b text-left">Dimensions</th>
                <th className="py-3 px-4 border-b text-left">Uploaded At</th>
                <th className="py-3 px-4 border-b text-left">Format</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.public_id}
                  className="border-b hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleFileClick(file)}
                >
                  <td className="py-3 px-4 flex items-center">
                    {file.format.startsWith("image/") && (
                      <div className="w-12 h-12 mr-3 overflow-hidden rounded-lg">
                        <img
                          src={file.secure_url}
                          alt={file.original_filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {getFileTypeIcon(file.format)}
                    <span className="ml-2 text-gray-700">
                      {highlightMatch(file.original_filename, searchQuery)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {file.width}x{file.height}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatToMonthDayYear(file.created_at)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{file.format}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.secure_url, file.original_filename);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(file);
                      }}
                      className="text-red-500 hover:underline ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasMoreFiles && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="border-2 border-blue-500 text-blue-500 py-2 px-4 hover:bg-blue-500 hover:text-white transition duration-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3">
            <div className="bg-red-100 p-4 rounded-t-lg">
              <h3 className="text-2xl font-semibold text-gray-700">
                Delete file
              </h3>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">
                Are you sure you want to delete this file?
              </h3>
            </div>
            <p className="text-sm text-gray-600 px-6 py-2">
              This action cannot be undone and will permanently delete the file.
            </p>
            <div className="flex justify-between px-6 py-2">
              <button
                onClick={handleCancelDelete}
                className="text-gray-500 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
  onClick={(e) => {
    e.stopPropagation();
    handleConfirmDelete(); // Call handleConfirmDelete directly
  }}
  className="text-red-500 hover:underline ml-4"
>
  Delete
</button>
            </div>
          </div>
        </div>
      )}

      <FileDetailSidebar
        selectedFile={selectedFile}
        onClose={handleCloseSidebar}
        onDownload={handleDownload}
        formatFileSize={formatFileSize}
        formatToMonthDayYear={formatToMonthDayYear}
      />

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default PlacementDocs;
