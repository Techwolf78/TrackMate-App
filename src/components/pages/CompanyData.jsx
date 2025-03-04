import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import CompanyTransModal from '../CompanyData/CompanyTransModal';  // Import the modal component

const CompanyData = () => {
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null); // State to track selected company
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    const fetchData = () => {
      const companyRef = ref(db, 'plac_spent/');
      onValue(companyRef, (snapshot) => {
        const data = snapshot.val();
        const aggregatedData = {};

        // Aggregate data by company
        for (let key in data) {
          const company = data[key];
          const companyName = company.company;

          if (!aggregatedData[companyName]) {
            aggregatedData[companyName] = {
              allocatedAmount: 0,
              spentAmount: 0,
              transactionCount: 0,
              transactions: [] // Store transactions for each company
            };
          }

          // Add to the totals
          aggregatedData[companyName].allocatedAmount += parseFloat(company.allocatedAmount) || 0;
          aggregatedData[companyName].spentAmount += parseFloat(company.spentAmount) || 0;
          aggregatedData[companyName].transactionCount += 1; // Count the number of transactions
          aggregatedData[companyName].transactions.push(company); // Store the individual transaction
        }

        // Convert the aggregated data object to an array for rendering
        const loadedData = Object.keys(aggregatedData).map((companyName) => ({
          company: companyName.replaceAll("_", " "), // Replace underscores with spaces
          allocatedAmount: aggregatedData[companyName].allocatedAmount,
          spentAmount: aggregatedData[companyName].spentAmount,
          transactionCount: aggregatedData[companyName].transactionCount,
          transactions: aggregatedData[companyName].transactions, // Include the transactions
        }));

        setCompanyData(loadedData);
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

  const handleRowClick = (company) => {
    setSelectedCompany(company); // Set the clicked company
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedCompany(null); // Clear the selected company
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-inter">
      <h2 className="text-4xl font-bold text-left text-blue-600 mb-4">Company Data</h2>

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Allocated Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Spent Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Remaining Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Spent Percentage (%)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Total Visits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Avg Spent per Transaction</th>
          </tr>
        </thead>
        <tbody>
          {companyData.length > 0 ? (
            companyData.map((company, index) => (
              <tr
                key={index}
                className="bg-white border-b hover:bg-gray-100"
                onClick={() => handleRowClick(company)} // Add click handler
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{company.company}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatNumber(company.allocatedAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatNumber(company.spentAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getRemainingAmount(company.allocatedAmount, company.spentAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getSpentPercentage(company.spentAmount, company.allocatedAmount)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{company.transactionCount}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getAvgSpentPerTransaction(company.spentAmount, company.transactionCount)}</td>
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
      {isModalOpen && selectedCompany && (
        <CompanyTransModal 
          selectedCompany={selectedCompany} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
};

export default CompanyData;
