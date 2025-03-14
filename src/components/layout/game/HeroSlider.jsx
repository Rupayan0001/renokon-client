import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import bollywoodImg2 from "../../../assets/images/Pathaan-1920x1080-2.jpg";
import footballImg2 from "../../../assets/images/f5LSNK.webp";
import musicImg from "../../../assets/images/Arijit-Singh-.jpg";
import financeImg from "../../../assets/images/529_Stock_Market_1920x1080_a7d91d2e997b49409920780a817a7a47.jpg";
import personalityImg from "../../../assets/images/personalities.jpg";
import cric2 from "../../../assets/images/1315984.jpg";
import geographyImg from "../../../assets/images/R (2).jpg";
import historyImg from "../../../assets/images/OIP (2).jpg";
import mathImg from "../../../assets/images/360_F_540586727_w1zF3FaMFlvmfO1BgIcN2SVmnKrsl10G.jpg";
import businessImg from "../../../assets/images/rich.jpg";
const slides = [
  { id: 1, image: cric2, title: "Cricket", link: "/game/cricket" },
  { id: 2, image: footballImg2, title: "Football", link: "/game/football" },
  { id: 3, image: bollywoodImg2, title: "Bollywood", link: "/game/bollywood" },
  { id: 4, image: musicImg, title: "Music", link: "/game/music" },
  { id: 5, image: businessImg, title: "Businessman", link: "/game/business" },
  { id: 6, image: financeImg, title: "Finance", link: "/game/finance" },
  { id: 7, image: personalityImg, title: "Famous Personalities", link: "/game/personality" },
  { id: 8, image: geographyImg, title: "Geography", link: "/game/geography" },
  { id: 9, image: historyImg, title: "History", link: "/game/history" },
  { id: 10, image: mathImg, title: "Maths", link: "/game/maths" },
];

const HeroSlider = ({ width }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

  return (
    <div
      className={`relative w-[95%] max-w-[768px] ${width >= 768 && "h-[250px]"} ${width < 768 && width > 450 && "h-[175px]"} ${
        width <= 450 && "h-[130px]"
      } bg-black mt-3 mx-auto overflow-hidden rounded-xl shadow-lg`}
    >
      {width > 525 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <AnimatePresence>
                <Link to={slide.link}>
                  <div className="w-full h-full relative">
                    {/* <p className="absolute top-0 left-0 text-white bg-black text-md px-2 py-0 rounded-xl font-bold z-50">{slide.title}</p> */}
                    <motion.img
                      key={slide.id}
                      src={slide.image}
                      alt={`Slide ${slide.id}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </Link>
              </AnimatePresence>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <AnimatePresence>
                <Link to={slide.link}>
                  <motion.img
                    key={slide.id}
                    src={slide.image}
                    alt={`Slide ${slide.id}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </Link>
              </AnimatePresence>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default HeroSlider;

{
  /* Navigation Buttons */
}
{
  /* <button
  onClick={prevSlide}
  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 flex justify-center items-center h-[40px] w-[40px] rounded-full"
>
  ◀
</button>
<button
  onClick={nextSlide}
  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 flex justify-center items-center h-[40px] w-[40px] rounded-full"
>
  ▶
</button> */
}

{
  /* Dots Navigation */
}
{
  /* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
  {slides.map((_, index) => (
    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`} />
  ))}
</div> */
}
