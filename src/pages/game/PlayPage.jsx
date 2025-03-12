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
// import bgMusic from "../../assets/notification_sound/Martin Garrix - Animals (Official Video).mp3";
import rightAnswer from "../../assets/notification_sound/success-1-6297.mp3";
import wrongAnswer from "../../assets/notification_sound/failed-295059.mp3";
import nextSound from "../../assets/notification_sound/next_question.mp3";
import bgMusic from "../../assets/notification_sound/yt1z.net - (No Copyright) Groove Day Hip Hop Beat - Groove and Modern Background Music For Videos by Soul Prod (320 KBps).mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircle, faCircleArrowRight, faCircleChevronRight, faCircleRight, faEllipsisVertical, faHand, faXmark } from "@fortawesome/free-solid-svg-icons";

const ViewMyPools = () => {
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const confirmDelete = globalState((state) => state.confirmDelete);
  const setConfirmDelete = globalState((state) => state.setConfirmDelete);
  const confirmLeaveGame = globalState((state) => state.confirmLeaveGame);
  const setConfirmLeaveGame = globalState((state) => state.setConfirmLeaveGame);
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
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [pool, setPool] = useState([]);
  const [confirmCheating, setConfirmCheating] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [joinedPlayersList, setJoinedPlayersList] = useState([]);
  const [question, setQuestion] = useState("");
  const [green, setGreen] = useState(null);
  const [red, setRed] = useState(null);
  const [time, setTime] = useState(30);
  const [timeExpired, setTimeExpired] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [getNextQuestion, setGetNextQuestion] = useState(false);
  const [poolJoined, setPoolJoined] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [warningCount, setWarningCount] = useState(1);
  const [cheatWarning, setCheatWarning] = useState(false);
  const [opponent, setOpponent] = useState({});
  const [cheatWarningSentCount, setCheatWarningSentCount] = useState(0);
  const [myScoreColor, setMyScoreColor] = useState("white");
  const [opponentScoreColor, setOpponentScoreColor] = useState("white");
  const [myQuestionIndex, setMyQuestionIndex] = useState(0);
  const [opponentQuestionIndex, setOpponentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [answerClicked, setAnswerClicked] = useState(false);

  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const poolsRef = useRef();
  const videoRef = useRef();
  const questionTimerRef = useRef();
  const socketRef = useRef();
  const bgMusicRef = useRef();
  const rightAnswerRef = useRef();
  const wrongAnswerRef = useRef();
  const nextSoundRef = useRef();
  const questionIndexRef = useRef(false);
  const navigate = useNavigate();
  const { section, poolId } = useParams();
  const prev = usePrev(selectedPoolType);

  const response = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      // navigate("/login");
    }
  };
  async function fetchPoolsData() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setPoolsLoading(true);
      const response = await axiosInstance.get(`/game/getPoolData/live/${poolId}`);
      setPoolsLoading(false);
      if (response.data.success) {
        setPool(response.data.pool);
        if (bgMusicRef.current) {
          bgMusicRef.current.play();
        }
      }
    } catch (error) {
      navigate("/game");
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
    if (nextSoundRef.current) {
      nextSoundRef.current.currentTime = 0;
      nextSoundRef.current.play();
    }
    questionTimerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          clearInterval(questionTimerRef.current);
          setTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, [question]);

  useEffect(() => {
    return () => {
      setTime(30);
      setTimeExpired(null);
      setAnswer(null);
      setResult(null);
      setGreen(null);
      setRed(null);
      setAnswerClicked(false);
    };
  }, [question]);
  useEffect(() => {
    if (timeExpired) {
      setGetNextQuestion(true);
    }
  }, [timeExpired]);

  useEffect(() => {
    if (getNextQuestion && pool) {
      if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
        setTimeout(() => {
          socketHolder.send(
            JSON.stringify({
              type: "send-question",
              payload: {
                poolId: pool._id,
                playerId: loggedInUser._id,
              },
            })
          );
        }, 1000);
      }
      setGetNextQuestion(null);
    }
  }, [getNextQuestion, loggedInUser, socketHolder, pool]);
  useEffect(() => {
    if (questionIndex === 29 && getNextQuestion && opponentQuestionIndex < 29 && answer) {
      setGetNextQuestion(null);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      setNotify("Please wait for your opponent to give all answers...");
    }
  }, [questionIndex, getNextQuestion, opponentQuestionIndex, answer]);

  useEffect(() => {
    if (gameEnd) {
      setLeaveMessage("Getting results, please wait...");
      setNotify(null);
      setTimeout(() => {
        navigate(`/game/results-page/${poolId}`);
      }, 3000);
    }
  }, [gameEnd, poolId]);

  useEffect(() => {
    if (result && answer) {
      if (result === answer) {
        setGreen(result);
        rightAnswerRef.current.play();
      } else if (result !== answer) {
        setGreen(result);
        setRed(answer);
        wrongAnswerRef.current.play();
      }

      setTimeout(() => {
        setGetNextQuestion(true);
      }, 1000);
    }
  }, [result, answer, socketHolder, loggedInUser]);

  useEffect(() => {
    const joinGame = () => {
      if (poolId && loggedInUser && !poolJoined && socketHolder?.readyState === WebSocket.OPEN) {
        handleShowJoinedPlayers();
        socketHolder.send(
          JSON.stringify({
            type: "Join-Game",
            payload: {
              poolId: poolId,
              playerId: loggedInUser._id,
            },
          })
        );
      }
    };

    joinGame();
    const handleSocketOpen = () => joinGame();

    if (socketHolder) {
      socketHolder.addEventListener("open", handleSocketOpen);
    }

    return () => {
      if (socketHolder) {
        socketHolder.removeEventListener("open", handleSocketOpen);
      }
    };
  }, [poolId, socketHolder, loggedInUser, poolJoined]);

  // useEffect(() => {
  //   if (socketHolder) {
  //     socketRef.current = socketHolder;
  //   }
  // }, [socketHolder]);

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

  async function handleShowJoinedPlayers() {
    try {
      // setLoadingPlayers(true);
      const response = await axiosInstance.get(`/game/pool/players/${poolId}`);
      // setLoadingPlayers(false);
      if (response.data.success) {
        setJoinedPlayersList(response.data.players);
        response.data.players.filter((e) => e._id !== loggedInUser._id)[0];
        setOpponent(response.data.players.filter((e) => e._id !== loggedInUser._id)[0]);
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
      if (data.type === "question") {
        setQuestion(data.payload.question);
        setQuestionIndex(data.payload.questionIndex);
      }
      if (data.type === "gameEnd") {
        setGameEnd(data.payload.gameEnd);
      }
      if (data.type === "opponent-leftGame") {
        setLeaveMessage(`${opponent.name.split(" ")[0]} left the game`);
        setTimeout(() => {
          setLeaveMessage(null);
          navigate(`/game/results-page/${pool._id}`);
        }, 3000);
      }
      if (data.type === "result") {
        setResult(data.payload.answer);
      }
      if (data.type === "cheating-warning-sent") {
        if (data.payload.cheatCount) {
          setCheatWarningSentCount(data.payload.cheatCount);
        }
      }
      if (data.type === "cheating-warning") {
        if (data.payload.cheatCount === 1) {
          setCheatWarning(
            `${opponent.name.split(" ")[0]} has sent you a cheating warning, if you are cheating, then please stop cheating, otherwise if ${
              opponent.name.split(" ")[0]
            } report one more time for cheating, then we have to end the game and look into the matter. If you are not cheating, then don't worry, we are here.`
          );
        } else if (data.payload.cheatCount > 1) {
          setCheatWarning(
            `${
              opponent.name.split(" ")[0]
            } has reported twice against you for cheating, unfortunately we have to end the game and look into the matter. If you are not cheating, then don't worry, we are here. Navigating to main page after 10 seconds`
          );
          setTimeout(() => {
            navigate(`/game`);
          }, 10000);
        }
        // setResult(data.payload.answer);
      }
      if (data.type === "score") {
        if (data.payload.yourScore > myScore) {
          setMyScoreColor("white");
        }
        if (data.payload.yourScore < myScore) {
          setMyScoreColor("red");
        }
        if (data.payload.opponentScore > opponentScore) {
          setOpponentScoreColor("white");
        }
        if (data.payload.opponentScore < opponentScore) {
          setOpponentScoreColor("red");
        }
        setMyScore(data.payload.yourScore);
        setOpponentScore(data.payload.opponentScore);
      }
      if (data.type === "question-index") {
        setMyQuestionIndex(data.payload.yourQuestionIndex);
        setOpponentQuestionIndex(data.payload.opponentQuestionIndex);
      }
      if (data.type === "pool-joined") {
        setPoolJoined(true);
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
  }, [socketHolder, connectSocket, loggedInUser, onlineUsers, pool, opponent, opponentScore, myScore]);

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
    if (question?.options) {
      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [question]);

  function handleBack() {
    setConfirmLeaveGame(false);
    if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
      socketHolder.send(
        JSON.stringify({
          type: "Leave-Game",
          payload: {
            poolId: pool?._id,
            playerId: loggedInUser._id,
            playerName: loggedInUser.name.split(" ")[0],
          },
        })
      );
    }
    navigate(`/game/results-page/${pool._id}`);
  }

  async function handleAnswerSubmission(id, myAnswer) {
    if (answer) return;
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }
    setAnswer(myAnswer);
    try {
      if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
        socketHolder.send(
          JSON.stringify({
            type: "Submit-Answer",
            payload: {
              poolId: pool._id,
              playerId: loggedInUser._id,
              questionId: id,
              answer: myAnswer,
              index: questionIndex,
            },
          })
        );
      }
    } catch (error) {}
  }
  async function handleCheating() {
    if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
      socketHolder.send(
        JSON.stringify({
          type: "cheating",
          payload: {
            userId: loggedInUser._id,
            poolId,
          },
        })
      );
      setWarningCount((prev) => prev + 1);
      setConfirmCheating(null);
      if (cheatWarningSentCount >= 1) {
        setTimeout(() => {
          navigate(`/game`);
        }, 3000);
      }
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
      {confirmLeaveGame && (
        <Confirmation width={windowWidth} cancel={setConfirmLeaveGame} proceed={handleBack} ConfirmText={"Are you sure you want to leave, you will lose this match?"} />
      )}
      {cheatWarning && <Confirmation width={windowWidth} cancel={setCheatWarning} cheat={true} alert={true} proceed={() => {}} ConfirmText={cheatWarning} />}
      {confirmCheating && (
        <Confirmation
          width={windowWidth}
          cancel={setConfirmCheating}
          proceed={handleCheating}
          ConfirmText={
            cheatWarningSentCount >= 1
              ? `Are you sure your ${opponent.name.split(" ")[0]} is still cheating, we will end the game and verify, if we find that ${
                  opponent.name.split(" ")[0]
                } is not cheating, then ${opponent.name.split(" ")[0]} will be declared the winner.`
              : `Are you sure your ${opponent.name.split(" ")[0]} is cheating? We will send ${opponent.name.split(" ")[0]} a warning If ${
                  opponent.name.split(" ")[0]
                } doesn't stop cheating after the warning, just report one more time we will end the game and look into the matter.`
          }
        />
      )}
      {leaveMessage && (
        <div className="fixed inset-0 h-[100%] w-[100%] flex justify-center items-center z-50 bg-black bg-opacity-70 ">
          <div className="w-[90%] max-w-[500px]  h-[70px] flex items-center bg-white">
            <p className="spinOnButton h-[24px] ml-4 w-[24px]"></p>
            <p className="text-black ml-2 text-center">{leaveMessage}</p>
          </div>
        </div>
      )}
      {logOut && <Logout width={windowWidth} />}
      {showLoader && <Loader width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />
      <audio ref={rightAnswerRef} preload="auto" src={rightAnswer} className="hidden" />
      <audio ref={wrongAnswerRef} preload="auto" src={wrongAnswer} className="hidden" />
      <audio ref={nextSoundRef} preload="auto" src={nextSound} className="hidden" />
      <AnimatePresence>
        <motion.div
          //   initial={{ opacity: 0.8, x: windowWidth }}
          //   animate={{ opacity: 1, x: 0 }}
          //   exit={{ opacity: 0, x: windowWidth }}
          //   transition={{ duration: 0.2 }}
          className={`parent flex flex-col w-full bg-gradient-to-r from-slate-900 to-black `}
        >
          {notify && windowWidth > 450 && (
            <div className="absolute w-[100%] bottom-[120px] flex justify-center">
              <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
            </div>
          )}
          {notify && windowWidth <= 450 && (
            <div className="absolute w-[100%] bottom-20 flex justify-center">
              <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
            </div>
          )}
          <div className="">
            <audio src={bgMusic} preload="auto" ref={bgMusicRef} loop className="hidden" />
            {/* <Topbar page="Game" hide={true} /> */}
            <div className={`sticky top-0 py-[15px] px-[10px] w-full flex items-center justify-between ${windowWidth > 450 ? "h-[65px]" : "h-[50px]"}`}>
              <div className="text-white flex items-center">
                <FontAwesomeIcon
                  onClick={() => setConfirmLeaveGame(true)}
                  icon={faArrowLeft}
                  className={`cursor-pointer text-white mr-2 ${windowWidth >= 450 ? "text-[24px]" : "text-[20px] mt-[1px]"}`}
                />
                <p
                  className={`logoHead ${windowWidth <= 450 && "text-2xl"} ${
                    windowWidth > 450 && "text-3xl"
                  } font-bold text-center text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-100 via-blue-400 to-blue-400`}
                >
                  {pool && pool.title?.length > 14 ? pool.title?.slice(0, 14) + "..." : pool.title}
                </p>
              </div>
              <div className={` text-white ${windowWidth <= 450 && "text-xl"} ${windowWidth > 450 && "text-3xl"} font-bold`}>{time >= 10 ? time : `0${time}`} sec</div>
            </div>
            {/* <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence> */}
          </div>
          <div className="mainsection relative">
            {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
            <div
              className={`postContents2 mt-3 items-center h-[calc(100vh-60px)] overflow-y-auto pb-[100px] ${
                windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"
              }`}
            >
              <div className="w-[100vw]">
                {joinedPlayersList?.length > 0 &&
                  joinedPlayersList.map((e, i) => {
                    return (
                      <div key={e._id} className={`w-full px-2 mb-6`}>
                        <div className="w-full flex justify-between items-center">
                          <div className="flex items-center">
                            <img src={e.profilePic} className="h-[35px] w-[35px] aspect-square object-cover rounded-full" />
                            <p className="text-white ml-3 text-md font-semibold">{e._id === loggedInUser._id ? "You" : e.name.split(" ")[0]}</p>
                            <p className="mx-4 text-white">|</p>
                            <p className="text-white ml-0 text-md font-semibold">
                              {e._id === loggedInUser._id ? `Answering ${myQuestionIndex}` : opponentQuestionIndex === 0 ? "Offline" : `Answering ${opponentQuestionIndex}`}
                            </p>
                          </div>
                          <p className="text-white mr-1 font-bold text-lg">{e._id === loggedInUser._id ? myScore : opponentScore}</p>
                          {/* <p>{myscore}</p>
                        <p>{opponentscore}</p> */}
                        </div>
                        <div className="w-full h-[6px] mt-4 bg-slate-800 rounded-full">
                          <p
                            className={`h-full rounded-full ${e._id === loggedInUser._id && (myScoreColor === "red" ? "bg-red-500" : "bg-white")} 
                            ${e._id !== loggedInUser._id && (opponentScoreColor === "red" ? "bg-red-500" : "bg-white")} `}
                            style={{ width: `${e._id === loggedInUser._id ? myScore / 10 : opponentScore / 10}%` }}
                          ></p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="w-[100vw] px-2 mt-[-4px]">
                <p className="text-white w-full mt-2 flex justify-start font-semibold">
                  Question {questionIndex + 1} of 30 <span className="ml-[2px]">:</span>
                </p>
                <p className="text-white pl-0 mt-1 text-2xl font-bold">{question.question}</p>
              </div>
              <div className="mt-6 w-full px-2">
                {shuffledOptions?.map((e, i) => {
                  return (
                    <div
                      onClick={() => {
                        handleAnswerSubmission(question._id, e);
                        setAnswerClicked(true);
                      }}
                      key={i}
                      className={`text-white cursor-pointer text-xl font-bold w-full h-[50px] flex items-center px-2 rounded-lg ${
                        red === e && "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-red-500 to-red-700"
                      } ${green === e && "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-green-600 to-sky-900"} ${
                        green !== e && red !== e && !answerClicked && "bg-gradient-to-b from-slate-800 to-black"
                      } ${answerClicked && "bg-black"} mb-6`}
                    >
                      <FontAwesomeIcon icon={faCircle} className="text-sm" /> <span className="ml-[1px] mr-4"></span> {e}
                    </div>
                  );
                })}
              </div>
              {/* <div className="fixed right-2 w-[90px] h-[150px] bottom-[70px] rounded-xl bg-gradient-to-b from-slate-800 to-black">
                <video ref={videoRef} autoPlay className="w-full h-full cursor-pointer rounded-xl object-cover"></video>
              </div> */}
              <div className="fixed bottom-0 bg-gradient-to-b from-slate-900 to-black h-[60px] w-full flex items-center justify-between px-2">
                <div onClick={() => setConfirmCheating(true)} className="flex group flex-col items-center cursor-pointer">
                  <FontAwesomeIcon icon={faHand} className="text-white text-xl group-hover:opacity-70" />
                  <p className="text-zinc-200 font-semibold text-sm group-hover:opacity-70">Cheating</p>
                </div>
                {/* <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={faXmark} className="text-white text-xl" />
                  <p className="text-zinc-200 font-semibold text-sm">Wrong question</p>
                </div> */}
                {/* <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={faHand} className="text-white text-2xl" />
                  <p className="text-white text-2xl">1</p>
                  <p className="text-zinc-200 font-semibold">Leave</p>
                </div> */}

                <div onClick={() => setGetNextQuestion(true)} className="flex flex-col items-center cursor-pointer group ">
                  <FontAwesomeIcon icon={faCircleArrowRight} className="text-white text-xl group-hover:opacity-70" />
                  <p className="text-zinc-200 font-semibold text-sm group-hover:opacity-70">Skip Question</p>
                </div>
              </div>

              <div className="mt-10 ">
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

{
  /* <div className="w-[100vw] px-2 flex justify-between">
                <p className="text-white font-semibold text-sm">Easy</p>
                <p className="text-zinc-700 font-semibold text-sm">Medium</p>
                <p className="text-zinc-700 font-semibold text-sm">Hard</p>
                <p className="text-zinc-700 font-semibold text-sm">Puzzle</p>
              </div> */
}
