import React, { useEffect, useState, useRef } from "react";
import Topbar from "../../components/layout/Topbar.jsx";
import { axiosInstance } from "../../lib/axios.js";
import globalState from "../../lib/globalState.js";
import postTimeLogic from "../../lib/Post_Time_Logic.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import post_uploaded from "../../../src/assets/notification_sound/post_uploaded.mp3";
import delete_notification from "../../assets/notification_sound/delete_notification.wav";
import SearchBox from "../../components/layout/SearchBox.jsx";
import TopbarRightDropdown from "../../components/layout/TopbarRightDropdown.jsx";
import Logout from "../../components/layout/Logout.jsx";
import Confirmation from "../../components/layout/Confirmation.jsx";
import Notify from "../../components/layout/Notify.jsx";
import WinnersScroll from "../../components/layout/game/TopWinnersScrolling.jsx";
import HeroSlider from "../../components/layout/game/HeroSlider.jsx";
import TopButtonsNav from "../../components/layout/game/TopButtonsNav.jsx";
import PoolCard from "../../components/layout/game/PoolCard.jsx";
// import { PoolDataLists } from "../../lib/poolDataLists.js";
import MiddleTitle from "../../components/layout/game/MiddleTitle.jsx";
import GameFilterButtons from "../../components/layout/game/GameFilterButtons.jsx";
import { groupGamePools } from "../../lib/groupGamePools.js";
import usePrev from "../../hooks/usePrev.js";
import Loader from "../../components/layout/Loader.jsx";
import Notification from "../../components/layout/Notification.jsx";

const ViewMyPools = () => {
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
  const notifyClicked = globalState((state) => state.notifyClicked);
  const setLikedData = globalState((state) => state.setLikedData);
  const logOut = globalState((state) => state.logOut);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const setLogOut = globalState((state) => state.setLogOut);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  //   const poolsList = globalState((state) => state.poolsList);
  //   const setPoolsList = globalState((state) => state.setPoolsList);
  const selectedPoolType = globalState((state) => state.selectedPoolType);
  const setSelectedPoolType = globalState((state) => state.setSelectedPoolType);
  const storePools = globalState((state) => state.storePools);
  //   const setStorePools = globalState((state) => state.setStorePools);
  const showLoader = globalState((state) => state.showLoader);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [poolsList, setPoolsList] = useState([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [poolType, setPoolType] = useState("");

  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const poolsRef = useRef();
  const navigate = useNavigate();
  const { section } = useParams();
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

  useEffect(() => {
    if (section) {
      if (section === "Upcoming Pools") [setPoolType("active")];
      else if (section === "Live Pools") [setPoolType("live")];
      else if (section === "Completed Pools") [setPoolType("completed")];
    }
  }, [section]);
  async function fetchPoolsData() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setPoolsLoading(true);
      const response = await axiosInstance.get(`/game/joinedPools/${poolType}`);
      setPoolsLoading(false);
      if (response.data.success) {
        setPoolsList(response.data.pools);
        // poolsRef.current = response.data.pools;
      }
    } catch (error) {
      setPoolsLoading(false);
      if (error.response.data.message && error.response.data.message !== "No pools found") {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
      }
      //  else {
      //   setNotify("Failed to fetch pools, please try again later");
      // }
    }
  }

  useEffect(() => {
    setSelected("Game");
    if (!loggedInUser) {
      response();
    } else if (loggedInUser && poolType) {
      fetchPoolsData();
      setLoading(false);
    }
    return () => {
      setNotifyClicked(null);
    };
  }, [loggedInUser, poolType]);

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
        <p className="spinButton h-[24px] w-[24px]"></p>
      </div>
    );
  }
  return (
    <>
      {confirmDelete && <Confirmation width={windowWidth} cancel={setConfirmDelete} proceed={handleDeletePost} ConfirmText={"Are you sure you want to delete this post?"} />}
      {logOut && <Logout width={windowWidth} />}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {showLoader && <Loader width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />
      <AnimatePresence>
        <motion.div
          //   initial={{ opacity: 0.8, x: windowWidth }}
          //   animate={{ opacity: 1, x: 0 }}
          //   exit={{ opacity: 0, x: windowWidth }}
          //   transition={{ duration: 0.2 }}
          className={`parent flex flex-col w-full bg-gradient-to-r from-slate-900 to-black `}
        >
          {notify && windowWidth > 450 && (
            <div className="absolute w-[100%] bottom-20 flex justify-center">
              <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
            </div>
          )}
          {notify && windowWidth <= 450 && (
            <div className="absolute w-[100%] bottom-10 flex justify-center">
              <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
            </div>
          )}
          <div className="">
            <Topbar page="Game" hideAll={true} hideBell={true} hide={windowWidth < 550} />
            <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
          </div>
          <div className="mainsection relative">
            {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
            <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Game"} ref={profileDropdownRef} />}</AnimatePresence>
            <div
              className={`postContents2 items-center h-[100vh] overflow-y-auto ${
                windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"
              }`}
            >
              <div className="mt-4 pb-[200px] ">
                {!poolsLoading &&
                  poolsList?.length > 0 &&
                  poolsList.map((e, i) => {
                    return <PoolCard key={e._id} pool={e.gamePoolId || {}} width={windowWidth} page={"ViewMyPools"} />;
                  })}
                {!poolsLoading && poolsList?.length === 0 && (
                  <p className="text-white fixed top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 font-semibold">No pool available. </p>
                )}

                {poolsLoading && (
                  <div className="flex justify-center w-full">
                    <p className="spinButton h-[24px] w-[24px]"></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ViewMyPools;
