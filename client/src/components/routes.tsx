import * as React from 'react'
import App from './App'
import Login from './Login'
import Register from './Register'

const routes = [
  { path: '/', action: () => <App />},
  { path: '/Login', action: () => <Login />},
  { path: '/Register', action: () => <Register />},
]

export default routes