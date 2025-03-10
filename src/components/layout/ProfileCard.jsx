import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const ProfileCard = ({
  profilePic,
  name,
  username,
  id,
  isVerified = false,
  cardHeight = "70px",
  profileSize = "60px",
  textColor = "black",
  width = 550,
  status = false,
  className = "",
  game = false,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/userProfile/${id}`)}
      className={`relative h-[${cardHeight}] mt-4 pt-1 cursor-pointer ${game ? "hover:opacity-90" : "hoverChange"} rounded-md${width < 450 ? "px-0" : game ? "" : "px-2"} w-full ${
        game && "bg-gradient-to-b from-slate-700 to-slate-900"
      }  flex flex-col items-center ${className}`}
    >
      <div className="flex w-full px-2">
        <div className="relative">
          <img src={profilePic} alt="Profile Image" className={`w-[${profileSize}] h-[${profileSize}] cursor-pointer object-cover rounded-full`} />
          {status && <div className="absolute bottom-1 right-[0px] w-[15px] h-[15px] bg-green-500 rounded-full transition duration-200"></div>}
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <p
              className={`font-bold ${width > 550 ? "text-[17px]" : "text-[15px]"} cursor-pointer ${textColor === "white" && "text-white"} ${
                textColor === "black" && "text-black"
              } hover:underline transition duration-300`}
            >
              {name}
            </p>
            {isVerified && !game && <FontAwesomeIcon icon={faCircleCheck} className={`text-blue-700 ml-2 ${width > 550 ? "text-[22px]" : "text-[19px]"}`} />}
          </div>
          <p className={`${width > 550 ? "text-[14px]" : "text-[14px]"} ${game ? "text-white" : "text-zinc-700"}`}>{username}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
