import React, { forwardRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faSliders, faVideo } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../lib/globalState.js";
import defaultBg from "../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";

const WritePost = forwardRef(({ width }, ref) => {
  // const [loading, setLoading] = useState(false);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setOpenPostWithType = globalState((state) => state.setOpenPostWithType);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setOpenPoll = globalState((state) => state.setOpenPoll);
  const openPost = globalState((state) => state.openPost);
  const [pic, setPic] = useState(defaultBg);
  useEffect(() => {
    if (loggedInUser) {
      setPic(loggedInUser.profilePic);
    }
  }, [loggedInUser]);

  return (
    <div
      className={`writePost inter ${width >= 1280 && "w-[550px] mt-2 rounded-lg px-4 pt-4"} ${width >= 550 && width < 1280 && "w-[520px] mt-2 rounded-lg px-4 pt-4"} ${
        width < 550 && "w-[100vw] px-2 pt-2"
      }   bg-gradient-to-r from-slate-900 to-black  pb-1 `}
    >
      <div className="writePostTop pb-2 border-b-2 border-zinc-300">
        <div className="profileImg flex items-center">
          <Link to={`/userProfile/${loggedInUser._id}`}>
            <img src={pic} className={` ${width > 550 ? "w-[50px] h-[50px]" : "ml-2 w-[40px] h-[40px]"} object-cover cursor-pointer rounded-full mr-3`} alt="" />
          </Link>
          <input
            type="text"
            ref={ref}
            onClick={() => {
              setOpenPost("Image");
            }}
            readOnly
            className="w-full ml-2 outline-none placeholder-black bg-slate-100 h-[42px] sm:h-[45px] cursor-pointer hover:bg-slate-200 placeholder:text-[15px] rounded-full px-1 pl-4 text-black text-xl"
            placeholder={`What's on your mind? ${loggedInUser && loggedInUser.name.split(" ")[0]}`}
          />
        </div>
      </div>
      <div className="writePostBottom flex text-zinc-500 justify-between pt-2">
        <div
          onClick={() => {
            setOpenPost("Image");
          }}
          ref={ref}
          className="cursor-pointer flex items-center  hover:bg-slate-700 hover:bg-opacity-30 px-3 sm:px-5 py-2 rounded-lg"
        >
          <FontAwesomeIcon className={`${width > 550 ? "text-xl" : "text-md"} text-green-500 `} icon={faImage} />{" "}
          <div className={`ml-2 text-white ${width > 550 ? "text-md" : "text-sm"} `}>Photo</div>
        </div>
        <div
          onClick={() => {
            setOpenPost("Video");
          }}
          ref={ref}
          className={`cursor-pointer flex items-center hover:bg-slate-700 hover:bg-opacity-30 px-3 sm:px-5 py-2 rounded-lg`}
        >
          <FontAwesomeIcon className={`${width > 550 ? "text-xl" : "text-md"} text-red-700 `} icon={faVideo} />{" "}
          <div className={`ml-2 text-white  ${width > 550 ? "text-md" : "text-sm"}`}>Video</div>
        </div>
        <div
          onClick={() => {
            setOpenPost("Image");
            setOpenPoll(true);
          }}
          ref={ref}
          className={`cursor-pointer flex  items-center hover:bg-slate-700 hover:bg-opacity-30 px-3 sm:px-5 py-2 rounded-lg`}
        >
          <FontAwesomeIcon className={`${width > 550 ? "text-xl" : "text-md"} text-purple-600`} icon={faSliders} />{" "}
          <div className={`ml-2 text-white   ${width > 550 ? "text-md" : "text-sm"}`}>Poll</div>
        </div>
      </div>
    </div>
  );
});

export default WritePost;
