import './assets/styles/App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import LayoutHome from './components/LayoutHome'
import React, { useEffect } from 'react'
import Home from './components/user/Home'
import RequireAuth from './components/RequireAuth'
import Notifications from './components/user/Notifications'
import Messages from './components/user/Messages'
import Profile from './components/user/Profile'
import { io } from "socket.io-client";
import useAuth from './hooks/useAuth'
import PersistLogin from './components/PersistLogin'

function App() {

  const { auth } = useAuth();
  let socket = io('ws://82.180.160.136:3000', {
    auth: {
      token: auth.accessToken
    },
    withCredentials: true,
    reconnection: false,
    autoConnect: false
  });

  useEffect(() => {

    socket.on('Connected', msg => {
      console.log(msg)
    });
    socket.on('User Connected', msg => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    }

  }, [])

  const ROLES = {
    'User': 'user'
  }

  return (
    <Routes>
      <Route path='/' element={<LayoutHome />}>
        {/* PUBLIC ROUTES */}
        <Route index element={<Login />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='unauthorized' element={
          <h1>Not enough privileges</h1>
        } />
      </Route>

      {/* PRIVATE ROUTES */}
      <Route element={<PersistLogin />} >
        <Route path='/' element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path='home' element={<Home />} />
        </Route>

        <Route path='/' element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path='notifications' element={<Notifications />} />
        </Route>

        <Route path='/' element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path='messages' element={<Messages socket={socket} />} />
        </Route>

        <Route path='/' element={<RequireAuth allowedRoles={ROLES.User} />}>
          <Route path='profile/:username' element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
