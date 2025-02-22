import { useNavigate } from 'react-router-dom';

function SalesBackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="text-sm font-semibold underline flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 12H5m7-7l-7 7 7 7"
        />
      </svg>
      Back
    </button>
  );
}

export default SalesBackButton;