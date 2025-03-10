import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumbsUp, faShareFromSquare as regularShare, faHeart as regularHeart, faSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faRetweet as regularRetweet,
  faEllipsis,
  faShare,
  faHeart,
  faCircleRight,
  faCircleArrowRight,
  faXmark,
  faPen,
  faTrashCan,
  faBookmark,
  faCircleMinus,
  faUserSlash,
  faBan,
  faFlag,
  faUserPlus,
  faBellSlash,
  faThumbTack,
  faUserGroup,
  faEarthAmericas,
  faUsers,
  faUser,
  faLock,
  faCirclePlus,
  faComment as regularComment,
  faEye,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../lib/axios.js";
import globalState from "../../lib/globalState.js";
import Carousel from "./Carousel.jsx";
import ImageSwiper from "./ImageSwiper.jsx";
import { Link } from "react-router-dom";
import HoverBasicDetails from "./HoverBasicDetails.jsx";
import { AnimatePresence, motion } from "framer-motion";
import VideoPlayer from "./VideoPlayer.jsx";
import PhotosCollage from "./PhotosCollage.jsx";

export default function Post({
  userId,
  page,
  width,
  id,
  shared,
  currentUserId,
  logoImg,
  audience,
  username,
  savedPosts = false,
  subtitle,
  time,
  textContent,
  postImage = [],
  postVideo = [],
  comments,
  shares,
  views,
  type = "post",
  question = "",
  option1 = "",
  option2 = "",
  totalVotes = 0,
  votesOnOption1 = 0,
  votesOnOption2 = 0,
  lastIndex = 0,
  postIndex,
  voters = [],
}) {
  const [likesCount, setLikesCount] = useState(0);
  const [likeStatus, setLikeStatus] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [showIdDetails, setShowIdDetails] = useState(null);
  const setShareOptions = globalState((state) => state.setShareOptions);
  const setCommentDetails = globalState((state) => state.setCommentDetails);
  const setConfirmDelete = globalState((state) => state.setConfirmDelete);
  const setDeletePostObj = globalState((state) => state.setDeletePostObj);
  const openPost = globalState((state) => state.openPost);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const postDetailsObj = globalState((state) => state.postDetailsObj);
  const setPostDetailsObj = globalState((state) => state.setPostDetailsObj);
  const setProfileBlock = globalState((state) => state.setProfileBlock);
  const profileBlock = globalState((state) => state.profileBlock);
  const setHideAllPostUser = globalState((state) => state.setHideAllPostUser);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const storeId = globalState((state) => state.storeId);
  const setStoreId = globalState((state) => state.setStoreId);
  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  const post = globalState((state) => state.post);
  const setNewPost = globalState((state) => state.setNewPost);
  const setEnterDialogHover = globalState((state) => state.setEnterDialogHover);
  const setReport = globalState((state) => state.setReport);
  const setBlockedUserPosts = globalState((state) => state.setBlockedUserPosts);
  const blockedUserPosts = globalState((state) => state.blockedUserPosts);
  const setBlock = globalState((state) => state.setBlock);
  const savePostList = globalState((state) => state.savePostList);
  const setSavePostList = globalState((state) => state.setSavePostList);
  const likedData = globalState((state) => state.likedData);
  const setLikedData = globalState((state) => state.setLikedData);
  const setExpandImageForPost = globalState((state) => state.setExpandImageForPost);
  const socketHolder = globalState((state) => state.socketHolder);
  const [distanceFromBottom, setDistanceFromBottom] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteCount, setVoteCount] = useState(totalVotes);
  const [votesOnOption1Count, setVotesOnOption1Count] = useState(votesOnOption1);
  const [votesOnOption2Count, setVotesOnOption2Count] = useState(votesOnOption2);
  // const [alreadyselected, setAlreadySelected] = useState(false);

  const [openEditor, setOpenEditor] = useState(null);
  const postEditRef = useRef();
  const postEditDotsRef = useRef();
  const entirePostRef = useRef();
  const notifyTimer = useRef();
  const dialogHoverTimer = useRef();

  useEffect(() => {
    function clickOutside(e) {
      if (postEditRef.current && !postEditRef.current.contains(e.target) && !postEditDotsRef.current.contains(e.target)) {
        setOpenEditor(null);
      }
    }
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
    };
  }, []);
  useEffect(() => {
    if (likedData.length > 0) {
      const info = likedData.find((e) => e.postId.toString() === id);
      if (info) {
        setLikeStatus(info.userLiked);
        setLikesCount(info.totalLikes);
      } else {
        setLikeStatus(false);
        setLikesCount(0);
      }
    }
  }, [homePagePost, likedData]);
  useEffect(() => {
    if (voters?.length > 0) {
      setVotesOnOption1Count(votesOnOption1);
      setVotesOnOption2Count(votesOnOption2);
      setVoteCount(totalVotes);
      const found = voters.find((e) => e.userId.toString() === loggedInUser._id);
      if (found) {
        setSelectedOption(found.vote);
      } else {
        setSelectedOption(null);
      }
    } else if (voters.length === 0) {
      setSelectedOption(null);
      setVotesOnOption1Count(0);
      setVotesOnOption2Count(0);
      setVoteCount(0);
    }
  }, [voters]);
  async function updateLikes() {
    const found = likedData.findIndex((e) => e.postId === id);
    if (found >= 0) {
      likedData[found].userLiked = likeStatus ? false : true;
      likedData[found].totalLikes = likeStatus ? likesCount - 1 : likesCount + 1;
      setLikedData([...likedData]);
    } else if (found < 0) {
      setLikedData([...likedData, { postId: id, totalLikes: likeStatus ? likesCount - 1 : likesCount + 1, userLiked: likeStatus ? false : true }]);
    }

    try {
      const response = await axiosInstance.put(`/post/${id}/likes`);
      if (response.data.message === "Liked") {
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "post_like",
              payload: {
                postId: id,
                postCreatorId: userId,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                senderProfilePic: loggedInUser.profilePic,
              },
            })
          );
        }
      }
    } catch (error) {}
  }
  function editPosttHandler(id) {
    const media = postImage.length > 0 ? "Image" : postVideo.length > 0 ? "Video" : "Image";
    setOpenPost(media);
    setPostDetailsObj({
      postId: id,
      userId,
      currentUserId,
      textContent,
      postImage,
      postVideo,
      audience,
    });
    setOpenEditor(null);
  }

  async function deletePostHandler(id) {
    setConfirmDelete(true);
    setOpenEditor(null);
    setDeletePostObj({
      postId: id,
      userId: userId,
      currentUserId,
      ref: entirePostRef,
    });
  }
  async function pinPostHandler(id) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`post/${id}/${userId}/pinPost`);
      setNotify("You post is pinned successfully");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 3 * 1000);
      setOpenEditor(null);
    } catch (error) {
      setNotify("Something went wrong, Please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 3 * 1000);
      setOpenEditor(null);
    }
  }
  function handleOpenEditor(id) {
    const oldId = openEditor === id ? null : id;
    setOpenEditor(oldId);
  }
  function turnOffNotificationtHandler(id) {
    setNotify("Notification turned off for this post");
    setTimeout(() => {
      setNotify(null);
    }, 5 * 1000);
    setOpenEditor(null);
  }

  //    function turnOffDetails(){
  //     setTimeout(()=>{
  //         setShowIdDetails(null);
  //     }, 400)
  //    }

  function idDetails(id) {
    if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
    setShowIdDetails(id);
    setStoreId(id);
  }

  async function saveThisPost(id) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.post(`/post/${id}/savePost`);
      setOpenEditor(null);
      if (response.data.message) {
        setNotify(response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 3 * 1000);
      }
    } catch (error) {
      setOpenEditor(null);
      setNotify("Failed to save post, Please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 3 * 1000);
    }
  }
  async function interestedPost(id) {
    const firstName = loggedInUser.name.split(" ")[0];
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setOpenEditor(null);
    try {
      const response = await axiosInstance.post(`/post/${id}/interestedPost`);
      if (response.data.message === "Interested") {
        setNotify(`You will see more posts like this, ${firstName} `);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      if (error.response.data.message === "Interested") {
        setNotify(`You will see more posts like this, ${firstName}`);
      } else {
        setNotify("Something went wrong, Please try again later");
      }
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  async function notInterestedPost(id) {
    const firstName = loggedInUser.name.split(" ")[0];
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setOpenEditor(null);
    try {
      const response = await axiosInstance.post(`/post/${id}/notInterestedPost`);
      if (response.data.message === "Not Interested") {
        setNotify(`You will see less posts like this, ${firstName} `);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      if (error.response.data.message === "Not Interested") {
        setNotify(`You will see less posts like this, ${firstName}`);
      } else {
        setNotify("Something went wrong, Please try again later");
      }
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } finally {
      const deleteThisPost = homePagePost.filter((e) => e._id !== id);
      setHomePagePost(deleteThisPost);
    }
  }

  function setReportAndClose(id) {
    setReport(id);
    setOpenEditor(null);
  }

  async function unSaveThisPost(id) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setOpenEditor(null);
    try {
      const response = await axiosInstance.put(`/post/${id}/unSavePost`);
      if (response.data.message === "Post unsaved") {
        const deleteThisPost = savePostList.filter((e) => e.postId._id !== id);
        setSavePostList(deleteThisPost);
        setNotify(`You have unsaved this post`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setNotify(`Failed to unsave post, please try again later.`);
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  // useEffect(() => {
  //   const calculateDistance = () => {
  //     if (openEditor !== id) return;
  //     if (postEditDotsRef.current) {
  //       const rect = postEditDotsRef.current.getBoundingClientRect();
  //       const viewportHeight = window.innerHeight;
  //       const distance = viewportHeight - rect.top;
  //       setDistanceFromBottom(distance - postEditRef.current.offsetHeight);
  //     }
  //   };

  //   calculateDistance();

  //   window.addEventListener("resize", calculateDistance);

  //   return () => {
  //     window.removeEventListener("resize", calculateDistance);
  //   };
  // }, [openEditor, id]);

  function doNullId() {
    if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
    dialogHoverTimer.current = setTimeout(() => {
      setShowIdDetails(null);
    }, 400);
    setEnterDialogHover(dialogHoverTimer);
  }

  async function handleOptionSelect(option) {
    setSelectedOption((prev) => {
      if (prev === option) {
        return null;
      } else {
        return option;
      }
    });
    try {
      const response = await axiosInstance.put(`/post/${id}/${loggedInUser._id}/voteOnPoll`, { option });
      if (response.data.success) {
        setVoteCount(response.data.poll.totalVotes);
        setVotesOnOption1Count(response.data.poll.votesOnOption1);
        setVotesOnOption2Count(response.data.poll.votesOnOption2);
      }
    } catch (error) {}
  }

  const editor = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, height: 0 }}
      animate={{ opacity: 1, scale: 1, height: "auto" }}
      exit={{ opacity: 0, scale: 0.8, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
      ref={postEditRef}
      className={`${
        width > 425 ? "absolute top-[45px] right-[0px] rounded-xl " : "fixed bottom-0 left-0 rounded-t-3xl pt-4"
      } editPost postEditShadow  bg-gradient-to-r from-slate-900 to-black  w-max`}
    >
      {/* ${width < 400 ? "right-[-20px]" : "right-[0px]"}  */}
      {/* border-[2px] border-white  */}
      {currentUserId === userId && (
        <>
          {type !== "poll" && (
            <div
              onClick={() => editPosttHandler(id)}
              className={`text-white hover:bg-slate-800 hover:bg-opacity-90 px-4 pb-[1px]  flex items-center ${
                width > 425 ? "pt-1 w-[300px] h-[45px]" : "w-[100vw] h-[50px] pt-0"
              } transition duration-100 cursor-pointer`}
            >
              <p className="h-[40px] w-[32px] flex items-center ">
                <FontAwesomeIcon className="h-[17px] w-[17px] text-white" icon={faPen} />
              </p>{" "}
              <p className="text-[14px] font-semibold">Edit post</p>
            </div>
          )}
          <div
            onClick={() => deletePostHandler(id)}
            className={`text-white hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center ${
              width > 425 ? "pt-1 w-[300px] h-[45px]" : "w-[100vw] h-[50px] pt-0"
            } transition duration-100 cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex items-center">
              <FontAwesomeIcon className="h-[17px] w-[17px] mr-4 text-white" icon={faTrashCan} />
            </p>{" "}
            <p className="text-[14px] font-semibold">{type !== "poll" ? "Delete your post" : "Delete your poll"}</p>
          </div>
          {type !== "poll" && (
            <div
              onClick={() => editPosttHandler(id)}
              className={`text-white hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center ${
                width > 425 ? "pt-1 w-[300px] h-[45px]" : "w-[100vw] h-[50px] pt-0"
              } transition duration-100 cursor-pointer`}
            >
              <p className="h-[40px] w-[32px] flex items-center ">
                <FontAwesomeIcon className="text-md text-white" icon={faUserGroup} />
              </p>{" "}
              <p className="text-[14px] font-semibold"> Change audience</p>
            </div>
          )}
          <div
            onClick={() => turnOffNotificationtHandler(id)}
            className={`text-white hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center py-[0px] mb-1 mt-0 ${
              width > 425 ? "pt-1 w-[300px] h-[45px]" : "w-[100vw] h-[50px] pt-0"
            } transition duration-100  cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex items-center ">
              <FontAwesomeIcon className="text-md text-white" icon={faBellSlash} />
            </p>{" "}
            <p className="text-[14px] font-semibold">Turn off notification</p>
          </div>
        </>
      )}
      {currentUserId !== userId && (
        <>
          {type !== "poll" && !savedPosts && (
            <div
              onClick={() => saveThisPost(id)}
              className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center ${
                width > 425 ? "pt-1 w-[300px] h-[40px]" : "w-[100vw] h-[45px] pt-0"
              } transition duration-100 rounded-md cursor-pointer`}
            >
              <p className="h-[40px] w-[32px] flex items-center">
                <FontAwesomeIcon className="h-[20px] w-[20px] mr-4 text-white" icon={faBookmark} />
              </p>
              <p className="text-[14px] font-semibold">Save this post</p>
            </div>
          )}
          {type !== "poll" && savedPosts && (
            <div
              onClick={() => unSaveThisPost(id)}
              className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center mt-0 ${
                width > 425 ? "pt-1 w-[300px] h-[40px]" : "w-[100vw] h-[45px] pt-0"
              } transition duration-100 rounded-md cursor-pointer`}
            >
              <p className="h-[40px] w-[32px] flex items-center">
                <FontAwesomeIcon className="h-[20px] w-[20px] mr-4 text-white" icon={faBookmark} />
              </p>
              <p className="text-[14px] font-semibold">Unsave this post</p>
            </div>
          )}
          <div className={`${type !== "poll" ? "" : ""} my-1 border-zinc-300`}></div>
          <div
            onClick={() => setReportAndClose(id)}
            className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4  flex items-center mt-1 ${
              width > 425 ? "pt-1 w-[300px] h-[40px]" : "w-[100vw] h-[45px] pt-0"
            } transition duration-100 rounded-md cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex justify-center items-center">
              <FontAwesomeIcon className="h-[20px] w-[20px] ml-1 mr-4 text-white" icon={faFlag} />
            </p>
            <p className="text-[14px] font-semibold">{type !== "poll" ? "Report this post" : "Report this poll"}</p>
          </div>
          <div
            onClick={() => {
              setHideAllPostUser({
                userId,
                username: username.split(" ")[0],
              });
              setOpenEditor(null);
            }}
            className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center mt-1 ${
              width > 425 ? "pt-1 w-[300px] h-[40px]" : "w-[100vw] h-[45px] pt-0"
            } transition duration-100 rounded-md cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex justify-center items-center">
              <FontAwesomeIcon className="h-[24px] w-[24px] ml-[1px] mr-4 text-white" icon={faUserSlash} />
            </p>
            <p className="text-[14px] font-semibold"> Hide all posts from {username.split(" ")[0]}</p>
          </div>
          <div className=" my-1 border-zinc-300"></div>
          <div
            onClick={() => interestedPost(id)}
            className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4 pt-0 flex items-center mt-1 ${
              width > 425 ? "pt-0 w-[300px] h-[50px]" : "w-[100vw] h-[60px] pt-0"
            } transition duration-100 rounded-md cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex items-center">
              <FontAwesomeIcon className="h-[20px] w-[20px] mr-4 text-white" icon={faCirclePlus} />
            </p>
            <div className="py-1">
              <p className="text-[14px] font-semibold">Interested</p>
              <p className="text-zinc-200 text-[14px] ">You will see more posts like this</p>
            </div>
          </div>
          <div
            onClick={() => notInterestedPost(id)}
            className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center mt-1 ${
              width > 425 ? "pt-0 w-[300px] h-50px]" : "w-[100vw] h-[60px] pt-0"
            } transition duration-100 rounded-md cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex items-center">
              <FontAwesomeIcon className="h-[20px] w-[20px] mr-4 text-white" icon={faCircleMinus} />
            </p>
            <div className="py-1">
              <p className="text-[14px] font-semibold">Not interested</p>
              <p className="text-zinc-200 text-[14px]">You will see less posts like this</p>
            </div>
          </div>
          {/* <div className=" my-1 border-zinc-300"></div> */}
          <div
            onClick={() => {
              setProfileBlock({
                userId,
                username: username.split(" ")[0],
              });
              setOpenEditor(null);
            }}
            className={`text-white  hover:bg-slate-800 hover:bg-opacity-90 px-4 flex items-center w-[300px] ${
              width > 425 ? "rounded-md " : "pb-4"
            } transition duration-100  cursor-pointer`}
          >
            <p className="h-[40px] w-[32px] flex items-center ">
              <FontAwesomeIcon className="h-[24px] w-[24px] mr-4 text-white" icon={faBan} />
            </p>
            <div className="py-1 pb-2 mt-1">
              <p className="text-white font-semibold text-[14px]">Block {username.split(" ")[0]}'s profile</p>
              <p className="text-zinc-200 text-[14px] ">You won't able to see or contact</p>
            </div>
          </div>{" "}
        </>
      )}
    </motion.div>
  );

  return (
    <div className="inter" ref={entirePostRef}>
      <div
        className={`mainPost bg-gradient-to-r from-slate-900 to-black shadowForPost ${shared && "max-h-[90vh] overflow-y-scroll scrollbar-thin"} ${
          width >= 1280 && "w-[550px] mt-4 rounded-lg"
        } ${width >= 550 && width < 1280 && " w-[520px] mt-4 rounded-lg "} ${width < 550 && ` w-[100vw] mt-2`}  ${
          width < 550 && lastIndex !== postIndex ? "border-b-4 border-slate-700" : ""
        } `}
      >
        <div className="box">
          <div className={`top mt-1 flex ${width > 550 ? "px-4 pt-4" : "px-2 pt-4"} `}>
            <div className="image relative">
              <Link to={`/userProfile/${userId}`}>
                <img
                  src={logoImg}
                  onMouseEnter={() => idDetails(userId)}
                  onMouseLeave={() => {
                    doNullId();
                  }}
                  className={`${width > 550 ? "w-[55px] h-[55px]" : "w-[40px] h-[40px]"} mt-[-5px] object-cover cursor-pointer rounded-full`}
                  alt=""
                />
              </Link>
              <AnimatePresence>{width > 550 && showIdDetails === userId && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}</AnimatePresence>
            </div>
            <div className={`details  ml-2 ${width > 550 ? " mt-[-4px]" : " mt-[-6px]"}`}>
              <Link to={`/userProfile/${userId}`}>
                <div
                  className={`name text-white ${width < 400 && "text-[14px]"} font-semibold cursor-pointer transition duration-300 hover:underline`}
                  onMouseEnter={() => idDetails(userId)}
                  onMouseLeave={() => doNullId()}
                >
                  {width < 450 && username.length > 21 ? username.slice(0, 21) + ".." : username}
                </div>
              </Link>
              <div className="subtitle text-sm  text-zinc-100">{subtitle}</div>
              <div className="time text-[13px] text-semibold text-zinc-100">
                {time}
                {audience === "Everyone" && <FontAwesomeIcon className="ml-2 text-[12px]" icon={faEarthAmericas} />}
                {audience === "Friends" && <FontAwesomeIcon className="ml-2 text-[12px]" icon={faUsers} />}
                {audience === "Only me" && <FontAwesomeIcon className="ml-2 text-[12px]" icon={faLock} />}
              </div>
            </div>

            <div className="postEdit ">
              <FontAwesomeIcon
                ref={postEditDotsRef}
                onClick={() => handleOpenEditor(id)}
                className={` relative h-[22px] w-[22px] cursor-pointer transition duration-200 p-2 rounded-full hover:bg-slate-900 hover:text-zinc-300 text-zinc-200 ${
                  openEditor === id ? "bg-slate-900 text-zinc-300" : ""
                }`}
                icon={openEditor === id ? faXmark : faEllipsis}
              />
              <AnimatePresence>{openEditor === id && width > 425 && editor}</AnimatePresence>
              <AnimatePresence>
                {openEditor === id && width <= 425 && (
                  <dialog className={`fixed z-50 h-[100%] w-[100%] flex justify-center items-center inset-0   bg-black bg-opacity-60`}>{editor}</dialog>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div
            className={`texts text-white ${width > 550 ? "px-4" : "px-2"} ${type === "poll" && "mt-5 mb-2"} ${
              type === "post" && (textContent.length >= 1 ? "mt-5 mb-5" : "mt-2 mb-2 ml-2")
            } `}
          >
            {type === "post" && textContent.length > 200 && showFullText && (
              <p onClick={() => setShowFullText(!showFullText)} className="postTextSection cursor-pointer">
                {type === "post" && textContent}
              </p>
            )}
            {type === "post" && textContent.length > 200 && !showFullText && (
              <p onClick={() => setShowFullText(!showFullText)} className="cursor-pointer postTextSection">
                {textContent.slice(0, 200)}... Read more
              </p>
            )}
            {type === "post" && textContent.length <= 200 && <p className={`postTextSection montserrat ${!shared ? "max-h-[550px]" : "max-h-[50vh]"}`}>{textContent}</p>}

            {type === "poll" && (
              <div className="flex flex-col">
                <p className="postTextSection cursor-pointer">{type === "poll" && question + " ?"}</p>
                <div
                  onClick={() => handleOptionSelect("option1")}
                  className={`h-[50px] flex items-center cursor-pointer text-xl px-4 mt-4 mb-4 w-full rounded-xl ${
                    selectedOption === "option1" ? "bg-gradient-to-b from-slate-900 to-black text-white" : "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={selectedOption === "option1" ? faSquareCheck : faSquare} className="mr-2 text-xl" />
                  <div className="flex w-full items-center justify-between">
                    <p>{option1}</p>
                    {selectedOption === "option1" && <p className="text-sm">Votes: {votesOnOption1Count}</p>}
                  </div>
                </div>
                <div
                  onClick={() => handleOptionSelect("option2")}
                  className={`h-[50px] text-xl flex cursor-pointer items-center px-4 w-full rounded-xl ${
                    selectedOption === "option2" ? "bg-gradient-to-b from-slate-900 to-black text-white" : "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                  } `}
                >
                  {" "}
                  <FontAwesomeIcon icon={selectedOption === "option2" ? faSquareCheck : faSquare} className={`mr-2 text-xl  `} />
                  <div className="flex w-full items-center justify-between">
                    <p>{option2}</p>
                    {selectedOption === "option2" && <p className="text-sm">Votes: {votesOnOption2Count}</p>}
                  </div>
                </div>
                {type === "poll" && <p className="my-2">Votes: {voteCount}</p>}
              </div>
            )}
          </div>

          <div className={`media ${width > 550 ? "px-4" : "px-0"} w-full flex justify-center items-center`}>
            {postImage && postImage.length > 0 && (
              <div className={`flex w-full ${!shared ? "max-h-[550px]" : "max-h-[50vh]"}`}>
                <PhotosCollage images={postImage} width={width} />
                {/* <Carousel images={postImage} /> */}
              </div>
            )}
            {postVideo && postVideo.length > 0 && <VideoPlayer e={postVideo[0]} />}
          </div>

          <div className={`reaction ${width > 550 ? "px-4 pb-4" : "px-2 pb-4"} flex justify-between mt-3  border-zinc-300 pt-3 ${width < 450 ? "px-0" : "px-0"}`}>
            <p
              className={`flex group justify-center items-center cursor-pointer transition duration-200 ${
                width > 600 && "hover:bg-slate-700 hover:bg-opacity-40"
              }   px-2 py-1 rounded-md`}
              onClick={updateLikes}
            >
              <FontAwesomeIcon
                className={`likes ${width < 450 ? "ml-0 text-xl" : "ml-4 text-2xl"} ${likeStatus ? "text-[#FF007F]" : "text-zinc-200"} `}
                icon={likeStatus ? faHeart : faHeart}
              />
              <span className={`ml-4 w-[25px] text-sm text-zinc-200`}>{likesCount > 0 ? likesCount : ""}</span>
            </p>
            <p
              className={`flex group justify-center items-center hover:text-[#002395] ${
                width > 600 && "hover:bg-slate-700 hover:bg-opacity-40"
              } cursor-pointer transition duration-200  px-2 py-1 rounded-lg`}
              onClick={() =>
                setCommentDetails({
                  loggedInUserName: loggedInUser.name,
                  postId: id,
                  loggedInUserProfilePic: loggedInUser.profilePic,
                  postCreatorName: username,
                  loggedInUserId: loggedInUser._id,
                  postCreatorId: userId,
                })
              }
            >
              <FontAwesomeIcon className={`comments  ${width < 450 ? " text-xl ml-0" : " text-2xl ml-6"}  text-zinc-200 group-hover:text-zinc-200`} icon={regularComment} />

              <span className={` ml-4  text-sm w-[25px] text-zinc-200`}>{comments > 0 ? comments : ""}</span>
            </p>
            <p
              className={`flex group items-center hover:text-zinc-200 ${width > 600 && "hover:bg-slate-700 hover:bg-opacity-40"} px-3 py-0 rounded-md`}
              onClick={() => setShareOptions(id)}
            >
              <FontAwesomeIcon
                className={`shares  ${width < 450 ? "ml-0 text-xl p-0" : " text-2xl p-3"} text-zinc-200 cursor-pointer transition duration-200 group-hover:text-zinc-200  `}
                icon={faShare}
              />
              <span className="ml-1 text-sm text-zinc-200">{shares > 0 ? shares : ""}</span>
            </p>
            {width > 450 && (
              <p className={`flex group items-center hover:text-zinc-200 ${width > 600 && "hover:bg-slate-700 hover:bg-opacity-40"} px-3 py-0 rounded-md`}>
                <FontAwesomeIcon className={`repos   text-2xl p-3 text-zinc-200 cursor-pointer transition duration-200 group-hover:text-zinc-200 `} icon={faEye} />
                <span className="ml-1 text-sm text-zinc-200">{views > 0 ? views : ""}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
