import React from 'react'
import ReactDOM from 'react-dom/client'

import './bootstrap.scss'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './component/Layout'
import NotificationContainer from './component/NotificationContainer'
import Root from './component/Root'

import HomePage from './page/Home'
import LoginPage from './page/Login'
import RegisterPage from './page/Register'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" Component={Root}>
      <Route path="/login" Component={LoginPage} />
      <Route path="/register" Component={RegisterPage} />
      <Route path="/" Component={Layout}>
        <Route path="/" Component={HomePage} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <NotificationContainer />
  </React.StrictMode>
)
