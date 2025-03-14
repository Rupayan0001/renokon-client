import React, { forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import globalState from "../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faMessage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { axiosInstance } from "../../lib/axios";

const ShareModal = forwardRef(({ page = "Home", URL = "", width }, ref) => {
  const shareOptions = globalState((state) => state.shareOptions);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const setNotify = globalState((state) => state.setNotify);
  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  const post = globalState((state) => state.post);
  const setNewPost = globalState((state) => state.setNewPost);
  const notifyTimer = useRef();
  const navigate = useNavigate();

  const mainUrl = `https://renokon.com/home/${shareOptions}`;

  async function handleShareClick(buttonName, url) {
    setCloseModal(true);
    const encodedURL = encodeURIComponent(url);

    if (!url.includes("game")) {
      try {
        await axiosInstance.put(`/post/updateShareCount/${shareOptions}`);
      } catch (error) {}
    }

    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }

    // Copy link to clipboard
    if (buttonName === "CopyLink") {
      navigator.clipboard.writeText(url);
      setNotify("Link copied to clipboard");
      notifyTimer.current = setTimeout(() => setNotify(null), 5000);
    }

    // ✅ FIX: Ensure URLs are shared properly
    if (buttonName === "Facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`, "_blank");
    }
    if (buttonName === "Twitter") {
      window.open(`https://twitter.com/intent/tweet?text=Check this out!&url=${encodedURL}`, "_blank");
    }
    if (buttonName === "Whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodedURL}`, "_blank");
    }
    if (buttonName === "Message") {
      navigator.clipboard.writeText(url);
      // setNotify("Link copied to clipboard");
      // notifyTimer.current = setTimeout(() => setNotify(null), 5000);
      navigate(`/message`);
    }
    if (buttonName === "Gmail") {
      const subject = encodeURIComponent("Check out this link");
      const body = encodeURIComponent(`I found something interesting: ${url}`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");
    }

    if (page === "Home") {
      const found = homePagePost.findIndex((e) => e._id === shareOptions);
      if (found >= 0) {
        homePagePost[found].sharesCount += 1;
        setHomePagePost([...homePagePost]);
      }
    } else if (page === "Profile") {
      const found = post.findIndex((e) => e._id === shareOptions);
      if (found >= 0) {
        post[found].sharesCount += 1;
        setNewPost([...post]);
      }
    }
  }

  function handleClose() {
    setCloseModal(true);
  }
  return (
    <dialog className={`fixed z-50 h-[100%] w-[100%] flex justify-center items-center inset-0   bg-black bg-opacity-60`}>
      <div
        ref={ref}
        className={`${
          width > 425 ? "relative rounded-xl  w-[350px] " : "fixed bottom-0 rounded-t-3xl w-[100vw] postEditShadow"
        } h-[380px] bg-gradient-to-r from-slate-900 to-black  px-2 pt-2`}
      >
        {width > 425 && (
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => handleClose()}
            className="absolute w-[25px] h-[25px] p-2 hover:bg-slate-600 text-white top-1 right-1 rounded-full top-0 right-0 cursor-pointer"
          />
        )}
        <h1 className={`border-b-2 border-zinc-300 h-[45px] text-white font-semibold pr-4 text-lg w-full flex justify-center items-center ${width > 425 ? "" : "rounded-t-3xl"}`}>
          Share
        </h1>

        <div className="options text-white">
          <p
            onClick={() => handleShareClick("CopyLink", URL || mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-slate-600 transition duration-200 p-2 rounded-lg"
          >
            Copy Link
            <FontAwesomeIcon className="ml-4 text-zinc-100 text-2xl" icon={faCopy} />
          </p>
          <p
            onClick={() => handleShareClick("Gmail", URL || mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-slate-600 transition duration-200 p-2 rounded-lg"
          >
            Share to Gmail
            <FontAwesomeIcon className="ml-4 text-red-500 text-2xl" icon={faEnvelope} />
          </p>
          <p
            onClick={() => handleShareClick("Twitter", URL || mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-slate-600 transition duration-200 p-2 rounded-lg"
          >
            {" "}
            Share to Twitter
            <FontAwesomeIcon className="ml-4 text-zinc-100 text-2xl" icon={faTwitter} />
          </p>
          <p
            onClick={() => handleShareClick("Message", URL || mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-slate-600 transition duration-200 p-2 rounded-lg"
          >
            Share via message
            {/* <span className="ml-4 text-blue-600 text-2xl">Renokon</span> */}
            <FontAwesomeIcon className="ml-4 text-zinc-100 text-2xl" icon={faMessage} />
          </p>
          <p
            onClick={() => handleShareClick("Facebook", URL || mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-slate-600 transition duration-200 p-2 rounded-lg"
          >
            Share to Facebook
            <FontAwesomeIcon className="ml-4 text-blue-600 text-2xl" icon={faFacebook} />
          </p>
          <p
            onClick={() => handleShareClick("Whatsapp", URL || mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-slate-600 transition duration-200 p-2 rounded-lg"
          >
            {" "}
            Share to Whatsapp
            <FontAwesomeIcon className="ml-4 text-green-600 text-2xl" icon={faWhatsapp} />
          </p>
        </div>
      </div>
    </dialog>
  );
});

export default ShareModal;
