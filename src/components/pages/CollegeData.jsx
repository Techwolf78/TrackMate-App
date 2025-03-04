import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import CollegeTransModal from '../CollegeData/CollegeTransModal';  // Import the modal component

const CollegeData = () => {
  const [collegeData, setCollegeData] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null); // State to track selected college
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    const fetchData = () => {
      const collegeRef = ref(db, 'sales_spent/');
      onValue(collegeRef, (snapshot) => {
        const data = snapshot.val();
        const aggregatedData = {};

        // Aggregate data by college
        for (let key in data) {
          const college = data[key];
          const collegeName = college.college;

          if (!aggregatedData[collegeName]) {
            aggregatedData[collegeName] = {
              allocatedAmount: 0,
              spentAmount: 0,
              transactionCount: 0,
              transactions: [] // Store transactions for each college
            };
          }

          // Add to the totals
          aggregatedData[collegeName].allocatedAmount += parseFloat(college.allocatedAmount) || 0;
          aggregatedData[collegeName].spentAmount += parseFloat(college.spentAmount) || 0;
          aggregatedData[collegeName].transactionCount += 1; // Count the number of transactions
          aggregatedData[collegeName].transactions.push(college); // Store the individual transaction
        }

        // Convert the aggregated data object to an array for rendering
        const loadedData = Object.keys(aggregatedData).map((collegeName) => ({
          college: collegeName,
          allocatedAmount: aggregatedData[collegeName].allocatedAmount,
          spentAmount: aggregatedData[collegeName].spentAmount,
          transactionCount: aggregatedData[collegeName].transactionCount,
          transactions: aggregatedData[collegeName].transactions, // Include the transactions
        }));

        setCollegeData(loadedData);
      });
    };

    fetchData();
  }, []);

  const getValueOrZero = (value) => {
    return value ? value : '0';
  };

  // Format number to 2 decimal places
  const formatNumber = (value) => {
    return parseFloat(value).toFixed(2);
  };

  const getSpentPercentage = (spentAmount, allocatedAmount) => {
    return allocatedAmount > 0 ? formatNumber((spentAmount / allocatedAmount) * 100) : '0.00';
  };

  const getRemainingAmount = (allocatedAmount, spentAmount) => {
    return formatNumber(allocatedAmount - spentAmount);
  };

  const getAvgSpentPerTransaction = (spentAmount, transactionCount) => {
    return transactionCount > 0 ? formatNumber(spentAmount / transactionCount) : '0.00';
  };

  const handleGoBack = () => {
    navigate(-1);  // Go back to the previous page
  };

  const handleRowClick = (college) => {
    setSelectedCollege(college); // Set the clicked college
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedCollege(null); // Clear the selected college
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-inter">
      <h2 className="text-4xl font-bold text-left text-blue-600 mb-4">College Data</h2>

      {/* Button Wrapper with flex to align to the right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleGoBack}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">College</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Allocated Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Spent Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Remaining Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Spent Percentage (%)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Total Visits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Avg Spent per Transaction</th>
          </tr>
        </thead>
        <tbody>
          {collegeData.length > 0 ? (
            collegeData.map((college, index) => (
              <tr
                key={index}
                className="bg-white border-b hover:bg-gray-100"
                onClick={() => handleRowClick(college)} // Add click handler
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{college.college}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatNumber(college.allocatedAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatNumber(college.spentAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getRemainingAmount(college.allocatedAmount, college.spentAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getSpentPercentage(college.spentAmount, college.allocatedAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{college.transactionCount}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getAvgSpentPerTransaction(college.spentAmount, college.transactionCount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-700">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Render the modal component if it's open */}
      {isModalOpen && selectedCollege && (
        <CollegeTransModal 
          selectedCollege={selectedCollege} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
};

export default CollegeData;
