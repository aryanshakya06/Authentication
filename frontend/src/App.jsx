import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import { ToastContainer } from 'react-toastify';
import VerifyOTP from './pages/VerifyOTP.jsx';
import Loading from './pages/Loading.jsx';
import { AppData } from './context/AppContext.jsx';
import Register from './pages/Register.jsx';
import Verify from './pages/Verify.jsx';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {

  const { isAuth, loading} = AppData();

  return (
    <>
    {loading ? <Loading/> : <BrowserRouter>
    <Routes>
      <Route path='/' element={ isAuth ? <Home/> : <Login />} />
      <Route path='/login' element={ isAuth ? <Home/> : <Login />} />
      <Route path='/register' element={ isAuth ? <Home/> : <Register />} />
      <Route path='/verify-otp' element={ isAuth ? <Home/> : <VerifyOTP/>} />
      <Route path='/token/:token' element={ isAuth ? <Home/> : <Verify/>} />
      <Route path='/dashboard' element={ isAuth ? <Dashboard/> : <Login/>} />
    </Routes>
    <ToastContainer/>
    </BrowserRouter>}
    </>
  )
}

export default App;
