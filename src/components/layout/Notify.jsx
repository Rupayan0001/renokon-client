import React, { useEffect, useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import globalState from "../../lib/globalState";
import { motion } from "framer-motion";

const Notify = ({ notify, reference, width, page, mode = "lite" }) => {
  const setNotify = globalState((state) => state.setNotify);
  const ref = useRef();
  useEffect(() => {
    function handleClicks(e) {
      if (ref.current && !ref.current.contains(e.target) && width < 425) {
        setNotify(null);
      }
    }
    document.addEventListener("mousedown", handleClicks);
    return () => {
      document.removeEventListener("mousedown", handleClicks);
    };
  }, [width]);
  function close() {
    setNotify(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={ref}
      className={`flex items-center justify-between ${width > 450 && width < 600 && "absolute left-1 w-[98%] pl-4 pr-2 py-2"} ${
        width >= 600 && "absolute left-4 pl-4 pr-2 h-[42px] text-[15px]"
      } ${width <= 450 && width > 400 && " w-[95%] pl-4 text-[16px]"} ${width <= 400 && "w-[98%] pl-4 py-2 text-[16px]"}
      ${width > 400 && width <= 450 && notify.length > 38 && notify.length < 50 && "h-[50px]"}  ${width > 400 && width <= 450 && notify.length <= 38 && "h-[42px]"}
      ${width > 400 && width <= 450 && notify.length >= 50 && "h-[70px]"}
        z-50 ${mode === "lite" ? "bg-white text-black" : "bg-gradient-to-b from-slate-900 to-black text-white"}  rounded-md`}
    >
      {notify}
      <button className="cursor-pointer hover:opacity-50 transition duration-200 border-0 px-2 py-1 ml-3 rounded-md font-semibold" onClick={() => close()}>
        <FontAwesomeIcon className="font-bold" icon={faXmark} />
      </button>
    </motion.div>
  );
};

export default Notify;

// ${(page === "Home" || page === "Profile") && "bg-gradient-to-t from-slate-800 to-slate-900 text-white"}
