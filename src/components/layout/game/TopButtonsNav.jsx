import React from "react";
import cricketImg from "../../../assets/images/e245f1544ab681bc1966f513aba7b4f5r.jpg";
import footbalImg from "../../../assets/images/81Rxne5Cv2L._SL500_.jpg";
import bollywoodImg from "../../../assets/images/Pathaan-1920x1080-1.jpg";
import musicImg from "../../../assets/images/373802-arijit-singh.png";
import financeImg from "../../../assets/images/1085f340-bfeb-424e-a9d5-723d1f63d29b (1).jpg";
import personalityImg from "../../../assets/images/9db8e720-183f-484a-86d0-15b1f123ae93.jpg";
import geographyImg from "../../../assets/images/360_F_992442949_kGmhHSAPuboVFQOhq2kWIYA4bnAGhRVXfe.jpg";
import historyImg from "../../../assets/images/reimagining-netaji-subhash-chandra-bose-through-ai-v0-0rjcpva5i4ec1.jpg";
import mathImg from "../../../assets/images/pngtree-3d-rendering-of-calculator-symbol-against-a-black-background-image_3782739d.jpg";
import businessImg from "../../../assets/images/pngtree-partnership-of-companies-collaboration-business-technology-internet-concept-image_15659993.jpg";
import { Link } from "react-router-dom";
const arr = [
  { topic: "Cricket", image: cricketImg, link: "/game/cricket" },
  { topic: "Football", image: footbalImg, link: "/game/football" },
  { topic: "Bollywood", image: bollywoodImg, link: "/game/bollywood" },
  { topic: "Music", image: musicImg, link: "/game/music" },
  { topic: "Business", image: businessImg, link: "/game/business" },
];
const arr2 = [
  { topic: "Finance", image: financeImg, link: "/game/finance" },
  { topic: "Personality", image: personalityImg, link: "/game/personality" },
  { topic: "Geography", image: geographyImg, link: "/game/geography" },
  { topic: "History", image: historyImg, link: "/game/history" },
  { topic: "Maths", image: mathImg, link: "/game/maths" },
];
const TopButtonsNav = ({ width }) => {
  return (
    <div className={`w-[100vw] justify-center ${width > 550 ? "items-center" : ""} mb-0 mt-4 overflow-x-scroll scrollbar-none flex flex-col px-3`}>
      <div className="flex items-center">
        {arr.map((e, i) => (
          <div key={i} className={`h-[90px] w-[80px]  ${i === 0 ? "ml-0" : "ml-4"}`}>
            <Link to={e.link}>
              <div className="h-[60px] w-[80px]">
                <img src={e.image} className="h-full w-full rounded-xl object-cover" />
              </div>
            </Link>
            <p className={` font-bold text-white w-full flex justify-center  `}>{e.topic}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-2">
        {arr2.map((e, i) => (
          <div key={i} className={`h-[90px] w-[80px]  ${i === 0 ? "ml-0" : "ml-4"} `}>
            <Link to={e.link}>
              <div className="h-[60px] w-[80px]">
                <img src={e.image} className="h-full w-full rounded-xl object-cover" />
              </div>
            </Link>
            <p className={` font-bold text-white w-full flex justify-center`}>{e.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopButtonsNav;

// w-[100vw]  mb-3 mt-3  overflow-x-scroll scrollbar-none
// w-[100vw]  overflow-x-scroll scrollbar-none
