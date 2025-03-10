import React from "react";

const MiddleTitle = ({ title, width }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-[768px] py-4">
      <div className="h-[1px] bg-gray-500 w-1/4 "></div>
      <h2 className={` ${width < 400 ? "text-lg mx-2" : "text-xl mx-4"} font-bold text-white uppercase tracking-wide`}>{title}</h2>
      <div className="h-[1px] bg-gray-500 w-1/4 "></div>
    </div>
  );
};

export default MiddleTitle;
