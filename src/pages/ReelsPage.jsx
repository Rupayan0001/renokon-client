import react, { forwardRef, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  faArrowUpRightDots,
  faBaseballBatBall,
  faBasketballBall,
  faBriefcase,
  faChartLine,
  faCircleCheck,
  faCircleChevronLeft,
  faCircleChevronRight,
  faClapperboard,
  faDollarSign,
  faFutbol,
  faMusic,
  faPersonRunning,
  faPhotoFilm,
  faShare,
  faTableTennisPaddleBall,
  faUpload,
  faVolleyball,
  faXmark,
  faCirclePlay,
} from "@fortawesome/free-solid-svg-icons";
import { faCirclePause, faFaceGrinSquintTears, faFaceLaughBeam, faNewspaper, faHeart, faThumbsDown, faComment, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
// import BollywoodIcon from "../assets/OIP__2_-removebg-preview.png"
// import videos from "../assets/32cd4980-5fd6-4160-997a-64b66fe5fd74.mp4";
import ShareModal from "../components/layout/ShareModal.jsx";
import CommentBox from "../components/layout/commentBox";

const ReelsPage = forwardRef(() => {
  const [reel, setReel] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [uploadVideo, setUploadVideo] = useState(null);
  const [showVideoUrl, setShowVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadText, setUploadText] = useState("Please Upload a Video");
  const [openUpload, setOpenUpload] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loadingReels, setLoadingReels] = useState(true);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [reelsList, setReelsList] = useState([]);
  const shareOptions = globalState((state) => state.shareOptions);
  const setShareOptions = globalState((state) => state.setShareOptions);
  const commentDetails = globalState((state) => state.commentDetails);
  const setCommentDetails = globalState((state) => state.setCommentDetails);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const videoRef = useRef();
  const timer = useRef();
  const shareOptionsRef = useRef();
  const shareButton = useRef();
  const commentButton = useRef();
  const uploadBox = useRef();
  const uploadButton = useRef();
  const titleRef = useRef();
  const videoInput = useRef();
  const notifyTimer = useRef();
  const uploadButtonRef = useRef();
  useEffect(() => {
    function outsideClickHandler(e) {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(e.target) && !shareButton.current.contains(e.target)) {
        setShareOptions(false);
      }
      if (uploadBox.current && !uploadBox.current.contains(e.target) && !uploadButton.current.contains(e.target) && !uploadButtonRef.current.contains(e.target)) {
        setOpenUpload(false);
      }
    }
    document.addEventListener("click", outsideClickHandler);
    return () => {
      document.removeEventListener("click", outsideClickHandler);
    };
  }, []);

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    async function getReel() {
      try {
        setLoadingReels(true);
        const response = await axiosInstance("/reel/getReels");
        setReelsList(response.data.reels);
        setLoadingReels(false);
      } catch (error) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    }
    getReel();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      const newIndex = videoIndex + 1;
      const value = newIndex === reelsList.length ? 0 : newIndex;
      setVideoIndex(value);
      setPlaying(true);
    },
    onSwipedDown: () => {
      const newIndex = videoIndex - 1;
      const value = newIndex < 0 ? reelsList.length - 1 : newIndex;
      setVideoIndex(value);
      setPlaying(true);
    },
    delta: 30, // minimum distance (in px) before a swipe is detected
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastWheelTime < 1000) return; // Throttle to 1 second
    setLastWheelTime(now);

    if (e.deltaY > 0) {
      // Scroll down: next video
      if (videoIndex < reelsList.length - 1) {
        setVideoIndex(videoIndex + 1);
        setPlaying(true);
      }
    } else if (e.deltaY < 0) {
      // Scroll up: previous video
      if (videoIndex > 0) {
        setVideoIndex(videoIndex - 1);
        setPlaying(true);
      }
    }
  };

  function togglePlayPouse() {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (playing) {
      setPlaying(false);
      videoRef.current.pause();
      setShowPlayPause(true);
      timer.current = setTimeout(() => {
        setShowPlayPause(false);
      }, 1000);
    } else {
      setPlaying(true);
      videoRef.current.play();
      setShowPlayPause(true);
      timer.current = setTimeout(() => {
        setShowPlayPause(false);
      }, 1500);
    }
  }

  function handleMedia(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadVideo(file);
      setShowVideoUrl(URL.createObjectURL(file));
      setUploadText("Upload");
      setDisabled(false);
    }
  }

  function cancelMedia() {
    setUploadVideo(null);
    setShowVideoUrl(null);
    setDisabled(true);
    setUploadText("Please upload a video");
  }

  async function uploadReel() {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (titleRef.current.value === "") {
      titleRef.current.placeholder = "Give a title";
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", titleRef.current.value);
      formData.append("video", uploadVideo);
      const response = await axiosInstance.post(`/reel/createReel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.message === "Reel uploaded successfully") {
        setUploading(false);
        setNotify("Reel uploaded successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setNotify("Something went wrong");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } finally {
      setOpenUpload(false);
    }
  }
  return (
    <div className="relative h-[100vh] w-[100vw] bg-gradient-to-r from-slate-900 to-black overflow-y-hidden ">
      <Link to="/home">
        <FontAwesomeIcon icon={faXmark} className="fixed top-2 left-1 w-[25px] h-[25px] z-50 bg-white p-2 hover:bg-zinc-300 text-zinc-800 font-bold rounded-full cursor-pointer" />
      </Link>
      {notify && (
        <div className="absolute giveShadow left-6 bottom-10 z-50 bg-zinc-900 px-5 py-3 text-white rounded-lg">
          {notify}{" "}
          <button
            className="cursor-pointer hover:bg-zinc-700 transition duration-200 border-0 px-2 py-1 ml-2 bg-zinc-800 rounded-md font-semibold text-[15px]"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      )}
      {shareOptions && <ShareModal ref={shareOptionsRef} />}
      {commentDetails && <CommentBox />}
      {openUpload && (
        <dialog className="fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black bg-opacity-60">
          <div ref={uploadBox} className="relative h-[500px] w-[370px] bg-white rounded-xl">
            <FontAwesomeIcon
              onClick={() => setOpenUpload(false)}
              icon={faXmark}
              className="absolute top-1 right-1 w-[25px] h-[25px] bg-white p-2 hover:bg-zinc-300 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer"
            />
            <div className="h-[50px] w-full border-b-2 border-zinc-300 flex justify-center items-center">
              <h1 className="text-black">Upload Shots</h1>
            </div>
            <div className="flex flex-col items-center">
              {/* <teaxtarea type="text"  placeholder="Write a caption" className="w-[300px] ml-2 bg-black outline-none h-[50px] p-2"></teaxtarea> */}
              <textarea type="text" ref={titleRef} placeholder="Write a caption" className="w-[340px] mt-2 mx-2 outline-none resize-none h-[100px] p-2"></textarea>
              <div className="relative h-[270px] w-[340px]  mt-2 rounded-xl bg-zinc-200 border-b-2 border-zinc-300 flex justify-center items-center">
                <FontAwesomeIcon
                  onClick={cancelMedia}
                  icon={faXmark}
                  className="absolute top-2 right-2 w-[25px] h-[25px] bg-zinc-300 p-2 hover:bg-zinc-400 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer"
                />
                {!showVideoUrl && (
                  <div onClick={() => videoInput.current.click()} className="flex h-full w-full justify-center cursor-pointer items-center">
                    <div className="flex flex-col justify-center items-center">
                      <input type="file" accept="video/*" className="hidden" ref={videoInput} onChange={handleMedia} />
                      <p className="text-zinc-700 text-[36px]">
                        <FontAwesomeIcon icon={faPhotoFilm} />
                      </p>
                      <p className="text-zinc-700 font-bold text-md mt-2">Upload shot video</p>
                      <p className="text-zinc-500 font-bold text-md">Max 1 min</p>
                    </div>
                  </div>
                )}
                {showVideoUrl && (
                  <div className="relative flex justify-center cursor-pointer items-center">
                    <video src={showVideoUrl} controls className="w-[170px] rounded-xl h-[250px] object-cover"></video>
                  </div>
                )}
              </div>
              {!uploading && (
                <button
                  ref={uploadButtonRef}
                  onClick={uploadReel}
                  disabled={disabled}
                  className={`h-[40px] w-[340px] mt-2 rounded-md  ${
                    disabled ? "bg-[#8127C2]" : "bg-[#6A0DAD]"
                  }  hover:bg-[#5C0D94] flex justify-center items-center text-white text-[15px] font-bold`}
                >
                  {uploadText}
                </button>
              )}
              {uploading && (
                <button className={`h-[40px] w-[340px] mt-2 rounded-md bg-[#6A0DAD] hover:bg-[#5C0D94] flex justify-center items-center text-white text-[15px] font-bold`}>
                  <p className="spinOnButton h-[25px] w-[25px]"></p>
                </button>
              )}
            </div>
          </div>
        </dialog>
      )}
      <div className="h-full w-full flex justify-center items-center">
        <div className="h-[98vh] min-h[500px] rounded-2xl">
          {!loadingReels && (
            <div className="relative flex justify-center items-center">
              {windowWidth > 600 && (
                <FontAwesomeIcon
                  onClick={() => {
                    setVideoIndex((prevIndex) => {
                      const newIndex = prevIndex - 1;
                      return newIndex < 0 ? reelsList.length - 1 : newIndex;
                    });
                    setPlaying(true);
                  }}
                  icon={faCircleChevronLeft}
                  className="text-white pr-[50px] text-5xl cursor-pointer"
                />
              )}
              <div {...swipeHandlers} onWheel={handleWheel} className="group">
                {/* {reelsList && reelsList.length > 0 && reelsList.map((reel, ind)=> {

                })} */}
                <div onClick={togglePlayPouse} style={{ aspectRatio: "9/16", height: "98vh" }} className=" group">
                  <video src={reelsList[videoIndex].videoLink} ref={videoRef} autoPlay className="w-full h-full cursor-pointer rounded-2xl object-cover" loop></video>
                  <AnimatePresence>
                    {!playing && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <FontAwesomeIcon
                          icon={faCirclePlay}
                          className="text-white text-5xl cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:text-zinc-300  "
                        />
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {windowWidth > 600 && (
                <FontAwesomeIcon
                  onClick={() => {
                    setVideoIndex(() => {
                      return (videoIndex + 1) % reelsList.length;
                    });
                    setPlaying(true);
                  }}
                  icon={faCircleChevronRight}
                  className="text-white pl-[50px] text-5xl cursor-pointer"
                />
              )}
            </div>
          )}
        </div>

        <div></div>
      </div>
    </div>
  );
});

export default ReelsPage;

// leftbar

{
  /* <div className="h-full overflow-y-scroll bg-black">
          <div className="mt-3 ml-4 mb-4 flex items-center ">
            <Link to="/home">
              <FontAwesomeIcon
                icon={faXmark}
                className=" w-[25px] h-[25px] bg-white p-2 hover:bg-zinc-300 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer"
              />
            </Link>
            <p className="text-white text-2xl font-bold ml-3">Reels</p>
          </div>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faArrowUpRightDots} className="mr-4 text-xl" /> Trending
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faClapperboard} className="mr-4 text-xl" /> Bollywood
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faTableTennisPaddleBall} className="mr-4 text-xl" /> Sports
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faBaseballBatBall} className="mr-4 text-xl" /> Cricket
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faVolleyball} className="mr-4 text-xl" /> Football
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faMusic} className="mr-4 text-xl" /> Songs
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faPersonRunning} className="mr-4 text-xl" /> Dance
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faFaceLaughBeam} className="mr-4 text-xl" /> Comedy
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faNewspaper} className="mr-4 text-xl" /> News
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faBriefcase} className="mr-4 text-xl" /> Business
          </p>
          <p className="text-white w-[250px] pl-6 py-4 cursor-pointer rounded-xl ml-2 hover:bg-zinc-800">
            <FontAwesomeIcon icon={faDollarSign} className="mr-4 text-xl" /> Finance
          </p>
        </div> */
}

// Reaction icons

{
  /* <div className="flex flex-col absolute bottom-[2%] right-[18%]">
                  <FontAwesomeIcon icon={faThumbsUp} className="  bg-zinc-900 bg-opacity-70 rounded-full p-3 mt-7 text-white text-2xl cursor-pointer" />
                  <FontAwesomeIcon icon={faThumbsDown} className="bg-zinc-900 bg-opacity-70 rounded-full p-3 mt-8 text-white  text-2xl cursor-pointer" />
                  <FontAwesomeIcon
                    icon={faComment}
                    ref={commentButton}
                    onClick={() => setCommentDetails(true)}
                    className=" bg-zinc-900 bg-opacity-70 rounded-full p-3 mt-8 text-white text-2xl cursor-pointer"
                  />
                  <FontAwesomeIcon
                    icon={faShare}
                    ref={shareButton}
                    onClick={() =>
                      setShareOptions({
                        loggedInUserName: loggedInUser.name,
                        postId: reelsList[videoIndex]._id,
                        loggedInUserProfilePic: loggedInUser.profilePic,
                        loggedInUserId: loggedInUser._id,
                        postCreatorId: reelsList[videoIndex].userId,
                        reels: true,
                      })
                    }
                    className=" bg-zinc-900 bg-opacity-70 rounded-full p-3 mt-8 text-white text-2xl cursor-pointer"
                  />
                  <FontAwesomeIcon
                    icon={faUpload}
                    ref={uploadButton}
                    onClick={() => setOpenUpload(true)}
                    className=" bg-zinc-900 bg-opacity-70 rounded-full p-3 mt-8 text-white text-2xl cursor-pointer"
                  />
                  <FontAwesomeIcon icon={faHeart} className="  text-white text-5xl cursor-pointer" />
                </div> */
}
