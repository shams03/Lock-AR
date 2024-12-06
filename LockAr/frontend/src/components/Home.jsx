import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Home = (props) => {
  const toggleLogin = props.toggleLogin;
  useEffect(() => {
    toggleLogin(false);
  });

  return (
    <>
      <div className="absolute inset-0 -z-10 h-[100vh] w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

      <div className="text-center p-4 mt-12 space-y-4">
        <h1 className="text-3xl font-bold text-purple-900">
          Welcome to
          <span className=" text-purple-900">&lt;</span>
          Loc
          <span className=" text-purple-900">KAR/&gt;</span>
        </h1>
        <p className="text-purple-700 text-base">
          Manage your passwords safely and securely.
        </p>

        <div className="flex justify-center gap-2 mt-4">
          {/* Login Button */}
          <Link
            to="/login"
            className="flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-purple-800 text-white hover:bg-purple-500 text-sm border-2 border-purple-800"
          >
            <FaSignInAlt className="text-base" /> {/* Login Icon */}
            Login
          </Link>

          {/* Sign Up Button */}
          <Link
            to="/signup"
            className="flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-purple-800 text-white hover:bg-purple-500 text-sm border-2 border-purple-800"
          >
            <FaUserPlus className="text-base" /> {/* Sign Up Icon */}
            Sign Up
          </Link>
        </div>

        <section className="mt-6  text-purple-900 p-4 rounded-md shadow-sm text-sm cursor-default">
          <h2 className="text-xl font-semibold">About Us</h2>
          <div className="mt-1 text-base">
            At LocKAR, we are committed to safeguarding your digital life with
            state-of-the-art security. Our team of experts works tirelessly to
            create a password management system that is secure, user-friendly,
            and designed to give you peace of mind.
          </div>
        </section>

        <section className="mt-4 text-purple-900 p-4 rounded-md shadow-sm text-sm">
          <h2 className="text-xl font-semibold">Why Choose Us?</h2>
          <ul className="mt-1 list-disc list-inside">
            <li>Zero-Knowledge Encryption for enhanced privacy</li>
            <li>User-friendly design with seamless functionality</li>
            <li>Advanced security features like multi-factor authentication</li>
            <li>Access across multiple devices</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Home;
