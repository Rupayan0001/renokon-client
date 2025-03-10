import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

const PhotosCollage = ({ images, width }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Swipe Handlers
  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
  });

  return (
    <div className="max-h-[550px] w-full overflow-hidden">
      {/* Image Collage Layout */}
      <div className="grid gap-1 max-h-[550px]">
        {images.length === 1 && <img src={images[0]} onClick={() => openModal(0)} className="w-full max-h-[550px] object-cover rounded-lg cursor-pointer" />}
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-1 max-h-[550px]">
            {images.map((img, i) => (
              <img key={i} src={img} onClick={() => openModal(i)} className="w-full max-h-[275px] object-cover rounded-lg cursor-pointer" />
            ))}
          </div>
        )}
        {images.length === 3 && (
          <div className="grid grid-cols-2 gap-1 max-h-[550px]">
            <div className="col-span-2">
              <img src={images[0]} onClick={() => openModal(0)} className="w-full max-h-[275px] object-cover rounded-lg cursor-pointer" />
            </div>
            {images.slice(1).map((img, i) => (
              <img key={i} src={img} onClick={() => openModal(i + 1)} className="w-full max-h-[275px] object-cover rounded-lg cursor-pointer" />
            ))}
          </div>
        )}
        {images.length >= 4 && (
          <div className="grid grid-cols-2 gap-1 max-h-[550px]">
            {images.slice(0, 4).map((img, i) => (
              <img key={i} src={img} onClick={() => openModal(i)} className="w-full max-h-[275px] object-cover rounded-lg cursor-pointer" />
            ))}
            {images.length > 4 && (
              <div
                onClick={() => openModal(3)}
                className="absolute bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold w-full h-full cursor-pointer"
              >
                +{images.length - 4} More
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div className={`fixed inset-0 h-[100%] w-[100%] flex items-center justify-center bg-black ${width > 550 ? "bg-opacity-80" : "bg-opacity-100"} z-50`}>
          <FontAwesomeIcon
            icon={width > 550 ? faXmark : faArrowLeft}
            onClick={closeModal}
            className={`absolute ${
              width > 550 ? "top-1 right-2 bg-slate-800" : "top-1 left-0"
            } z-20 cursor-pointer aspect-square  hover:bg-slate-600 p-2 rounded-full text-xl text-white`}
          />
          {/* ✖ */}
          {/* </button> */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 z-20 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 flex justify-center items-center h-[40px] w-[40px] rounded-full text-black"
            >
              ◀
            </button>
          )}

          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 z-20 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 flex justify-center items-center h-[40px] w-[40px] rounded-full text-black"
            >
              ▶
            </button>
          )}
          <div {...handlers} className="relative max-w-[100%] md:max-w-[50%] rounded-lg">
            <img src={selectedImage} className={`w-full max-h-[90vh] object-contain rounded-lg`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosCollage;
