import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { AuthContext } from "../Context/UserContext";
import { ClipLoader } from "react-spinners";
import WelcomePageBanner from "../images/WelcomePageBanner.jpg";

function SignUp() {
  const { User, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        onAuthStateChanged(auth, (user) => {
          const EmptyArray = [];
          setDoc(doc(db, "Users", user.uid), {
            email: email,
            Uid: user.uid,
          }).then(() => {
            setDoc(doc(db, "MyList", user.uid), { movies: EmptyArray }, { merge: true });
            setDoc(doc(db, "WatchedMovies", user.uid), { movies: EmptyArray }, { merge: true });
            setDoc(doc(db, "LikedMovies", user.uid), { movies: EmptyArray }, { merge: true });
          });
        });
        if (userCredential.user) {
          navigate("/");
        }
      })
      .catch((error) => {
        setLoader(false);
        setErrorMessage(error.message);
      });
  };

  return (
    <section
      className="h-[100vh] bg-gray-500"
      style={{
        background: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%),url(${WelcomePageBanner})`,
      }}
    >
      <div className="h-[100vh] flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-[#000000a2] rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
                Create a new account
              </h1>
              <h1 className="text-white text-2xl p-3 text-center border-2 border-red-700 rounded-sm">
                Zenova TV  
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    className={`bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 ${ErrorMessage ? "border-2 border-red-700" : ""}`}
                    placeholder="name@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className={`bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 ${ErrorMessage ? "border-2 border-red-700" : ""}`}
                    required
                  />
                </div>
                {ErrorMessage && (
                  <h1 className="flex text-white font-bold p-4 bg-red-700 rounded text-center">
                    {ErrorMessage}
                  </h1>
                )}
                <button
                  type="submit"
                  className={`w-full text-white ${loader ? "bg-stone-700" : "bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300"} font-medium rounded-sm text-sm px-5 py-2.5 text-center`}
                >
                  {loader ? <ClipLoader color="#ff0000" /> : "Create now"}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Already have one? <Link className="font-medium text-white hover:underline" to={"/signin"}>Sign in</Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
