import { motion } from "framer-motion";
import defaultWinner from "../../../assets/sundar(5).png";
import winBg from "../../../assets/images/6557.jpg_wh1200.jpg";

const WinnersScroll = ({ width }) => {
  return (
    <div className="w-full overflow-hidden py-2" style={{ backgroundImage: `url(${winBg})` }}>
      <div className="flex w-full items-center justify-center text-white">
        {/* <img src={defaultWinner} className={` ${width > 550 ? "w-10 h-10" : "w-9 h-9"} rounded-full mr-2 object-cover`} /> */}
        <p
          className={`${width > 768 && "text-2xl"} ${width <= 768 && width > 550 && "text-2xl"} ${width <= 550 && width > 400 && "text-2xl"} ${
            width <= 400 && "text-lg"
          } font-bold text-white `}
        >
          Play More Win More Learn More!!!
        </p>
      </div>
    </div>
  );
};
export default WinnersScroll;

// 🏆
// transparent bg-clip-text bg-gradient-to-r from-green-100 via-white to-green-200
