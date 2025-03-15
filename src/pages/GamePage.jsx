import React, { useEffect, useState, useRef } from "react";
import Topbar from "../components/layout/Topbar";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState.js";
import postTimeLogic from "../lib/Post_Time_Logic.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import post_uploaded from "../../src/assets/notification_sound/post_uploaded.mp3";
import delete_notification from "../assets/notification_sound/delete_notification.wav";
import SearchBox from "../components/layout/SearchBox.jsx";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown.jsx";
import Logout from "../components/layout/Logout.jsx";
import Confirmation from "../components/layout/Confirmation.jsx";
import Notify from "../components/layout/Notify.jsx";
import WinnersScroll from "../components/layout/game/TopWinnersScrolling.jsx";
import HeroSlider from "../components/layout/game/HeroSlider.jsx";
import TopButtonsNav from "../components/layout/game/TopButtonsNav.jsx";
import PoolCard from "../components/layout/game/PoolCard.jsx";
// import { PoolDataLists } from "../lib/poolDataLists.js";
import MiddleTitle from "../components/layout/game/MiddleTitle.jsx";
import Loader from "../components/layout/Loader.jsx";
import Notification from "../components/layout/Notification.jsx";
import GameFilterButtons from "../components/layout/game/GameFilterButtons.jsx";
import { groupGamePools } from "../lib/groupGamePools.js";
import usePrev from "../hooks/usePrev.js";

const GamePage = () => {
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const confirmDelete = globalState((state) => state.confirmDelete);
  const setConfirmDelete = globalState((state) => state.setConfirmDelete);
  const setSelected = globalState((state) => state.setSelected);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const pageName = globalState((state) => state.pageName);
  const setPageName = globalState((state) => state.setPageName);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const increaseTotalUnreadMessages = globalState((state) => state.increaseTotalUnreadMessages);
  const setLikedData = globalState((state) => state.setLikedData);
  const logOut = globalState((state) => state.logOut);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const showLoader = globalState((state) => state.showLoader);
  const setLogOut = globalState((state) => state.setLogOut);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  const poolsDataList = globalState((state) => state.poolsDataList);
  const setPoolsDataList = globalState((state) => state.setPoolsDataList);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const quickPlay = globalState((state) => state.quickPlay);
  const setQuickPlay = globalState((state) => state.setQuickPlay);
  const cricketPoolsList = globalState((state) => state.cricketPoolsList);
  const setCricketPoolsList = globalState((state) => state.setCricketPoolsList);
  const storePools = globalState((state) => state.storePools);
  const setStorePools = globalState((state) => state.setStorePools);
  const selectedPoolType = globalState((state) => state.selectedPoolType);
  const setSelectedPoolType = globalState((state) => state.setSelectedPoolType);
  const joinedPools = globalState((state) => state.joinedPools);
  // const [myPools, setMyPools] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPools, setLoadingPools] = useState(true);
  const [poolsLoading, setPoolsLoading] = useState(true);

  const poolsRef = useRef();
  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const navigate = useNavigate();
  const { postId } = useParams();
  const prev = usePrev(selectedPoolType);

  const response = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setUser(result.data.user);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  };

  // async function getQuickPlayPool() {
  //   try {
  //     setLoadingPools(true);
  //     const response = await axiosInstance.get(`/game/quickPlay`);
  //     setLoadingPools(false);
  //     if (response.data.success) {
  //       setQuickPlay(response.data.pool);
  //     }
  //   } catch (error) {
  //     setLoadingPools(false);
  //   }
  // }

  async function fetchPoolsData() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setPoolsLoading(true);
      const response = await axiosInstance.get(`/game/poolsData/cricket`);
      setPoolsLoading(false);
      if (response.data.success) {
        setStorePools(response.data.pools);
        const grouped = groupGamePools(response.data.pools);
        setCricketPoolsList(grouped);
        poolsRef.current = grouped;
      }
    } catch (error) {
      setPoolsLoading(false);
      setCricketPoolsList(groupGamePools([]));
      if (error.response.data.message) {
        setNotify(error.response.data.message);
      } else {
        setNotify("Failed to fetch pools, please try again later");
      }
      notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
    }
  }
  useEffect(() => {
    if (joinedPools.length) {
      joinedPools.forEach((pool) => {
        const ind = storePools.findIndex((p) => p._id === pool._id);
        if (ind >= 0) {
          storePools[ind] = pool;
          const grouped = groupGamePools(storePools);
          poolsRef.current = grouped;
        }
      });
    }
  }, [cricketPoolsList, joinedPools, storePools]);

  useEffect(() => {
    setSelected("Game");
    if (!loggedInUser) {
      response();
    } else if (loggedInUser) {
      fetchPoolsData();
      setLoading(false);
    }
    return () => {
      setNotifyClicked(null);
    };
  }, [loggedInUser]);
  useEffect(() => {
    socketData();
    function socketData() {
      if (!loggedInUser) return;
      if (!socketHolder) {
        connectSocket();
        return;
      }
    }
    fetchTotalUnreadMessages();
    const socket = socketHolder;
    const handleMessage = async (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "text" || data.type === "file" || data.type === "audio" || data.type === "video" || data.type === "image") {
        if (data.payload.receiverId === loggedInUser._id && data.payload.status === "sent") {
          increaseTotalUnreadMessages();
        }
        if (data.payload.groupId !== null && data.payload.seenBy.includes(loggedInUser._id) === false) {
          increaseTotalUnreadMessages();
        }
      }
      if (data.type === "notification") {
        addNotification(data.payload);
      }
      if (data.type === "statusUpdate") {
        if (data.payload.status === false) {
          const filteredArr = onlineUsers.filter((user) => user.userId !== data.payload.userId);
          setOnlineUsers(filteredArr);
        }
        if (data.payload.status === true) {
          setOnlineUsers([...onlineUsers, data.payload]);
        }
      }
    };
    if (socket) {
      socket.onmessage = handleMessage;
    }
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socketHolder, connectSocket, loggedInUser, onlineUsers]);

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      setNotify(null);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
      }
    };
  }, []);

  function showPoolsByType(poolType) {
    if (!poolsRef.current) return;
    if (poolType === prev) {
      setCricketPoolsList(poolsRef.current);
      return;
    }
    const filtered = poolsRef.current?.filter((pool) => Object.keys(pool)[0] === poolType) || cricketPoolsList || [];
    setCricketPoolsList(filtered);
  }
  useEffect(() => {
    if (selectedPoolType) {
      showPoolsByType(selectedPoolType);
    }
    return () => {
      setSelectedPoolType(null);
    };
  }, [selectedPoolType]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
        setOpenProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [topBarRightProfilePicRefState]);

  async function logout() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setClickedLogOut(null);
    setLogOut(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.data.message === "Logged out successfully") {
        setLogOut(null);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      setLogOut(null);
      setNotify("Error occured, please try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  if (loading || !loggedInUser) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-slate-900 to-black">
        <p className="spinOnButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <>
      {confirmDelete && <Confirmation width={windowWidth} cancel={setConfirmDelete} proceed={handleDeletePost} ConfirmText={"Are you sure you want to delete this post?"} />}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {showLoader && <Loader width={windowWidth} />}
      {logOut && <Logout width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />

      <div className={`parent flex flex-col w-full bg-gradient-to-r from-slate-900 to-black `}>
        {notify && windowWidth > 450 && (
          <div className="absolute w-[100%] bottom-[130px] flex justify-center">
            <Notify reference={notifyTimer} width={windowWidth} notify={notify} mode="dark" page="Home" />
          </div>
        )}

        {notify && windowWidth <= 450 && (
          <div className="absolute w-[100%] bottom-[70px] flex justify-center">
            <Notify reference={notifyTimer} width={windowWidth} notify={notify} mode="dark" page="Home" />
          </div>
        )}
        <div className="">
          <Topbar page="Game" />
          <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
          {/* <AnimatePresence>{openSearch && <SearchBox width={windowWidth} page={"Home"} ref={leftBarSearchRef} />}</AnimatePresence> */}
        </div>
        <div className="mainsection relative">
          <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Game"} ref={profileDropdownRef} />}</AnimatePresence>
          {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
          <div className={`postContents z-10 overflow-y-auto ${windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"}`}>
            <div className="w-full">
              <WinnersScroll width={windowWidth} />
              <HeroSlider width={windowWidth} />
              <div className="flex items-center justify-center w-full">
                <MiddleTitle width={windowWidth} title={`Topics`} />
              </div>
              <TopButtonsNav width={windowWidth} />
              {/* <MiddleTitle width={windowWidth} title={`Cricket`} /> */}
              {/* <GameFilterButtons width={windowWidth} /> */}
            </div>

            <div className="mt-4 w-full">
              {poolsLoading && (
                <div className="flex justify-center w-full">
                  <p className="spinButton h-[24px] w-[24px]"></p>
                </div>
              )}
              {/* <div className="flex flex-col items-center"> */}
              {!poolsLoading &&
                cricketPoolsList &&
                cricketPoolsList.map((e, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <MiddleTitle width={windowWidth} title={Object.keys(e)[0]} />
                    {e[Object.keys(e)[0]].length === 0 && <p className="text-white font-semiblod text-center">No {Object.keys(e)[0]} pool available right now. </p>}
                    {e[Object.keys(e)[0]].map((pool) => (
                      <PoolCard key={pool._id} pool={pool} width={windowWidth} />
                    ))}
                  </div>
                ))}
              {!poolsLoading && cricketPoolsList && (
                <div className={` h-[200px] mt-8 ${windowWidth > 450 ? "mb-[100px]  pl-4" : "mb-[50px]  pl-2"} w-full`}>
                  <p
                    className={`text-white font-extrabold ${windowWidth < 350 && "text-3xl"} ${windowWidth >= 350 && windowWidth < 768 && "text-5xl"} ${
                      windowWidth >= 768 && "text-5xl"
                    }`}
                  >
                    Play Big
                  </p>
                  <p
                    className={`text-white font-extrabold  ${windowWidth < 350 && "text-3xl"} ${windowWidth >= 350 && windowWidth < 768 && "text-5xl"} ${
                      windowWidth >= 768 && "text-5xl"
                    } mt-4`}
                  >
                    Win Bigger
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="fixed z-20 bottom-0 w-[100vw] mt-8 h-[60px] bg-gradient-to-b from-slate-900 to-black flex items-center">
            <button onClick={() => navigate(`/game/my-pools/view/Upcoming Pools`)} className="h-full w-1/3 pl-3  text-white text-lg flex justify-center items-center font-semibold">
              Upcoming
            </button>
            <button onClick={() => navigate(`/game/my-pools/view/Live Pools`)} className="h-full w-1/3 text-white text-lg flex justify-center items-center font-semibold">
              Live
            </button>
            <button onClick={() => navigate(`/game/my-pools/view/Completed Pools`)} className="h-full w-1/3 text-white text-lg flex justify-center items-center font-semibold">
              Completed
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;

{
  /* {!loadingPools && quickPlay && quickPlay.length > 0 && (
              <>
                <MiddleTitle width={windowWidth} title="Quick Play" />
                <div className="flex items-center justify-center w-full py-2">
                  <h2 className={` ${windowWidth < 400 ? "text-lg mx-2" : "text-xl mx-4"} font-bold text-white uppercase tracking-wide`}>Cricket</h2>
                </div>
                <div className="mt-4 mb-[200px]">
                  {quickPlay.map((e, i) => (
                    <PoolCard key={e._id} pool={e} width={windowWidth} />
                  ))}
                </div>
              </>
            )} */
}
