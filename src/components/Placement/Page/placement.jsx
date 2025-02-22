// Sales.jsx
import React from 'react';
import PlacementForm from '../Components/PlacementForm';  // Importing SalesForm component
import PlacementFormSubmit from '../Components/PlacementFormSubmit';  // Importing Submit component

function Sales() {
  return (
    <div className='bg-white font-inter '>
      <PlacementForm />  {/* You can use SalesForm here */}
      <PlacementFormSubmit />     {/* You can use Submit here */}
    </div>
  );
}

export default Sales;
