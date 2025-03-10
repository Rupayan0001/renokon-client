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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faChessKing, faCrown, faMedal, faShare, faShareFromSquare, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/layout/loader.jsx";
import ProfileCard from "../../components/layout/ProfileCard.jsx";
import Notification from "../../components/layout/Notification.jsx";
import ShareModal from "../../components/layout/ShareModal.jsx";
import { set } from "mongoose";

const PoolPage = () => {
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
  const setLogOut = globalState((state) => state.setLogOut);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  const cricketPoolsList = globalState((state) => state.cricketPoolsList);
  const setCricketPoolsList = globalState((state) => state.setCricketPoolsList);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const joinedPools = globalState((state) => state.joinedPools);
  const showLoader = globalState((state) => state.showLoader);
  const storePools = globalState((state) => state.storePools);
  const shareOptions = globalState((state) => state.shareOptions);
  const setShareOptions = globalState((state) => state.setShareOptions);
  const closeModal = globalState((state) => state.closeModal);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const playerCountIncreased = globalState((state) => state.playerCountIncreased);
  const setPlayerCountIncreased = globalState((state) => state.setPlayerCountIncreased);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [poolDetails, setPoolDetails] = useState(null);
  const [selectedButton, setSelectedButton] = useState("prizes");
  const [joinedPlayersList, setJoinedPlayersList] = useState([]);
  const [loadingplayers, setLoadingPlayers] = useState(false);

  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const shareOptionsRef = useRef();
  const poolsRef = useRef();
  const navigate = useNavigate();
  const { section, poolId } = useParams();
  const location = useLocation();
  const response = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setUser(result.data.user);
      setLoading(false);
    } catch (err) {
      // navigate("/login");
    }
  };

  async function setPoolData() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    // const found = storePools?.find((e) => e._id === poolId);
    // if (found) {
    //   setPoolDetails(found);
    //   return;
    // }
    try {
      // setPoolsLoading(true);
      const response = await axiosInstance.get(`/game/getPoolData/${poolId}`);
      setPoolsLoading(false);
      if (response.data.success) {
        setPoolDetails(response.data.pool);
      }
    } catch (error) {
      setPoolsLoading(false);
      if (error.response.data.message) {
        setNotify(error.response.data.message);
      } else {
        setNotify("Failed to fetch pools, please try again later");
      }
      notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
    }
  }
  useEffect(() => {
    if (closeModal) {
      // setOpenBlockList(null);
      // setOpenHideUserList(null);
      setCloseModal(null);
      setShareOptions(null);
      // setShowFriends(null);
    }
  }, [closeModal]);
  useEffect(() => {
    setSelected("Game");
    if (!loggedInUser || !user) {
      response();
    } else if (loggedInUser) {
      setPoolData();
      setLoading(false);
    }
    return () => {
      //   setPageName("");
      setNotifyClicked(null);
    };
  }, [loggedInUser, user]);

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
      setPoolDetails(null);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
        setOpenProfileDropdown(false);
      }
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(e.target)) {
        setShareOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [topBarRightProfilePicRefState]);
  //   useEffect(() => {
  //     if (notify === "Post uploaded successfully" || notify === "Post updated successfully") {
  //       if (postUploadedSoundRef.current) {
  //         postUploadedSoundRef.current.play();
  //       }
  //     }
  //   }, [notify]);

  // useEffect(()=> [

  // ], [poolId, socketHolder])

  async function handleShowJoinedPlayers() {
    try {
      if (!joinedPlayersList.length) {
        setLoadingPlayers(true);
      }
      const response = await axiosInstance.get(`/game/pool/players/${poolId}`);
      setLoadingPlayers(false);
      if (response.data.success) {
        setJoinedPlayersList(response.data.players);
      }
    } catch (error) {
      setLoadingPlayers(false);
      if (error.response.data.message) {
        setNotify(error.response.data.message);
      } else {
        setNotify("Failed to get players details, please try again later");
      }
      notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
    }
  }
  useEffect(() => {
    if (joinedPools.length >= 1) {
      handleShowJoinedPlayers();
    }
    if (playerCountIncreased) {
      handleShowJoinedPlayers();
      setPlayerCountIncreased(false);
    }
  }, [joinedPools, playerCountIncreased]);

  if (loading || (!loggedInUser && !poolDetails)) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-slate-900 to-black">
        <p className="spinButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <>
      {confirmDelete && <Confirmation width={windowWidth} cancel={setConfirmDelete} proceed={handleDeletePost} ConfirmText={"Are you sure you want to delete this post?"} />}
      {/* {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )} */}
      {logOut && (
        <div className="flex justify-center items-center bg-black bg-opacity-30 ">
          <Logout width={windowWidth} />
        </div>
      )}
      {shareOptions && <ShareModal width={windowWidth} page="Home" URL={window.location.href} ref={shareOptionsRef} />}
      {showLoader && <Loader width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />
      <AnimatePresence>
        <motion.div
          //   initial={{ opacity: 0.8, x: windowWidth }}
          //   animate={{ opacity: 1, x: 0 }}
          //   exit={{ opacity: 0, x: windowWidth }}
          //   transition={{ duration: 0.2 }}
          className={`parent relative flex flex-col w-full bg-gradient-to-r from-slate-900 to-black `}
        >
          {notify && windowWidth > 450 && (
            <div className="absolute w-[100%] bottom-20 flex justify-center">
              <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
            </div>
          )}
          {notify && windowWidth <= 450 && (
            <div className="absolute w-[100%] bottom-10 flex justify-center">
              <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Message" />
            </div>
          )}
          <div className="">
            <Topbar page="Game" hideAll={true} hideBell={true} hide={windowWidth < 550} poolDetails={poolDetails} />
            <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
            <AnimatePresence>{openSearch && <SearchBox width={windowWidth} page={"Home"} ref={leftBarSearchRef} />}</AnimatePresence>
          </div>
          <div className="mainsection2 overflow-y-auto scrollbar-none relative">
            <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Game"} ref={profileDropdownRef} />}</AnimatePresence>
            {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
            <div
              className={`postContents h-[100vh] overflow-y-auto ${windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"}`}
            >
              {!poolsLoading && (
                <div className="mt-4 ">
                  {poolDetails && (
                    <PoolCard key={poolDetails?._id} pool={poolDetails} poolPage={true} fetchFunc={setPoolData} width={windowWidth} page="PoolPage" detailsPage={true} />
                  )}
                  <div className={`${windowWidth > 768 ? "" : "px-1"}`}>
                    {poolDetails && (
                      <div className={`w-full ${windowWidth > 768 ? "h-[40px]" : "h-[34px]"}  bg-slate-800 px-1 mb-4 flex items-center font-bold rounded-lg`}>
                        <button
                          onClick={() => setSelectedButton("prizes")}
                          className={`h-[70%] w-1/2 rounded-md ${selectedButton === "players" ? "text-white" : "bg-white text-black"} flex justify-center items-center`}
                        >
                          Prizes
                        </button>
                        <button
                          onClick={() => {
                            setSelectedButton("players");
                            handleShowJoinedPlayers();
                          }}
                          className={`h-[70%] w-1/2 rounded-md ${selectedButton === "prizes" ? "text-white" : "bg-white text-black"} flex justify-center items-center`}
                        >
                          Players
                        </button>
                      </div>
                    )}

                    {selectedButton === "players" && (
                      <div className={`w-full flex justify-end mt-5 ${windowWidth > 768 ? "" : "px-2"} mb-2`}>
                        {/* <p className="text-md font-semibold text-white  cursor-pointer hover:opacity-80 transition duration-100">Play Now</p> */}
                        <p
                          onClick={() => setShareOptions(window.location.href)}
                          className="text-md font-semibold text-white  cursor-pointer hover:opacity-80 transition duration-100"
                        >
                          Share
                        </p>
                      </div>
                    )}
                    {selectedButton === "prizes" &&
                      poolDetails &&
                      poolDetails.prize_distribution?.length > 0 &&
                      poolDetails.prize_distribution?.map((e, i) => (
                        <div key={i} className={`w-full text-lg flex items-center justify-between text-white px-4 mb-2 h-[40px] font-semibold`}>
                          <div className={``}>
                            {parseInt(e.rank_range) === 1 && <FontAwesomeIcon icon={faCrown} className="mr-1" />}
                            {parseInt(e.rank_range) === 2 && <FontAwesomeIcon icon={faTrophy} className="mr-1" />}
                            {parseInt(e.rank_range) === 3 && <FontAwesomeIcon icon={faMedal} className="mr-1" />}
                            {parseInt(e.rank_range) > 3 && parseInt(e.rank_range) <= 10 && <FontAwesomeIcon icon={faMedal} className="mr-1" />}
                            {parseInt(e.rank_range) > 10 && <span className="mr-1">#</span>} {e.rank_range}
                          </div>
                          <div>₹ {e.prize}</div>
                        </div>
                      ))}
                    {selectedButton === "players" && !loadingplayers && poolDetails && poolDetails.players?.length === 0 && !joinedPlayersList.length && (
                      <div className={`w-full text-md flex justify-center text-white  px-0 mt-10  font-semibold`}>No players joined yet.</div>
                    )}

                    {selectedButton === "players" && poolDetails && !loadingplayers && joinedPlayersList.length > 0 && (
                      <div className="mt-5">
                        {joinedPlayersList.map((e, i) => (
                          <ProfileCard
                            key={e._id}
                            name={e.name}
                            username={e.username}
                            profilePic={e.profilePic}
                            textColor="white"
                            id={e._id}
                            game={true}
                            cardHeight="50px"
                            profileSize="40px"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedButton === "players" && poolDetails && loadingplayers && (
                    <div className="w-full flex justify-center mt-6">
                      <p className="spinButton h-[24px] w-[24px]"></p>
                    </div>
                  )}
                  {/* {!poolsLoading && selectedButton === "prizes" && poolDetails && (
                  <div className={poolDetails?.prize_distribution?.length > 0 ? "pb-[50px] mt-10" : "fixed bottom-0 pb-[10px]"}>
                    <div className=" h-[200px]">
                      <p className={`text-white font-extrabold ${windowWidth < 350 ? "text-5xl" : "text-6xl"}`}>Play Big</p>
                      <p className={`text-white font-extrabold ${windowWidth < 350 ? "text-5xl" : "text-6xl"} mt-4`}>Win Bigger</p>
                    </div>
                  </div>
                )} */}
                </div>
              )}
              {poolsLoading && (
                <div className="w-full flex justify-center mt-6">
                  <p className="spinButton h-[24px] w-[24px]"></p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PoolPage;
