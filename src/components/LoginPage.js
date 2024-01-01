import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { FaGoogle } from 'react-icons/fa';

const Login = ({ setUser, onAuthentication }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://socialappmernbackend.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);

        Cookies.set('user', JSON.stringify(formData));
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        toast.error("Login failed. Please check your credentials.");
        onAuthentication(false);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("Something went wrong");
      toast.error(
        "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "https://socialappmernbackend.vercel.app/auth/google";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      handleGoogleSignInCallback(code);
    }
  }, []);

  const handleGoogleSignInCallback = async (code) => {
    try {
      const response = await fetch(
        "https://socialappmernbackend.vercel.app/auth/google/callback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Google sign-in successful!");
      } else {
        console.error("Error during Google sign-in:", response.statusText);
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              className="w-full border-gray-300 border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-600 text-sm mb-1"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInputChange}
              className="w-full border-gray-300 border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white rounded-md py-2 transition duration-300 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-red-500 text-white rounded-md py-2 mt-4 transition duration-300 hover:bg-red-600"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        </form>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => navigate("/")}
            className="w-1/2 bg-indigo-500 text-white rounded-md py-2 transition duration-300 hover:bg-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-1/2 bg-teal-500 text-white rounded-md py-2 transition duration-300 hover:bg-gray-600"
          >
            SignUp
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
