// Placement.jsx
import PlacementForm from '../Components/PlacementForm';  // Importing PlacementForm component
import PlacementFormSubmit from '../Components/PlacementFormSubmit';  // Importing Submit component

function Placement() {
  return (
    <div className='bg-white font-inter '>
      <PlacementForm />  {/* You can use PlacementForm here */}
      <PlacementFormSubmit />     {/* You can use Submit here */}
    </div>
  );
}

export default Placement;
