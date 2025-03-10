import React, { useEffect, useState, useRef } from "react";
import moment from "moment-timezone";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faTrophy, faUser, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../../lib/globalState";
import { axiosInstance } from "../../../lib/axios";
import { gameTime } from "../../../lib/gameTime.js";
import { useStore } from "zustand";
import enterSound from "../../../assets/notification_sound/successed-295058.mp3";
// gradient-to-r from-gray-900 to-gray-800
const PoolCard = ({ pool = {}, width, detailsPage = false, page = "", fetchFunc = () => {}, poolPage = false }) => {
  const [showLine, setShowLine] = useState(false);
  const setShowLoader = globalState((state) => state.setShowLoader);
  const setNotify = globalState((state) => state.setNotify);
  const storePools = globalState((state) => state.storePools);
  const setStorePools = globalState((state) => state.setStorePools);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const poolsDataList = globalState((state) => state.poolsDataList);
  const setPoolsDataList = globalState((state) => state.setPoolsDataList);
  const joinedPools = globalState((state) => state.joinedPools);
  const setJoinedPools = globalState((state) => state.setJoinedPools);
  const socketHolder = globalState((state) => state.socketHolder);
  const setPlayerCountIncreased = globalState((state) => state.setPlayerCountIncreased);
  const playerCountIncreased = globalState((state) => state.playerCountIncreased);
  const cricketPoolsList = globalState((state) => state.cricketPoolsList);
  const setCricketPoolsList = globalState((state) => state.setCricketPoolsList);
  const [full, setFull] = useState(false);
  const [joined, setJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);
  const [updatedJoinedPlayers, setUpdatedJoinedPlayers] = useState(0);
  const [play, setPlay] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const notifyTimer = useRef();
  const expiredRef = useRef();
  const fetched = useRef(false);
  const audioRef = useRef();
  const { section } = useParams();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLine((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (expired && poolPage && !fetched.current) {
      fetchFunc();
      fetched.current = true;
    }
  }, [poolPage, fetchFunc, expired]);
  function handlePoolClicked() {
    if (section === "Completed Pools") {
      navigate(`/game/results-page/${pool._id}`);
      return;
    }
    navigate(`/game/${pool.topic.toLowerCase()}/${pool._id}`);
  }
  async function handleButtonClick(e) {
    e.stopPropagation();
    if (play) {
      navigate(`/game/maths/play/${pool._id}`);
      return;
    }
    // if(expired) return;
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (full) {
      const set = new Set(pool.players);
      if (set.has(loggedInUser._id)) {
        setNotify(`You have already joined this pool`);
        notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
        return;
      }
    }
    // if (page !== "PoolPage" && page !== "ViewMyPools") {
    //   handlePoolClicked();
    //   return;
    // }
    try {
      setShowLoader(true);
      const response = await axiosInstance.put(`/game/enterPool/${pool._id}`);
      if (response.data.success) {
        audioRef.current?.play();
        setJoined(true);
        setShowLoader(false);
        if (response.data.pool.joinedPlayers) {
          setUpdatedJoinedPlayers(response.data.pool.joinedPlayers);
        }
        setNotify("You have joined the pool");
        notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
        setJoinedPools([...joinedPools, response.data.pool]);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "pool-joined",
              payload: {
                poolId: pool._id,
                userId: loggedInUser._id,
                name: loggedInUser.name.split(" ")[0],
                profilePic: loggedInUser.profilePic,
              },
            })
          );
        }
        const found = cricketPoolsList.findIndex((e) => e._id === pool._id);
        if (found >= 0) {
          cricketPoolsList[found] = response.data.pool;
          setCricketPoolsList([...cricketPoolsList]);
        }
      } else {
        throw error;
      }
    } catch (error) {
      setShowLoader(false);
      if (error.response.data.message) {
        setNotify(error.response.data.message);
      } else {
        setNotify("Something went wrong, please try again later");
      }

      notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
    }
  }
  useEffect(() => {
    if (pool && parseInt(pool.maxPlayers) === parseInt(updatedJoinedPlayers)) {
      setFull(true);
    } else {
      setFull(false);
    }
  }, [updatedJoinedPlayers, pool]);
  function fullStatus() {
    if (pool && parseInt(pool.maxPlayers) === parseInt(pool.joinedPlayers)) {
      setFull(true);
    } else {
      setFull(false);
    }
  }
  useEffect(() => {
    fullStatus();
  }, [pool, storePools]);
  useEffect(() => {
    if (!pool || !pool.gameTime) return;
    expiredRef.current = false;
    let interval = null;
    let playersInterval = null;
    const givenTime = moment(pool.gameTime).tz("Asia/Kolkata");
    updateStatus(givenTime);
    const updateTimer = () => {
      const time = gameTime(pool.gameTime);
      setTimeLeft(time);
      if (time === "00s") {
        setExpired(true);
        clearInterval(interval);
        clearInterval(playersInterval);
      }
    };
    if (!expiredRef.current) {
      updateTimer();
      interval = setInterval(updateTimer, 1000);
      playersInterval = setInterval(getUpdatedUsers, 15 * 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(playersInterval);
    };
  }, [pool]);
  function updateStatus(givenTime) {
    const currentTimeDate = new Date();
    const poolTime = new Date(givenTime);
    if (poolTime.getTime() <= currentTimeDate.getTime()) {
      expiredRef.current = true;
      setExpired(true);
    }
  }
  useEffect(() => {
    if (expired) {
      if (pool.players.includes(loggedInUser._id) && pool.full) {
        setPlay(true);
      } else {
        setPlay(false);
      }
    }
  }, [expired]);

  async function getUpdatedUsers() {
    try {
      const response = await axiosInstance.get(`/game/getJoinedPlayers/${pool._id}`);
      if (response.data.count > updatedJoinedPlayers) {
        setPlayerCountIncreased(true);
      }
      setUpdatedJoinedPlayers(response.data.count);
    } catch (error) {}
  }
  // useEffect(() => {
  //   if (joined && poolsDataList && pool && pool.type === "Mega") {
  //     const index = poolsDataList.findIndex((e) => e._id === pool._id);
  //     if (index >= 0) {
  //       poolsDataList[index].joinedPlayers += 1;
  //       setPoolsDataList(poolsDataList);
  //     }
  //   }
  // }, [joined, poolsDataList, pool]);
  return (
    <motion.div
      onClick={handlePoolClicked}
      className={`relative w-[100vw] max-w-[768px] ${width >= 768 && "rounded-xl"} mb-4 inter bg-white cursor-pointer text-black shadow-lg flex flex-col`}
    >
      {!detailsPage && (
        <div className="flex justify-center items-center h-[40px] rounded-t-xl px-4 bg-slate-200">
          <h2 className="text-md font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-black">{pool.title}</h2>
        </div>
      )}
      {/* bg-gradient-to-b from-slate-800 via-red-500 to-blue-700   */}
      <div className={`px-4 ${detailsPage ? "mt-4" : "mt-2"} w-full`}>
        <div className="flex justify-between  mt-1">
          <div className="flex">
            <p className={`${width < 360 ? "text-xl" : "text-2xl"}  font-extrabold`}>{parseInt(pool.totalPoolAmount) > 0 ? `₹ ${pool.totalPoolAmount}` : "Free"}</p>
          </div>
          {pool.status !== "completed" && (
            <button
              onClick={handleButtonClick}
              className={`${showLine && "shiny-btn"} bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white ${
                width < 360 ? " w-[80px] h-[30px] text-md" : " w-[90px] h-[35px] text-lg"
              } rounded-lg font-semibold hover:opacity-80 transition-all`}
            >
              {expired && !play && "Time Out"}
              {!expired && !full && <>{pool.entryFee > 0 ? `₹ ${pool.entryFee}` : "Free"}</>}
              {!expired && full && "Full"}
              {expired && play && "Play"}
            </button>
          )}
        </div>
        <audio ref={audioRef} src={enterSound} className="hidden" />
        <div className={`${width < 350 ? "mt-2" : "mt-4"}`}>
          <div className="w-full flex justify-between items-center">
            <p className={`${width < 350 ? "text-xs" : "text-sm"} text-blue-600`}>{updatedJoinedPlayers || pool.joinedPlayers} joined</p>
            {!expired && <p className="bg-blue-700 bg-opacity-100 text-white px-1 rounded-md ">{timeLeft}</p>}
            <p className={`${width < 350 ? "text-xs" : "text-sm"} text-gray-500`}>Total {pool.maxPlayers}</p>
          </div>
          <div className="w-full h-[6px] bg-gray-300 rounded-full mt-1">
            <p className="h-full bg-blue-600 rounded-full" style={{ width: `${((updatedJoinedPlayers || pool.joinedPlayers) / pool.maxPlayers) * 100}%` }}></p>
          </div>
        </div>
      </div>
      <div className={`flex px-4 justify-between items-center rounded-b-xl mt-2 ${detailsPage ? "h-[70px]" : "h-[40px] bg-slate-200"} `}>
        {!detailsPage && (
          <div className="flex items-center justify-between w-full text-sm">
            <p className="font-bold">1st prize: ₹ {pool.firstPrize}</p>
            <p className="text-sm font-bold  py-1">
              <FontAwesomeIcon icon={faTrophy} className="text-red-600 " /> {pool.winningChance}%
            </p>
          </div>
        )}

        {detailsPage && (
          <div className="flex items-center justify-between w-full text-md">
            {pool.status !== "completed" && (
              <button
                onClick={handleButtonClick}
                className={`${
                  showLine && "shiny-btn"
                } bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover:opacity-80 text-white w-full h-[33px] font-semibold flex justify-center items-center rounded-lg`}
              >
                {expired && !play && "Time Out"}
                {!expired && !full && "Join"}
                {!expired && full && "Full"}
                {expired && play && "Play"}
              </button>
            )}
            {pool.status === "completed" && (
              <button className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white w-full h-[33px] font-semibold flex justify-center items-center rounded-lg">
                Game Completed
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PoolCard;

// export default PoolCard;
