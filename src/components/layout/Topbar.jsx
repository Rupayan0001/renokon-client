import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import globalState from "../../lib/globalState.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHouse,
  faMessage,
  faStore,
  faGamepad,
  faCircleChevronDown,
  faVideo,
  faBars,
  faBell,
  faGear,
  faRightFromBracket,
  faChessKing,
  faUsers,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../lib/axios.js";
const Topbar = ({ page = "Home", hide = false, poolDetails = null, hideAll = false, hideBell = false }) => {
  const selected = globalState((state) => state.selected);
  const setSelected = globalState((state) => state.setSelected);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const setTopBarRightProfilePicRefState = globalState((state) => state.setTopBarRightProfilePicRefState);
  const totalUnreadMessages = globalState((state) => state.totalUnreadMessages);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const setTopBarsearch = globalState((state) => state.setTopBarsearch);
  const [windowSm, setWindowSm] = useState(window.innerWidth <= 767);
  const [below500, setBelow500] = useState(window.innerWidth < 500);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const notifications = globalState((state) => state.notifications);
  const setNotifications = globalState((state) => state.setNotifications);
  const storePools = globalState((state) => state.storePools);
  const setTopBarNotificationIconRef = globalState((state) => state.setTopBarNotificationIconRef);
  const [backURL, setBackURL] = useState("/");
  const [heading, setHeading] = useState("");
  const topBarRightProfilePicRef = useRef();
  const topBarsearchRef = useRef();
  const notifyIconRef = useRef();
  const { section, poolId } = useParams();
  const location = useLocation();
  useEffect(() => {
    fetchTotalUnreadMessages();
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 768) {
        setWindowSm(true);
      }
      if (width > 768) {
        setWindowSm(false);
      }
      if (width < 500) {
        setBelow500(true);
      }
      if (width > 500) {
        setBelow500(false);
      }
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    if (location.pathname) {
      if (
        location.pathname === "/game/my-pools/view/Upcoming%20Pools" ||
        location.pathname === "/game/my-pools/view/Live%20Pools" ||
        location.pathname === "/game/my-pools/view/Completed%20Pools" ||
        location.pathname === `/game/maths/${poolId}` ||
        location.pathname === `/game/${section}/play/${poolId}`

        // location.pathname === "/game/my-pools/view/Completed%20Pools"
      ) {
        setBackURL("/game");
        return;
      }
      const currentPath = location.pathname.split("/");
      if (currentPath.length > 1) {
        const newPath = currentPath.slice(0, currentPath.length - 1).join("/");
        setBackURL(newPath);
      } else {
        setBackURL("/");
      }
    }
  }, [location.pathname]);
  useEffect(() => {
    if (!poolId && section) {
      const updated = section[0].toUpperCase() + section.slice(1);
      setHeading(updated);
    } else if (poolId && poolDetails) {
      const found = poolDetails;
      if (found && windowWidth < 768) {
        const title = found.title.length > 14 ? found.title.slice(0, 14) + "..." : found.title;
        setHeading(title);
      } else if (found && windowWidth >= 768) {
        const title = found.title;
        setHeading(title);
      }
    }
    if (location.pathname.includes("play") && section) {
      const updated = section[0].toUpperCase() + section.slice(1);
      setHeading(updated);
    }
  }, [section, poolId, poolDetails, windowWidth]);

  useEffect(() => {
    setTopBarsearch(topBarsearchRef);
    getNotifications();
  }, []);
  useEffect(() => {
    if (topBarRightProfilePicRef.current) {
      setTopBarRightProfilePicRefState(topBarRightProfilePicRef.current);
    }
  }, [setTopBarRightProfilePicRefState]);
  useEffect(() => {
    if (notifyIconRef.current) {
      setTopBarNotificationIconRef(notifyIconRef.current);
    }
  }, [setTopBarNotificationIconRef]);

  async function getNotifications() {
    try {
      const response = await axiosInstance.get(`/notification/getNotifications`);
      if (response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      setNotifications([]);
    }
  }

  function handleClickOnHome() {
    setSelected("Home");
  }

  return (
    <div>
      <div
        className={`topbar ${page === "Game" ? "bg-gradient-to-r from-slate-900 to-black" : "bg-gradient-to-r from-slate-900 to-black"} messageText ${
          windowWidth > 450 ? "h-[65px]" : "h-[50px]"
        } `}
      >
        <div className={`topBox ${page === "Game" ? "bg-gradient-to-r from-slate-900 to-black" : "bg-gradient-to-r from-slate-900 to-black"}`}>
          <div className=" flex  items-center">
            {!section && (
              <Link to={"/game"}>
                <div className="logo">
                  <h1
                    className={`logoHead ${windowWidth <= 450 && "text-xl"} ${
                      windowWidth > 450 && "text-3xl"
                    } font-bold text-center text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-100 via-blue-400 to-blue-400`}
                  >
                    Renokon
                  </h1>
                </div>
              </Link>
            )}
            {section && (
              <div className="h-[30px] flex items-center">
                <p>
                  <Link to={backURL}>
                    <FontAwesomeIcon icon={faArrowLeft} className={`text-white mr-2 ${windowWidth >= 450 ? "text-[24px]" : "text-[20px] mt-[1px]"}`} />
                  </Link>
                </p>
                <h1
                  className={`logoHead ${windowWidth <= 450 && "text-xl"} ${
                    windowWidth > 450 && "text-3xl"
                  } font-bold text-center text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-100 via-blue-400 to-blue-400`}
                >
                  {heading}
                </h1>
              </div>
            )}

            {(page === "Messages" || page === "Shop" || page === "Game") && windowWidth >= 1280 && (
              <div className="relative ml-2">
                <p className={`search w-[14vw] ml-2 ${windowWidth >= 768 && windowWidth < 1024 && ""} opacity-0 relative `}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon absolute top-3 left-3" />
                </p>
              </div>
            )}
            {windowWidth > 1279 && page !== "Messages" && page !== "Game" && (
              <div onClick={() => setOpenSearch(true)} className="relative ml-2">
                <input
                  className={`search bg-gradient-to-r from-slate-800 to-slate-900 hover:bg-gray-400 transition duration-200 ${
                    windowWidth >= 1024 && "w-[14vw] block"
                  } pl-[36px] block sm:block ${windowWidth >= 768 && windowWidth < 1024 && "hidden"} relative cursor-pointer`}
                  readOnly
                  placeholder="Search by name"
                  ref={topBarsearchRef}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon absolute top-3 left-[18px]" />
              </div>
            )}
            {windowWidth <= 1279 && page !== "Messages" && page !== "Game" && (
              <p className="block relative cursor-pointer" ref={topBarsearchRef} onClick={() => setOpenSearch(true)}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon hover:opacity-80 absolute top-[-8px] left-[15px]" />
              </p>
            )}
          </div>
          {!windowSm && !hideAll && (
            <div className={`middle `}>
              <div className={`middlebox ml-[0px] mr-[20px] ${windowWidth >= 768 && windowWidth < 1024 && "mr-0 w-[42vw]"} ${windowWidth >= 1024 && "w-[34vw]"}`}>
                <Link to="/game">
                  <div
                    className={`text-[25px] px-[25px] py-[8px] ${selected === "Game" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={() => setSelected("Game")}
                  >
                    <FontAwesomeIcon icon={faHouse} />
                  </div>
                </Link>
                <Link to="/home">
                  <div
                    className={` px-[25px] text-[25px] py-[8px] ${selected === "Home" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={handleClickOnHome}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                </Link>
                <Link to="/message">
                  <div
                    className={`relative text-[25px] px-[25px] py-[8px] ${selected === "Messages" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={() => setSelected("Messages")}
                  >
                    <FontAwesomeIcon icon={faMessage} />
                    {totalUnreadMessages > 0 && (
                      <p className="text-[12px] font-bold absolute right-[-5px] top-[-7px] bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[24px] h-[24px] pt-[1px] flex items-center justify-center rounded-full">
                        {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                      </p>
                    )}
                  </div>
                </Link>
                <Link to="/shop">
                  <div
                    className={` text-[25px] px-[25px] py-[8px] ${selected === "Shop" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={() => setSelected("Shop")}
                  >
                    <FontAwesomeIcon icon={faStore} />
                  </div>
                </Link>
              </div>
            </div>
          )}
          <div className="right ">
            {/* {page !== "" && ( */}
            <Link to="/wallet">
              <div
                className={`flex items-center justify-center hover:opacity-90 ${
                  windowWidth > 330 ? "w-[56px] h-[26px] text-sm" : "w-[50px] h-[26px] text-xs"
                } border-2 border-white text-white ml-2 rounded-lg font-semibold`}
              >
                ₹ {loggedInUser.walletBalance}
              </div>
            </Link>
            {!hideBell && (
              <div
                ref={notifyIconRef}
                className={`notification hover:opacity-80 relative ${windowWidth > 450 ? "h-[40px] w-[40px] text-[18px] ml-2" : "h-[30px] w-[30px] text-[15px] ml-1"} `}
                onClick={() => setNotifyClicked(!notifyClicked)}
              >
                {/* ${page === "Home" || page === "Profile" ? "text-blue-700 " : ""}  */}
                <FontAwesomeIcon className={`text-white`} icon={faBell} />
                {notifications && notifications.length > 0 && (
                  <p
                    className={` font-bold absolute ${
                      windowWidth > 450 ? "right-[-7px] top-[-7px] w-[24px] h-[24px] text-[12px]" : "text-[9px] right-[-9px] top-[-3px] w-[18px] h-[18px]"
                    } bg-gradient-to-r from-blue-500 to-blue-600 text-white  pt-[1px] flex items-center justify-center rounded-full`}
                  >
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </p>
                )}
              </div>
            )}

            {/* )} */}
            {/* {page === "Game" && <div className="w-[80px] h-[30px] border-2 border-blue-600 text-white flex items-center justify-center rounded-lg">900</div>} */}
            {/* {!hide && ( */}
            <div ref={topBarRightProfilePicRef} className={`userLogo ${windowWidth > 550 ? "ml-4" : "ml-3"}`}>
              <img
                src={loggedInUser?.profilePic}
                onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
                className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"} object-cover  mb-1 cursor-pointer rounded-full`}
                alt=""
              />
            </div>
            {/* // )} */}
          </div>
        </div>
      </div>
      {windowSm && !hide && (
        <div>
          <div
            className={`middle pb-2 ${windowWidth >= 768 && windowWidth < 1024 && "hidden"}  ${
              page === "Game" ? "bg-gradient-to-r from-slate-900 to-black" : "bg-gradient-to-r from-slate-900 to-black"
            }`}
          >
            <div className={`middlebox ${windowWidth > 600 ? "w-[65vw]" : "w-[100vw]"} `}>
              <Link to="/game">
                <div
                  className={`${windowWidth > 450 ? "text-[25px]" : "text-[20px]"} px-[25px] py-[8px] ${
                    selected === "Game" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"
                  }`}
                  onClick={() => setSelected("Game")}
                >
                  <FontAwesomeIcon icon={faHouse} />
                </div>
              </Link>
              <Link to="/home">
                <div
                  className={` ${windowWidth > 450 ? "text-[25px]" : "text-[20px]"} ml-2 px-[25px] py-[8px] ${
                    selected === "Home" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600 border-b-2 border-transparent"
                  }`}
                  onClick={handleClickOnHome}
                >
                  <FontAwesomeIcon icon={faUsers} />
                </div>
              </Link>
              <Link to="/message">
                <div
                  className={`relative ${windowWidth > 450 ? "text-[25px]" : "text-[20px]"} px-[25px] py-[8px] ${
                    selected === "Messages" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"
                  }`}
                  onClick={() => setSelected("Messages")}
                >
                  <FontAwesomeIcon icon={faMessage} />
                  {totalUnreadMessages > 0 && (
                    <p
                      className={`${
                        windowWidth > 450 ? "text-[12px] w-[24px] h-[24px] right-[-5px] top-[-7px]" : "text-[10px] w-[20px] h-[20px] right-[0px] top-[-7px]"
                      } font-bold absolute bg-gradient-to-r from-blue-500 to-blue-600 text-white  pt-[1px] flex items-center justify-center rounded-full`}
                    >
                      {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                    </p>
                  )}
                </div>
              </Link>
              <Link to="/shop">
                <div
                  className={`${windowWidth > 450 ? "text-[25px]" : "text-[20px]"}  px-[25px] py-[8px] ${
                    selected === "Shop" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"
                  }`}
                  onClick={() => setSelected("Shop")}
                >
                  <FontAwesomeIcon icon={faStore} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
