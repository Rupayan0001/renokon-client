import React from "react";

const Loader = ({ width }) => {
  return (
    <dialog className="fixed inset-0 z-50 h-[100%] w-[100%]  flex justify-center items-center bg-black bg-opacity-80">
      <div className={`${width < 550 ? "w-[90%]" : "w-[400px]"} h-[70px] bg-white flex items-center`}>
        {" "}
        <p className="spinOnButton h-[24px] w-[24px] ml-4 mr-2"></p> Loading...
      </div>
    </dialog>
  );
};

export default Loader;
