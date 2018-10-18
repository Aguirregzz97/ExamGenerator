import * as React from 'react'
import App from './App'
import Login from './Login'
import Register from './Register'
import User from './User'
import Exams from './Exams'
import Subjects from './Subjects'
import Topics from './Topics'


const routes = [
  { path: '/', action: () => <App />},
  { path: '/Login', action: () => <Login />},
  { path: '/Register', action: () => <Register />},
  { path: '/User', action: () => <User />},
  { path: '/Exams', action: () => <Exams />},
  { path: '/Subjects', action: () => <Subjects />},
  { path: '/Topics', action: () => <Topics />},
]

export default routes