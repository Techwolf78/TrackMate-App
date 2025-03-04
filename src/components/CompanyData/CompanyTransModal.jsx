import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';

const CompanyTransModal = ({ isOpen, onClose, companyId }) => {
  const [companyData, setCompanyData] = useState([]);
  
  useEffect(() => {
    if (companyId) {
      // Fetch company-specific data based on companyId
      const fetchCompanyData = async () => {
        try {
          const response = await fetch(`/api/company/${companyId}/transactions`);
          const data = await response.json();
          setCompanyData(data);
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      };

      fetchCompanyData();
    }
  }, [companyId]);

  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return 'Invalid Date'; 
    }
    return format(new Date(timestamp), 'dd/MM/yyyy');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-5xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={onClose}
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
              Company Transaction Details
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">
                      Transaction Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">
                      Transaction Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.length > 0 ? (
                    companyData.map((transaction, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-100">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {transaction.transactionId}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {transaction.transactionAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatDate(transaction.transactionDate)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {transaction.description || 'No description'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-700">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* You can add pagination or any other UI elements below if necessary */}
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyTransModal;
