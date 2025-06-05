import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="loader mb-4"></div>
      <p className="text-gray-600 text-sm">Loading data...</p>
    </div>
  );
};

export default Loader;
