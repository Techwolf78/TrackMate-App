import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isAuthenticated }) => {
  return (
    <div className="bg-[#ffffff] relative font-inter">
      <div className="bg-gradient-to-b from-[#ecf2ff] to-[#ecf2ff] h-auto flex flex-col items-center justify-center mb-4 ml-4 rounded-br-3xl rounded-bl-3xl">
        <div className="absolute top-4 left-4">
          <img src="./blacklogo.png" alt="Company Logo" className="w-36 h-auto" />
        </div>

        <div className="text-2xl mr-16 pl-4 md:text-3xl font-bold text-left text-[#316bff] mt-24 sm:mt-20 mb-8 leading-tight">
          Streamline Your Sales and Placement with One Tap
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full bg-[#ffffff] space-y-8 px-4">
        <div className="w-full max-w-3xl space-y-6">
          {/* Sales Tab */}
          <Link
            to={isAuthenticated ? '/sales' : '/login'} // Conditional link for Sales
            className="text-white p-6 rounded-xl text-xl font-semibold text-center shadow-xl cursor-pointer hover:scale-105 transform transition-all duration-200 ease-in-out hover:bg-blue-800 flex items-center justify-between"
            style={{
              backgroundImage:
                'radial-gradient(88% 100% at top, hsla(0, 0%, 100%, 0.5), hsla(0, 0%, 100%, 0))',
              backgroundColor: 'rgb(30 58 138 / var(--tw-bg-opacity))',
            }}
          >
            <div className="flex flex-col items-start w-full">
              <div className="text-sm text-white font-extralight">Admin</div>
              <div className="text-lg md:text-4xl text-white font-bold">Sales</div>
            </div>
            <img
              src="./sale.webp"
              alt="Sales Icon"
              className="w-auto h-32 ml-4"
            />
          </Link>

          {/* Placement Tab */}
          <Link
            to={isAuthenticated ? '/placement' : '/login'} // Conditional link for Placement
            className="text-white p-6 rounded-xl text-xl font-semibold text-center shadow-xl cursor-pointer hover:scale-105 transform transition-all duration-200 ease-in-out hover:bg-green-700 flex items-center justify-between"
            style={{
              backgroundImage:
                'radial-gradient(88% 100% at top, hsla(120, 100%, 75%, 0.5), hsla(120, 100%, 50%, 0))',
              backgroundColor: 'rgb(34, 197, 94)',
            }}
          >
            <div className="flex flex-col items-start w-full">
              <div className="text-sm text-white font-extralight">Admin</div>
              <div className="text-lg md:text-4xl text-white font-bold">Placement</div>
            </div>
            <img
              src="./placement.webp"
              alt="Placement Icon"
              className="w-auto h-32 ml-4"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
