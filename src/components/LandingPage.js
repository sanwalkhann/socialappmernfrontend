import React from 'react';
import { Link } from 'react-router-dom';

import BackgroundImage from '../assets/bg.png';

export default function LandingPage() {
  const backgroundStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <header className="flex flex-col items-center justify-center" style={backgroundStyle}>
      <h1 className="text-4xl text-white mb-4">Login / Register Page</h1>
      <p className="text-white mb-8">Join us now</p>
      <div className="flex flex-col items-center">
        <Link to="/login">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full mb-4">
            Log In
          </button>
        </Link>
        <Link to="/register">
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full"
            id="reg_btn"
          >
            <span>Register</span>
          </button>
        </Link>
      </div>
    </header>
  );
}
