import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import cricketImg from "../../../assets/images/ms-dhoni-team-india-national-cricket-team-shikhar-dhawan-wallpaper-preview.jpg";
import bollywoodImg2 from "../../../assets/images/Pathaan-1920x1080-2.jpg";
import footbalImg from "../../../assets/images/360_F_589743912_Hb0wJQKoUZIXXUKkejDWJUUwBopHha92.jpg";
import bollywoodImg from "../../../assets/images/srk-jawan-1200.jpg";
import musicImg from "../../../assets/images/Arijit-Singh-.jpg";
import financeImg from "../../../assets/images/1085f340-bfeb-424e-a9d5-723d1f63d29b (1).jpg";
import personalityImg from "../../../assets/images/PM-Narendra-Modi-iPhone-Wallpapers.jpg";
import cric2 from "../../../assets/images/1315984.jpg";
import geographyImg from "../../../assets/images/indian-flag-abstract-background-wallpaper-for-independence-day-on-15-august-ai-generative-free-photo.jpg";
import historyImg from "../../../assets/images/Freedom_fighters.webp";
// import historyImg from "../../../assets/images/reimagining-netaji-subhash-chandra-bose-through-ai-v0-0rjcpva5i4ec1d.jpg";
import mathImg from "../../../assets/images/pngtree-3d-rendering-of-calculator-symbol-against-a-black-background-image_3782739d.jpg";
import footballImg2 from "../../../assets/images/cristiano-ronaldo-cr7-the-kick-facebook-cover.jpg";
import businessImg from "../../../assets/images/pngtree-partnership-of-companies-collaboration-business-technology-internet-concept-image_15659993.jpg";

const slides = [
  { id: 1, image: cric2, title: "Mega Quiz Pool - Win $5000", link: "/game/cricket" },
  { id: 2, image: footbalImg, title: "Daily Cash Quiz - $1000 Prize", link: "/game/football" },
  { id: 3, image: bollywoodImg, title: "Daily Cash Quiz - $1000 Prize", link: "/game/bollywood" },
  { id: 4, image: musicImg, title: "Esports Quiz Battle - $3000", link: "/game/music" },
  { id: 5, image: businessImg, title: "Esports Quiz Battle - $3000", link: "/game/business" },
  { id: 6, image: financeImg, title: "Esports Quiz Battle - $3000", link: "/game/finance" },
  { id: 7, image: personalityImg, title: "Esports Quiz Battle - $3000", link: "/game/personality" },
  { id: 8, image: geographyImg, title: "Esports Quiz Battle - $3000", link: "/game/geography" },
  { id: 9, image: historyImg, title: "Crypto Trivia Challenge - $2000", link: "/game/history" },
  { id: 10, image: mathImg, title: "Daily Cash Quiz - $1000 Prize", link: "/game/maths" },
];
const slides2 = [
  // { id: 1, image: bollywoodImg2, title: "Mega Quiz Pool - Win $5000", link: "/game/bollywood" },
  { id: 1, image: cric2, title: "Mega Quiz Pool - Win $5000", link: "/game/cricket" },
  { id: 2, image: footballImg2, title: "Daily Cash Quiz - $1000 Prize", link: "/game/football" },
  { id: 3, image: bollywoodImg2, title: "Daily Cash Quiz - $1000 Prize", link: "/game/bollywood" },
  { id: 4, image: musicImg, title: "Esports Quiz Battle - $3000", link: "/game/music" },
  { id: 5, image: businessImg, title: "Esports Quiz Battle - $3000", link: "/game/business" },
  { id: 6, image: financeImg, title: "Esports Quiz Battle - $3000", link: "/game/finance" },
  { id: 7, image: personalityImg, title: "Esports Quiz Battle - $3000", link: "/game/personality" },
  { id: 8, image: geographyImg, title: "Esports Quiz Battle - $3000", link: "/game/geography" },
  { id: 9, image: historyImg, title: "Crypto Trivia Challenge - $2000", link: "/game/history" },
  { id: 10, image: mathImg, title: "Daily Cash Quiz - $1000 Prize", link: "/game/maths" },
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
    <div className={`relative w-[95%] max-w-[768px] ${width > 768 ? "h-[250px]" : "h-[130px]"} bg-black mt-3 mx-auto overflow-hidden rounded-xl shadow-lg`}>
      {width > 525 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full"
        >
          {slides2.map((slide) => (
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
