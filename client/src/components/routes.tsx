import * as React from 'react'
import App from './App'
import Login from './Login'
import Register from './Register'
import User from './User'
import Exams from './Exams'
import Questions from './Questions'

const routes = [
  { path: '/', action: () => <App />},
  { path: '/Login', action: () => <Login />},
  { path: '/Register', action: () => <Register />},
  { path: '/User', action: () => <User />},
  { path: '/Exams', action: () => <Exams />},
  { path: '/Questions', action: () => <Questions />},
]

export default routes