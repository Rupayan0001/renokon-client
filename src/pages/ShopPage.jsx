import React, { useEffect, useState, useRef } from "react";
import Topbar from "../components/layout/Topbar";
import "./../styles/HomePage.css";
import WritePost from "../components/layout/WritePost";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState.js";
import postTimeLogic from "../lib/Post_Time_Logic.js";
import PostBox from "../components/layout/PostBox";
import Post from "../components/layout/Post";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import defaultProfilePic from "../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import post_uploaded from "../../src/assets/notification_sound/post_uploaded.mp3";
import { faXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faWhatsapp, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import CommentBox from "../components/layout/commentBox.jsx";
import Photos from "../components/layout/Photos.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import mongoose from "mongoose";
import delete_notification from "../assets/notification_sound/delete_notification.wav";
import SearchBox from "../components/layout/SearchBox.jsx";
import ReportBox from "../components/layout/ReportBox.jsx";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown.jsx";
import Logout from "../components/layout/Logout.jsx";
import BlockList from "../components/layout/BlockList.jsx";
import ShareModal from "../components/layout/ShareModal.jsx";
import Leftbar from "../components/layout/LeftBar.jsx";
import Confirmation from "../components/layout/Confirmation.jsx";
import HideUser from "../components/layout/HideUser.jsx";
import FriendsList from "../components/layout/FriendsList.jsx";
import Notify from "../components/layout/Notify.jsx";
import PostSkeleton from "../components/layout/PostSkeleton.jsx";
import VideoPlayer from "../components/layout/VideoPlayer.jsx";
import Carousel from "../components/layout/Carousel.jsx";
import Notification from "../components/layout/Notification.jsx";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const id = JSON.parse(localStorage.getItem("user"));
  const postBoxRef = useRef();
  const navigate = useNavigate();
  const { postId } = useParams();
  const commentDetails = globalState((state) => state.commentDetails);
  const shareOptionsRef = useRef();
  const profilePic = globalState((state) => state.profilePic);
  const selectedTab = globalState((state) => state.selected);
  const shareOptions = globalState((state) => state.shareOptions);
  const setShareOptions = globalState((state) => state.setShareOptions);
  const confirmDelete = globalState((state) => state.confirmDelete);
  const setConfirmDelete = globalState((state) => state.setConfirmDelete);
  const deletePostObj = globalState((state) => state.deletePostObj);
  const setDeletePostObj = globalState((state) => state.setDeletePostObj);
  const setHideAllPostUser = globalState((state) => state.setHideAllPostUser);
  const hideAllPostUser = globalState((state) => state.hideAllPostUser);
  const showFriends = globalState((state) => state.showFriends);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const setSelected = globalState((state) => state.setSelected);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const changeWidth = globalState((state) => state.changeWidth);
  const setChangeWidth = globalState((state) => state.setChangeWidth);
  const expandImageForPost = globalState((state) => state.expandImageForPost);
  const setExpandImageForPost = globalState((state) => state.setExpandImageForPost);
  // const [showLoading, setShowLoading] = useState(false);
  const [numOfComment, setNumOfComment] = useState("");

  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  // const [homePagePost, setHomePagePost] = useState([]);
  const openPost = globalState((state) => state.openPost);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setPostDetailsObj = globalState((state) => state.setPostDetailsObj);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const setTotalUnreadMessages = globalState((state) => state.setTotalUnreadMessages);
  const totalUnreadMessages = globalState((state) => state.totalUnreadMessages);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const pageName = globalState((state) => state.pageName);
  const setPageName = globalState((state) => state.setPageName);
  const setOpenHideUserList = globalState((state) => state.setOpenHideUserList);
  const openHideUserList = globalState((state) => state.openHideUserList);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const setFriendRequests = globalState((state) => state.setFriendRequests);
  const setFriendsList = globalState((state) => state.setFriendsList);
  const increaseTotalUnreadMessages = globalState((state) => state.increaseTotalUnreadMessages);
  const report = globalState((state) => state.report);
  const setReport = globalState((state) => state.setReport);
  const blockedUserPosts = globalState((state) => state.blockedUserPosts);
  const setBlockedUserPosts = globalState((state) => state.setBlockedUserPosts);
  const setOnlineFriends = globalState((state) => state.setOnlineFriends);
  const likedData = globalState((state) => state.likedData);
  const setLikedData = globalState((state) => state.setLikedData);
  const setOpenPoll = globalState((state) => state.setOpenPoll);
  const logOut = globalState((state) => state.logOut);
  const openBlockList = globalState((state) => state.openBlockList);
  const closeModal = globalState((state) => state.closeModal);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const setOpenBlockList = globalState((state) => state.setOpenBlockList);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const setProfileBlock = globalState((state) => state.setProfileBlock);
  const profileBlock = globalState((state) => state.profileBlock);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const setLogOut = globalState((state) => state.setLogOut);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  const setIsLoggedOut = globalState((state) => state.setIsLoggedOut);
  // const [likedData, setLikedData] = useState([]);
  // const postBoxRef = useRef();

  const postScroll = useRef();
  const confirmDeleteRef = useRef();
  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postsArrayRef = useRef();
  const reportRef = useRef();
  const blockListsRef = useRef();
  const sharedPostRef = useRef();
  const hideUserRef = useRef();
  const friendListsRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const expandImageForPostRef = useRef();

  const response = async () => {
    let result = null;
    try {
      setLoading(true);
      result = await axiosInstance.get(`/user/getLoggedInuser`);
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
    setPageName("Shop");
    setSelected("Shop");
    if (!loggedInUser || !user) {
      response();
    } else {
      setLoading(false);
    }
    return () => {
      setPageName("");
      setHomePagePost([]);
      setNotifyClicked(null);
      setOpenPost(false);
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
      if (data.type === "online_friends") {
        setOnlineFriends(data.payload.onlineFriends);
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
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
    };
  }, []);

  useEffect(() => {
    let scrollTimeOut = false;
    if (!loadingPosts && postScroll.current) {
      postScroll.current.onscroll = function handleScroll() {
        if (scrollTimeOut) return;

        scrollTimeOut = setTimeout(() => {
          if (window.innerHeight + postScroll.current.scrollTop >= postScroll.current.scrollHeight * 0.7) {
            if (hasMore) {
              setPage((prev) => prev + 1);
            }
          }
          scrollTimeOut = false;
        }, 300);
      };
    }
    return () => {
      clearTimeout(scrollTimeOut);
    };
  }, [loadingPosts]);

  // click outside handler
  useEffect(() => {
    function handleClickOutside(e) {
      if (postBoxRef.current && !postBoxRef.current.contains(e.target)) {
        setOpenPost(false);
        setPostDetailsObj(null);
        setOpenPoll(null);
      }
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(e.target)) {
        setShareOptions(false);
      }
      if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(e.target)) {
        setConfirmDelete(false);
      }
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setReport(null);
      }
      if (blockListsRef.current && !blockListsRef.current.contains(e.target)) {
        setOpenBlockList(false);
      }
      if (leftBarSearchRef.current && !leftBarSearchRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
      if (hideUserRef.current && !hideUserRef.current.contains(e.target)) {
        setOpenHideUserList(false);
      }
      if (friendListsRef.current && !friendListsRef.current.contains(e.target)) {
        setShowFriends(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      setOpenSearch(false);
      setReport(null);
      setOpenBlockList(false);
      document.removeEventListener("mousedown", handleClickOutside);
      setNotify(null);
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
    let newArr;
    if (blockedUserPosts && blockedUserPosts.length > 0) {
      blockedUserPosts.forEach((e) => {
        newArr = homePagePost.filter((post, ind) => post.userId !== e);
      });
      setHomePagePost(newArr);
    }
  }, [blockedUserPosts]);

  useEffect(() => {
    if (closeModal) {
      setOpenBlockList(null);
      setOpenHideUserList(null);
      setCloseModal(null);
      setShareOptions(null);
      setShowFriends(null);
    }
  }, [closeModal]);

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
        setIsLoggedOut(true);
        setLogOut(null);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      setLogOut(null);
      setNotify("Failed to logout, please try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  if (loading || !loggedInUser || !user) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-r from-slate-900 to-black">
        <p className="spinButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <>
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      <AnimatePresence>
        {changeWidth && (
          <motion.dialog
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black"
          >
            <VideoPlayer maxHeight="100vh" playing={changeWidth.videoPlaying} currentTimeVideo={changeWidth.currentTime} e={changeWidth.e} />
          </motion.dialog>
        )}
      </AnimatePresence>
      {showFriends === "Friends" && <FriendsList width={windowWidth} ref={friendListsRef} currentUserId={loggedInUser._id} />}
      {report && <ReportBox pageName="Home" width={windowWidth} ref={reportRef} />}
      {openHideUserList && <HideUser ref={hideUserRef} width={windowWidth} currentUserId={loggedInUser._id} />}
      {openBlockList && <BlockList ref={blockListsRef} width={windowWidth} currentUserId={loggedInUser._id} />}
      {logOut && <Logout width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />
      {/* ${windowWidth > 550 ? "bg-zinc-100 bg-opacity-60" : "bg-zinc-300"}  */}
      <div className={`parent inter flex flex-col w-full bg-gradient-to-r from-slate-900 to-black `}>
        {notify && windowWidth > 450 && (
          <div className="absolute w-[100%] bottom-20 flex justify-center">
            <Notify page="Message" reference={notifyTimer} width={windowWidth} notify={notify} />
          </div>
        )}
        {notify && windowWidth <= 450 && (
          <div className="absolute w-[100%] bottom-10 flex justify-center">
            <Notify page="Message" reference={notifyTimer} width={windowWidth} notify={notify} />
          </div>
        )}
        <div className="">
          <Topbar page="Messages" />
          <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
        </div>
        <div className="mainsection relative">
          <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Shop"} ref={profileDropdownRef} />}</AnimatePresence>
          {/* {windowWidth >= 1024 && <Leftbar width={windowWidth} />} */}
          <div
            ref={postScroll}
            className={`postContents overflow-hidden ${windowWidth > 768 ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300" : "scrollbar-none"}`}
          >
            <div className="mainsection relative">
              <div
                className={`fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full flex justify-center text-white ${
                  windowWidth > 550 ? "text-8xl" : "text-7xl"
                } font-bold`}
              >
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
