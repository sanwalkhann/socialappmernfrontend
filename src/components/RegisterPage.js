import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle } from "react-icons/fa";
import Cookies from "js-cookie"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const history = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://socialappmernbackend.vercel.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Signup successful!");
        history("/login");

        Cookies.set("userData", {
          name: formData.name,
          email: formData.email,
        });

        toast.success("Signup successful!");
        history("/login");
      } else {
        const errorData = await response.json();
        console.error("Error during signup:", errorData);
        toast.error(errorData.message || "Signup failed. Please try again.");
     
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      toast.error( error.message );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      window.location.href = "https://socialappmernbackend.vercel.app/auth/google";
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      handleGoogleSignin(code);
    }
  });

  const handleGoogleSignin = async (code) => {
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Signup</h2>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleInputChange}
              className="w-full border-gray-300 border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

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
            className="w-full bg-green-500 text-white rounded-md py-2 mb-4 transition duration-300 hover:bg-green-600"
          >
            Signup
          </button>

          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center bg-red-500 text-white rounded-md py-2 mb-4 transition duration-300 hover:bg-red-600"
          >
            <FaGoogle className="mr-2" /> Sign up with Google
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => history("/")}
              className="w-1/2 bg-blue-500 text-white rounded-md py-2 transition duration-300 hover:bg-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => history("/login")}
              className="w-1/2 bg-teal-500 text-white rounded-md py-2 transition duration-300 hover:bg-gray-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
