import PropTypes from 'prop-types';
import { format } from 'date-fns'; // Importing date-fns to format date

const CollegeTransModal = ({ selectedCollege, closeModal }) => {
  // Function to format the timestamp to a human-readable date (dd/MM/yyyy)
  const formatDate = (timestamp) => {
    // If no timestamp or it's invalid, return a fallback message
    if (!timestamp || isNaN(timestamp)) {
      return 'No date available'; // Fallback message
    }
    return format(new Date(timestamp), 'dd/MM/yyyy'); // Convert timestamp to a readable date format
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-8 md:mx-16 max-w-7xl">
        <h3 className="text-xl font-bold mb-4">{selectedCollege.college} Transactions</h3>

        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Transaction #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Allocated Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Spent Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Remaining Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Food</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Toll</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th> {/* Added Date column */}
              </tr>
            </thead>
            <tbody>
              {selectedCollege.transactions.map((transaction, index) => {
                const allocatedAmount = Number(transaction.allocatedAmount);
                const spentAmount = Number(transaction.spentAmount);
                const food = Number(transaction.food);
                const fuel = Number(transaction.fuel);
                const stay = Number(transaction.stay);
                const toll = Number(transaction.toll);

                return (
                  <tr key={index} className="bg-white border-b hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{allocatedAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{spentAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {(allocatedAmount - spentAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{food.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{fuel.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{stay.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{toll.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatDate(transaction.date)}</td> {/* Show formatted date */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          onClick={closeModal}
          className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Prop Types Validation
CollegeTransModal.propTypes = {
  selectedCollege: PropTypes.shape({
    college: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        allocatedAmount: PropTypes.number.isRequired,
        spentAmount: PropTypes.number.isRequired,
        food: PropTypes.number.isRequired,
        fuel: PropTypes.number.isRequired,
        stay: PropTypes.number.isRequired,
        toll: PropTypes.number.isRequired,
        date: PropTypes.number, // Date is optional and might be missing
      })
    ).isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default CollegeTransModal;
