import React, { useEffect, useState, useRef } from "react";
import Topbar from "../../components/layout/Topbar";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState.js";
import postTimeLogic from "../../lib/Post_Time_Logic.js";
import { Link, redirect, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import post_uploaded from "../../../src/assets/notification_sound/post_uploaded.mp3";
import delete_notification from "../../assets/notification_sound/delete_notification.wav";
import TopbarRightDropdown from "../../components/layout/TopbarRightDropdown.jsx";
import Logout from "../../components/layout/Logout.jsx";
import Confirmation from "../../components/layout/Confirmation.jsx";
import Notify from "../../components/layout/Notify.jsx";
import MiddleTitle from "../../components/layout/game/MiddleTitle.jsx";
import Loader from "../../components/layout/Loader.jsx";
import Notification from "../../components/layout/Notification.jsx";
import usePrev from "../../hooks/usePrev.js";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { load } from "@cashfreepayments/cashfree-js";

const Wallet = () => {
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
  const [selectedButton, setSelectedButton] = useState("");
  const [walletHistory, setWalletHistory] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [amount, setAmount] = useState(100);
  const [CashFree, setCashFree] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const poolsRef = useRef();
  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const navigate = useNavigate();
  const { postId } = useParams();
  const prev = usePrev(selectedPoolType);
  const [sessionId, setSessionId] = useState(null);

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
  // const orderId = uuidv4();
  async function fetchWalletHistory() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setPoolsLoading(true);
      const response = await axiosInstance.get(`/payment/walletHistory`);
      setPoolsLoading(false);
      if (response.data.success) {
        setWalletHistory(response.data.wallet);
      }
      if (!response.data.success) {
        setNotFound(`No transaction found`);
      }
    } catch (error) {
      setPoolsLoading(false);
      if (error.response.data.message) {
        setNotify(error.response.data.message);
      } else {
        setNotify("Failed to fetch transactions, please try again later");
      }
      notifyTimer.current = setTimeout(() => setNotify(null), 5 * 1000);
    }
  }

  useEffect(() => {
    setSelected("Game");
    if (!loggedInUser) {
      response();
    } else if (loggedInUser) {
      fetchWalletHistory();
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

  useEffect(() => {
    let cashFree;
    const initializeSDK = async () => {
      cashFree = await load({ mode: "sandbox" });
      setCashFree(cashFree);
    };
    initializeSDK();
  }, []);
  const getSessionId = async () => {
    try {
      const id = uuidv4();
      setOrderId(id);
      const response = await axiosInstance.post("/payment/createOrder", { orderId: id, customerName: loggedInUser.name, customerEmail: loggedInUser.email, amount: amount });

      if (response.data.success) {
        setSessionId(response.data.paymentSessionId);
        return response.data.paymentSessionId;
      }
      throw Error;
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };
  const handlePaymentClick = async () => {
    try {
      const sessionId = await getSessionId();

      const res = await CashFree.checkout({ paymentSessionId: sessionId, redirectTarget: "_modal" });
      await verifyPayment();
    } catch (error) {
      // console.log(error);
    }
  };
  const verifyPayment = async () => {
    try {
      // console.log("orderId: ", orderId);
      const response = await axiosInstance.post(`/payment/verifyPayment/${orderId}`);
      if (response.data.success) {
        // console.log("Payment Success:", response.data.message);
        alert("Verified");
      } else {
        // console.error("Error creating order:", response.data.message);
      }
    } catch (error) {
      // console.error("Payment Error:", error);
    }
  };
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
        notifyTimer.current = setTimeout(() => {
          setLogOut(null);
          navigate("/login");
        }, 1000);
      } else {
        throw Error;
      }
    } catch (error) {
      setLogOut(null);
      setNotify("Error occured, please try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  function handleClick() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setNotify(`Wallet transactions is not live yet`);
    notifyTimer.current = setTimeout(() => {
      setNotify(null);
    }, 5 * 1000);
  }
  if (loading || !loggedInUser) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-slate-900 to-black">
        <p className="spinButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <>
      {confirmDelete && <Confirmation width={windowWidth} cancel={setConfirmDelete} proceed={handleDeletePost} ConfirmText={"Are you sure you want to delete this post?"} />}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {depositModalOpen && (
        <dialog className="fixed inset-0 z-50 h-[100%] w-[100%]  flex justify-center items-center bg-black bg-opacity-60">
          <div className={`w-[500px] h-[250px] relative px-4 bg-gradient-to-r from-slate-900 to-black rounded-xl text-[20px]`}>
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute w-[20px] h-[20px] top-1 right-1 p-2 hover:bg-slate-900 text-white font-bold rounded-full cursor-pointer"
              onClick={() => setDepositModalOpen(false)}
            />
            <h2 className="text-white text-center border-b-2 border-slate-600 h-[50px] flex justify-center items-center font-bold">Deposit</h2>
            <div className="flex flex-col justify-center items-center h-[calc(100%-60px)] ">
              <input
                type="number"
                value={amount}
                placeholder="Enter amount"
                className="w-[100%] h-[40px] rounded-md my-2 px-2 outline-none font-semibold"
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={handleClick}
                className={`${windowWidth > 425 ? "w-full h-[40px]" : "w-full py-1"} mt-6 hover:opacity-80 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white`}
              >
                Deposit
              </button>
            </div>
          </div>
        </dialog>
      )}
      {showLoader && <Loader width={windowWidth} />}
      {logOut && <Logout width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />

      <div className={`parent flex flex-col w-full bg-gradient-to-r from-slate-900 to-black `}>
        {notify && windowWidth > 450 && (
          <div className="absolute w-[100%] bottom-20 flex justify-center">
            <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
          </div>
        )}

        {notify && windowWidth <= 450 && (
          <div className="absolute w-[100%] bottom-[70px] flex justify-center">
            <Notify reference={notifyTimer} width={windowWidth} notify={notify} page="Home" />
          </div>
        )}
        <div className="">
          <Topbar page="Game" />
          <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
        </div>
        <div className="mainsection relative">
          <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Game"} ref={profileDropdownRef} />}</AnimatePresence>
          {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
          <div className={`postContents z-10 overflow-y-auto ${windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"}`}>
            <div className="mt-4 w-full">
              {poolsLoading && (
                <div className="flex justify-center w-full">
                  <p className="spinButton h-[24px] w-[24px]"></p>
                </div>
              )}
              {!poolsLoading && (
                <div className="flex justify-center w-full">
                  <div className={`${windowWidth > 425 ? "px-4" : ""}  w-full max-w-[768px] text-white`}>
                    <div className={` p-4 ${windowWidth > 425 ? "rounded-lg bg-white " : ""} `}>
                      <div className={`flex justify-between items-center ${windowWidth > 425 ? "text-2xl text-black" : "text-xl text-white"}   font-bold w-full`}>
                        <p>Balance:</p>
                        <p>₹ {loggedInUser.walletBalance}</p>
                      </div>
                      <div className="flex justify-between text-lg items-center font-bold text-black w-full">
                        {/* <Link to="/depo" */}
                        <button
                          onClick={() => {
                            if (windowWidth > 425) {
                              setDepositModalOpen(true);
                            } else {
                              navigate("/deposit");
                            }
                          }}
                          className={`${
                            windowWidth > 425 ? "w-1/2 h-[40px]" : "w-[120px] py-1"
                          }   mr-4 mt-4 hover:opacity-80 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white`}
                        >
                          Deposit
                        </button>
                        <button
                          onClick={handleClick}
                          className={`${
                            windowWidth > 425 ? "w-1/2 h-[40px]" : "w-[120px] py-1"
                          } mt-4 hover:opacity-80 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white`}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className={`flex justify-between ${windowWidth > 425 ? "text-md mt-6" : "text-xs px-4 mt-4"}  font-semibold `}>
                        <button
                          onClick={() => {
                            setSelectedButton("Deposits");
                          }}
                          className={`hover:text-white ${selectedButton === "Deposits" ? " text-white border-b-2 border-white" : " text-zinc-300 border-b-2 border-transparent"}`}
                        >
                          Deposits
                        </button>
                        <button
                          onClick={() => {
                            setSelectedButton("Withdrawl");
                          }}
                          className={`hover:text-white ${selectedButton === "Withdrawl" ? " text-white border-b-2 border-white" : " text-zinc-300 border-b-2 border-transparent"}`}
                        >
                          Withdrawl
                        </button>
                        <button
                          onClick={() => {
                            setSelectedButton("Winnings");
                          }}
                          className={`hover:text-white ${selectedButton === "Winnings" ? " text-white border-b-2 border-white" : " text-zinc-300 border-b-2 border-transparent"}`}
                        >
                          Winnings
                        </button>
                        <button
                          onClick={() => {
                            setSelectedButton("Purchases");
                          }}
                          className={`hover:text-white ${selectedButton === "Purchases" ? " text-white border-b-2 border-white" : " text-zinc-300 border-b-2 border-transparent"}`}
                        >
                          Purchases
                        </button>
                      </div>
                    </div>
                    <div className="w-full flex justify-center items-center h-full mt-8 text-white">Wallet transaction is not live yet</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="fixed z-20 bottom-0 w-[100vw] mt-8 h-[60px] bg-gradient-to-b from-slate-900 to-black flex items-center">
            <button onClick={() => navigate(`/game/my-pools/view/Upcoming Pools`)} className="h-full w-1/3 pl-3  text-white text-lg flex justify-center items-center font-semibold">
              Upcoming
            </button>
            <button onClick={() => navigate(`/game/my-pools/view/Live Pools`)} className="h-full w-1/3 text-white text-lg flex justify-center items-center font-semibold">
              Live
            </button>
            <button onClick={() => navigate(`/game/my-pools/view/Completed Pools`)} className="h-full w-1/3 text-white text-lg flex justify-center items-center font-semibold">
              Completed
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Wallet;
