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
import winSound from "../../assets/notification_sound/crowd-cheer-ii-6263.mp3";
import loseSound from "../../assets/notification_sound/game-over-39-199830.mp3";
import usePrev from "../../hooks/usePrev.js";
import Loader from "../../components/layout/Loader.jsx";
import Notification from "../../components/layout/Notification.jsx";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

const ResultPage = () => {
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
  const [gameReport, setGameReport] = useState({});
  const { width, height } = useWindowSize();

  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const poolsRef = useRef();
  const navigate = useNavigate();
  const { section, poolId } = useParams();
  const prev = usePrev(selectedPoolType);
  const winEffect = useRef();
  const loseEffect = useRef();

  const response = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  };

  async function fetchPoolsData() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setPoolsLoading(true);
      const response = await axiosInstance.get(`/game/game-results/${poolId}`);
      setPoolsLoading(false);
      if (response.data.success) {
        setGameReport(response.data.pool);
        if (response.data.pool.winner) {
          if (response.data.pool.winner === loggedInUser._id) {
            winEffect.current.play();
          } else {
            loseEffect.current.play();
          }
        }
      }
    } catch (error) {
      setPoolsLoading(true);
      const response = await axiosInstance.get(`/game/game-results/${poolId}`);
      setPoolsLoading(false);
      if (response.data.success) {
        setGameReport(response.data.pool);
        if (response.data.pool.winner) {
          if (response.data.pool.winner === loggedInUser._id) {
            winEffect.current.play();
          } else {
            loseEffect.current.play();
          }
        }
      }
    }
  }

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
  }, [loggedInUser, poolId]);

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
      <audio src={winSound} preload="auto" ref={winEffect} className="hidden" />
      <audio src={loseSound} preload="auto" ref={loseEffect} className="hidden" />
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
            <Topbar page="Game" hideAll={true} hide={windowWidth < 550} />
            <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
          </div>
          <div className="mainsection relative">
            {gameReport.verification !== "pending" && gameReport.winner === loggedInUser._id && <Confetti width={width} height={height} />}
            {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
            <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Game"} ref={profileDropdownRef} />}</AnimatePresence>
            <div
              className={`postContents2 items-center h-[100vh] overflow-y-auto ${
                windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"
              }`}
            >
              <div className="mt-4 pb-[200px] ">
                {!poolsLoading && gameReport && (
                  <div className="w-[100vw] max-w-[768px] px-4 text-center text-white font-semibold">
                    <motion.p
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 150, damping: 10 }}
                      className={`text-3xl font-bold text-white `}
                    >
                      {gameReport.draw && "It's a Draw!"}
                      {!gameReport.draw &&
                        (gameReport.verification === "pending"
                          ? "Decision Pending"
                          : gameReport.winner === loggedInUser._id
                          ? `🏆 You Won ${parseInt(gameReport.winningAmount) > 0 ? `₹${gameReport.winningAmount}` : ""}!!!`
                          : "You Lost")}
                    </motion.p>
                    {gameReport.winner !== loggedInUser._id && parseInt(gameReport.winningAmount) > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 150, damping: 10 }}
                        className="mt-4 text-lg font-bold flex justify-center"
                      >
                        Opponent won ₹{gameReport.winningAmount}
                      </motion.div>
                    )}
                    <motion.p
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 150, damping: 10 }}
                      className="text-lg mt-4 font-bold text-white"
                    >
                      {gameReport.draw && "It was a tough match!"}
                      {!gameReport.draw &&
                        (gameReport.verification === "pending" ? "Decision Pending" : gameReport.winner === loggedInUser._id ? "You are a champion" : "Make a comeback next time")}
                    </motion.p>

                    {/* Game Stats */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-4 p-4 font-semibold bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-xl"
                    >
                      {/* <p className="text-lg">You vs Opponent</p> */}
                      <div className="text-lg w-full flex justify-between">
                        {" "}
                        <p>{gameReport.winner === loggedInUser._id && <FontAwesomeIcon icon={faTrophy} className="mr-2" />} Your Score:</p>
                        <p>{gameReport.players.player1._id === loggedInUser._id ? gameReport.players.player1.score : gameReport.players.player2.score}</p>
                      </div>
                      <div className="text-lg w-full flex justify-between">
                        <p>{gameReport.winner && gameReport.winner !== loggedInUser._id && <FontAwesomeIcon icon={faTrophy} className="mr-2" />} Opponent Score:</p>
                        <p>{gameReport.players.player1._id === loggedInUser._id ? gameReport.players.player2.score : gameReport.players.player1.score}</p>
                      </div>
                    </motion.div>
                    {/* Buttons for next actions */}

                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="mt-6 flex justify-center gap-4">
                      <button
                        className={`bg-gradient-to-b from-blue-800 via-blue-700 to-blue-600 hover:opacity-80 text-white ${width > 360 ? "px-4" : "px-2"} py-1 rounded-md`}
                        onClick={() => navigate(`/game`)}
                      >
                        Home Page
                      </button>
                      {/* <button className="bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 hover:opacity-80 text-white px-4 py-2 rounded-md">📊 View Full Stats</button> */}
                    </motion.div>
                  </div>
                )}

                {poolsLoading && (
                  <div className="flex fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center w-full">
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

export default ResultPage;
