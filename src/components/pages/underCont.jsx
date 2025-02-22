import React from "react";

function UnderCont() {
  return (
    <div className="flex font-inter items-center justify-center sm:items-start sm:justify-start h-[100vh] bg-[#f5f5f5]">
      <div className="text-center max-w-auto mx-auto">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src="under-construction.jpg"
            alt="Under Construction"
            className="w-full h-auto sm:max-w-lg md:max-w-screen-2xl"
          />
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl mb-3 font-semibold text-[#425b93] tracking-widest">
          We are Under Maintenance...
        </h1>

        {/* Optional additional text */}
        <p className="text-[#425b93] text-lg">Will be Back Soon!</p>
      </div>
    </div>
  );
}

export default UnderCont;
