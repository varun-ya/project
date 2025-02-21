import React, { useState, useEffect, useContext } from "react";
import { API_KEY, imageUrl } from "../../Constants/Constance";
import axios from "../../axios";
import { PopUpContext } from "../../Context/moviePopUpContext";
import { motion } from "framer-motion";
import StarRatings from "react-star-ratings";
import MoviePopUp from "../PopUp/MoviePopUp";
import usePlayMovie from "../../CustomHooks/usePlayMovie";

function Banner(props) {
  const { showModal, setShowModal } = useContext(PopUpContext);
  const { playMovie } = usePlayMovie();

  const [movie, setMovie] = useState([]);
  const [moviePopupInfo, setMoviePopupInfo] = useState({});
  const [urlId, setUrlId] = useState("");

  useEffect(() => {
    axios.get(props.url).then((response) => {
      setMovie(
        response.data.results.sort(() => 0.5 - Math.random())[0]
      );
    });
  }, []);

  const handleMoviePopup = (movieInfo) => {
    setMoviePopupInfo(movieInfo);
    setShowModal(true);
    axios
      .get(`/movie/${movieInfo.id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((responce) => {
        if (responce.data.results.length !== 0) {
          setUrlId(responce.data.results[0]);
        }
      });
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, hsl(0deg 0% 7% / 91%) 0%, hsl(0deg 0% 0% / 0%) 35%, hsl(220deg 26% 44% / 0%) 100%), url(${movie ? imageUrl + movie.backdrop_path : ""})`,
        }}
        className="h-[50rem] md:h-[55rem] 3xl:h-[63rem] bg-cover bg-center object-contain grid items-center"
      >
        <div className="ml-2  mr-2 sm:mr-0 sm:ml-12 mt-[75%] sm:mt-52">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {movie.title || movie.name ? (
              <h1 className="text-white text-3xl font-semibold text-center mb-5 py-2 sm:text-left sm:text-5xl sm:border-l-8 pl-4 border-red-700 md:text-6xl lg:w-2/3 xl:w-1/2 sm:font-bold drop-shadow-lg">
                {movie.title || movie.name}
              </h1>
            ) : null}
          </motion.div>

          <div className="flex justify-center sm:justify-start">
            {movie.id ? (
              <>
                <button
                  onClick={() => playMovie(movie)}
                  className="bg-red-800 hover:bg-red-900 transition duration-500 ease-in-out shadow-2xl flex items-center mb-3 mr-3 text-base sm:text-xl font-semibold text-white py-2 sm:py-2 px-10 sm:px-14 rounded-md"
                >
                  Play
                </button>
                <button
                  onClick={() => handleMoviePopup(movie)}
                  className="bg-[#33333380] flex items-center shadow-2xl mb-3 text-base sm:text-xl font-semibold text-white hover:bg-white hover:text-black transition duration-500 ease-in-out py-2 px-8 rounded-md"
                >
                  More Info
                </button>
              </>
            ) : null}
          </div>
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(hsl(0deg 0% 0% / 0%), hsl(0deg 0% 0% / 38%), hsl(0deg 0% 7%))",
          }}
          className="h-80 mt-auto "
        ></div>
      </div>
      {showModal ? <MoviePopUp data1={moviePopupInfo} data2={urlId} /> : null}
    </>
  );
}

export default Banner;
