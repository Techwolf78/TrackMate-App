// Sales.jsx
import SalesForm from '../Components/salesform';  // Importing SalesForm component
import Submit from '../Components/submit';        // Importing Submit component

function Sales() {
  return (
    <div className='bg-gradient-to-r from-blue-200 via-teal-100 to-slate-50 font-inter '>
      <SalesForm />  {/* You can use SalesForm here */}
      <Submit />     {/* You can use Submit here */}
    </div>
  );
}

export default Sales;
