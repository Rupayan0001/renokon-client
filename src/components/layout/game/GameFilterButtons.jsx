import React from "react";
import H2H from "../../../assets/images/H2h.webp";
import footbalImg from "../../../assets/images/Mega_Pools_2.webp";
import Limited from "../../../assets/images/Limited.jpg";
import musicImg from "../../../assets/images/Tournament.webp";
import VIP from "../../../assets/images/VIP.jpg";
import Free from "../../../assets/images/Free.webp";
import quickPlay from "../../../assets/images/quick play2.jpg";
import { Link } from "react-router-dom";
import globalState from "../../../lib/globalState";
// { type: "Quick", image: quickPlay },
// { type: "Limited", image: Limited },
// { type: "Mega", image: footbalImg },
const arr = [
  { type: "Free", image: Free },
  { type: "H2H", image: H2H },
  { type: "VIP", image: VIP },
];
// { type: "Tournament", image: musicImg }, this will add complexity will add this later a complete tournaments

const GameFilterButtons = ({ width }) => {
  const setSelectedPoolType = globalState((state) => state.setSelectedPoolType);
  return (
    <div className={`w-[100vw] mb-0 mt-4 overflow-x-scroll scrollbar-none flex justify-center ${width > 425 ? "" : ""}  `}>
      <div className={`flex items-center ${width > 550 ? "mt-2" : ""} `}>
        {/* {width <= 480 && <div className="ml-2 h-full text-transparent">.</div>} */}
        <div className={` ${width <= 480 && "h-[90px] w-[80px]"} ${width > 480 && "h-[110px] w-[90px]"}  cursor-pointer`}>
          <div className={`${width <= 480 && "h-[60px] w-[80px]"} ${width > 480 && "h-[70px] w-[90px]"} `}>
            <img
              onClick={() => {
                setSelectedPoolType(arr[0].type);
              }}
              src={arr[0].image}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          <p className={` font-bold text-white w-full flex justify-center  `}>{arr[0].type}</p>
        </div>
        {/* ${width > 768 && "h-[130px] w-[100px] ml-6"}  ${width > 768 && "h-[80px] w-[100px]"} */}
        {arr.slice(1).map((e, i) => (
          <div key={i} className={`${width <= 480 && "h-[90px] w-[80px] ml-4"} ${width > 480 && "h-[110px] w-[90px] ml-4"}  cursor-pointer `}>
            <div className={`${width <= 480 && "h-[60px] w-[80px]"} ${width > 480 && "h-[70px] w-[90px]"} `}>
              <img
                onClick={() => {
                  setSelectedPoolType(e.type);
                }}
                src={e.image}
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <p className={` font-bold text-white w-full flex justify-center  `}>{e.type}</p>
          </div>
        ))}
        {/* {width <= 480 && <div className="ml-4 h-full text-transparent">.</div>} */}
      </div>
    </div>
  );
};

export default GameFilterButtons;

// w-[100vw]  mb-3 mt-3  overflow-x-scroll scrollbar-none
// w-[100vw]  overflow-x-scroll scrollbar-none
