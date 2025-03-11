import React, { useState, useRef, forwardRef } from "react";
import globalState from "../../lib/globalState";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faUserSlash,
  faRightFromBracket,
  faUser,
  faGear,
  faBan,
  faSquarePlus,
  faUserGroup,
  faCirclePlay,
  faTrophy,
  faDownload,
  faCreditCard,
  faRankingStar,
  faRotate,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../lib/axios";
import { motion } from "framer-motion";
import bg from "../../assets/11574a_solid_color_background_icolorpalette.png";

const TopbarRightDropdown = forwardRef(({ pageName, width }, ref) => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const user = globalState((state) => state.user);
  const setOpenBlockList = globalState((state) => state.setOpenBlockList);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const setOpenHideUserList = globalState((state) => state.setOpenHideUserList);
  const setSavePost = globalState((state) => state.setSavePost);
  const setSelected = globalState((state) => state.setSelected);
  const setLogOut = globalState((state) => state.setLogOut);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setNotify = globalState((state) => state.setNotify);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const navigate = useNavigate();
  const notifyTimer = useRef();
  function goToProfile() {
    navigate(`/userProfile/${loggedInUser._id}`);
    setOpenProfileDropdown(false);
  }

  function showBlockedUsers() {
    setOpenBlockList(true);
    setOpenProfileDropdown(false);
  }
  function showHideUsers() {
    setOpenHideUserList(true);
    setOpenProfileDropdown(false);
  }

  function showSavedPosts() {
    if (pageName !== "Profile") {
      navigate(`/userprofile/${loggedInUser._id}`);
    }
    setSelected("");
    setSavePost(true);
    setOpenProfileDropdown(false);
  }
  const dropDown = (
    <div className={`${width > 425 && "overflow-y-auto max-h-[calc(100vh-65px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-400"}`}>
      <div
        onClick={goToProfile}
        className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
          width > 400 ? " w-[300px]" : " w-[250px]"
        } h-[40px] transition duration-100 rounded-md cursor-pointer`}
      >
        <img src={loggedInUser.profilePic} className="w-[33px] h-[33px] ml-[-5px] rounded-full mr-3" alt="" />{" "}
        {loggedInUser.name.length > 22 ? loggedInUser.name.slice(0, 22) + "..." : loggedInUser.name}
      </div>
      {/* {width < 1024 && (pageName === "Profile" || pageName === "Home") && (
        <div
          onClick={() => {
            navigate("/reels");
            setOpenProfileDropdown(false);
          }}
          className={`text-white hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center mt-2 
      ${width > 400 ? " w-[300px]" : " w-[250px]"} h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          <FontAwesomeIcon icon={faCirclePlay} className="text-[22px] ml-[-1px] rounded-full mr-4" />
          Reels
        </div>
      )} */}
      {(pageName === "Profile" || pageName === "Home" || pageName === "Message" || pageName === "Shop") && (
        <div
          onClick={() => {
            navigate(`/game`);
            setOpenProfileDropdown(false);
          }}
          className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
            width > 400 ? " w-[300px]" : " w-[250px]"
          } h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          <FontAwesomeIcon icon={faTrophy} className="text-[20px]  ml-[-1px] rounded-full mr-[14px]" /> Quiz Arena{" "}
        </div>
      )}
      {(pageName === "Profile" || pageName === "Home") && (
        <>
          {user._id === loggedInUser._id && width < 1024 && (
            <div
              onClick={() => {
                setOpenPost("Image");
                setOpenProfileDropdown(false);
              }}
              className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
                width > 400 ? " w-[300px]" : " w-[250px]"
              } h-[40px] transition duration-100 rounded-md cursor-pointer`}
            >
              <FontAwesomeIcon icon={faSquarePlus} className="text-[20px] ml-[0px] rounded-full mr-4" />
              Create Post
            </div>
          )}
          {width < 1024 && (
            <div
              onClick={() => {
                setShowFriends("Friends");
                setOpenProfileDropdown(false);
              }}
              className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
                width > 400 ? " w-[300px]" : " w-[250px]"
              } h-[40px] transition duration-100 rounded-md cursor-pointer`}
            >
              <FontAwesomeIcon icon={faUserGroup} className="text-[20px] ml-[-1px] rounded-full mr-3" />
              Friend List
            </div>
          )}
          {user._id === loggedInUser._id && pageName === "Profile" && (
            <div
              onClick={showSavedPosts}
              className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
                width > 400 ? " w-[300px]" : " w-[250px]"
              } h-[40px] transition duration-100 rounded-md cursor-pointer`}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-[20px] ml-[2px] rounded-full mr-4" />
              Saved Posts
            </div>
          )}
        </>
      )}
      {(pageName === "Profile" || pageName === "Home" || pageName === "Message") && (
        <div
          onClick={showBlockedUsers}
          className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
            width > 400 ? " w-[300px]" : " w-[250px]"
          } h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          <FontAwesomeIcon icon={faBan} className="text-[20px]  ml-[-1px] rounded-full mr-[14px]" /> Blocked users{" "}
        </div>
      )}
      {(pageName === "Profile" || pageName === "Home") && (
        <div
          onClick={showHideUsers}
          className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
            width > 400 ? " w-[300px]" : " w-[250px]"
          } h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          <FontAwesomeIcon icon={faUserSlash} className="text-[20px]  ml-[-3px] rounded-full mr-3" /> Hide users{" "}
        </div>
      )}
      {/* <div className={`text-white hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${width > 400 ? " w-[300px]" : " w-[250px]"} h-[40px] transition duration-100 rounded-md cursor-pointer`}><FontAwesomeIcon className='mr-4 text-xl text-slate-900 ' icon={faGear} />  Settings</div> */}

      <div
        onClick={() => {
          setOpenProfileDropdown(false);
          navigate("/wallet");
        }}
        className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
          width > 400 ? " w-[300px]" : " w-[250px]"
        } h-[40px] transition duration-100 rounded-md cursor-pointer`}
      >
        {" "}
        <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[-1px] text-xl`} icon={faCreditCard} />
        Wallet
      </div>
      {/* {pageName === "Game" && (
        <div
          onClick={() => {
            setClickedLogOut(true);
            setOpenProfileDropdown(false);
          }}
          className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
            width > 400 ? " w-[300px]" : " w-[250px]"
          } h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          {" "}
          <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[1px] text-xl`} icon={faRankingStar} />
          Leaderboard
        </div>
      )} */}
      {width <= 426 && (
        <div
          onClick={() => {
            setOpenProfileDropdown(false);
            window.location.reload();
          }}
          className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
            width > 400 ? " w-[300px]" : " w-[250px]"
          } h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          {" "}
          <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[1px] text-xl`} icon={faRotate} /> Refresh
        </div>
      )}
      <div
        onClick={() => {
          navigate("/policies");
          setOpenProfileDropdown(false);
        }}
        className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
          width > 400 ? " w-[300px]" : " w-[250px]"
        } h-[40px] transition duration-100 rounded-md cursor-pointer`}
      >
        {" "}
        <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[1px] text-xl`} icon={faFileLines} /> Policies
      </div>
      <div
        onClick={() => {
          setClickedLogOut(true);
          setOpenProfileDropdown(false);
        }}
        className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
          width > 400 ? " w-[300px]" : " w-[250px]"
        } h-[40px] transition duration-100 rounded-md cursor-pointer`}
      >
        {" "}
        <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[1px] text-xl`} icon={faRightFromBracket} /> Log Out
      </div>
      {width > 768 && (
        <a
          onClick={() => {
            setOpenProfileDropdown(false);
          }}
          href="https://www.dropbox.com/scl/fi/8oieseh46u1yxgky02p49/renokon.apk?rlkey=x0b38lnt6cokjfqhnpivynoiy&st=jhbjtz3f&dl=0"
          download={true}
          className={`text-white font-semibold hover:bg-slate-700 hover:bg-opacity-60 px-2 z-90 flex items-center  mt-2 ${
            width > 400 ? " w-[300px]" : " w-[250px]"
          } h-[40px] transition duration-100 rounded-md cursor-pointer`}
        >
          {" "}
          <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[1px] text-xl`} icon={faDownload} /> Download Renokon on Mobile
        </a>
      )}
    </div>
  );
  return (
    <>
      {width > 425 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, height: 0 }}
          animate={{ opacity: 1, scale: 1, height: "auto" }}
          exit={{ opacity: 0, scale: 0.8, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          ref={ref}
          className={`inter ${pageName !== "Message" ? "shadowForTopDropDown" : "shadowForTopDropDownForMessagePage"} ${
            width > 425 ? "absolute right-[0px] top-[-4px]" : "fixed h-[100vh] top-[95px] bottom-[0px] right-0 "
          }   z-50  p-2 bg-gradient-to-b from-slate-900 to-black rounded-md shadow-lg w-max`}
          style={{ transition: `all 0.2 ease-in` }}
        >
          {dropDown}
        </motion.div>
      )}
      {width <= 425 && (
        <dialog className={`fixed z-50 h-[100%] w-[100%] flex justify-center items-center inset-0   bg-black bg-opacity-60`}>
          <motion.div
            initial={{ opacity: 0, y: 0, x: 300 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 0, x: 300 }}
            transition={{ duration: 0.4 }}
            ref={ref}
            className={`inter ${pageName !== "Message" ? "shadowForTopDropDown" : "shadowForTopDropDownForMessagePage"} ${
              width > 425 ? "absolute right-[0px] top-[-4px]" : "fixed h-[100vh] pt-4 top-[0px] bottom-[0px] right-0 "
            }   z-50  p-2 bg-gradient-to-b from-slate-900 to-black rounded-md shadow-lg w-max`}
            style={{ transition: `all 0.2 ease-in` }}
          >
            {dropDown}
          </motion.div>
        </dialog>
      )}
    </>
  );
});

export default TopbarRightDropdown;
