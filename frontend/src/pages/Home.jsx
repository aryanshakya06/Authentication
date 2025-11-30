import React from 'react'
import { AppData } from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {

  const { logoutUser, user } = AppData();
  const navigate = useNavigate();

  return (
    <>
    <div>Home</div>
    <button className="bg-purple-500 text-white p-2 rounded-md mt-30 cursor-pointer" onClick={() => logoutUser(navigate)}>Logout</button>
    {
      user && user.role === "admin" && <Link to="/dashboard" className="bg-purple-500 text-white p-2 rounded-md mt-30 cursor-pointer">Dashboard</Link>

    }
    </>
  )
}

export default Home