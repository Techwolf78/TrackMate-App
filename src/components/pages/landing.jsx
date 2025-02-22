import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative w-full h-screen font-inter bg-no-repeat bg-cover bg-center" style={{ backgroundImage: "url('mob-loc.jpg')" }}>
      
      {/* Black overlay with some transparency for a modern touch */}
      <div className="absolute inset-0 bg-black opacity-60"></div> 

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-6 sm:px-12">
        
        {/* Logo in the top-left corner, with padding for touch targets */}
        <div className="absolute top-4 left-4 text-4xl sm:text-5xl font-bold">
          <span className="text-white">Track</span>
          <span className="text-[#00bcd4]">Mate</span>
        </div>

        {/* Main Heading - large and impactful for mobile */}
        <div className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
          Effortless Tracking of <span className="text-[#00bcd4]">Visits</span>, Activities, and <span className="text-[#00bcd4]">Expenses</span> - Wherever You Are.
        </div>

        {/* Subheading - slightly smaller but still bold */}
        <div className="text-lg sm:text-2xl text-white mb-8 opacity-90">
          Keep Your <span className="underline decoration-[#00bcd4]">Sales</span>, <span className="underline decoration-[#00bcd4]">Placement</span>, and Travel Activities Organized with a Single Tap.
        </div>

        {/* Explore Now Button */}
        <Link
          to="/home"
          className="inline-block px-3 py-2 bg-gradient-to-r from-[#00bcd4] to-[#316bff] text-white text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#00bcd4] focus:ring-opacity-50"
        >
          Explore Now
        </Link>
      </div>
    </div>
  );
};

export default Landing;
